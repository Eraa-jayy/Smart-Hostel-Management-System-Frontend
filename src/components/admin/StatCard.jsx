import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ label, value, icon: Icon, bg, iconColor, sub, change, up }) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={20} className={iconColor} strokeWidth={2} />
        </div>
        {change && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
          }`}>
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      </div>
      {sub && <p className="text-[11px] text-gray-400 mt-2">{sub}</p>}
    </div>
  );
}
