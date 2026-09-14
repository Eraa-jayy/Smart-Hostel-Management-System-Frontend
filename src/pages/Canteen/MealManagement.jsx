import React, { useEffect, useRef, useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  UtensilsCrossed,
  Sparkles,
  CalendarDays,
  Clock,
  RefreshCw,
  ChefHat,
  CheckCircle2,
  AlertCircle,
  X,
  Flame,
} from "lucide-react";
import {
  createCanteenMeal,
  deleteCanteenMeal,
  getCanteenAssignment,
  getCanteenMeals,
  updateCanteenMeal,
} from "../../service/canteenService";

const empty = { mealType: "BREAKFAST", mainDishes: "", curries: "", shortEats: "" };

export default function MealManagement() {
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assignedHostel, setAssignedHostel] = useState("");
  const formRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCanteenMeals();
      setMeals(res.data || []);
    } catch {
      setError("Unable to load meal menus. Please check connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    getCanteenAssignment()
      .then((res) => setAssignedHostel(res.data?.hostelName || "Not assigned"))
      .catch(() => setAssignedHostel("Not assigned"));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (![form.mainDishes, form.curries, form.shortEats].some((value) => value.trim())) {
      setError("Add at least one food item category before publishing.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        mainDishes: form.mainDishes.trim(),
        curries: form.curries.trim(),
        shortEats: form.shortEats.trim(),
      };
      editingId ? await updateCanteenMeal(editingId, payload) : await createCanteenMeal(payload);
      setForm(empty);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.detail || "Could not save the meal menu."
      );
    } finally {
      setSaving(false);
    }
  };

  const edit = (meal) => {
    setForm({
      mealType: meal.mealType,
      mainDishes: meal.mainDishes || meal.menuItems || "",
      curries: meal.curries || "",
      shortEats: meal.shortEats || "",
    });
    setEditingId(meal.id);
    setError("");
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const cancelEdit = () => {
    setForm(empty);
    setEditingId(null);
    setError("");
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this meal menu?")) return;
    try {
      await deleteCanteenMeal(id);
      await load();
    } catch {
      setError("Could not remove the meal menu.");
    }
  };

  const publishedCount = meals.length;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Hero Banner ── */}
      <div className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              {/* <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
                <Sparkles size={13} className="text-blue-300" />
                Hostel Dining Management
              </span> */}

              <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Canteen Meal Management
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                Publish daily breakfast, lunch, and dinner menus. Published menus auto-expire after 24 hours.
              </p>
              <div className="mt-4 inline-flex items-center rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-blue-100 backdrop-blur-md">
                Assigned hostel:
                <span className="ml-1.5 text-white">
                  {assignedHostel || "Loading..."}
                </span>
              </div>
            </div>

          </div>

          {/* Ambient Lighting & Glassmorphism Overlay */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
      </div>

      {/* ── Sub-header Meta Bar ── */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-800">Canteen Overview</h2>
          <p className="text-xs text-slate-400">Configure daily meal menus and categories</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
          <CalendarDays size={14} className="text-indigo-600" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-xs font-bold text-rose-700 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} className="rounded-lg p-1 hover:bg-rose-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Active Published Menus", value: publishedCount, sub: "Live on Student Portal", icon: ChefHat, lightBg: "bg-amber-50 text-amber-600", accent: "from-amber-500 to-orange-600" },
          { label: "Auto-Expiration", value: "24 Hours", sub: "Rolling Menu Cycle", icon: Clock, lightBg: "bg-blue-50 text-blue-600", accent: "from-blue-500 to-indigo-600" },
          { label: "Dining Status", value: "Active", sub: "Regular Kitchen Operations", icon: UtensilsCrossed, lightBg: "bg-emerald-50 text-emerald-600", accent: "from-emerald-500 to-teal-600" },
        ].map(({ label, value, sub, icon: Icon, lightBg, accent }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60"
          >
            <div className="flex items-center gap-3.5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${lightBg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
              </div>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${accent}`} />
              {sub}
            </p>

            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
          </div>
        ))}
      </div>

      {/* ── Menu Form Card ── */}
      <form
        ref={formRef}
        onSubmit={submit}
        className={`space-y-5 rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md sm:p-6 ${
          editingId
            ? "border-indigo-300 bg-indigo-50/20 ring-2 ring-indigo-500/10"
            : "border-slate-200/70 bg-white"
        }`}
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              {editingId ? <Pencil size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {editingId ? "Edit Published Menu" : "Publish Daily Menu"}
              </h3>
              <p className="text-xs text-slate-400">Select meal time and list available dishes</p>
            </div>
          </div>
          {editingId && (
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700">
                Editing Mode
              </span>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg px-2 py-1 text-[11px] font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                Discard
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[200px_1fr]">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Meal Session
            </label>
            <select
              value={form.mealType}
              onChange={(e) => setForm({ ...form, mealType: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
            </select>
          </div>
          <p className="text-xs text-slate-400 pb-1">
            Fill in the items for each food category. Separate items with commas or line breaks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ["mainDishes", "Main Dishes", "Rice, Fried Noodles, Hoppers..."],
            ["curries", "Curries", "Chicken Curry, Dhal, Sambal..."],
            ["shortEats", "Short Eats / Extras", "Rolls, Cutlets, Sandwiches..."],
          ].map(([field, label, placeholder]) => (
            <div key={field}>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {label}
              </label>
              <textarea
                value={form[field]}
                aria-label={label}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                rows="3"
                placeholder={placeholder}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : editingId ? (
              <Pencil size={14} />
            ) : (
              <Plus size={14} />
            )}
            {saving ? "Saving Menu..." : editingId ? "Update Menu" : "Publish Menu"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* ── Published Menus Stream ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {["BREAKFAST", "LUNCH", "DINNER"].map((type) => {
          const typeMeals = meals.filter((m) => m.mealType === type);

          return (
            <section
              key={type}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold capitalize text-slate-800 flex items-center gap-2">
                    <Flame size={15} className="text-amber-500" />
                    {type.toLowerCase()}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {typeMeals.length} Active
                  </span>
                </div>

                {typeMeals.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-xs font-semibold text-slate-400">No menu published</p>
                    <p className="mt-1 text-[11px] text-slate-400">Use the form above to add dishes.</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3.5">
                    {typeMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="group rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3 transition-colors hover:bg-slate-50"
                      >
                        {[
                          ["Main Dishes", meal.mainDishes || meal.menuItems],
                          ["Curries", meal.curries],
                          ["Short Eats / Extras", meal.shortEats],
                        ]
                          .filter(([, value]) => value)
                          .map(([label, value]) => (
                            <div key={label}>
                              <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                                {label}
                              </p>
                              <p className="text-xs text-slate-700 font-medium whitespace-pre-line mt-0.5 leading-relaxed">
                                {value}
                              </p>
                            </div>
                          ))}

                        <div className="flex items-center gap-1 pt-1 text-[11px] font-semibold text-slate-400">
                          <Clock size={12} />
                          <span>Expires: {new Date(meal.expiresAt).toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
                          <button
                            onClick={() => edit(meal)}
                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            onClick={() => remove(meal.id)}
                            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
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