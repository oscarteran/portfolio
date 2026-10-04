"use client";

import { useActionState, useState } from "react";
import { sendContact } from "@/app/actions";
import type { Dictionary } from "@/data/ui";
import {
  HONEYPOT_FIELD,
  LIMITS,
  LOCALE_FIELD,
  mailtoHref,
  readContactValues,
  validateContact,
  type ContactField,
  type ContactState,
  type ContactValues,
} from "@/lib/contact";
import type { Locale } from "@/lib/i18n";
import Blueprint from "./Blueprint";

const EMPTY: ContactValues = { name: "", email: "", message: "" };

export default function ContactForm({ locale, email, ui }: { locale: Locale; email: string; ui: Dictionary["form"] }) {
  const [values, setValues] = useState<ContactValues>(EMPTY);

  // Validate on the client first so obvious mistakes don't cost a round trip; the server
  // action re-validates with the same rules since the client can't be trusted.
  const [state, formAction, pending] = useActionState(
    async (prev: ContactState, formData: FormData): Promise<ContactState> => {
      const errors = validateContact(readContactValues(formData), locale);
      if (Object.keys(errors).length > 0) return { status: "invalid", errors };

      const result = await sendContact(prev, formData);
      if (result.status === "unconfigured") {
        window.location.href = mailtoHref(email, readContactValues(formData), locale);
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

  function fieldProps(field: ContactField) {
    return {
      id: `contact-${field}`,
      name: field,
      maxLength: LIMITS[field],
      value: values[field],
      onChange: update(field),
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
      className: "input",
    };
  }

  function errorFor(field: ContactField) {
    return (
      errors[field] && (
        <p id={`contact-${field}-error`} role="alert" className="mt-1.5 text-[13px] text-danger">
          {errors[field]}
        </p>
      )
    );
  }

  if (state.status === "success") {
    return (
      <Blueprint role="status" className="flex flex-col items-start gap-2 p-7">
        <p className="font-heading text-[22px] font-semibold">{ui.successTitle}</p>
        <p className="text-[15px] text-neutral-800">{ui.successBody}</p>
      </Blueprint>
    );
  }

  return (
    <Blueprint as="form" action={formAction} noValidate className="flex flex-col gap-4 p-7">
      <input type="hidden" name={LOCALE_FIELD} value={locale} />
      {/* Honeypot: off-screen and skipped by keyboard and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`contact-${HONEYPOT_FIELD}`}>{ui.honeypot}</label>
        <input id={`contact-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        <div>
          <label htmlFor="contact-name" className="field-label">
            {ui.name}
          </label>
          <input type="text" autoComplete="name" {...fieldProps("name")} />
          {errorFor("name")}
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">
            {ui.email}
          </label>
          <input type="email" autoComplete="email" {...fieldProps("email")} />
          {errorFor("email")}
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="field-label">
          {ui.message}
        </label>
        <textarea rows={5} {...fieldProps("message")} />
        {errorFor("message")}
      </div>
      <div className="flex flex-col items-start gap-2">
        <Blueprint as="button" type="submit" disabled={pending} className="btn btn-primary btn-lg">
          {pending ? ui.sending : ui.send}
        </Blueprint>
        {state.status === "unconfigured" && (
          <p role="status" className="text-[13px] text-neutral-700">
            {ui.mailtoBefore} <a href={`mailto:${email}`}>{email}</a>.
          </p>
        )}
        {state.status === "error" && (
          <p role="alert" className="text-[13px] text-danger">
            {state.message}
          </p>
        )}
      </div>
    </Blueprint>
  );
}
