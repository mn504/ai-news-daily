import { Link } from "react-router";
import { Zap, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI News Daily</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              每日聚合全球 AI 领域最新资讯，覆盖大模型、AI 应用、前沿研究、投资动态和产业新闻。
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">分类</h3>
            <ul className="space-y-2">
              {[
                { label: "AI前沿", href: "/category/frontier" },
                { label: "大模型", href: "/category/llm" },
                { label: "AI应用", href: "/category/application" },
                { label: "AI投资", href: "/category/investment" },
                { label: "产业动态", href: "/category/industry" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">关于</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-slate-400">关于我们</span>
              </li>
              <li>
                <span className="text-sm text-slate-400">免责声明</span>
              </li>
              <li>
                <span className="text-sm text-slate-400">广告投放</span>
              </li>
              <li>
                <span className="text-sm text-slate-400">联系我们</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; 2024 AI News Daily. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            本站内容来源于网络，仅供学习参考
          </p>
        </div>
      </div>
    </footer>
  );
}
