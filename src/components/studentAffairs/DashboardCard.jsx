import React from "react";
import { TrendingUp } from "lucide-react";

export default function DashboardCard({
  title,
  value,
  sub,
  icon: Icon,
  accent = "from-blue-500 to-indigo-600",
  lightBg = "bg-blue-50/80 text-blue-600",
  change,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Top Header Row with Icon & Badge */}
      <div className="flex items-start justify-between gap-2">
        {Icon ? (
          <div className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl sm:rounded-2xl ${lightBg} transition-all duration-300 group-hover:scale-110`}>
            <Icon className="h-5 w-5 sm:h-5 sm:w-5" strokeWidth={2.2} />
          </div>
        ) : (
          <div className="h-10 sm:h-12" />
        )}

        {change && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/50 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-emerald-600 flex-shrink-0">
            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="truncate">{change}</span>
          </span>
        )}
      </div>

      {/* Main Metric Output */}
      <div className="mt-3 sm:mt-4">
        <p className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 break-words">
          {value}
        </p>
        <p className="mt-0.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </p>
      </div>

      {/* Subtext Footer Label */}
      {sub && (
        <p className="mt-2.5 sm:mt-3 flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-500 min-w-0">
          <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r ${accent}`} />
          <span className="truncate">{sub}</span>
        </p>
      )}

      {/* Hover Lighting Line */}
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
    </div>
  );
}