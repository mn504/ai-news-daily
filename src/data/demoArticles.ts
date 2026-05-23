export interface DemoArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  sourceUrl: string;
  sourceName: string;
  imageUrl: string;
  category: "frontier" | "llm" | "application" | "investment" | "industry";
  publishedAt: string; // ISO date string YYYY-MM-DD
  status: "published" | "draft" | "archived";
}

// Helper: create dates for the past 30 days
function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}

export const demoArticles: DemoArticle[] = [
  {
    id: 1,
    title: "OpenAI 发布 GPT-5 预览版：多模态推理能力大幅提升",
    summary: "OpenAI 今日发布了 GPT-5 的预览版本，新模型在代码生成、数学推理和多语言处理方面表现突出。据悉，GPT-5 采用了全新的架构设计，参数量达到数万亿级别...",
    content: "OpenAI 今日发布了 GPT-5 的预览版本，新模型在代码生成、数学推理和多语言处理方面表现突出。据悉，GPT-5 采用了全新的架构设计，参数量达到数万亿级别，训练数据覆盖了更广泛的知识领域。",
    sourceUrl: "https://openai.com/blog/gpt-5-preview",
    sourceName: "OpenAI Blog",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    category: "llm",
    publishedAt: daysAgo(0),
    status: "published",
  },
  {
    id: 2,
    title: "Google DeepMind 推出 AlphaFold 3：预测蛋白质-DNA 复合物结构",
    summary: "Google DeepMind 今日发布了 AlphaFold 3，这是其蛋白质结构预测工具的第三代版本。新版本不仅能预测蛋白质结构，还能模拟蛋白质与 DNA、RNA 以及其他分子的相互作用...",
    content: "Google DeepMind 今日发布了 AlphaFold 3，这是其蛋白质结构预测工具的第三代版本。新版本不仅能预测蛋白质结构，还能模拟蛋白质与 DNA、RNA 以及其他分子的相互作用，为药物研发开辟了新的可能性。",
    sourceUrl: "https://deepmind.google/discover/blog/alphafold-3/",
    sourceName: "DeepMind Blog",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800",
    category: "frontier",
    publishedAt: daysAgo(0),
    status: "published",
  },
  {
    id: 3,
    title: "AI 创业公司在 2024 年Q1 融资超 200 亿美元，创季度新高",
    summary: "据 Crunchbase 数据显示，2024年第一季度全球 AI 创业公司共获得超过 200 亿美元融资，创下新的季度记录。其中，大模型、AI 基础设施和企业级 AI 应用是最受资本青睐的三大赛道...",
    content: "据 Crunchbase 数据显示，2024年第一季度全球 AI 创业公司共获得超过 200 亿美元融资，创下新的季度记录。",
    sourceUrl: "https://crunchbase.com/ai-funding-q1-2024",
    sourceName: "Crunchbase News",
    imageUrl: "https://images.unsplash.com/photo-1553729459-afe8c2fc8b8d?w=800",
    category: "investment",
    publishedAt: daysAgo(1),
    status: "published",
  },
  {
    id: 4,
    title: "Anthropic 发布 Claude 4：推理能力接近人类专家水平",
    summary: "Anthropic 今日发布了 Claude 4，这是其 Claude 系列的最新版本。Claude 4 在多项基准测试中表现出色，特别是在长文本理解、逻辑推理和代码生成方面...",
    content: "Anthropic 今日发布了 Claude 4，这是其 Claude 系列的最新版本。Claude 4 在多项基准测试中表现出色。",
    sourceUrl: "https://anthropic.com/news/claude-4",
    sourceName: "Anthropic",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
    category: "llm",
    publishedAt: daysAgo(1),
    status: "published",
  },
  {
    id: 5,
    title: "Midjourney V7 发布：AI 图像生成进入实时时代",
    summary: "Midjourney 发布了第七代模型，V7 版本最大的升级是支持实时图像生成和编辑。用户可以在对话过程中实时调整图像的风格、构图和细节...",
    content: "Midjourney 发布了第七代模型，V7 版本最大的升级是支持实时图像生成和编辑。",
    sourceUrl: "https://midjourney.com/updates/v7",
    sourceName: "Midjourney",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    category: "application",
    publishedAt: daysAgo(2),
    status: "published",
  },
  {
    id: 6,
    title: "特斯拉 FSD V13 推送：纯视觉方案实现城市自动驾驶",
    summary: "特斯拉开始推送 FSD V13 版本，新版本完全依赖摄像头和神经网络，不再使用雷达和超声波传感器。据早期测试用户反馈，V13 在城市道路的接管率降低了 40%...",
    content: "特斯拉开始推送 FSD V13 版本，新版本完全依赖摄像头和神经网络。",
    sourceUrl: "https://tesla.com/blog/fsd-v13",
    sourceName: "Tesla Blog",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    category: "application",
    publishedAt: daysAgo(2),
    status: "published",
  },
  {
    id: 7,
    title: "Meta 开源 Llama 4：400B 参数模型免费商用",
    summary: "Meta AI 今日开源了 Llama 4 系列模型，包括 70B、400B 和 1T 三个版本。其中 400B 版本在多项基准测试中超过了 GPT-4，且允许免费商用...",
    content: "Meta AI 今日开源了 Llama 4 系列模型，包括 70B、400B 和 1T 三个版本。",
    sourceUrl: "https://ai.meta.com/blog/llama-4/",
    sourceName: "Meta AI",
    imageUrl: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=800",
    category: "llm",
    publishedAt: daysAgo(3),
    status: "published",
  },
  {
    id: 8,
    title: "英伟达发布 H200 AI 芯片：推理速度提升 90%",
    summary: "NVIDIA 发布了新一代 AI 芯片 H200，采用 HBM3e 显存技术，内存带宽达到 4.8TB/s。在大模型推理场景下，H200 相比 H100 速度提升高达 90%...",
    content: "NVIDIA 发布了新一代 AI 芯片 H200，采用 HBM3e 显存技术。",
    sourceUrl: "https://nvidia.com/news/h200-announcement",
    sourceName: "NVIDIA News",
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800",
    category: "industry",
    publishedAt: daysAgo(3),
    status: "published",
  },
  {
    id: 9,
    title: "Perplexity AI 完成新一轮融资，估值突破 30 亿美元",
    summary: "AI 搜索引擎 Perplexity 完成了由软银愿景基金领投的 C 轮融资，估值达到 30 亿美元。该公司计划利用新资金扩展企业级产品线...",
    content: "AI 搜索引擎 Perplexity 完成了由软银愿景基金领投的 C 轮融资。",
    sourceUrl: "https://perplexity.ai/blog/funding",
    sourceName: "Perplexity",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    category: "investment",
    publishedAt: daysAgo(4),
    status: "published",
  },
  {
    id: 10,
    title: "苹果发布 Apple Intelligence：深度集成 AI 的 iOS 18",
    summary: "苹果在 WWDC 上发布了 Apple Intelligence，将生成式 AI 深度集成到 iOS 18、iPadOS 18 和 macOS Sequoia 中。用户可以在系统层面使用 AI 写作、修图、摘要...",
    content: "苹果在 WWDC 上发布了 Apple Intelligence，将生成式 AI 深度集成到 iOS 18 中。",
    sourceUrl: "https://apple.com/apple-intelligence",
    sourceName: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    category: "application",
    publishedAt: daysAgo(5),
    status: "published",
  },
  {
    id: 11,
    title: "微软 Copilot Studio 更新：支持自定义 GPT 和插件",
    summary: "微软宣布 Copilot Studio 重大更新，现在支持创建自定义 GPT、集成第三方插件、以及连接到企业内部的业务系统。这意味着企业可以打造专属 AI 助手...",
    content: "微软宣布 Copilot Studio 重大更新，现在支持创建自定义 GPT。",
    sourceUrl: "https://microsoft.com/copilot-studio",
    sourceName: "Microsoft",
    imageUrl: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800",
    category: "application",
    publishedAt: daysAgo(6),
    status: "published",
  },
  {
    id: 12,
    title: "Stability AI 发布 Stable Diffusion 3：文字渲染大幅改进",
    summary: "Stability AI 发布了 Stable Diffusion 3，新版本在文字渲染、多人构图和图像质量方面有显著提升。新模型采用了改进的 Diffusion Transformer 架构...",
    content: "Stability AI 发布了 Stable Diffusion 3，新版本在文字渲染方面大幅提升。",
    sourceUrl: "https://stability.ai/stable-diffusion-3",
    sourceName: "Stability AI",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    category: "application",
    publishedAt: daysAgo(7),
    status: "published",
  },
  {
    id: 13,
    title: "Google 发布 Gemini 1.5 Pro：100万 token 上下文窗口",
    summary: "Google DeepMind 发布了 Gemini 1.5 Pro，支持高达 100 万 token 的上下文窗口。这意味着模型可以一次处理约 70 万字的文本...",
    content: "Google DeepMind 发布了 Gemini 1.5 Pro，支持高达 100 万 token 的上下文窗口。",
    sourceUrl: "https://deepmind.google/gemini-1-5-pro",
    sourceName: "DeepMind",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    category: "frontier",
    publishedAt: daysAgo(7),
    status: "published",
  },
  {
    id: 14,
    title: "Figure AI 人形机器人获 6.75 亿美元融资",
    summary: "人形机器人公司 Figure AI 完成了 6.75 亿美元 B 轮融资，由微软、OpenAI、NVIDIA 等科技巨头联合投资。该公司计划利用新资金扩大机器人生产...",
    content: "人形机器人公司 Figure AI 完成了 6.75 亿美元 B 轮融资。",
    sourceUrl: "https://figure.ai/news/funding",
    sourceName: "Figure AI",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    category: "investment",
    publishedAt: daysAgo(8),
    status: "published",
  },
  {
    id: 15,
    title: "xAI Grok-2 发布：马斯克挑战 GPT-4",
    summary: "马斯克旗下的 xAI 发布了 Grok-2 大模型，在多项基准测试中接近 GPT-4 水平。Grok-2 特别擅长编码和数学推理，且保留了 Grok 系列的幽默风格...",
    content: "马斯克旗下的 xAI 发布了 Grok-2 大模型。",
    sourceUrl: "https://x.ai/grok-2",
    sourceName: "xAI",
    imageUrl: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=800",
    category: "llm",
    publishedAt: daysAgo(9),
    status: "published",
  },
  {
    id: 16,
    title: "欧盟通过《人工智能法案》：全球首部 AI 综合法规",
    summary: "欧盟议会正式通过了《人工智能法案》（EU AI Act），这是全球首部针对人工智能的综合法规。法案将 AI 系统按风险等级分类管理...",
    content: "欧盟议会正式通过了《人工智能法案》。",
    sourceUrl: "https://europa.eu/ai-act",
    sourceName: "EU Parliament",
    imageUrl: "https://images.unsplash.com/photo-1553729459-afe8c2fc8b8d?w=800",
    category: "industry",
    publishedAt: daysAgo(10),
    status: "published",
  },
  {
    id: 17,
    title: "Character.AI 被 Google 以 25 亿美元收购",
    summary: "Google 宣布以 25 亿美元收购 AI 聊天机器人公司 Character.AI。该公司创始人 Noam Shazeer（Transformer 论文作者之一）将重返 Google...",
    content: "Google 宣布以 25 亿美元收购 AI 聊天机器人公司 Character.AI。",
    sourceUrl: "https://blog.google/character-ai-acquisition",
    sourceName: "Google Blog",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800",
    category: "investment",
    publishedAt: daysAgo(11),
    status: "published",
  },
  {
    id: 18,
    title: "华为盘古大模型 5.0 发布：多模态能力全面升级",
    summary: "华为发布了盘古大模型 5.0，在多模态理解、代码生成、科学计算等方面实现重大突破。新版本支持文本、图像、视频、音频的统一理解...",
    content: "华为发布了盘古大模型 5.0。",
    sourceUrl: "https://huawei.com/pangu-5",
    sourceName: "Huawei",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
    category: "llm",
    publishedAt: daysAgo(12),
    status: "published",
  },
];

// Get unique dates from articles
export function getAvailableDates(): string[] {
  const dates = new Set(demoArticles.map((a) => a.publishedAt));
  return Array.from(dates).sort((a, b) => b.localeCompare(a)); // newest first
}

// Filter articles by date
export function filterByDate(articles: DemoArticle[], date: string): DemoArticle[] {
  return articles.filter((a) => a.publishedAt === date);
}

// Filter articles by category and date
export function filterByCategoryAndDate(
  articles: DemoArticle[],
  category: string,
  date: string
): DemoArticle[] {
  return articles.filter((a) => a.category === category && a.publishedAt === date);
}
