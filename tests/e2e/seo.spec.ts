import { expect, test } from "@playwright/test";
import { site } from "../../src/data/site";

test("page exposes title, description, Open Graph and JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(`${site.name} — ${site.role}`);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", site.tagline);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  await expect(page.locator('link[rel="canonical"]')).toBeAttached();

  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(jsonLd).toMatchObject({ "@type": "Person", name: site.name, jobTitle: site.role });
});

test("metadata routes respond", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Sitemap:");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("<urlset");

  for (const path of ["/opengraph-image", "/icon"]) {
    const image = await request.get(path);
    expect(image.ok(), path).toBe(true);
    expect(image.headers()["content-type"], path).toBe("image/png");
  }
});

test("unknown routes render the custom 404", async ({ page }) => {
  const response = await page.goto("/esta-pagina-no-existe");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Volver al inicio" })).toBeVisible();
});
