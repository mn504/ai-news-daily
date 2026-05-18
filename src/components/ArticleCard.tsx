import { Link } from "react-router";
import { Clock, ArrowRight } from "lucide-react";
import type { Article } from "@db/schema";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
}

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

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return new Date(date).toLocaleDateString("zh-CN");
}

export default function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <Link
        to={`/article/${article.id}`}
        className="group block relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
      >
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={article.imageUrl || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.industry}`}>
              {CATEGORY_LABELS[article.category] || "AI资讯"}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
            {article.title}
          </h2>
          <p className="mt-2 text-sm text-slate-400 line-clamp-2 hidden sm:block">
            {article.summary}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        to={`/article/${article.id}`}
        className="group flex gap-3 items-start py-3 border-b border-slate-800 last:border-0"
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-800">
          <img
            src={article.imageUrl || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200"}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-slate-500">{article.sourceName}</span>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs text-slate-500">{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/article/${article.id}`}
      className="group block rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
    >
      <div className="aspect-[16/10] overflow-hidden bg-slate-800">
        <img
          src={article.imageUrl || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600"}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.industry}`}>
            {CATEGORY_LABELS[article.category] || "AI资讯"}
          </span>
          <span className="text-xs text-slate-500">{article.sourceName}</span>
        </div>
        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-slate-400 line-clamp-2">
          {article.summary}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
            阅读 <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
