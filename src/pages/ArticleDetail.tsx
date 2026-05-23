import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";
import { Loader2, ChevronRight, ExternalLink, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<string, string> = {
  frontier: "AI前沿",
  llm: "大模型",
  application: "AI应用",
  investment: "AI投资",
  industry: "产业动态",
};

const CATEGORY_COLORS: Record<string, string> = {
  frontier: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  llm: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  application: "bg-green-500/10 text-green-400 border-green-500/20",
  investment: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  industry: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const articleId = parseInt(id ?? "0", 10);

  const { data: article, isLoading } = trpc.article.getById.useQuery(
    { id: articleId },
    { enabled: articleId > 0 }
  );

  const { data: relatedData } = trpc.article.getByCategory.useQuery(
    {
      category: article?.category ?? "frontier",
      limit: 4,
    },
    { enabled: !!article }
  );

  const relatedArticles =
    relatedData?.filter((a) => a.id !== articleId).slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">文章未找到</h1>
            <p className="text-slate-500 mb-4">该文章可能已被删除或不存在</p>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700">返回首页</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
          <Link
            to={`/category/${article.category}`}
            className="hover:text-blue-400 transition-colors"
          >
            {CATEGORY_LABELS[article.category]}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-300 truncate max-w-[200px]">
            {article.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-3">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    CATEGORY_COLORS[article.category]
                  }`}
                >
                  {CATEGORY_LABELS[article.category]}
                </span>
                <span className="text-sm text-slate-500">
                  {article.sourceName}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                {article.title}
              </h1>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.publishedAt ? formatDate(article.publishedAt) : "未知时间"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("链接已复制到剪贴板");
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    分享
                  </Button>
                  {article.sourceUrl && (
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        阅读原文
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {article.imageUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            )}

            {/* Ad: Article Top */}
            <AdSlot slotId="ad-article-top" className="w-full h-[90px] mb-6" />

            {/* Content */}
            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-lg text-slate-300 leading-relaxed">
                {article.summary}
              </p>
              {article.content && article.content !== article.summary && (
                <div className="mt-6 text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {article.content}
                </div>
              )}
              {!article.content && (
                <div className="mt-6 p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                  <p className="text-slate-500 mb-3">
                    文章内容摘要如上，点击下方按钮阅读完整原文
                  </p>
                  {article.sourceUrl && (
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        阅读完整原文
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Ad: Article Mid */}
            <AdSlot slotId="ad-article-mid" className="w-full h-[250px] my-8" />

            {/* Ad: Article Bottom */}
            <AdSlot slotId="ad-article-bottom" className="w-full h-[90px] mb-8" />

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-800">
                <h2 className="text-xl font-bold text-white mb-6">相关推荐</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedArticles.map((a) => (
                    <ArticleCard key={a.id} article={a} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdSlot slotId="ad-sidebar-1" className="w-full h-[250px]" />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
