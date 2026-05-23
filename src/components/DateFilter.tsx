import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, X } from "lucide-react";

interface DateFilterProps {
  availableDates: string[];
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
  label?: string;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);

  if (diff === 0) return "今天";
  if (diff === 1) return "昨天";
  if (diff === 2) return "前天";

  return d.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

export default function DateFilter({
  availableDates,
  selectedDate,
  onDateChange,
  label = "选择日期",
}: DateFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
            selectedDate
              ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
              : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>
            {selectedDate ? formatDateLabel(selectedDate) : label}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {selectedDate && (
          <button
            onClick={() => onDateChange(null)}
            className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="清除筛选"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-xl shadow-black/50 z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-800">
            <p className="text-xs text-slate-500 px-2 py-1">可选日期</p>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {availableDates.map((date) => {
              const isSelected = date === selectedDate;
              return (
                <button
                  key={date}
                  onClick={() => {
                    onDateChange(isSelected ? null : date);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? "bg-blue-400" : "bg-slate-600"
                      }`}
                    />
                    <span>{formatDateLabel(date)}</span>
                  </div>
                  <span className="text-xs text-slate-500">{date}</span>
                </button>
              );
            })}
          </div>
          {selectedDate && (
            <div className="p-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onDateChange(null);
                  setOpen(false);
                }}
                className="w-full px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                显示全部日期
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
