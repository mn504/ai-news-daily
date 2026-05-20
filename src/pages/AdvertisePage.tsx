import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Megaphone,
  Mail,
  Users,
  Eye,
  CheckCircle2,
  ChevronRight,
  Globe,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

const AD_SLOTS = [
  {
    id: "ad-top-banner",
    name: "首页顶部横幅",
    size: "728 x 90",
    position: "首页头条新闻下方",
    price: "¥500/周",
    exposure: "高",
    description: "用户进入网站第一眼看到的广告位，曝光率最高",
  },
  {
    id: "ad-sidebar-1",
    name: "侧边栏矩形广告",
    size: "300 x 250",
    position: "侧边栏上部",
    price: "¥300/周",
    exposure: "中高",
    description: "贯穿所有页面的固定展示位，持续曝光",
  },
  {
    id: "ad-mid-banner",
    name: "首页中部横幅",
    size: "970 x 90",
    position: "首页新闻流中部",
    price: "¥400/周",
    exposure: "高",
    description: "用户浏览新闻列表时必经之处，适合品牌展示",
  },
  {
    id: "ad-article-top",
    name: "文章页顶部横幅",
    size: "728 x 90",
    position: "文章详情页顶部",
    price: "¥350/周",
    exposure: "中",
    description: "阅读场景下的精准曝光，用户注意力集中",
  },
  {
    id: "ad-article-mid",
    name: "文章页中部矩形",
    size: "300 x 250",
    position: "文章正文中部",
    price: "¥400/周",
    exposure: "中高",
    description: "阅读中途的自然展示，点击率较高",
  },
  {
    id: "ad-article-bottom",
    name: "文章页底部横幅",
    size: "728 x 90",
    position: "文章详情页底部",
    price: "¥250/周",
    exposure: "中",
    description: "阅读完成后的行动号召位，适合转化类广告",
  },
];

const STATS = [
  { icon: Users, label: "日活跃用户", value: "1,000+", color: "text-blue-400" },
  { icon: Eye, label: "日均PV", value: "5,000+", color: "text-green-400" },
  { icon: Globe, label: "用户覆盖", value: "全球", color: "text-purple-400" },
  { icon: BarChart3, label: "AI领域专注", value: "垂直精准", color: "text-amber-400" },
];

export default function AdvertisePage() {
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.name || !form.email) {
      toast.error("请填写必填项");
      return;
    }
    toast.success("提交成功！我们会尽快与您联系。");
    setForm({ company: "", name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Megaphone className="w-4 h-4" />
              广告合作
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6">
              在 AI 领域精准触达目标用户
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              AI News Daily 是专注于人工智能领域的垂直资讯平台，汇聚开发者、技术决策者、投资人和 AI 爱好者。在这里投放广告，精准触达高价值目标受众。
            </p>
            <a href="#contact">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                立即咨询
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-y border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-slate-900 border border-slate-800"
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
              为什么选择我们
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "精准受众",
                  desc: "100% AI 领域用户，包括开发者、CTO、投资人、研究者等高价值人群",
                },
                {
                  title: "持续增长",
                  desc: "网站流量稳步增长，新用户每日增加，您的广告曝光持续扩大",
                },
                {
                  title: "多位置展示",
                  desc: "6个广告位覆盖首页、文章页、侧边栏，满足品牌推广和效果转化需求",
                },
                {
                  title: "数据透明",
                  desc: "提供广告展示次数、点击数据等效果报告，让每一分投入都看得见",
                },
                {
                  title: "灵活合作",
                  desc: "支持按周/按月合作，也支持CPC、CPM等多种计费方式",
                },
                {
                  title: "内容共创",
                  desc: "支持赞助内容、软植入等深度合作形式，提升品牌认知度",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-blue-400 mb-3" />
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ad Slots */}
        <section className="py-16 bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
              广告位资源
            </h2>
            <p className="text-slate-400 text-center mb-12">
              以下广告位均已在网站预留，支持图片、文字链、富媒体等多种形式
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AD_SLOTS.map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden hover:border-blue-500/30 transition-all"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white">{slot.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                        {slot.size}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">
                      位置：{slot.position}
                    </p>
                    <p className="text-sm text-slate-400 mb-4">
                      {slot.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <div>
                        <p className="text-xs text-slate-500">参考价格</p>
                        <p className="text-lg font-bold text-blue-400">
                          {slot.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">曝光度</p>
                        <p className="text-sm font-medium text-slate-300">
                          {slot.exposure}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              * 以上价格为参考价，实际价格根据投放时长和形式可商议调整
            </p>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                联系我们
              </h2>
              <p className="text-slate-400">
                填写以下信息，我们的商务团队会在 1-2 个工作日内与您联系
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-xl bg-slate-900 border border-slate-800 p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    公司名称 <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={form.company}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, company: e.target.value }))
                    }
                    placeholder="您的公司或品牌名称"
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    联系人 <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="您的姓名"
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    邮箱 <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="business@example.com"
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    联系电话
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="可选填"
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">
                  合作意向
                </label>
                <Textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  rows={4}
                  placeholder="请描述您的广告需求，包括期望的广告位、投放时长、预算范围等..."
                  className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                提交咨询
              </Button>

              <p className="text-center text-xs text-slate-500">
                您也可以直接发送邮件至{" "}
                <a
                  href="mailto:109189726@qq.com"
                  className="text-blue-400 hover:underline"
                >
                  109189726@qq.com
                </a>
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
