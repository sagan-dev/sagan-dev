"use client";

import { useEffect, useMemo, useState } from "react";
import { Braces, Clock3, KeyRound, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

type JsonRecord = Record<string, unknown>;

interface DecodedJwt {
  header: JsonRecord;
  payload: JsonRecord;
}

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

export function Toolbox() {
  const { lang, t } = useLanguage();
  const locale = lang === "pl" ? "pl-PL" : "en-US";
  const copy = t.toolbox;
  const [token, setToken] = useState("");
  const [unixInput, setUnixInput] = useState("");
  const [now, setNow] = useState(() => Date.now() / 1000);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => window.clearInterval(interval);
  }, []);

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
  const unixTimestamp = normalizeUnixTime(unixInput);
  const claimEntries = payload
    ? Object.entries(payload).filter(([key]) => !["roles", "role", "groups", "group", "scope", "scp"].includes(key))
    : [];

  return (
    <section id="toolbox" className="py-24 px-6 md:px-12 lg:px-24 bg-slate-950/40">
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
              className="rounded-xl border border-slate-700 bg-slate-800/50 p-6"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-cyan-500/15 p-3">
                  <KeyRound className="h-6 w-6 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-2xl text-white">{copy.jwt.title}</h3>
                  <p className="text-sm text-slate-400">{copy.jwt.subtitle}</p>
                </div>
              </div>

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

              {decoded.error ? (
                <p className="mt-3 text-sm text-amber-300">{decoded.error}</p>
              ) : null}

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
            </motion.div>

            <motion.div
              className="rounded-xl border border-slate-700 bg-slate-800/50 p-6"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/15 p-3">
                  <Clock3 className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-2xl text-white">{copy.unix.title}</h3>
                  <p className="text-sm text-slate-400">{copy.unix.subtitle}</p>
                </div>
              </div>

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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
