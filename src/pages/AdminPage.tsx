import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Newspaper,
  Megaphone,
  RefreshCw,
  Loader2,
  Pencil,
  Trash2,
  Eye,
  Search,
  ArrowLeft,
} from "lucide-react";

type TabType = "dashboard" | "articles" | "ads";

const CATEGORY_LABELS: Record<string, string> = {
  frontier: "AI前沿",
  llm: "大模型",
  application: "AI应用",
  investment: "AI投资",
  industry: "产业动态",
};

const CATEGORY_OPTIONS = [
  { value: "frontier", label: "AI前沿" },
  { value: "llm", label: "大模型" },
  { value: "application", label: "AI应用" },
  { value: "investment", label: "AI投资" },
  { value: "industry", label: "产业动态" },
];

const STATUS_OPTIONS = [
  { value: "published", label: "已发布" },
  { value: "draft", label: "草稿" },
  { value: "archived", label: "已归档" },
];

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Redirect non-admin users
  if (!authLoading && (!user || user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">无权访问</h1>
          <p className="text-slate-500 mb-4">您需要管理员权限才能访问此页面</p>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-slate-500 hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">管理后台</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <nav className="space-y-1 p-2">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "dashboard"
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  仪表盘
                </button>
                <button
                  onClick={() => setActiveTab("articles")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "articles"
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Newspaper className="w-4 h-4" />
                  文章管理
                </button>
                <button
                  onClick={() => setActiveTab("ads")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "ads"
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  广告管理
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-4">
            {activeTab === "dashboard" && <DashboardTab />}
            {activeTab === "articles" && <ArticlesTab />}
            {activeTab === "ads" && <AdsTab />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DashboardTab() {
  const { data: stats, isLoading } = trpc.stats.dashboard.useQuery();
  const utils = trpc.useUtils();
  const scrapeMutation = trpc.scrape.useMutation({
    onSuccess: (result) => {
      toast.success(
        `抓取完成：尝试 ${result.attempted} 个源，获取 ${result.fetched} 条，保存 ${result.saved} 条`
      );
      utils.stats.dashboard.invalidate();
      utils.article.list.invalidate();
    },
    onError: () => {
      toast.error("抓取失败");
    },
  });

  const cards = [
    {
      label: "总文章数",
      value: stats?.total ?? 0,
      color: "text-blue-400",
    },
    {
      label: "今日新增",
      value: stats?.today ?? 0,
      color: "text-green-400",
    },
    {
      label: "已发布",
      value: stats?.published ?? 0,
      color: "text-purple-400",
    },
    {
      label: "草稿",
      value: stats?.draft ?? 0,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl bg-slate-900 border border-slate-800 p-4"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${isLoading ? "text-slate-600" : card.color}`}>
              {isLoading ? "-" : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6">
        <h3 className="font-semibold text-white mb-4">快速操作</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => scrapeMutation.mutate({})}
            disabled={scrapeMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {scrapeMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            立即抓取新闻
          </Button>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6">
        <h3 className="font-semibold text-white mb-4">分类分布</h3>
        <div className="space-y-3">
          {stats?.byCategory.map((item) => (
            <div key={item.category} className="flex items-center gap-3">
              <span className="text-sm text-slate-400 w-20">
                {CATEGORY_LABELS[item.category]}
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${Math.max(5, (item.count / (stats.total || 1)) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-sm text-slate-400 w-8 text-right">
                {item.count}
              </span>
            </div>
          )) ?? (
            <p className="text-slate-500">暂无数据</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ArticlesTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingArticle, setEditingArticle] = useState<number | null>(null);

  const { data, isLoading } = trpc.article.list.useQuery({
    page,
    limit: 15,
    search: search || undefined,
    status: undefined,
  });

  const utils = trpc.useUtils();

  const updateMutation = trpc.article.update.useMutation({
    onSuccess: () => {
      toast.success("文章已更新");
      setEditingArticle(null);
      utils.article.list.invalidate();
    },
    onError: () => toast.error("更新失败"),
  });

  const deleteMutation = trpc.article.delete.useMutation({
    onSuccess: () => {
      toast.success("文章已删除");
      utils.article.list.invalidate();
      utils.stats.dashboard.invalidate();
    },
    onError: () => toast.error("删除失败"),
  });

  const articleToEdit = data?.items.find((a) => a.id === editingArticle);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索文章标题或摘要..."
            className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left">
                    <th className="px-4 py-3 text-slate-500 font-medium">标题</th>
                    <th className="px-4 py-3 text-slate-500 font-medium">分类</th>
                    <th className="px-4 py-3 text-slate-500 font-medium">状态</th>
                    <th className="px-4 py-3 text-slate-500 font-medium">时间</th>
                    <th className="px-4 py-3 text-slate-500 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items.map((article) => (
                    <tr
                      key={article.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="max-w-[300px]">
                          <p className="text-white font-medium truncate">
                            {article.title}
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            {article.sourceName}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {CATEGORY_LABELS[article.category]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            article.status === "published"
                              ? "bg-green-500/10 text-green-400"
                              : article.status === "draft"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-slate-500/10 text-slate-400"
                          }`}
                        >
                          {article.status === "published"
                            ? "已发布"
                            : article.status === "draft"
                            ? "草稿"
                            : "已归档"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(article.publishedAt).toLocaleDateString("zh-CN")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                onClick={() => setEditingArticle(article.id)}
                                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </DialogTrigger>
                            {articleToEdit?.id === article.id && (
                              <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>编辑文章</DialogTitle>
                                </DialogHeader>
                                <ArticleEditForm
                                  article={articleToEdit}
                                  onSave={(data) =>
                                    updateMutation.mutate({ id: article.id, ...data })
                                  }
                                  isSaving={updateMutation.isPending}
                                  onClose={() => setEditingArticle(null)}
                                />
                              </DialogContent>
                            )}
                          </Dialog>
                          <Link to={`/article/${article.id}`} target="_blank">
                            <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-green-400 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm("确定删除这篇文章？")) {
                                deleteMutation.mutate({ id: article.id });
                              }
                            }}
                            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-50"
              >
                上一页
              </Button>
              <span className="text-sm text-slate-500">
                {page} / {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-50"
              >
                下一页
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import type { Article } from "@db/schema";

function ArticleEditForm({
  article,
  onSave,
  isSaving,
  onClose,
}: {
  article: Article;
  onSave: (data: {
    title?: string;
    summary?: string;
    content?: string;
    category?: "frontier" | "llm" | "application" | "investment" | "industry";
    status?: "published" | "draft" | "archived";
  }) => void;
  isSaving: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: article.title,
    summary: article.summary || "",
    content: article.content || "",
    category: article.category,
    status: article.status,
  });

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="text-sm text-slate-400 mb-1 block">标题</label>
        <Input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="bg-slate-950 border-slate-700 text-white"
        />
      </div>
      <div>
        <label className="text-sm text-slate-400 mb-1 block">摘要</label>
        <Textarea
          value={form.summary}
          onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
          rows={3}
          className="bg-slate-950 border-slate-700 text-white"
        />
      </div>
      <div>
        <label className="text-sm text-slate-400 mb-1 block">正文</label>
        <Textarea
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          rows={6}
          className="bg-slate-950 border-slate-700 text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-400 mb-1 block">分类</label>
          <Select
            value={form.category}
            onValueChange={(v) =>
              setForm((f) => ({
                ...f,
                category: v as typeof form.category,
              }))
            }
          >
            <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-1 block">状态</label>
          <Select
            value={form.status}
            onValueChange={(v) =>
              setForm((f) => ({
                ...f,
                status: v as typeof form.status,
              }))
            }
          >
            <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          取消
        </Button>
        <Button
          onClick={() => onSave(form)}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          保存
        </Button>
      </div>
    </div>
  );
}

function AdsTab() {
  const { data, isLoading } = trpc.ad.list.useQuery();
  const utils = trpc.useUtils();

  const updateMutation = trpc.ad.update.useMutation({
    onSuccess: () => {
      toast.success("广告位已更新");
      utils.ad.list.invalidate();
    },
    onError: () => toast.error("更新失败"),
  });

  const toggleMutation = trpc.ad.toggle.useMutation({
    onSuccess: () => {
      toast.success("状态已切换");
      utils.ad.list.invalidate();
    },
    onError: () => toast.error("操作失败"),
  });

  const [editingAd, setEditingAd] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", htmlCode: "" });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">广告位管理</h2>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {data?.map((ad) => (
            <div
              key={ad.id}
              className="rounded-xl bg-slate-900 border border-slate-800 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-white">{ad.name}</h3>
                  <p className="text-xs text-slate-500">ID: {ad.slotId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMutation.mutate({ id: ad.id })}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      ad.isActive
                        ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        : "bg-slate-800 text-slate-500 hover:bg-slate-700"
                    }`}
                  >
                    {ad.isActive ? "已启用" : "已禁用"}
                  </button>
                </div>
              </div>

              {editingAd === ad.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">名称</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="bg-slate-950 border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">广告代码</label>
                    <Textarea
                      value={editForm.htmlCode}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, htmlCode: e.target.value }))
                      }
                      rows={5}
                      placeholder="在此粘贴广告 HTML/JavaScript 代码..."
                      className="bg-slate-950 border-slate-700 text-white text-sm font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAd(null)}
                      className="border-slate-700 text-slate-300"
                    >
                      取消
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        updateMutation.mutate({
                          id: ad.id,
                          name: editForm.name,
                          htmlCode: editForm.htmlCode,
                        });
                        setEditingAd(null);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      保存
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {ad.htmlCode ? (
                    <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                      <p className="text-xs text-slate-500 mb-1">当前代码预览：</p>
                      <code className="text-xs text-slate-400 font-mono line-clamp-3">
                        {ad.htmlCode}
                      </code>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-slate-950/50 border border-dashed border-slate-700 p-4 text-center">
                      <p className="text-sm text-slate-500">此广告位暂无代码</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingAd(ad.id);
                      setEditForm({ name: ad.name, htmlCode: ad.htmlCode || "" });
                    }}
                    className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    编辑
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
