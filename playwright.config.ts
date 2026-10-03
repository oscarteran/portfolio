import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const isCI = Boolean(process.env.CI);

/** Tests run against the production build (`next start`), not the dev server: that's what
 * visitors get, and it avoids dev-only overlays and origin checks. A dedicated port keeps
 * them from colliding with a `npm run dev` already on :3000. */
export default defineConfig({
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    // Pure logic, no browser needed.
    { name: "unit", testDir: "./tests/unit" },
    { name: "desktop", testDir: "./tests/e2e", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", testDir: "./tests/e2e", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    // CI builds in its own step; locally, build first so tests never hit a stale build.
    command: isCI ? `npx next start -p ${PORT}` : `npm run build && npx next start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 180_000,
    // Tests must not send real email, whatever the local .env says.
    env: { RESEND_API_KEY: "" },
  },
});
