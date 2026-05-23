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
      // 总文章数
      db
        .select({ count: sql<number>`count(*)` })
        .from(articles),
      // 今日文章数
      db
        .select({ count: sql<number>`count(*)` })
        .from(articles)
        .where(
          sql`DATE(${articles.createdAt}) = DATE('now')`
        ),
      // 已发布文章数
      db
        .select({ count: sql<number>`count(*)` })
        .from(articles)
        .where(eq(articles.status, "published")),
      // 草稿文章数
      db
        .select({ count: sql<number>`count(*)` })
        .from(articles)
        .where(eq(articles.status, "draft")),
      // 分类统计
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
