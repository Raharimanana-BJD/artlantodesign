import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { render } from "@react-email/render";
import { LeadEmail, type LeadEmailRow } from "@/app/emails/LeadEmail";

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
    const rows: LeadEmailRow[] = [{ label: "Téléphone", value: lead.phone }];
    return {
      subject: `Rappel demandé — ${stripCrlf(lead.phone)}`,
      heading: "Rappel demandé",
      text: rows.map((row) => `${row.label}: ${row.value}`).join("\n"),
      rows,
    };
  }

  const rows: LeadEmailRow[] = [
    { label: "Maison", value: lead.brand ?? "" },
    { label: "Type de demande", value: lead.requestType ?? "" },
    { label: "Nom", value: lead.name },
    lead.company ? { label: "Société", value: lead.company } : null,
    { label: "E-mail", value: lead.email },
    lead.phone ? { label: "Téléphone", value: lead.phone } : null,
    lead.message ? { label: "Message", value: lead.message } : null,
  ].filter((row): row is LeadEmailRow => row !== null);

  return {
    subject: `Demande ${stripCrlf(lead.brand ?? "")} — ${stripCrlf(lead.name)}`,
    heading: `Nouvelle demande — ${lead.brand ?? ""}`,
    text: rows.map((row) => `${row.label}: ${row.value}`).join("\n"),
    rows,
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
  const { subject, heading, text, rows } = composeEmail(lead);
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
    const html = await render(<LeadEmail heading={heading} preview={subject} rows={rows} />);
    await transporter.sendMail({ from, to, replyTo, subject, text, html });
    return { ok: true };
  } catch (error) {
    console.error("[contact] send_failed", error);
    return { ok: false };
  }
}
