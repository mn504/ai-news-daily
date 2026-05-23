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

// ===== 每天早上 8:00 自动抓取新闻 =====

// 记录今天是否已经抓取过
let lastScrapeDate = "";

function getNext8AM(): number {
  const now = new Date();
  const next8 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0);
  if (next8 <= now) {
    next8.setDate(next8.getDate() + 1); // 如果已经过了8点，设置为明天8点
  }
  return next8.getTime() - now.getTime();
}

async function runDailyScrape() {
  const today = new Date().toISOString().split("T")[0];
  if (lastScrapeDate === today) {
    return; // 今天已经抓取过了
  }
  lastScrapeDate = today;

  try {
    const now = new Date().toLocaleString("zh-CN");
    console.log(`[AutoScraper][${now}] ===== 开始每日新闻抓取 =====`);
    const result = await scrapeNews();
    console.log(`[AutoScraper][${now}] 抓取完成！尝试:${result.attempted} 获取:${result.fetched} 保存:${result.saved}`);
    if (result.errors.length > 0) {
      console.log(`[AutoScraper] 错误:`, result.errors);
    }
  } catch (err) {
    console.error("[AutoScraper] 抓取失败:", err);
  }

  // 安排下一次 8:00 的抓取
  scheduleNextScrape();
}

function scheduleNextScrape() {
  const delay = getNext8AM();
  const nextTime = new Date(Date.now() + delay).toLocaleString("zh-CN");
  console.log(`[AutoScraper] 下次抓取时间: ${nextTime}`);
  setTimeout(runDailyScrape, delay);
}

// Seed demo data on first start
seedDemoData().catch(() => {});

// Start the daily scheduler
scheduleNextScrape();
// Also check every minute in case the server was down at 8:00
setInterval(runDailyScrape, 60 * 1000);

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`[AutoScraper] 每天早上 8:00 自动抓取新闻`);
  });
}
