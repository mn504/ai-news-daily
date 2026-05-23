import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import { Loader2, ChevronRight } from "lucide-react";

const CATEGORY_META: Record<string, { label: string; description: string }> = {
  frontier: {
    label: "AI前沿",
    description: "人工智能领域最前沿的研究突破与技术进展",
  },
  llm: {
    label: "大模型",
    description: "大语言模型最新动态、发布与评测",
  },
  application: {
    label: "AI应用",
    description: "AI 在各行业的落地应用与创新产品",
  },
  investment: {
    label: "AI投资",
    description: "AI 领域投融资动态与资本市场分析",
  },
  industry: {
    label: "产业动态",
    description: "AI 产业链上下游企业动态与行业趋势",
  },
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug as "frontier" | "llm" | "application" | "investment" | "industry";

  const { data, isLoading } = trpc.article.getByCategory.useQuery(
    { category, limit: 30 },
    { enabled: !!category }
  );

  const meta = CATEGORY_META[slug ?? ""] ?? {
    label: "AI资讯",
    description: "人工智能领域最新动态",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-blue-400 transition-colors">
            首页
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-300">{meta.label}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {meta.label}
          </h1>
          <p className="text-slate-400">{meta.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Articles */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            ) : data && data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {data.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">
                <p>暂无该分类下的文章</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdSlot slotId="ad-sidebar-1" className="w-full h-[250px]" />

            {/* Category Navigation */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
              <h3 className="font-semibold text-white mb-4">浏览分类</h3>
              <div className="space-y-1">
                {Object.entries(CATEGORY_META).map(([key, value]) => (
                  <Link
                    key={key}
                    to={`/category/${key}`}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      key === slug
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <span>{value.label}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
