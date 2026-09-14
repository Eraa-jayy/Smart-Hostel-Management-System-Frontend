import React, { useState, useEffect } from "react";
import {
  Megaphone,
  CalendarDays,
  Clock,
  ChevronRight,
  Bell,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError("");
    try {
      // TODO: Replace with your actual service endpoint, e.g., getAnnouncements()
      // const response = await getAnnouncements();
      // setAnnouncements(response.data || []);
      setAnnouncements([]);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to load announcements. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = showUnreadOnly
    ? announcements.filter((a) => !a.read)
    : announcements;

  const unreadCount = announcements.filter((a) => !a.read).length;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header Banner ── */}
      <div className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-8 lg:p-10">
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
                <Sparkles size={13} className="text-blue-300" />
                Notice Board & Updates
              </span>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Hostel Announcements
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Stay informed with official notices, administrative circulars, and hostel updates.
              </p>
            </div>

          </div>

          {/* Background Lighting Effects */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
      </div>

      {/* ── Sub-header Meta Bar ── */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-800">Notice Stream</h2>
          <p className="text-xs text-slate-400">Review official hostel notices</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
          <CalendarDays size={14} className="text-indigo-600" />
          <span>{new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-xs font-bold text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { label: "Total Notices", value: announcements.length, icon: Megaphone, lightBg: "bg-slate-100 text-slate-700" },
          { label: "Unread Notices", value: unreadCount, icon: Bell, lightBg: "bg-blue-50 text-blue-600" },
        ].map(({ label, value, lightBg, icon: Icon }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${lightBg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-xs font-semibold text-slate-400">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Controls Bar ── */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
        <span className="text-xs font-bold text-slate-600">All Announcements</span>

        <button
          type="button"
          onClick={() => setShowUnreadOnly((prev) => !prev)}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
            showUnreadOnly
              ? "border-blue-200 bg-blue-50 text-blue-700 shadow-xs"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          {showUnreadOnly ? <EyeOff size={14} /> : <Eye size={14} />}
          {showUnreadOnly ? "Show All Notices" : "Unread Only"}
        </button>
      </div>

      {/* ── Announcement Stream ── */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-slate-200/70 bg-white">
            <RefreshCw size={24} className="animate-spin text-indigo-600" />
            <p className="mt-3 text-xs font-semibold text-slate-400">Loading announcements...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((announcement) => (
            <div
              key={announcement.id}
              className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Unread Indicator */}
                  {!announcement.read ? (
                    <span className="relative mt-1.5 flex h-2.5 w-2.5 flex-shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
                    </span>
                  ) : (
                    <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-slate-200 flex-shrink-0" />
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-sm font-bold ${!announcement.read ? "text-slate-900" : "text-slate-700"}`}>
                        {announcement.title}
                      </h3>
                      {announcement.category && (
                        <span className="rounded-full border border-slate-200/60 bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                          {announcement.category}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {announcement.description}
                    </p>
                  </div>
                </div>

                <ChevronRight size={16} className="flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
              </div>

              {/* Card Meta Footer */}
              <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-400">
                {announcement.date && (
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} className="text-slate-400" />
                    {announcement.date}
                  </span>
                )}
                {announcement.time && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    {announcement.time}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Megaphone size={22} />
            </div>
            <p className="text-sm font-bold text-slate-700">No announcements found</p>
            <p className="mt-1 text-xs text-slate-400">Check back later for new notices from the hostel administration.</p>
          </div>
        )}
      </div>
    </div>
  );
}