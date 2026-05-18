import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, X, Shield } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "首页", href: "/", slug: "" },
  { label: "AI前沿", href: "/category/frontier", slug: "frontier" },
  { label: "大模型", href: "/category/llm", slug: "llm" },
  { label: "AI应用", href: "/category/application", slug: "application" },
  { label: "AI投资", href: "/category/investment", slug: "investment" },
  { label: "产业动态", href: "/category/industry", slug: "industry" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              News Daily
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {user?.role === "admin" && (
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  <Shield className="w-4 h-4" />
                  后台
                </Button>
              </Link>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex items-center gap-2 text-slate-300"
                  >
                    <img
                      src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="max-w-[80px] truncate">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-900 border-slate-700"
                >
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-slate-300 focus:text-white focus:bg-slate-800 cursor-pointer"
                  >
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  登录
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.querySelector("input") as HTMLInputElement;
                if (input.value.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`;
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="搜索 AI 新闻..."
                autoFocus
                className="flex-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                搜索
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="px-4 py-2 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Shield className="w-4 h-4" />
                后台管理
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
