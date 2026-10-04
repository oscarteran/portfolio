/** Contact form contract, shared by the client form and the server action so both
 * enforce exactly the same rules and messages. */

import type { Locale } from "./i18n";

export type ContactField = "name" | "email" | "message";
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors }
  | { status: "success" }
  /** No email provider configured on the server: the client falls back to mailto:. */
  | { status: "unconfigured" }
  | { status: "error"; message: string };

export const LIMITS: Record<ContactField, number> = { name: 100, email: 200, message: 5000 };

/** Hidden field real visitors never fill; bots that auto-fill every input do. */
export const HONEYPOT_FIELD = "company";

/** Hidden field carrying the page language, so server messages match the page. */
export const LOCALE_FIELD = "locale";

const messages = {
  es: {
    nameRequired: "Dime cómo te llamas.",
    emailRequired: "Necesito un email para responderte.",
    emailInvalid: "Ese email no parece válido.",
    messageRequired: "El mensaje no puede estar vacío.",
    tooLong: (max: number) => `Máximo ${max} caracteres.`,
    rateLimited: "Recibí varios mensajes seguidos. Intenta de nuevo en unos minutos.",
    sendFailed: "No pude enviar el mensaje. Intenta de nuevo o escríbeme directo por email.",
    subject: "Contacto desde el portfolio",
    replyTo: "Email de contacto",
  },
  en: {
    nameRequired: "Tell me your name.",
    emailRequired: "I need an email to reply to you.",
    emailInvalid: "That email doesn't look valid.",
    messageRequired: "The message can't be empty.",
    tooLong: (max: number) => `${max} characters max.`,
    rateLimited: "I got several messages in a row. Please try again in a few minutes.",
    sendFailed: "I couldn't send the message. Try again or email me directly.",
    subject: "Contact from the portfolio",
    replyTo: "Contact email",
  },
} satisfies Record<Locale, unknown>;

export function contactMessages(locale: Locale = "es") {
  return messages[locale];
}

export function readLocale(formData: FormData): Locale {
  return formData.get(LOCALE_FIELD) === "en" ? "en" : "es";
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readContactValues(formData: FormData): ContactValues {
  const read = (key: ContactField) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  return { name: read("name"), email: read("email"), message: read("message") };
}

export function validateContact({ name, email, message }: ContactValues, locale: Locale = "es"): ContactErrors {
  const m = messages[locale];
  const errors: ContactErrors = {};
  if (!name) errors.name = m.nameRequired;
  else if (name.length > LIMITS.name) errors.name = m.tooLong(LIMITS.name);

  if (!email) errors.email = m.emailRequired;
  else if (email.length > LIMITS.email || !emailPattern.test(email)) errors.email = m.emailInvalid;

  if (!message) errors.message = m.messageRequired;
  else if (message.length > LIMITS.message) errors.message = m.tooLong(LIMITS.message);
  return errors;
}

export function mailtoHref(to: string, { name, email, message }: ContactValues, locale: Locale = "es") {
  const m = messages[locale];
  const subject = encodeURIComponent(`${m.subject} - ${name}`);
  const body = encodeURIComponent(`${message}\n\n${m.replyTo}: ${email}`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
