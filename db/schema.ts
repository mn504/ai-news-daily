import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  unionId: text("unionId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  avatar: text("avatar"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastSignInAt: integer("lastSignInAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const articles = sqliteTable("articles", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content"),
  sourceUrl: text("sourceUrl"),
  sourceName: text("sourceName"),
  imageUrl: text("imageUrl"),
  category: text("category", { enum: ["frontier", "llm", "application", "investment", "industry"] }).default("frontier").notNull(),
  publishedAt: integer("publishedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
  status: text("status", { enum: ["published", "draft", "archived"] }).default("published").notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

export const adSlots = sqliteTable("adSlots", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  slotId: text("slotId").notNull().unique(),
  name: text("name").notNull(),
  htmlCode: text("htmlCode"),
  isActive: integer("isActive", { mode: "boolean" }).default(false).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type AdSlot = typeof adSlots.$inferSelect;
export type InsertAdSlot = typeof adSlots.$inferInsert;
