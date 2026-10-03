/** Contact form contract, shared by the client form and the server action so both
 * enforce exactly the same rules and messages. */

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readContactValues(formData: FormData): ContactValues {
  const read = (key: ContactField) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  return { name: read("name"), email: read("email"), message: read("message") };
}

export function validateContact({ name, email, message }: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!name) errors.name = "Dime cómo te llamas.";
  else if (name.length > LIMITS.name) errors.name = `Máximo ${LIMITS.name} caracteres.`;

  if (!email) errors.email = "Necesito un email para responderte.";
  else if (email.length > LIMITS.email || !emailPattern.test(email)) errors.email = "Ese email no parece válido.";

  if (!message) errors.message = "El mensaje no puede estar vacío.";
  else if (message.length > LIMITS.message) errors.message = `Máximo ${LIMITS.message} caracteres.`;
  return errors;
}

export function mailtoHref(to: string, { name, email, message }: ContactValues) {
  const subject = encodeURIComponent(`Contacto desde el portfolio - ${name}`);
  const body = encodeURIComponent(`${message}\n\nEmail de contacto: ${email}`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
