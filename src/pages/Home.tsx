import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import { Button } from "@/components/ui/button";
import { TrendingUp, Tag, Loader2, Newspaper } from "lucide-react";

const ALL_TAGS = [
  "GPT-5", "Claude", "LLaMA", "OpenAI", "Google", "NVIDIA",
  "AI芯片", "自动驾驶", "AI医疗", "机器人", "多模态", "AGI",
  "AI安全", "深度学习", "机器学习", "生成式AI", "AI Agent",
];

export default function Home() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = trpc.article.list.useQuery({ page, limit: 12 });
  const { data: trendingData } = trpc.article.list.useQuery({ limit: 5 });

  const articles = data?.items ?? [];
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Section Title */}
        <div className="flex items-center gap-2 mb-6">
          <Newspaper className="w-5 h-5 text-blue-400" />
          <h1 className="text-lg font-semibold text-white">最新 AI 资讯</h1>
          <span className="text-sm text-slate-500">
            共 {data?.total ?? 0} 条
          </span>
        </div>

        {/* Hero / Featured */}
        {featured && (
          <div className="mb-8">
            <ArticleCard article={featured} variant="featured" />
          </div>
        )}

        {/* Ad: Top Banner */}
        <div className="mb-8">
          <AdSlot slotId="ad-top-banner" className="w-full h-[90px]" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Articles Column */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-20">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              ) : (
                rest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              )}
            </div>

            {/* Load More */}
            {!isLoading && data && page < data.totalPages && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  加载更多
                </Button>
              </div>
            )}

            {/* Ad: Mid Banner */}
            <div className="mt-8">
              <AdSlot slotId="ad-mid-banner" className="w-full h-[90px]" />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Ad: Sidebar */}
            <AdSlot slotId="ad-sidebar-1" className="w-full h-[250px]" />

            {/* Trending */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <h3 className="font-semibold text-white">热门排行</h3>
              </div>
              <div className="space-y-0">
                {trendingData?.items.slice(0, 5).map((article, index) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="group flex gap-3 items-start py-3 border-b border-slate-800 last:border-0"
                  >
                    <span className={`text-lg font-bold shrink-0 w-6 text-center ${
                      index < 3 ? "text-blue-400" : "text-slate-600"
                    }`}>
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-300 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </p>
                      <span className="text-xs text-slate-500 mt-1 inline-block">
                        {article.sourceName}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-green-400" />
                <h3 className="font-semibold text-white">热门标签</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 transition-colors border border-slate-700 hover:border-blue-500/20"
                  >
                    {tag}
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
