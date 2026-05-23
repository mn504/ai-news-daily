import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@db/schema";
import { join } from "path";

const dbPath = process.env.DATABASE_PATH || join(process.cwd(), "data", "db.sqlite");

let db: ReturnType<typeof drizzle<typeof schema>>;

export function getDb() {
  if (!db) {
    const client = createClient({ url: `file:${dbPath}` });
    db = drizzle(client, { schema });
  }
  return db;
}
