import { expect, test, type Page } from "@playwright/test";
import { experience } from "../../src/data/experience";
import { personalProjects } from "../../src/data/personalProjects";
import { projects } from "../../src/data/projects";
import { site } from "../../src/data/site";

/** Fails the test on any console error or uncaught exception, e.g. hydration mismatches. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

/** Form inputs by label; scoped to textboxes since the navbar also has an "Email" icon link. */
function field(page: Page, name: "Nombre" | "Email" | "Mensaje") {
  return page.getByRole("textbox", { name, exact: true });
}

test.describe("home", () => {
  test("renders every section without console errors", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(site.name.split(" ")[0]);
    const sections = ["inicio", "proyectos", "proyectos-personales", "experiencia", "habilidades", "contacto"];
    // The personal projects section only renders once it has entries.
    for (const id of sections.filter((s) => s !== "proyectos-personales" || personalProjects.length > 0)) {
      await expect(page.locator(`section#${id}`)).toBeAttached();
    }
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test("has no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows).toBe(false);
  });

  test("CV download link points at an existing PDF", async ({ page, request }) => {
    await page.goto("/");
    const href = await page.getByRole("link", { name: "Descargar CV" }).first().getAttribute("href");
    expect(href).toBe(site.cvUrl);
    const response = await request.get(href!);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("pdf");
  });
});

test.describe("project modal", () => {
  test("opens, navigates with the keyboard and restores focus on close", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("button", { name: projects[0].title });
    await card.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading")).toHaveText(projects[0].title);

    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("heading")).toHaveText(projects[1].title);
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByRole("heading")).toHaveText(projects.at(-1)!.title);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(card).toBeFocused();
  });

  test("locks page scroll while open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: projects[0].title }).click();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await page.getByRole("button", { name: "Cerrar" }).click();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });
});

test("experience entries expand to show achievements", async ({ page }) => {
  await page.goto("/");
  const first = experience[0];
  const toggle = page.getByRole("button", { name: new RegExp(first.role) });

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText(first.achievements[0])).toBeVisible();
});

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#contacto");
  });

  test("shows an error for each empty field", async ({ page }) => {
    await page.getByRole("button", { name: "Enviar mensaje" }).click();
    await expect(field(page, "Nombre")).toHaveAttribute("aria-invalid", "true");
    await expect(field(page, "Email")).toHaveAttribute("aria-invalid", "true");
    await expect(field(page, "Mensaje")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#contact-email-error")).toHaveText("Necesito un email para responderte.");
  });

  test("rejects an invalid email and keeps what was typed", async ({ page }) => {
    await field(page, "Nombre").fill("Ana");
    await field(page, "Email").fill("ana@");
    await field(page, "Mensaje").fill("Hola");
    await page.getByRole("button", { name: "Enviar mensaje" }).click();

    await expect(page.locator("#contact-email-error")).toHaveText("Ese email no parece válido.");
    await expect(field(page, "Nombre")).toHaveValue("Ana");
    await expect(field(page, "Mensaje")).toHaveValue("Hola");
  });

  test("falls back to the visitor's mail client when no email provider is configured", async ({ page }) => {
    await field(page, "Nombre").fill("Ana");
    await field(page, "Email").fill("ana@example.com");
    await field(page, "Mensaje").fill("Hola");
    await page.getByRole("button", { name: "Enviar mensaje" }).click();

    await expect(page.getByRole("status").filter({ hasText: "cliente de correo" })).toBeVisible();
  });
});

test("content stays visible with reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = trackErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText(site.tagline)).toBeVisible();
  // framer-motion logs a dev-style notice when reduced motion is on; it isn't an app error.
  expect(errors.filter((e) => !e.includes("Reduced Motion"))).toEqual([]);
  await context.close();
});
