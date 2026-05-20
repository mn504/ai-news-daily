import { sql, eq } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { articles } from "@db/schema";

export const statsRouter = createRouter({
  dashboard: adminQuery.query(async () => {
    const db = getDb();

    const [
      totalArticles,
      todayArticles,
      publishedArticles,
      draftArticles,
      categoryStats,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(articles),
      db
        .select({ count: sql<number>`count(*)` })
        .from(articles)
        .where(sql`DATE(${articles.createdAt}) = CURRENT_DATE`),
      db
        .select({ count: sql<number>`count(*)` })
        .from(articles)
        .where(eq(articles.status, "published")),
      db
        .select({ count: sql<number>`count(*)` })
        .from(articles)
        .where(eq(articles.status, "draft")),
      db
        .select({
          category: articles.category,
          count: sql<number>`count(*)`,
        })
        .from(articles)
        .groupBy(articles.category),
    ]);

    return {
      total: totalArticles[0]?.count ?? 0,
      today: todayArticles[0]?.count ?? 0,
      published: publishedArticles[0]?.count ?? 0,
      draft: draftArticles[0]?.count ?? 0,
      byCategory: categoryStats,
    };
  }),
});
