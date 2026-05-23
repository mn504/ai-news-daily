import { useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import { Loader2, Search } from "lucide-react";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const { data, isLoading } = trpc.article.search.useQuery(
    { q },
    { enabled: q.length > 0 }
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-semibold text-white">搜索结果</h1>
          </div>
          <p className="text-slate-500">
            {q ? `关键词："${q}"` : "请输入搜索关键词"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
            ) : q ? (
              <div className="text-center py-20">
                <p className="text-slate-500">没有找到匹配 "{q}" 的文章</p>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-500">在上方搜索框输入关键词开始搜索</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <AdSlot slotId="ad-sidebar-1" className="w-full h-[250px]" />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
