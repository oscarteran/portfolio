"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { sendContact } from "@/app/actions";
import { site } from "@/data/site";
import {
  HONEYPOT_FIELD,
  LIMITS,
  mailtoHref,
  readContactValues,
  validateContact,
  type ContactField,
  type ContactState,
  type ContactValues,
} from "@/lib/contact";
import { buttonClass } from "@/lib/styles";

const EMPTY: ContactValues = { name: "", email: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);

  // Validate on the client first so obvious mistakes don't cost a round trip; the server
  // action re-validates with the same rules since the client can't be trusted.
  const [state, formAction, pending] = useActionState(
    async (prev: ContactState, formData: FormData): Promise<ContactState> => {
      const errors = validateContact(readContactValues(formData));
      if (Object.keys(errors).length > 0) return { status: "invalid", errors };

      const result = await sendContact(prev, formData);
      if (result.status === "unconfigured") {
        window.location.href = mailtoHref(site.email, readContactValues(formData));
      }
      if (result.status === "success") setValues(EMPTY);
      return result;
    },
    { status: "idle" }
  );

  const errors = state.status === "invalid" ? state.errors : {};

  function update(field: ContactField) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [field]: e.target.value }));
  }

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-7">
        <CheckCircle2 className="text-accent-2" size={24} />
        <p className="font-bold text-lg">¡Mensaje enviado!</p>
        <p className="text-sm leading-relaxed text-muted">Gracias por escribir. Te respondo lo antes posible.</p>
      </div>
    );
  }

  const fieldClass =
    "border-0 border-b border-border bg-transparent px-0 py-2.5 text-sm outline-none placeholder:text-muted focus-visible:border-accent aria-invalid:border-danger";
  const labelClass = "text-sm text-muted";
  const errorClass = "text-sm text-danger";

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {/* Honeypot: off-screen and skipped by keyboard and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`contact-${HONEYPOT_FIELD}`}>No llenar</label>
        <input id={`contact-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className={labelClass}>
            Nombre
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            value={values.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={fieldClass}
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className={errorClass}>
              {errors.name}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            value={values.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={fieldClass}
          />
          {errors.email && (
            <p id="contact-email-error" role="alert" className={errorClass}>
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className={labelClass}>
          Mensaje
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          maxLength={LIMITS.message}
          value={values.message}
          onChange={update("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${fieldClass} resize-none`}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className={errorClass}>
            {errors.message}
          </p>
        )}
      </div>
      <div className="mt-2 flex flex-col items-start gap-2">
        <button type="submit" disabled={pending} className={buttonClass.primary}>
          {pending ? "Enviando…" : "Enviar mensaje"}
        </button>
        {state.status === "unconfigured" && (
          <p role="status" className="text-sm text-muted">
            Se abrirá tu cliente de correo con el mensaje listo. Si no se abre, escríbeme a{" "}
            <a href={`mailto:${site.email}`} className="text-foreground underline underline-offset-2">
              {site.email}
            </a>
            .
          </p>
        )}
        {state.status === "error" && (
          <p role="alert" className={errorClass}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
