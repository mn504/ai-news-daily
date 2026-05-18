import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";
import { scrapeNews, seedDemoData } from "./scraper-service";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

// Auto-scrape endpoint - can be called by external cron services
app.get("/api/cron/scrape", async (c) => {
  const secret = c.req.query("secret");
  const expectedSecret = process.env.CRON_SECRET || "ainews-cron-key";

  if (secret !== expectedSecret) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const result = await scrapeNews();
    return c.json({
      success: true,
      attempted: result.attempted,
      fetched: result.fetched,
      saved: result.saved,
      errors: result.errors,
    });
  } catch (err) {
    return c.json({ error: "Scrape failed", message: String(err) }, 500);
  }
});

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

// Start built-in auto-scraping scheduler (every hour)
const SCRAPE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

async function runScraperWithLog() {
  try {
    console.log("[AutoScraper] Starting scheduled news scrape...");
    const result = await scrapeNews();
    console.log(
      `[AutoScraper] Done. Attempted: ${result.attempted}, Fetched: ${result.fetched}, Saved: ${result.saved}`
    );
    if (result.errors.length > 0) {
      console.log(`[AutoScraper] Errors:`, result.errors);
    }
  } catch (err) {
    console.error("[AutoScraper] Error:", err);
  }
}

// Seed demo data on first start
seedDemoData().catch(() => {});

// Schedule periodic scraping
setInterval(runScraperWithLog, SCRAPE_INTERVAL_MS);

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`[AutoScraper] Scheduled to run every ${SCRAPE_INTERVAL_MS / 1000 / 60} minutes`);
  });
}
