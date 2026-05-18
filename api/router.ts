import { z } from "zod";
import { authRouter } from "./auth-router";
import { articleRouter } from "./article-router";
import { adRouter } from "./ad-router";
import { statsRouter } from "./stats-router";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { scrapeNews } from "./scraper-service";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  article: articleRouter,
  ad: adRouter,
  stats: statsRouter,

  scrape: adminQuery
    .input(z.object({}).optional())
    .mutation(async () => {
      const result = await scrapeNews();
      return result;
    }),
});

export type AppRouter = typeof appRouter;
