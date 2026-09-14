import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChefHat,
  Leaf,
  Moon,
  Sun,
  Sunset,
  Building2,
  Sparkles,
  RefreshCw,
  Clock,
  UtensilsCrossed,
  CheckCircle2,
} from "lucide-react";
import { getMyHostelCanteenMeals } from "../../service/canteenService";

const details = {
  BREAKFAST: {
    label: "Breakfast",
    time: "07:00 AM - 09:30 AM",
    Icon: Sun,
    gradient: "from-amber-500 to-orange-600",
    badge: "bg-amber-50 text-amber-700 border-amber-200/60",
    lightIconBg: "bg-amber-500/10 text-amber-600",
  },
  LUNCH: {
    label: "Lunch",
    time: "12:00 PM - 02:30 PM",
    Icon: Sunset,
    gradient: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    lightIconBg: "bg-emerald-500/10 text-emerald-600",
  },
  DINNER: {
    label: "Dinner",
    time: "07:00 PM - 09:30 PM",
    Icon: Moon,
    gradient: "from-indigo-600 to-purple-600",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    lightIconBg: "bg-indigo-500/10 text-indigo-600",
  },
};

const items = (value = "") =>
  value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);

export default function Canteen() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hostelName, setHostelName] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = () => {
    setLoading(true);
    setError("");
    getMyHostelCanteenMeals()
      .then((res) => {
        const data = res.data || [];
        setMeals(data);
        if (data.length > 0 && data[0].hostelName) {
          setHostelName(data[0].hostelName);
        }
      })
      .catch(() => setError("Today's menus are unavailable right now."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header Banner ── */}
      <div className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
                <Sparkles size={13} className="text-blue-300" />
                Hostel Dining Services
              </span>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Daily Canteen Menu
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Explore today's breakfast, lunch, and dinner menus published for your hostel facility.
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex flex-wrap items-center gap-2.5 sm:flex-col sm:items-end">
              {hostelName && (
                <div className="inline-flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
                  <Building2 size={14} className="text-blue-300" />
                  <span>{hostelName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Background Lighting Effects */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
      </div>

      {/* ── Sub-header Meta bar ── */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-800">Meal Timings & Dishes</h2>
          <p className="text-xs text-slate-400">Published options updated for today</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
          <CalendarDays size={14} className="text-indigo-600" />
          <span>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-xs font-bold text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {/* ── Meals Grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Object.entries(details).map(([type, { label, time, Icon, gradient, badge, lightIconBg }]) => {
          const meal = meals.find((m) => m.mealType === type);
          const categories = meal
            ? [
                ["Main Dishes", meal.mainDishes || meal.menuItems],
                ["Curries", meal.curries],
                ["Short Eats", meal.shortEats],
              ].filter(([, value]) => value)
            : [];
          const count = categories.reduce((total, [, value]) => total + items(value).length, 0);

          return (
            <section
              key={type}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
            >
              {/* Card Header Gradient */}
              <div className={`bg-gradient-to-r ${gradient} p-5 text-white shadow-inner`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black tracking-tight text-white">{label}</h2>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-white/80">
                        <Clock size={12} />
                        <span>{time}</span>
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    {meal ? `${count} Items` : "Pending"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6">
                {loading ? (
                  <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                    <RefreshCw size={22} className="animate-spin text-indigo-600" />
                    <p className="mt-3 text-xs font-semibold text-slate-400">Loading menu options...</p>
                  </div>
                ) : categories.length ? (
                  <div className="space-y-5">
                    {categories.map(([category, value]) => (
                      <div key={category}>
                        <div className="mb-2.5 flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${gradient.split(" ")[0].replace("from-", "bg-")}`} />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{category}</h3>
                        </div>
                        <div className="space-y-2">
                          {items(value).map((item, index) => (
                            <div
                              key={`${item}-${index}`}
                              className="group/item flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50 hover:shadow-xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${lightIconBg}`}>
                                  <Leaf size={14} strokeWidth={2.2} />
                                </div>
                                <span className="text-xs font-bold text-slate-700 transition-colors group-hover/item:text-indigo-600">
                                  {item}
                                </span>
                              </div>
                              <CheckCircle2 size={14} className="text-slate-300 transition-colors group-hover/item:text-emerald-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                      <ChefHat size={28} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Menu not published yet</p>
                    <p className="mt-1 text-xs text-slate-400">Kitchen staff will upload the {label.toLowerCase()} menu soon.</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}