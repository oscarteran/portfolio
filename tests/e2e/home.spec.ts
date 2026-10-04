import { expect, test, type Page } from "@playwright/test";
import { getExperience } from "../../src/data/experience";
import { getPersonalProjects } from "../../src/data/personalProjects";
import { getProjects } from "../../src/data/projects";
import { getSite } from "../../src/data/site";

const site = getSite("es");
const experience = getExperience("es");
const projects = getProjects("es");

/** Fails the test on any console error or uncaught exception, e.g. hydration mismatches. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

/** Form inputs by label. */
function field(page: Page, name: "Nombre" | "Email" | "Mensaje") {
  return page.getByRole("textbox", { name, exact: true });
}

test.describe("home", () => {
  test("renders every section without console errors", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(site.name.split(" ")[0]);
    const sections = ["inicio", "logros", "proyectos", "proyectos-personales", "experiencia", "habilidades", "contacto"];
    // The personal projects section only renders once it has entries.
    for (const id of sections.filter((s) => s !== "proyectos-personales" || getPersonalProjects("es").length > 0)) {
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

  test("draws the career seismogram with one event per stage", async ({ page }) => {
    await page.goto("/");
    const figure = page.getByRole("figure");
    await expect(figure.locator("svg path")).toHaveAttribute("d", /^M0\.0 /);
    await expect(figure.getByRole("listitem")).toHaveCount(experience.length + 1);
  });
});

test("projects show the featured case and a card for every other project", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section#proyectos");
  const featured = projects.find((p) => p.featured)!;

  await expect(section.getByRole("heading", { name: featured.title })).toBeVisible();
  await expect(section.getByRole("article")).toHaveCount(projects.length);
  for (const project of projects) {
    await expect(section.getByRole("heading", { name: project.title, exact: true })).toBeAttached();
  }
});

test("experience shows every achievement without expanding", async ({ page }) => {
  await page.goto("/");
  for (const job of experience) {
    await expect(page.getByRole("heading", { name: job.role, exact: true })).toBeVisible();
    await expect(page.getByText(job.achievements[0])).toBeVisible();
  }
});

test.describe("language", () => {
  test("switches to English and back, keeping the section", async ({ page }) => {
    await page.goto("/#experiencia");
    await page.getByRole("navigation", { name: "Idioma" }).getByRole("link", { name: "EN" }).click();

    await expect(page).toHaveURL(/\/en#experiencia$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByText(getSite("en").tagline)).toBeVisible();
    await expect(page.getByText(getExperience("en")[0].achievements[0])).toBeVisible();

    await page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "ES" }).click();
    await expect(page).toHaveURL(/\/#experiencia$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });

  test("English page renders without console errors", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(site.name.split(" ")[0]);
    await expect(page.getByRole("link", { name: "Download CV" }).first()).toHaveAttribute("href", site.cvUrl);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
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

test("contact form errors are in English on the English page", async ({ page }) => {
  await page.goto("/en#contacto");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#contact-email-error")).toHaveText("I need an email to reply to you.");
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
