"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Braces, Maximize2, ShieldCheck, Wrench, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEV_TOOLS, getDevToolIconPath, type DevToolSlug } from "@/lib/dev-tools";

type JsonRecord = Record<string, unknown>;
type ToolboxCopy = ReturnType<typeof useLanguage>["t"]["toolbox"];

interface DecodedJwt {
  header: JsonRecord;
  payload: JsonRecord;
}

interface TlsCertificateName {
  C?: string;
  ST?: string;
  L?: string;
  O?: string;
  OU?: string;
  CN?: string;
}

interface TlsCertificateInfo {
  subject?: TlsCertificateName;
  issuer?: TlsCertificateName;
  subjectAltName?: string[];
  validFrom?: string;
  validTo?: string;
  serialNumber?: string;
  fingerprint?: string;
  fingerprint256?: string;
  fingerprint512?: string;
  publicKeyAlgorithm?: string;
  publicKeyBits?: number;
  signatureAlgorithm?: string;
  ca?: boolean;
}

interface TlsCertificateResponse {
  target: {
    hostname: string;
    port: number;
  };
  checkedAt: string;
  authorized: boolean;
  authorizationError: string | null;
  protocol: string | null;
  cipher: {
    name?: string;
    standardName?: string;
    version?: string;
  };
  certificate: TlsCertificateInfo;
  chain: TlsCertificateInfo[];
  browserDestination?: {
    url: string;
    hostname: string;
    port: number;
    redirects: Array<{
      from: string;
      to: string;
      status: number;
    }>;
  };
  browserDestinationDetails?: {
    authorized: boolean;
    authorizationError: string | null;
    protocol: string | null;
    cipher: {
      name?: string;
      standardName?: string;
      version?: string;
    };
    certificate: TlsCertificateInfo;
    chain: TlsCertificateInfo[];
  } | null;
}

const toolIconBaseBySlug: Record<DevToolSlug, string> = {
  "jwt-decoder": "tool-jwt-decoder",
  "linux-time": "tool-linux-time",
  "tls-certificate": "tool-tls-certificate",
};

function decodeBase64UrlJson(part: string): JsonRecord {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = window.atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const decoded = new TextDecoder().decode(bytes);
  const parsed = JSON.parse(decoded) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("JWT part is not a JSON object");
  }

  return parsed as JsonRecord;
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");

  if (parts.length < 2) {
    throw new Error("JWT must contain header and payload");
  }

  return {
    header: decodeBase64UrlJson(parts[0]),
    payload: decodeBase64UrlJson(parts[1]),
  };
}

function claimNumber(payload: JsonRecord, key: string) {
  const value = payload[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeUnixTime(value: string) {
  const trimmed = value.trim().replace(",", ".");

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.abs(parsed) > 10_000_000_000 ? parsed / 1000 : parsed;
}

function collectClaimValues(payload: JsonRecord, keys: string[]) {
  const values = keys.flatMap((key) => {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value.map(String);
    }

    if (value && typeof value === "object") {
      const nested = value as JsonRecord;
      return Array.isArray(nested.roles) ? nested.roles.map(String) : [];
    }

    if (typeof value === "string") {
      return key === "scope" || key === "scp" ? value.split(/\s+/) : [value];
    }

    return [];
  });

  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function formatDateTime(seconds: number, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date(seconds * 1000));
}

function formatDate(value: string | undefined, locale: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(date);
}

function formatDuration(seconds: number, locale: string) {
  const absolute = Math.max(0, Math.round(Math.abs(seconds)));
  const formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });

  if (absolute < 60) {
    return `${absolute} s`;
  }

  if (absolute <= 540) {
    const minutes = Math.floor(absolute / 60);
    const rest = absolute % 60;
    return `${minutes} min ${rest} s`;
  }

  if (absolute < 7200) {
    return `${formatter.format(absolute / 60)} min`;
  }

  if (absolute < 172800) {
    return `${formatter.format(absolute / 3600)} h`;
  }

  return `${formatter.format(absolute / 86400)} d`;
}

function prettyClaimName(key: string) {
  const labels: Record<string, string> = {
    aud: "Audience",
    azp: "Authorized party",
    client_id: "Client ID",
    exp: "Expires at",
    iat: "Issued at",
    iss: "Issuer",
    jti: "JWT ID",
    nbf: "Not before",
    sub: "Subject",
    typ: "Type",
  };

  return labels[key] ?? key;
}

function stringifyClaim(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value}`;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (value === null) {
    return "null";
  }

  return JSON.stringify(value, null, 2) ?? "";
}

function formatCertificateName(name?: TlsCertificateName) {
  if (!name) {
    return "";
  }

  return [name.CN, name.O, name.OU, name.L, name.ST, name.C].filter(Boolean).join(", ");
}

function InfoBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
      <p className="mb-2 text-sm text-slate-400">{label}</p>
      <div className="break-words text-base leading-relaxed text-slate-100">{value}</div>
    </div>
  );
}

function TlsCertificateSummary({
  certificate,
  authorized,
  authorizationError,
  label,
  copy,
}: {
  certificate: TlsCertificateInfo;
  authorized: boolean;
  authorizationError: string | null;
  label: string;
  copy: ToolboxCopy;
}) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
      <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{label}</p>
        <p className={authorized ? "text-sm text-emerald-300" : "text-sm text-amber-300"}>
          {authorized ? copy.tls.valid : `${copy.tls.invalid}: ${authorizationError ?? ""}`}
        </p>
      </div>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm text-slate-400">{copy.tls.subject}</dt>
          <dd className="break-words text-white">{formatCertificateName(certificate.subject) || copy.missing}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">{copy.tls.issuer}</dt>
          <dd className="break-words text-white">{formatCertificateName(certificate.issuer) || copy.missing}</dd>
        </div>
      </dl>
    </div>
  );
}

function useLiveNow() {
  const [now, setNow] = useState(() => Date.now() / 1000);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return now;
}

function TimeDelta({
  timestamp,
  now,
  locale,
  futureLabel,
  pastLabel,
  emptyLabel,
}: {
  timestamp: number | null;
  now: number;
  locale: string;
  futureLabel: string;
  pastLabel: string;
  emptyLabel: string;
}) {
  if (timestamp === null) {
    return <span className="text-slate-500">{emptyLabel}</span>;
  }

  const delta = timestamp - now;
  const label = delta >= 0 ? futureLabel : pastLabel;

  return (
    <span className={delta >= 0 ? "text-emerald-300" : "text-amber-300"}>
      {label} {formatDuration(delta, locale)}
    </span>
  );
}

function PillList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-100"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function CustomToolIcon({
  iconBase,
  title,
  size = 48,
}: {
  iconBase: string;
  title: string;
  size?: number;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/30 shadow-lg shadow-slate-950/30"
      style={{ width: size, height: size }}
    >
      <Image
        src={getDevToolIconPath(iconBase, 192)}
        alt=""
        aria-hidden="true"
        title={title}
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

function ToolHeader({
  iconBase,
  tone,
  title,
  subtitle,
}: {
  iconBase: string;
  tone: "cyan" | "blue" | "emerald";
  title: string;
  subtitle: string;
}) {
  const color =
    tone === "cyan"
      ? "bg-cyan-500/15 text-cyan-300"
      : tone === "blue"
        ? "bg-blue-500/15 text-blue-300"
        : "bg-emerald-500/15 text-emerald-300";

  return (
    <div className="mb-5 flex items-center gap-3">
      <div className={`rounded-xl p-1 ${color}`}>
        <CustomToolIcon iconBase={iconBase} title={title} size={52} />
      </div>
      <div>
        <h3 className="text-2xl text-white">{title}</h3>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function toolCardClass(framed: boolean) {
  return framed ? "rounded-xl border border-slate-700 bg-slate-800/50 p-6" : "";
}

export function JwtDecoderTool({ framed = true }: { framed?: boolean }) {
  const { lang, t } = useLanguage();
  const locale = lang === "pl" ? "pl-PL" : "en-US";
  const copy = t.toolbox;
  const now = useLiveNow();
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    if (!token.trim()) {
      return { value: null, error: "" };
    }

    try {
      return { value: decodeJwt(token), error: "" };
    } catch {
      return { value: null, error: copy.invalidToken };
    }
  }, [copy.invalidToken, token]);

  const payload = decoded.value?.payload ?? null;
  const expiresAt = payload ? claimNumber(payload, "exp") : null;
  const issuedAt = payload ? claimNumber(payload, "iat") : null;
  const notBefore = payload ? claimNumber(payload, "nbf") : null;
  const roles = payload ? collectClaimValues(payload, ["roles", "role", "realm_access"]) : [];
  const groups = payload ? collectClaimValues(payload, ["groups", "group"]) : [];
  const scopes = payload ? collectClaimValues(payload, ["scope", "scp", "permissions"]) : [];
  const claimEntries = payload
    ? Object.entries(payload).filter(([key]) => !["roles", "role", "groups", "group", "scope", "scp"].includes(key))
    : [];

  return (
    <div className={toolCardClass(framed)}>
      <ToolHeader
        iconBase={toolIconBaseBySlug["jwt-decoder"]}
        tone="cyan"
        title={copy.jwt.title}
        subtitle={copy.jwt.subtitle}
      />

      <label className="mb-2 block text-sm text-slate-300" htmlFor="jwt-token">
        {copy.jwt.inputLabel}
      </label>
      <textarea
        id="jwt-token"
        value={token}
        onChange={(event) => setToken(event.target.value)}
        placeholder={copy.jwt.placeholder}
        spellCheck={false}
        className="min-h-36 w-full resize-y rounded-lg border border-slate-600 bg-slate-950/70 px-4 py-3 font-mono text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400"
      />

      {decoded.error ? <p className="mt-3 text-sm text-amber-300">{decoded.error}</p> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
          <p className="mb-2 text-sm text-slate-400">{copy.jwt.expiresIn}</p>
          <p className="text-lg text-white">
            <TimeDelta
              timestamp={expiresAt}
              now={now}
              locale={locale}
              futureLabel={copy.in}
              pastLabel={copy.ago}
              emptyLabel={copy.missing}
            />
          </p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
          <p className="mb-2 text-sm text-slate-400">{copy.jwt.tokenAge}</p>
          <p className="text-lg text-white">
            {issuedAt === null ? (
              <span className="text-slate-500">{copy.missing}</span>
            ) : (
              <span className="text-cyan-200">{formatDuration(now - issuedAt, locale)}</span>
            )}
          </p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
          <p className="mb-2 text-sm text-slate-400">{copy.jwt.notBefore}</p>
          <p className="text-lg text-white">
            <TimeDelta
              timestamp={notBefore}
              now={now}
              locale={locale}
              futureLabel={copy.in}
              pastLabel={copy.ago}
              emptyLabel={copy.missing}
            />
          </p>
        </div>
      </div>

      {payload ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-cyan-300">
              <ShieldCheck className="h-4 w-4" />
              {copy.jwt.roles}
            </h4>
            <PillList items={roles} emptyLabel={copy.emptyList} />
          </div>
          <div>
            <h4 className="mb-3 text-cyan-300">{copy.jwt.groups}</h4>
            <PillList items={groups} emptyLabel={copy.emptyList} />
          </div>
          <div>
            <h4 className="mb-3 text-cyan-300">{copy.jwt.scopes}</h4>
            <PillList items={scopes} emptyLabel={copy.emptyList} />
          </div>
        </div>
      ) : null}

      {payload ? (
        <div className="mt-6">
          <h4 className="mb-3 flex items-center gap-2 text-cyan-300">
            <Braces className="h-4 w-4" />
            {copy.jwt.claims}
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            {claimEntries.map(([key, value]) => (
              <div key={key} className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-xs uppercase tracking-wider text-slate-500">{prettyClaimName(key)}</p>
                <pre className="mt-1 overflow-auto whitespace-pre-wrap break-words text-sm text-slate-200">
                  {["exp", "iat", "nbf"].includes(key) && claimNumber(payload, key) !== null
                    ? `${formatDateTime(claimNumber(payload, key) ?? 0, locale)}\n${stringifyClaim(value)}`
                    : stringifyClaim(value)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function LinuxTimeTool({ framed = true }: { framed?: boolean }) {
  const { lang, t } = useLanguage();
  const locale = lang === "pl" ? "pl-PL" : "en-US";
  const copy = t.toolbox;
  const now = useLiveNow();
  const [unixInput, setUnixInput] = useState("");
  const unixTimestamp = normalizeUnixTime(unixInput);

  return (
    <div className={toolCardClass(framed)}>
      <ToolHeader
        iconBase={toolIconBaseBySlug["linux-time"]}
        tone="blue"
        title={copy.unix.title}
        subtitle={copy.unix.subtitle}
      />

      <label className="mb-2 block text-sm text-slate-300" htmlFor="unix-time">
        {copy.unix.inputLabel}
      </label>
      <input
        id="unix-time"
        value={unixInput}
        onChange={(event) => setUnixInput(event.target.value)}
        placeholder={copy.unix.placeholder}
        inputMode="decimal"
        className="w-full rounded-lg border border-slate-600 bg-slate-950/70 px-4 py-3 font-mono text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400"
      />

      <div className="mt-6 space-y-4">
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
          <p className="mb-2 text-sm text-slate-400">{copy.unix.delta}</p>
          <p className="text-lg text-white">
            <TimeDelta
              timestamp={unixTimestamp}
              now={now}
              locale={locale}
              futureLabel={copy.in}
              pastLabel={copy.ago}
              emptyLabel={copy.missing}
            />
          </p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
          <p className="mb-2 text-sm text-slate-400">{copy.unix.date}</p>
          <p className="text-base leading-relaxed text-slate-100">
            {unixTimestamp === null ? copy.missing : formatDateTime(unixTimestamp, locale)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
          <p className="mb-2 text-sm text-slate-400">{copy.unix.normalized}</p>
          <p className="font-mono text-sm text-cyan-200">
            {unixTimestamp === null ? copy.missing : Math.round(unixTimestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TlsCertificateTool({ framed = true }: { framed?: boolean }) {
  const { lang, t } = useLanguage();
  const locale = lang === "pl" ? "pl-PL" : "en-US";
  const copy = t.toolbox;
  const now = useLiveNow();
  const [target, setTarget] = useState("");
  const [details, setDetails] = useState<TlsCertificateResponse | null>(null);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsChecking(true);

    try {
      const response = await fetch("/api/dev-tools/tls-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target }),
      });
      const payload = (await response.json()) as TlsCertificateResponse | { error?: string };

      if (!response.ok) {
        throw new Error("error" in payload && payload.error ? payload.error : copy.tls.error);
      }

      const certificateDetails = payload as TlsCertificateResponse;
      const redirects = certificateDetails.browserDestination?.redirects ?? [];

      setDetails(certificateDetails);

      if (redirects.length > 0 && certificateDetails.browserDestination) {
        setTarget(certificateDetails.browserDestination.url);
      }
    } catch (submitError) {
      setDetails(null);
      setError(submitError instanceof Error ? submitError.message : copy.tls.error);
    } finally {
      setIsChecking(false);
    }
  }

  const certificate = details?.certificate;
  const validToSeconds = certificate?.validTo ? new Date(certificate.validTo).getTime() / 1000 : null;
  const validFrom = formatDate(certificate?.validFrom, locale);
  const validTo = formatDate(certificate?.validTo, locale);
  const checkedAt = details ? formatDate(details.checkedAt, locale) : "";
  const altNames = certificate?.subjectAltName ?? [];
  const destinationCertificate = details?.browserDestinationDetails?.certificate;
  const appliedRedirects = details?.browserDestination?.redirects ?? [];
  const redirectNotice =
    details?.browserDestination && appliedRedirects.length > 0 && target === details.browserDestination.url
      ? {
          from: appliedRedirects[0].from,
          to: details.browserDestination.url,
          count: appliedRedirects.length,
        }
      : null;
  const fingerprints = [
    certificate?.fingerprint256 ? ["SHA-256", certificate.fingerprint256] : null,
    certificate?.fingerprint ? ["SHA-1", certificate.fingerprint] : null,
    certificate?.fingerprint512 ? ["SHA-512", certificate.fingerprint512] : null,
  ].filter((item): item is string[] => Boolean(item));

  return (
    <div className={toolCardClass(framed)}>
      <ToolHeader
        iconBase={toolIconBaseBySlug["tls-certificate"]}
        tone="emerald"
        title={copy.tls.title}
        subtitle={copy.tls.subtitle}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
        <div className="min-w-0 flex-1">
          <label className="mb-2 block text-sm text-slate-300" htmlFor="tls-target">
            {copy.tls.inputLabel}
          </label>
          <input
            id="tls-target"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder={copy.tls.placeholder}
            spellCheck={false}
            className="w-full rounded-lg border border-slate-600 bg-slate-950/70 px-4 py-3 font-mono text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400"
          />
          {redirectNotice ? (
            <div className="mt-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
              <p>
                {copy.tls.redirectApplied}: {redirectNotice.count} {copy.tls.redirects.toLowerCase()}
              </p>
              <p className="mt-1 break-all font-mono text-xs text-cyan-200">
                {redirectNotice.from} -&gt; {redirectNotice.to}
              </p>
            </div>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isChecking}
          className="mt-auto rounded-lg bg-cyan-500 px-5 py-3 text-white transition-colors hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isChecking ? copy.tls.checking : copy.tls.check}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-amber-300">{error}</p> : null}

      {details && certificate ? (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <TlsCertificateSummary
              certificate={certificate}
              authorized={details.authorized}
              authorizationError={details.authorizationError}
              label={`${copy.tls.exactHost}: ${details.target.hostname}:${details.target.port}`}
              copy={copy}
            />
            {details.browserDestination ? (
              <InfoBlock
                label={copy.tls.browserHost}
                value={
                  <div className="space-y-2">
                    <p className="break-all font-mono text-cyan-100">{details.browserDestination.url}</p>
                    <p className="text-sm text-slate-400">
                      {details.browserDestination.redirects.length} {copy.tls.redirects.toLowerCase()}
                    </p>
                  </div>
                }
              />
            ) : null}
          </div>

          {destinationCertificate ? (
            <TlsCertificateSummary
              certificate={destinationCertificate}
              authorized={details.browserDestinationDetails?.authorized ?? false}
              authorizationError={details.browserDestinationDetails?.authorizationError ?? null}
              label={`${copy.tls.browserCertificate}: ${details.browserDestination?.hostname}:${details.browserDestination?.port}`}
              copy={copy}
            />
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            <InfoBlock
              label={copy.tls.status}
              value={
                <span className={details.authorized ? "text-emerald-300" : "text-amber-300"}>
                  {details.authorized ? copy.tls.valid : `${copy.tls.invalid}: ${details.authorizationError ?? ""}`}
                </span>
              }
            />
            <InfoBlock
              label={copy.tls.expiresIn}
              value={
                validToSeconds === null ? (
                  <span className="text-slate-500">{copy.missing}</span>
                ) : (
                  <TimeDelta
                    timestamp={validToSeconds}
                    now={now}
                    locale={locale}
                    futureLabel={copy.in}
                    pastLabel={copy.tls.expiredAgo}
                    emptyLabel={copy.missing}
                  />
                )
              }
            />
            <InfoBlock label={copy.tls.checkedAt} value={checkedAt} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoBlock label={copy.tls.subject} value={formatCertificateName(certificate.subject) || copy.missing} />
            <InfoBlock label={copy.tls.issuer} value={formatCertificateName(certificate.issuer) || copy.missing} />
            <InfoBlock label={copy.tls.validFrom} value={validFrom || copy.missing} />
            <InfoBlock label={copy.tls.validTo} value={validTo || copy.missing} />
          </div>

          <div>
            <h4 className="mb-3 text-cyan-300">{copy.tls.altNames}</h4>
            <PillList items={altNames} emptyLabel={copy.emptyList} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <InfoBlock
              label={copy.tls.connection}
              value={
                <dl className="space-y-2">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">{copy.tls.protocol}</dt>
                    <dd className="text-right font-mono text-cyan-200">{details.protocol ?? copy.missing}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">{copy.tls.cipher}</dt>
                    <dd className="text-right font-mono text-cyan-200">
                      {details.cipher.standardName ?? details.cipher.name ?? copy.missing}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">Host</dt>
                    <dd className="text-right font-mono text-cyan-200">
                      {details.target.hostname}:{details.target.port}
                    </dd>
                  </div>
                </dl>
              }
            />
            <InfoBlock
              label={copy.tls.fingerprints}
              value={
                fingerprints.length === 0 ? (
                  <span className="text-slate-500">{copy.missing}</span>
                ) : (
                  <dl className="space-y-3">
                    {fingerprints.map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-sm text-slate-400">{label}</dt>
                        <dd className="break-all font-mono text-sm text-cyan-100">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )
              }
            />
          </div>

          <div>
            <h4 className="mb-3 text-cyan-300">{copy.tls.chain}</h4>
            <div className="space-y-3">
              {details.chain.map((item, index) => (
                <div key={`${item.fingerprint256 ?? item.serialNumber ?? index}`} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
                  <div className="mb-2 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <p className="text-white">{formatCertificateName(item.subject) || copy.missing}</p>
                    <p className="text-sm text-slate-400">{item.ca ? "CA" : "Leaf"}</p>
                  </div>
                  <p className="text-sm text-slate-400">
                    {copy.tls.issuer}: {formatCertificateName(item.issuer) || copy.missing}
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-slate-500">{item.fingerprint256}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DevToolContent({ tool, framed = true }: { tool: DevToolSlug; framed?: boolean }) {
  switch (tool) {
    case "jwt-decoder":
      return <JwtDecoderTool framed={framed} />;
    case "linux-time":
      return <LinuxTimeTool framed={framed} />;
    case "tls-certificate":
      return <TlsCertificateTool framed={framed} />;
  }
}

function getDevToolText(tool: DevToolSlug, copy: ToolboxCopy) {
  switch (tool) {
    case "jwt-decoder":
      return { title: copy.jwt.title, subtitle: copy.jwt.subtitle };
    case "linux-time":
      return { title: copy.unix.title, subtitle: copy.unix.subtitle };
    case "tls-certificate":
      return { title: copy.tls.title, subtitle: copy.tls.subtitle };
  }
}

export function Toolbox() {
  const { t } = useLanguage();
  const copy = t.toolbox;

  return (
    <section id="toolbox" className="bg-slate-950/40 px-6 py-24 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-300">{copy.kicker}</p>
              <h2 className="text-4xl text-white md:text-5xl">{copy.title}</h2>
            </div>
            <p className="max-w-2xl text-slate-300">{copy.description}</p>
          </motion.div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <JwtDecoderTool />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <LinuxTimeTool />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DevToolLauncher() {
  const { t } = useLanguage();
  const router = useRouter();
  const copy = t.toolbox;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<DevToolSlug | null>(null);

  useEffect(() => {
    document.body.style.overflow = activeTool ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeTool]);

  return (
    <>
      <div className="fixed bottom-5 left-5 z-[60]">
        {isMenuOpen ? (
          <div className="mb-3 w-[min(360px,calc(100vw-40px))] rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl shadow-cyan-950/40 backdrop-blur">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{copy.kicker}</p>
              <button
                type="button"
                aria-label={copy.close}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {DEV_TOOLS.map((tool) => {
                const { title, subtitle } = getDevToolText(tool.slug, copy);

                return (
                  <button
                    key={tool.slug}
                    type="button"
                    data-testid={`dev-tool-overlay-${tool.slug}`}
                    onClick={() => {
                      setActiveTool(tool.slug);
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/70 p-3 text-left transition-colors hover:border-cyan-500/50 hover:bg-slate-800"
                  >
                    <CustomToolIcon iconBase={tool.iconBase} title={title} size={44} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-base text-white">{title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-400">{subtitle}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          data-testid="dev-tool-launcher"
          aria-label={copy.openMenu}
          title={copy.openMenu}
          onClick={() => setIsMenuOpen((value) => !value)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-900/95 text-cyan-300 shadow-lg shadow-cyan-950/40 backdrop-blur transition-all hover:border-cyan-300 hover:bg-slate-800 hover:text-white"
        >
          <Wrench className="h-5 w-5" />
        </button>
      </div>

      {activeTool ? (
        <div className="fixed inset-0 z-[90] bg-slate-950/90 px-4 py-4 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{copy.kicker}</p>
                <h2 className="text-xl text-white">{getDevToolText(activeTool, copy).title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={copy.openFullScreen}
                  title={copy.openFullScreen}
                  onClick={() => {
                    const nextTool = activeTool;
                    setActiveTool(null);
                    router.push(`/dev-tool/${nextTool}`);
                  }}
                  className="rounded-md border border-slate-700 p-2 text-cyan-200 transition-colors hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white"
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label={copy.close}
                  onClick={() => setActiveTool(null)}
                  className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <DevToolContent tool={activeTool} framed={false} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function DevToolFullscreen({ tool }: { tool: DevToolSlug }) {
  const { t } = useLanguage();
  const copy = t.toolbox;
  const { title, subtitle } = getDevToolText(tool, copy);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-20 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <CustomToolIcon iconBase={toolIconBaseBySlug[tool]} title={title} size={76} />
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-300">{copy.kicker}</p>
              <h1 className="text-4xl text-white md:text-5xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-slate-300">{subtitle}</p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-md border border-slate-700 px-4 py-2 text-sm text-cyan-200 transition-colors hover:border-cyan-500/50 hover:bg-slate-800"
          >
            {copy.backToSite}
          </Link>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <DevToolContent tool={tool} framed={false} />
        </div>
      </div>
    </main>
  );
}
