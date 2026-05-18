import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  // int,
  // bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const articles = mysqlTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
  content: text("content"),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  sourceName: varchar("sourceName", { length: 100 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  category: mysqlEnum("category", [
    "frontier",
    "llm",
    "application",
    "investment",
    "industry",
  ])
    .default("frontier")
    .notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["published", "draft", "archived"])
    .default("published")
    .notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

export const adSlots = mysqlTable("adSlots", {
  id: serial("id").primaryKey(),
  slotId: varchar("slotId", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  htmlCode: text("htmlCode"),
  isActive: boolean("isActive").default(false).notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type AdSlot = typeof adSlots.$inferSelect;
export type InsertAdSlot = typeof adSlots.$inferInsert;
