import { z } from "zod";
import { eq, desc, and, like, or, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { articles } from "@db/schema";

export const articleRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          category: z
            .enum(["frontier", "llm", "application", "investment", "industry"])
            .optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(50).default(20),
          status: z.enum(["published", "draft", "archived"]).optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.category) {
        conditions.push(eq(articles.category, input.category));
      }
      if (input?.status) {
        conditions.push(eq(articles.status, input.status));
      } else {
        conditions.push(eq(articles.status, "published"));
      }
      if (input?.search) {
        conditions.push(
          or(
            like(articles.title, `%${input.search}%`),
            like(articles.summary, `%${input.search}%`)
          )
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [items, countResult] = await Promise.all([
        db
          .select()
          .from(articles)
          .where(where)
          .orderBy(desc(articles.publishedAt))
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(articles)
          .where(where),
      ]);

      return {
        items,
        total: countResult[0]?.count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((countResult[0]?.count ?? 0) / limit),
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(articles)
        .where(eq(articles.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  getByCategory: publicQuery
    .input(
      z.object({
        category: z.enum([
          "frontier",
          "llm",
          "application",
          "investment",
          "industry",
        ]),
        limit: z.number().min(1).max(20).default(10),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.category, input.category),
            eq(articles.status, "published")
          )
        )
        .orderBy(desc(articles.publishedAt))
        .limit(input.limit);
    }),

  search: publicQuery
    .input(z.object({ q: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.status, "published"),
            or(
              like(articles.title, `%${input.q}%`),
              like(articles.summary, `%${input.q}%`)
            )
          )
        )
        .orderBy(desc(articles.publishedAt))
        .limit(20);
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        summary: z.string().optional(),
        content: z.string().optional(),
        sourceUrl: z.string().optional(),
        sourceName: z.string().optional(),
        imageUrl: z.string().optional(),
        category: z.enum([
          "frontier",
          "llm",
          "application",
          "investment",
          "industry",
        ]),
        status: z.enum(["published", "draft", "archived"]).default("published"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(articles).values({
        ...input,
        publishedAt: new Date(),
      });
      return result;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        summary: z.string().optional(),
        content: z.string().optional(),
        sourceUrl: z.string().optional(),
        sourceName: z.string().optional(),
        imageUrl: z.string().optional(),
        category: z
          .enum([
            "frontier",
            "llm",
            "application",
            "investment",
            "industry",
          ])
          .optional(),
        status: z.enum(["published", "draft", "archived"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(articles).set(data).where(eq(articles.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(articles).where(eq(articles.id, input.id));
      return { success: true };
    }),
});
