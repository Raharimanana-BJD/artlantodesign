import { sendLeadEmail, type LeadPayload } from "@/app/lib/email";

const SHORT_MAX = 200;
const MESSAGE_MAX = 2000;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

function truncate(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

function invalid() {
  return Response.json({ ok: false, error: "validation" }, { status: 422 });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalid();
  }

  if (typeof body !== "object" || body === null) return invalid();
  const raw = body as Record<string, unknown>;

  // Honeypot: checked before anything else, so every response looks the
  // same to a bot regardless of what else the payload contains.
  const honeypot = typeof raw.website === "string" ? raw.website.trim() : "";
  if (honeypot) {
    console.log("[contact] honeypot");
    return Response.json({ ok: true }, { status: 200 });
  }

  if (raw.kind !== "full") return invalid();

  const name = truncate(raw.name, SHORT_MAX);
  const email = truncate(raw.email, SHORT_MAX);
  if (!name || !email || !EMAIL_RE.test(email)) return invalid();
  const lead: LeadPayload = {
    kind: "full",
    name,
    email,
    company: truncate(raw.company, SHORT_MAX),
    phone: truncate(raw.phone, SHORT_MAX),
    message: truncate(raw.message, MESSAGE_MAX),
    brand: truncate(raw.brand, SHORT_MAX),
    requestType: truncate(raw.requestType, SHORT_MAX),
  };

  const result = await sendLeadEmail(lead);
  if (!result.ok) {
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  console.log("[contact] sent");
  return Response.json({ ok: true }, { status: 200 });
}
