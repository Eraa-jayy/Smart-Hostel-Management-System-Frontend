import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Info,
  CalendarDays,
  Clock,
  ChevronRight,
  Bell,
  Filter,
  Eye,
  EyeOff,
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
  const [filter, setFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

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
    read: false,
  }));

  let filtered = mapped;
  if (filter !== "all") {
    filtered = filtered.filter((a) => a.priority === filter);
  }
  if (showUnreadOnly) {
    filtered = filtered.filter((a) => !a.read);
  }

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
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Total Notices",
                value: mapped.length,
                icon: Megaphone,
                bg: "bg-gray-50",
                iconColor: "text-gray-600",
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

          {/* ── Filter Bar ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-500 mr-1">
                <Filter size={15} />
                <span className="text-[12px] font-medium">Filter:</span>
              </div>
              {[
                { value: "all", label: "All" },
                { value: "important", label: "Important" },
                { value: "info", label: "Info" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-200 ${
                    filter === value
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowUnreadOnly((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-200 ${
                showUnreadOnly
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {showUnreadOnly ? (
                <EyeOff size={13} />
              ) : (
                <Eye size={13} />
              )}
              {showUnreadOnly ? "Show All" : "Unread Only"}
            </button>
          </div>

          {/* ── Announcement Cards ── */}
          <div className="space-y-3">
            {filtered.map((announcement) => {
              const pr =
                PRIORITY_CONFIG[announcement.priority] || PRIORITY_CONFIG.info;
              return (
                <div
                  key={announcement.id}
                  className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${pr.border} overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200`}
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

                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
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
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
