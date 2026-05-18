import { getDb } from "../api/queries/connection";
import { adSlots } from "./schema";
import { seedDemoData } from "../api/scraper-service";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed ad slots
  const existingAds = await db.select().from(adSlots);
  if (existingAds.length === 0) {
    await db.insert(adSlots).values([
      {
        slotId: "ad-top-banner",
        name: "首页顶部横幅",
        htmlCode: "",
        isActive: false,
      },
      {
        slotId: "ad-sidebar-1",
        name: "侧边栏矩形广告",
        htmlCode: "",
        isActive: false,
      },
      {
        slotId: "ad-mid-banner",
        name: "首页中部横幅",
        htmlCode: "",
        isActive: false,
      },
      {
        slotId: "ad-article-top",
        name: "文章页顶部横幅",
        htmlCode: "",
        isActive: false,
      },
      {
        slotId: "ad-article-mid",
        name: "文章页中部矩形",
        htmlCode: "",
        isActive: false,
      },
      {
        slotId: "ad-article-bottom",
        name: "文章页底部横幅",
        htmlCode: "",
        isActive: false,
      },
    ]);
    console.log("Ad slots seeded.");
  }

  // Seed demo articles if none exist
  await seedDemoData();
  console.log("Demo articles seeded.");

  console.log("Done.");
  process.exit(0);
}

seed();
