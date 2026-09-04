import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import tls from "node:tls";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

interface TlsLookupRequest {
  target?: unknown;
}

interface CertificateName {
  C?: string;
  ST?: string;
  L?: string;
  O?: string;
  OU?: string;
  CN?: string;
}

interface CertificateInfo {
  subject?: CertificateName;
  issuer?: CertificateName;
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

interface ParsedTarget {
  hostname: string;
  port: number;
  url: string;
}

interface PeerCertificate {
  subject?: CertificateName;
  issuer?: CertificateName;
  subjectaltname?: string;
  valid_from?: string;
  valid_to?: string;
  serialNumber?: string;
  fingerprint?: string;
  fingerprint256?: string;
  fingerprint512?: string;
  bits?: number;
  asn1Curve?: string;
  nistCurve?: string;
  sigalg?: string;
  ca?: boolean;
  issuerCertificate?: PeerCertificate;
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function parseTarget(target: string): ParsedTarget {
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(target) ? target : `https://${target}`;
  const url = new URL(withProtocol);

  if (url.protocol !== "https:") {
    throw new Error("Only HTTPS targets are supported");
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  const port = url.port ? Number(url.port) : 443;

  if (!hostname || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Enter a valid HTTPS host and port");
  }

  return { hostname, port, url: url.toString() };
}

function isPrivateIp(address: string) {
  if (address === "::1") {
    return true;
  }

  if (address.startsWith("fc") || address.startsWith("fd") || address.startsWith("fe80:")) {
    return true;
  }

  if (!address.includes(".")) {
    return false;
  }

  const parts = address.split(".").map(Number);
  const [a, b] = parts;

  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 0) ||
    a >= 224
  );
}

function parseSubjectAltName(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(/,\s*/)
    .map((entry) => entry.replace(/^DNS:/, "").replace(/^IP Address:/, "IP: "))
    .filter(Boolean);
}

function normalizeCertificate(cert: PeerCertificate): CertificateInfo {
  return {
    subject: cert.subject,
    issuer: cert.issuer,
    subjectAltName: parseSubjectAltName(cert.subjectaltname),
    validFrom: cert.valid_from,
    validTo: cert.valid_to,
    serialNumber: cert.serialNumber,
    fingerprint: cert.fingerprint,
    fingerprint256: cert.fingerprint256,
    fingerprint512: cert.fingerprint512,
    publicKeyAlgorithm: cert.asn1Curve ?? cert.nistCurve,
    publicKeyBits: cert.bits,
    signatureAlgorithm: cert.sigalg,
    ca: cert.ca,
  };
}

function normalizeChain(cert: PeerCertificate) {
  const chain: CertificateInfo[] = [];
  const seen = new Set<string>();
  let current: PeerCertificate | undefined = cert;

  while (current) {
    const key = current.fingerprint256 ?? current.fingerprint ?? current.serialNumber ?? `${chain.length}`;
    if (seen.has(key)) {
      break;
    }

    seen.add(key);
    chain.push(normalizeCertificate(current));

    if (!current.issuerCertificate || current.issuerCertificate === current) {
      break;
    }

    current = current.issuerCertificate;
  }

  return chain;
}

async function assertPublicHost(hostname: string) {
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new Error("Local and private hosts are not supported");
  }

  if (isIP(hostname) && isPrivateIp(hostname)) {
    throw new Error("Local and private hosts are not supported");
  }

  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some((entry) => isPrivateIp(entry.address))) {
    throw new Error("Local and private hosts are not supported");
  }
}

async function findBrowserDestination(startUrl: string) {
  let current = new URL(startUrl);
  const redirects: Array<{ from: string; to: string; status: number }> = [];

  for (let index = 0; index < 5; index += 1) {
    await assertPublicHost(current.hostname);

    let response = await fetch(current, {
      method: "HEAD",
      redirect: "manual",
      headers: {
        "User-Agent": "sagan.dev TLS Certificate Inspector",
      },
    });

    if (response.status === 405 || response.status === 403) {
      response = await fetch(current, {
        method: "GET",
        redirect: "manual",
        headers: {
          "User-Agent": "sagan.dev TLS Certificate Inspector",
        },
      });
    }

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return {
        url: current.toString(),
        hostname: current.hostname.toLowerCase(),
        port: current.port ? Number(current.port) : 443,
        redirects,
      };
    }

    const location = response.headers.get("location");
    if (!location) {
      break;
    }

    const next = new URL(location, current);
    if (next.protocol !== "https:") {
      break;
    }

    redirects.push({
      from: current.toString(),
      to: next.toString(),
      status: response.status,
    });
    current = next;
  }

  return {
    url: current.toString(),
    hostname: current.hostname.toLowerCase(),
    port: current.port ? Number(current.port) : 443,
    redirects,
  };
}

function readTlsCertificate(hostname: string, port: number) {
  return new Promise<{
    authorized: boolean;
    authorizationError: string | null;
    protocol: string | null;
    cipher: tls.CipherNameAndProtocol;
    certificate: CertificateInfo;
    chain: CertificateInfo[];
  }>((resolve, reject) => {
    const socket = tls.connect({
      host: hostname,
      port,
      servername: isIP(hostname) ? undefined : hostname,
      rejectUnauthorized: false,
    });

    socket.setTimeout(8000);

    socket.once("secureConnect", () => {
      const certificate = socket.getPeerCertificate(true) as PeerCertificate;

      if (!certificate || Object.keys(certificate).length === 0) {
        socket.destroy();
        reject(new Error("No peer certificate returned"));
        return;
      }

      const result = {
        authorized: socket.authorized,
        authorizationError: socket.authorizationError ? String(socket.authorizationError) : null,
        protocol: socket.getProtocol(),
        cipher: socket.getCipher(),
        certificate: normalizeCertificate(certificate),
        chain: normalizeChain(certificate),
      };

      socket.end();
      resolve(result);
    });

    socket.once("timeout", () => {
      socket.destroy();
      reject(new Error("TLS connection timed out"));
    });

    socket.once("error", reject);
  });
}

export async function POST(req: NextRequest) {
  let body: TlsLookupRequest;

  try {
    body = (await req.json()) as TlsLookupRequest;
  } catch {
    return jsonError("Invalid JSON");
  }

  if (typeof body.target !== "string" || !body.target.trim()) {
    return jsonError("Enter a HTTPS hostname or URL");
  }

  let target: ReturnType<typeof parseTarget>;

  try {
    target = parseTarget(body.target.trim());
    await assertPublicHost(target.hostname);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Invalid target");
  }

  try {
    const details = await readTlsCertificate(target.hostname, target.port);
    const browserDestination = await findBrowserDestination(target.url);
    const destinationDiffers =
      browserDestination.hostname !== target.hostname || browserDestination.port !== target.port;
    const browserDestinationDetails = destinationDiffers
      ? await readTlsCertificate(browserDestination.hostname, browserDestination.port)
      : null;

    return NextResponse.json({
      target,
      checkedAt: new Date().toISOString(),
      browserDestination,
      browserDestinationDetails,
      ...details,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not read TLS certificate", 502);
  }
}
