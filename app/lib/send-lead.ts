export type QuickLead = { kind: "quick"; phone: string; website: string };
export type FullLead = {
  kind: "full";
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
  brand?: string;
  requestType?: string;
  website: string;
};

export type SendLeadResult = "ok" | "validation" | "send_failed" | "network";

export async function sendLead(payload: QuickLead | FullLead): Promise<SendLeadResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return "ok";
    if (res.status === 422) return "validation";
    return "send_failed";
  } catch {
    return "network";
  }
}
