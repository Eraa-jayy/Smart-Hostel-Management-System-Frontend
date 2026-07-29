import React from "react";
import {
  Sun,
  Sunset,
  Moon,
  Clock,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  CalendarDays,
  ChefHat,
  Leaf,
} from "lucide-react";

const MEALS = [
  {
    name: "Breakfast",
    icon: Sun,
    time: "7:00 AM — 9:00 AM",
    status: "available",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    items: [
      { name: "Milk Rice", type: "main" },
      { name: "Lunu Miris", type: "side" },
      { name: "Tea / Coffee", type: "beverage" },
      { name: "Fresh Fruit Salad", type: "side" },
    ],
  },
  {
    name: "Lunch",
    icon: Sunset,
    time: "12:00 PM — 2:00 PM",
    status: "available",
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    items: [
      { name: "White Rice", type: "main" },
      { name: "Chicken Curry", type: "main" },
      { name: "Dhal Curry", type: "side" },
      { name: "Papadam", type: "side" },
      { name: "Green Salad", type: "side" },
      { name: "Fruit Juice", type: "beverage" },
    ],
  },
  {
    name: "Dinner",
    icon: Moon,
    time: "6:00 PM — 8:00 PM",
    status: "not_published",
    color: "from-violet-400 to-purple-500",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    items: [],
  },
];

const MEAL_TIMES = [
  { label: "Breakfast", time: "7:00 AM — 9:00 AM", icon: Sun, color: "bg-amber-50 text-amber-600" },
  { label: "Lunch", time: "12:00 PM — 2:00 PM", icon: Sunset, color: "bg-emerald-50 text-emerald-600" },
  { label: "Dinner", time: "6:00 PM — 8:00 PM", icon: Moon, color: "bg-violet-50 text-violet-600" },
];

const TYPE_LABELS = {
  main: { label: "Main", color: "bg-blue-50 text-blue-600" },
  side: { label: "Side", color: "bg-gray-100 text-gray-500" },
  beverage: { label: "Drink", color: "bg-purple-50 text-purple-600" },
};

export default function Canteen() {
  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Canteen</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Today&apos;s meal schedule and menu
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays size={14} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MEALS.map(({ name, icon: Icon, time, status, color, bg, iconColor }) => (
          <div key={name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={20} className={iconColor} strokeWidth={2} />
              </div>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                status === "available"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-gray-100 text-gray-400"
              }`}>
                {status === "available" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                {status === "available" ? "Served" : "Pending"}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-3">{name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock size={11} className="text-gray-300" />
              <span className="text-[11px] text-gray-400">{time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Meal Menus ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {MEALS.map(({ name, icon: Icon, status, color, bg, iconColor, items }) => (
          <div key={name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
            {/* Card header */}
            <div className={`p-5 bg-gradient-to-r ${color}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{name}</h3>
                  <p className="text-[11px] text-white/70">{items.length > 0 ? `${items.length} items` : "Not yet published"}</p>
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="p-5">
              {status === "available" && items.length > 0 ? (
                <div className="space-y-2.5">
                  {items.map(({ name: itemName, type }) => {
                    const t = TYPE_LABELS[type];
                    return (
                      <div key={itemName} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <Leaf size={12} className="text-emerald-400" />
                          <span className="text-[13px] font-medium text-gray-700">{itemName}</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.color}`}>
                          {t.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <ChefHat size={20} className="text-gray-300" />
                  </div>
                  <p className="text-[13px] text-gray-400">Menu will be published soon</p>
                  <p className="text-[11px] text-gray-300 mt-1">Check back before meal time</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Meal Schedule ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <UtensilsCrossed size={16} className="text-indigo-600" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Weekly Meal Schedule</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MEAL_TIMES.map(({ label, time, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-800">{label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="mt-5 p-3.5 rounded-xl bg-blue-50/80 border border-blue-100/50">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-blue-700/80">
              Meal timings are subject to change during holidays and exam periods. Check announcements for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
