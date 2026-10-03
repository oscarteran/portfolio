"use server";

import { headers } from "next/headers";
import { site } from "@/data/site";
import { HONEYPOT_FIELD, readContactValues, validateContact, type ContactState } from "@/lib/contact";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
// Best-effort, per-instance limit: enough to blunt a single script hammering the form.
// A multi-instance deployment would need a shared store (e.g. Redis) to be strict.
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (recentSubmissions.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    recentSubmissions.set(key, recent);
    return true;
  }
  recentSubmissions.set(key, [...recent, now]);
  return false;
}

/** Sends the contact form through Resend. Configure with RESEND_API_KEY; optionally
 * CONTACT_TO_EMAIL (defaults to the site email) and CONTACT_FROM_EMAIL (defaults to
 * Resend's shared test sender, which can only deliver to the Resend account's owner). */
export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Bots get a fake success so they have no signal to adapt to.
  if (formData.get(HONEYPOT_FIELD)) return { status: "success" };

  const values = readContactValues(formData);
  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: "unconfigured" };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return { status: "error", message: "Recibí varios mensajes seguidos. Intenta de nuevo en unos minutos." };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL ?? site.email],
        reply_to: values.email,
        subject: `Contacto desde el portfolio - ${values.name}`,
        text: `${values.message}\n\n—\n${values.name} <${values.email}>`,
      }),
    });
    if (!response.ok) {
      console.error("Resend rejected the contact email", response.status, await response.text());
      return { status: "error", message: "No pude enviar el mensaje. Intenta de nuevo o escríbeme directo por email." };
    }
  } catch (error) {
    console.error("Contact email request failed", error);
    return { status: "error", message: "No pude enviar el mensaje. Intenta de nuevo o escríbeme directo por email." };
  }

  return { status: "success" };
}
