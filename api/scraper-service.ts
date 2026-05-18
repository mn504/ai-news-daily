import { eq, sql } from "drizzle-orm";
import { getDb } from "./queries/connection";
import { articles, type InsertArticle } from "@db/schema";

interface NewsSource {
  name: string;
  url: string;
  category: "frontier" | "llm" | "application" | "investment" | "industry";
}

const NEWS_SOURCES: NewsSource[] = [
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "frontier",
  },
  {
    name: "MIT AI News",
    url: "https://news.mit.edu/topic/artificial-intelligence2/rss.xml",
    category: "frontier",
  },
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    category: "llm",
  },
];

function parseRSSItems(xmlText: string, source: NewsSource) {
  const items: Omit<InsertArticle, "id">[] = [];
  const itemRegex = /<item[^>]*>[\s\S]*?<\/item>/gi;
  const items_xml = xmlText.match(itemRegex) || [];

  for (const itemXml of items_xml.slice(0, 8)) {
    try {
      const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i);
      const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/i);
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);

      const title = titleMatch?.[1]?.trim();
      const sourceUrl = linkMatch?.[1]?.trim();
      let summary = descMatch?.[1]?.trim() || "";

      // Strip HTML tags from summary
      summary = summary.replace(/<[^>]+>/g, "").substring(0, 300);

      let publishedAt = new Date();
      if (pubDateMatch?.[1]) {
        publishedAt = new Date(pubDateMatch[1]);
      }

      if (title && sourceUrl) {
        items.push({
          title,
          summary: summary || title,
          content: summary || title,
          sourceUrl,
          sourceName: source.name,
          category: source.category,
          publishedAt,
          status: "published",
        });
      }
    } catch {
      // Skip invalid items
    }
  }

  return items;
}

export async function scrapeNews() {
  const db = getDb();
  const results = {
    attempted: 0,
    fetched: 0,
    saved: 0,
    errors: [] as string[],
  };

  for (const source of NEWS_SOURCES) {
    try {
      results.attempted++;
      const response = await fetch(source.url, {
        headers: {
          "User-Agent": "AI-News-Daily-Bot/1.0",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        results.errors.push(`${source.name}: HTTP ${response.status}`);
        continue;
      }

      const xmlText = await response.text();
      const items = parseRSSItems(xmlText, source);
      results.fetched += items.length;

      for (const item of items) {
        try {
          // Check if article already exists by sourceUrl
          const existing = await db
            .select({ id: articles.id })
            .from(articles)
            .where(eq(articles.sourceUrl, item.sourceUrl!))
            .limit(1);

          if (existing.length === 0) {
            await db.insert(articles).values(item);
            results.saved++;
          }
        } catch (err) {
          results.errors.push(`${source.name}: DB insert failed`);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      results.errors.push(`${source.name}: ${message}`);
    }
  }

  return results;
}

// Seed initial demo data if no articles exist
export async function seedDemoData() {
  const db = getDb();
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(articles);

  if ((count[0]?.count ?? 0) > 0) return;

  const demoArticles: InsertArticle[] = [
    {
      title: "OpenAI 发布 GPT-5 预览版：多模态推理能力大幅提升",
      summary:
        "OpenAI 今日发布了 GPT-5 的预览版本，新模型在代码生成、数学推理和多语言处理方面表现突出。据悉，GPT-5 采用了全新的架构设计，参数量达到数万亿级别...",
      content: "OpenAI 今日发布了 GPT-5 的预览版本，新模型在代码生成、数学推理和多语言处理方面表现突出。据悉，GPT-5 采用了全新的架构设计，参数量达到数万亿级别，训练数据覆盖了更广泛的知识领域。",
      sourceUrl: "https://openai.com/blog/gpt-5-preview",
      sourceName: "OpenAI Blog",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      category: "llm",
      publishedAt: new Date(),
      status: "published",
    },
    {
      title: "Google DeepMind 推出 AlphaFold 3：预测蛋白质-DNA 复合物结构",
      summary:
        "Google DeepMind 今日发布了 AlphaFold 3，这是其蛋白质结构预测工具的第三代版本。新版本不仅能预测蛋白质结构，还能模拟蛋白质与 DNA、RNA 以及其他分子的相互作用...",
      content: "Google DeepMind 今日发布了 AlphaFold 3，这是其蛋白质结构预测工具的第三代版本。新版本不仅能预测蛋白质结构，还能模拟蛋白质与 DNA、RNA 以及其他分子的相互作用，为药物研发开辟了新的可能性。",
      sourceUrl: "https://deepmind.google/discover/blog/alphafold-3/",
      sourceName: "DeepMind Blog",
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800",
      category: "frontier",
      publishedAt: new Date(Date.now() - 3600000),
      status: "published",
    },
    {
      title: "AI 创业公司在 2024 年Q1 融资超 200 亿美元，创季度新高",
      summary:
        "据 Crunchbase 数据显示，2024年第一季度全球 AI 创业公司共获得超过 200 亿美元融资，创下新的季度记录。其中，大模型、AI 基础设施和企业级 AI 应用是最受资本青睐的三大赛道...",
      content: "据 Crunchbase 数据显示，2024年第一季度全球 AI 创业公司共获得超过 200 亿美元融资，创下新的季度记录。",
      sourceUrl: "https://crunchbase.com/ai-funding-q1-2024",
      sourceName: "Crunchbase News",
      imageUrl: "https://images.unsplash.com/photo-1553729459-afe8c2fc8b8d?w=800",
      category: "investment",
      publishedAt: new Date(Date.now() - 7200000),
      status: "published",
    },
    {
      title: "Anthropic 发布 Claude 4：推理能力接近人类专家水平",
      summary:
        "Anthropic 今日发布了 Claude 4，这是其 Claude 系列的最新版本。Claude 4 在多项基准测试中表现出色，特别是在长文本理解、逻辑推理和代码生成方面...",
      content: "Anthropic 今日发布了 Claude 4，这是其 Claude 系列的最新版本。Claude 4 在多项基准测试中表现出色。",
      sourceUrl: "https://anthropic.com/news/claude-4",
      sourceName: "Anthropic",
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
      category: "llm",
      publishedAt: new Date(Date.now() - 10800000),
      status: "published",
    },
    {
      title: "Midjourney V7 发布：AI 图像生成进入实时时代",
      summary:
        "Midjourney 发布了第七代模型，V7 版本最大的升级是支持实时图像生成和编辑。用户可以在对话过程中实时调整图像的风格、构图和细节...",
      content: "Midjourney 发布了第七代模型，V7 版本最大的升级是支持实时图像生成和编辑。",
      sourceUrl: "https://midjourney.com/updates/v7",
      sourceName: "Midjourney",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      category: "application",
      publishedAt: new Date(Date.now() - 14400000),
      status: "published",
    },
    {
      title: "特斯拉 FSD V13 推送：纯视觉方案实现城市自动驾驶",
      summary:
        "特斯拉开始推送 FSD V13 版本，新版本完全依赖摄像头和神经网络，不再使用雷达和超声波传感器。据早期测试用户反馈，V13 在城市道路的接管率降低了 40%...",
      content: "特斯拉开始推送 FSD V13 版本，新版本完全依赖摄像头和神经网络。",
      sourceUrl: "https://tesla.com/blog/fsd-v13",
      sourceName: "Tesla Blog",
      imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
      category: "application",
      publishedAt: new Date(Date.now() - 18000000),
      status: "published",
    },
    {
      title: "Meta 开源 Llama 4：400B 参数模型免费商用",
      summary:
        "Meta AI 今日开源了 Llama 4 系列模型，包括 70B、400B 和 1T 三个版本。其中 400B 版本在多项基准测试中超过了 GPT-4，且允许免费商用...",
      content: "Meta AI 今日开源了 Llama 4 系列模型，包括 70B、400B 和 1T 三个版本。",
      sourceUrl: "https://ai.meta.com/blog/llama-4/",
      sourceName: "Meta AI",
      imageUrl: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=800",
      category: "llm",
      publishedAt: new Date(Date.now() - 21600000),
      status: "published",
    },
    {
      title: "英伟达发布 H200 AI 芯片：推理速度提升 90%",
      summary:
        "NVIDIA 发布了新一代 AI 芯片 H200，采用 HBM3e 显存技术，内存带宽达到 4.8TB/s。在大模型推理场景下，H200 相比 H100 速度提升高达 90%...",
      content: "NVIDIA 发布了新一代 AI 芯片 H200，采用 HBM3e 显存技术。",
      sourceUrl: "https://nvidia.com/news/h200-announcement",
      sourceName: "NVIDIA News",
      imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800",
      category: "industry",
      publishedAt: new Date(Date.now() - 25200000),
      status: "published",
    },
    {
      title: "Perplexity AI 完成新一轮融资，估值突破 30 亿美元",
      summary:
        "AI 搜索引擎 Perplexity 完成了由软银愿景基金领投的 C 轮融资，估值达到 30 亿美元。该公司计划利用新资金扩展企业级产品线...",
      content: "AI 搜索引擎 Perplexity 完成了由软银愿景基金领投的 C 轮融资。",
      sourceUrl: "https://perplexity.ai/blog/funding",
      sourceName: "Perplexity",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
      category: "investment",
      publishedAt: new Date(Date.now() - 28800000),
      status: "published",
    },
  ];

  await db.insert(articles).values(demoArticles);
}
