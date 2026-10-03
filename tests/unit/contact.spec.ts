import { expect, test } from "@playwright/test";
import { LIMITS, mailtoHref, readContactValues, validateContact } from "../../src/lib/contact";

const valid = { name: "Ana", email: "ana@example.com", message: "Hola" };

test.describe("validateContact", () => {
  test("accepts a complete, well-formed message", () => {
    expect(validateContact(valid)).toEqual({});
  });

  test("requires every field", () => {
    expect(Object.keys(validateContact({ name: "", email: "", message: "" })).sort()).toEqual([
      "email",
      "message",
      "name",
    ]);
  });

  test("rejects malformed emails", () => {
    for (const email of ["ana", "ana@", "ana@example", "ana @example.com"]) {
      expect(validateContact({ ...valid, email }).email, email).toBeDefined();
    }
  });

  test("enforces length limits", () => {
    const errors = validateContact({
      name: "a".repeat(LIMITS.name + 1),
      email: `${"a".repeat(LIMITS.email)}@example.com`,
      message: "a".repeat(LIMITS.message + 1),
    });
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
  });
});

test("readContactValues trims input and ignores non-string entries", () => {
  const form = new FormData();
  form.set("name", "  Ana  ");
  form.set("email", new Blob(["x"]));
  form.set("message", "\nHola\n");
  expect(readContactValues(form)).toEqual({ name: "Ana", email: "", message: "Hola" });
});

test("mailtoHref encodes subject and body", () => {
  const href = mailtoHref("me@example.com", { ...valid, message: "¿Hablamos? & más" });
  expect(href.startsWith("mailto:me@example.com?subject=")).toBe(true);
  expect(decodeURIComponent(href)).toContain("¿Hablamos? & más");
  expect(href).not.toContain(" ");
});
