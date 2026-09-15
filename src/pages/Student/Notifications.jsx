import React, { useState, useEffect } from "react";
import {
  Megaphone,
  CalendarDays,
  Clock,
  ChevronRight,
  Bell,
  Check,
  RotateCcw,
  Eye,
} from "lucide-react";
import api from "../../service/axios";

const PRIORITY_CONFIG = {
  important: {
    label: "Important",
    color: "bg-amber-50 text-amber-600",
    border: "border-l-amber-500",
    dot: "bg-amber-400",
  },
  info: {
    label: "Info",
    color: "bg-blue-50 text-blue-600",
    border: "border-l-blue-500",
    dot: "bg-blue-400",
  },
};

const CATEGORY_COLORS = {
  General: "bg-gray-100 text-gray-500",
  Maintenance: "bg-orange-50 text-orange-600",
  Canteen: "bg-emerald-50 text-emerald-600",
  Academic: "bg-blue-50 text-blue-600",
  Hostel: "bg-indigo-50 text-indigo-600",
};

export default function Announcements() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/announcements");
        setRaw(data);
      } catch {
        setError(
          "Could not load announcements. Make sure the backend is running and you are signed in."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.post(`/announcements/${id}/read`);
      setRaw((prev) =>
        prev.map((a) => (a.id === id ? { ...a, read: true } : a))
      );
    } catch {
      console.error("Failed to mark announcement as read");
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await api.post(`/announcements/${id}/unread`);
      setRaw((prev) =>
        prev.map((a) => (a.id === id ? { ...a, read: false } : a))
      );
    } catch {
      console.error("Failed to mark announcement as unread");
    }
  };

  const mapped = raw.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.message,
    date: a.createdAt
      ? new Date(a.createdAt).toLocaleDateString()
      : "N/A",
    time: a.createdAt
      ? new Date(a.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    category: a.category || "General",
    priority:
      (a.priority || "").toLowerCase() === "important"
        ? "important"
        : "info",
    read: a.read || false,
  }));

  const filtered = mapped;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Stay updated with the latest hostel notices
          </p>
        </div>
      </div>

      {loading && (
        <p className="py-12 text-center text-sm text-gray-400">
          Loading announcements...
        </p>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── Stats Row ── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Total Notices",
                value: mapped.length,
                icon: Megaphone,
                bg: "bg-gray-50",
                iconColor: "text-gray-600",
              },
              {
                label: "Read",
                value: mapped.filter((a) => a.read).length,
                icon: Check,
                bg: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
              {
                label: "Unread",
                value: mapped.filter((a) => !a.read).length,
                icon: Bell,
                bg: "bg-blue-50",
                iconColor: "text-blue-600",
              },
            ].map(({ label, value, bg, iconColor, icon: Icon }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}
                  >
                    <Icon size={18} className={iconColor} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                    <p className="text-[11px] text-gray-400">{label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Announcement Cards ── */}
          <div className="space-y-3">
            {filtered.map((announcement) => {
              const pr =
                PRIORITY_CONFIG[announcement.priority] || PRIORITY_CONFIG.info;
              return (
                <div
                  key={announcement.id}
                  className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${pr.border} overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 ${
                    announcement.read ? "opacity-75" : ""
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {!announcement.read && (
                          <div
                            className={`mt-1.5 w-2 h-2 rounded-full ${pr.dot} flex-shrink-0`}
                          />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3
                              className={`text-[14px] font-semibold ${
                                !announcement.read
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {announcement.title}
                            </h3>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pr.color}`}
                            >
                              {pr.label}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                CATEGORY_COLORS[announcement.category] ||
                                "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {announcement.category}
                            </span>
                          </div>
                          <p className="text-[12px] text-gray-400 mt-2 leading-relaxed">
                            {announcement.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-gray-300 mt-1 flex-shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <CalendarDays size={10} />
                          {announcement.date}
                        </span>
                        {announcement.time && (
                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Clock size={10} />
                            {announcement.time}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!announcement.read) {
                              handleMarkAsRead(announcement.id);
                            }
                            setSelectedAnnouncement(announcement);
                          }}
                          className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Eye size={12} />
                          Read
                        </button>
                        {!announcement.read ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(announcement.id);
                            }}
                            className="flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <Check size={12} />
                            Mark as read
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsUnread(announcement.id);
                            }}
                            className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <RotateCcw size={12} />
                            Mark as unread
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Megaphone
                    size={20}
                    className="text-gray-300"
                  />
                </div>
                <p className="text-sm text-gray-400">No announcements found</p>
                <p className="text-[11px] text-gray-300 mt-1">
                  Check back later for new notices
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {selectedAnnouncement && (() => {
        const live =
          mapped.find((a) => a.id === selectedAnnouncement.id) ||
          selectedAnnouncement;
        const pr =
          PRIORITY_CONFIG[live.priority] || PRIORITY_CONFIG.info;
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {live.title}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="text-xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Message
                </label>
                <p className="w-full rounded-lg border border-slate-200 bg-gray-50 px-3 py-2 text-sm leading-relaxed text-slate-700">
                  {live.description}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pr.color}`}
                >
                  {pr.label}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    CATEGORY_COLORS[live.category] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {live.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <CalendarDays size={10} />
                  {live.date}
                </span>
                {live.time && (
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock size={10} />
                    {live.time}
                  </span>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {!live.read && (
                  <button
                    type="button"
                    onClick={() => {
                      handleMarkAsRead(live.id);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    <Check size={14} />
                    Mark as read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedAnnouncement(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
