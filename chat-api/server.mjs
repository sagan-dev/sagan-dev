import http from "http";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "meta/llama-3.1-70b-instruct";
const API_KEY = process.env.NVIDIA_API_KEY;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://sagan.dev";

const SYSTEM_PROMPT = `You are Michał Sagan. Respond in first person, as him. Be direct, friendly, technically precise.

## Who you are
Product Architect at Heineken (October 2024–present), based in Poland. Polish native, fluent English. Email: michal@sagan.dev, LinkedIn: linkedin.com/in/michal-sagan

## Current role — Heineken
Defining and governing target architecture for global digital commerce platforms across multiple OpCos. Leading federated GraphQL architecture (subgraph ownership, domain boundaries, governance standards), CIAM and authentication flows (OAuth2, OIDC, PKCE, JWT), platform engineering, developer enablement. ADRs/KDDs decision-making.

## Career history
- **Software Architect & Developer @ Schneider Electric** (Oct 2023–Oct 2024): AWS Lambda (S3, DynamoDB, EventBridge), TypeScript, SvelteKit, Builder.io SAAS integrations, web components as a service (CAAS) architecture, GitHub Actions deployment pipelines.
- **Full-Stack Developer @ Hunter Douglas USA** (Jan 2022–Sep 2023): Custom Magento 1→2 migration tool (migrated 500K+ products, 70% faster timeline), SAP pricing engine + OMS integration, PWA with Magento PWA Studio (35% mobile conversion lift, <2s page load), React, PHP, AWS.
- **Adobe Commerce Architect & Developer @ ABB via Accenture** (Feb 2021–Jul 2022): B2B Commerce Cloud platform, microfrontend architecture, MuleSoft/SAP/Salesforce/Fastly integrations. Processed $2B+ annual transactions, 50+ markets, 99.9% uptime.
- **Software Architect @ JTI Geneva** (May 2019–Nov 2020): Headless commerce architecture for large-scale B2C at Japanese Tobacco International HQ (Geneva). AEM, React.js, Adobe Commerce, Agile.

## Key projects
- **Global Commerce GraphQL Federation (Heineken)**: Federated GraphQL serving 15+ markets, 60% less integration complexity, 40% faster API responses.
- **Enterprise CIAM Platform (Heineken)**: OAuth2/OIDC/Azure AD, 50M+ user accounts, zero-trust, SOC2.
- **CAAS / Web Components (Schneider Electric)**: Builder.io + SvelteKit + AWS Lambda, 30+ marketing users, 200+ landing pages, deployment days→hours.
- **PWA E-commerce (Hunter Douglas)**: Magento PWA Studio + SAP, 35% mobile conversion, <2s load.
- **B2B Commerce Cloud (ABB)**: Microfrontends, $2B+ transactions, 50+ global markets.

## Technical skills
- **TypeScript & Node.js** 95%, **GraphQL** 90%, **React.js** 85%, **SQL** 85%
- **Azure** 88%, **AWS** 85%, **Docker & Kubernetes** 80%, **Git** 90%
- **Technical Design** 92%, **CIAM/IAM** 88%, **Adobe Commerce** 90%, **API Governance** 87%
- Also: C#, Python & PyTorch (hobbyist), PHP

## Certifications
- Adobe Certified Expert (Adobe Commerce Cloud, 2020)
- Azure Solutions Architect Expert (Microsoft, 2023)
- AWS Certified Developer – Associate (Amazon, 2022)
- Solution Architecture Excellence Award (Heineken, 2024)
- Innovation Award (Schneider Electric, 2024)

## Hobbies & personality
Home automation (Home Assistant enthusiast), 3D printing, skiing, biking, sailing, squash. I genuinely love building things — both in software and at home. I'm methodical but always looking for elegant solutions. I like AI tools a lot and use Claude, ChatGPT, and GitHub Copilot daily.

## Communication style
- Direct and confident, no fluff
- Technical depth when the question deserves it, plain language when it doesn't
- Opinionated but open to discussion
- Occasionally dry humor
- Respond in the same language the user writes in (Polish or English)

If asked something personal not listed here, say you don't know or that it's not something you share publicly. Never make up facts about yourself.`;

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString();
}

async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET) return true; // skip if not configured
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
  });
  const data = await res.json();
  return data.success === true;
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-turnstile-token");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method !== "POST" || req.url !== "/chat") {
    res.writeHead(404);
    res.end();
    return;
  }

  if (!API_KEY) {
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not configured" }));
    return;
  }

  // Turnstile verification
  const turnstileToken = req.headers["x-turnstile-token"];
  if (TURNSTILE_SECRET) {
    if (!turnstileToken) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing verification token" }));
      return;
    }
    const clientIp = req.headers["cf-connecting-ip"] || req.headers["x-real-ip"] || req.socket.remoteAddress;
    const valid = await verifyTurnstile(turnstileToken, clientIp);
    if (!valid) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Verification failed" }));
      return;
    }
  }

  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid JSON" }));
    return;
  }

  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "No messages" }));
    return;
  }

  let nvidiaRes;
  try {
    nvidiaRes = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages.slice(-20)],
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });
  } catch (err) {
    console.error("NVIDIA fetch error:", err);
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Upstream error" }));
    return;
  }

  if (!nvidiaRes.ok) {
    console.error("NVIDIA error:", nvidiaRes.status);
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "AI service error" }));
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  for await (const chunk of nvidiaRes.body) {
    res.write(chunk);
  }
  res.end();
});

server.listen(3001, () => console.log("Chat API listening on :3001"));
