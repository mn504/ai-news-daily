import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { adSlots } from "@db/schema";

export const adRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(adSlots);
  }),

  getBySlotId: publicQuery
    .input(z.object({ slotId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(adSlots)
        .where(eq(adSlots.slotId, input.slotId))
        .limit(1);
      return result[0] ?? null;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        htmlCode: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(adSlots).set(data).where(eq(adSlots.id, id));
      return { success: true };
    }),

  toggle: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const current = await db
        .select()
        .from(adSlots)
        .where(eq(adSlots.id, input.id))
        .limit(1);
      if (current[0]) {
        await db
          .update(adSlots)
          .set({ isActive: !current[0].isActive })
          .where(eq(adSlots.id, input.id));
      }
      return { success: true };
    }),
});
