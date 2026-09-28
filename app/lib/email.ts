import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

const FALLBACK_FROM = "Art Lanto Design <no-reply@localhost>";
// Rejects the comma/semicolon/angle-bracket/quote characters that could turn
// a Reply-To header into a multi-address list (stricter than the general
// "looks like an email" check used for client side validation).
const STRICT_EMAIL_RE = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>"]+$/;

function stripCrlf(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export type LeadPayload =
  | { kind: "quick"; phone: string }
  | {
      kind: "full";
      name: string;
      email: string;
      company?: string;
      phone?: string;
      message?: string;
      brand?: string;
      requestType?: string;
    };

function composeEmail(lead: LeadPayload) {
  if (lead.kind === "quick") {
    return {
      subject: `Rappel demandé — ${stripCrlf(lead.phone)}`,
      text: `Téléphone: ${lead.phone}`,
    };
  }

  const lines = [
    `Maison: ${lead.brand ?? ""}`,
    `Type de demande: ${lead.requestType ?? ""}`,
    `Nom: ${lead.name}`,
    lead.company ? `Société: ${lead.company}` : null,
    `E-mail: ${lead.email}`,
    lead.phone ? `Téléphone: ${lead.phone}` : null,
    lead.message ? `Message: ${lead.message}` : null,
  ].filter((line): line is string => line !== null);

  return {
    subject: `Demande ${stripCrlf(lead.brand ?? "")} — ${stripCrlf(lead.name)}`,
    text: lines.join("\n"),
  };
}

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  if (!host) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: user && pass ? { user, pass } : undefined,
  });
  return cachedTransporter;
}

export async function sendLeadEmail(lead: LeadPayload): Promise<{ ok: true } | { ok: false }> {
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? FALLBACK_FROM;
  const { subject, text } = composeEmail(lead);
  const transporter = getTransporter();

  if (!transporter || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[contact] dev fallback, no SMTP_HOST/CONTACT_EMAIL set\n${subject}\n${text}`);
      return { ok: true };
    }
    console.error("[contact] send_failed: SMTP_HOST or CONTACT_EMAIL is not set");
    return { ok: false };
  }

  const replyTo =
    lead.kind === "full" && STRICT_EMAIL_RE.test(lead.email.trim()) ? lead.email.trim() : undefined;

  try {
    await transporter.sendMail({ from, to, replyTo, subject, text });
    return { ok: true };
  } catch (error) {
    console.error("[contact] send_failed", error);
    return { ok: false };
  }
}
