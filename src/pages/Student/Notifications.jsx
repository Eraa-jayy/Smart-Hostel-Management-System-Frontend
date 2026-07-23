import React, { useState } from "react";
import {
  Megaphone,
  AlertTriangle,
  Info,
  CheckCircle2,
  CalendarDays,
  Clock,
  Tag,
  ChevronRight,
  Bell,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Hostel Fee Payment Deadline Extended",
    description: "The hostel fee payment deadline has been extended until 30 July 2026. Please complete your payment before the deadline to avoid late charges.",
    date: "Jul 13, 2026",
    time: "10:30 AM",
    category: "Finance",
    priority: "urgent",
    read: false,
  },
  {
    id: 2,
    title: "Water Supply Interruption",
    description: "Water supply will be unavailable from 9:00 AM to 2:00 PM due to maintenance work on the main pipeline. Please store water accordingly.",
    date: "Jul 10, 2026",
    time: "08:15 AM",
    category: "Maintenance",
    priority: "important",
    read: false,
  },
  {
    id: 3,
    title: "Hostel Room Inspection — This Friday",
    description: "A hostel room inspection will be conducted this Friday. Please ensure your room is clean and properly maintained. Failure to comply may result in a warning.",
    date: "Jul 8, 2026",
    time: "02:00 PM",
    category: "General",
    priority: "info",
    read: true,
  },
  {
    id: 4,
    title: "Mid-term Exam Schedule Released",
    description: "The mid-term examination schedule has been published on the university portal. Please check your individual timetables and prepare accordingly.",
    date: "Jul 12, 2026",
    time: "11:00 AM",
    category: "Academic",
    priority: "info",
    read: false,
  },
  {
    id: 5,
    title: "Annual Sports Day — January 25",
    description: "The annual sports day will be held on January 25. All hostel residents are encouraged to participate. Registration forms are available at the admin office.",
    date: "Jul 8, 2026",
    time: "09:00 AM",
    category: "Events",
    priority: "info",
    read: true,
  },
];

const PRIORITY_CONFIG = {
  urgent: {
    label: "Urgent",
    color: "bg-red-50 text-red-600",
    border: "border-l-red-500",
    bg: "from-red-500 to-red-600",
    dot: "bg-red-400",
  },
  important: {
    label: "Important",
    color: "bg-amber-50 text-amber-600",
    border: "border-l-amber-500",
    bg: "from-amber-500 to-orange-500",
    dot: "bg-amber-400",
  },
  info: {
    label: "Info",
    color: "bg-blue-50 text-blue-600",
    border: "border-l-blue-500",
    bg: "from-blue-500 to-indigo-500",
    dot: "bg-blue-400",
  },
};

const CATEGORY_COLORS = {
  Finance: "bg-amber-50 text-amber-600",
  Maintenance: "bg-orange-50 text-orange-600",
  General: "bg-gray-100 text-gray-500",
  Academic: "bg-blue-50 text-blue-600",
  Events: "bg-emerald-50 text-emerald-600",
};

export default function Announcements() {
  const [filter, setFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  let filtered = ANNOUNCEMENTS;

  if (filter !== "all") {
    filtered = filtered.filter((a) => a.priority === filter);
  }

  if (showUnreadOnly) {
    filtered = filtered.filter((a) => !a.read);
  }

  const unreadCount = ANNOUNCEMENTS.filter((a) => !a.read).length;
  const urgentCount = ANNOUNCEMENTS.filter((a) => a.priority === "urgent").length;

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

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Notices", value: ANNOUNCEMENTS.length, icon: Megaphone, bg: "bg-gray-50", iconColor: "text-gray-600" },
          { label: "Unread", value: unreadCount, icon: Bell, bg: "bg-blue-50", iconColor: "text-blue-600" },
          { label: "Urgent", value: urgentCount, icon: AlertTriangle, bg: "bg-red-50", iconColor: "text-red-600" },
        ].map(({ label, value, bg, iconColor, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
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
            { value: "urgent", label: "Urgent" },
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
          {showUnreadOnly ? <EyeOff size={13} /> : <Eye size={13} />}
          {showUnreadOnly ? "Show All" : "Unread Only"}
        </button>
      </div>

      {/* ── Announcement Cards ── */}
      <div className="space-y-3">
        {filtered.map((announcement) => {
          const pr = PRIORITY_CONFIG[announcement.priority];
          return (
            <div
              key={announcement.id}
              className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${pr.border} overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Unread dot */}
                    {!announcement.read && (
                      <div className={`mt-1.5 w-2 h-2 rounded-full ${pr.dot} flex-shrink-0`} />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-[14px] font-semibold ${!announcement.read ? "text-gray-900" : "text-gray-700"}`}>
                          {announcement.title}
                        </h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pr.color}`}>
                          {pr.label}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[announcement.category]}`}>
                          {announcement.category}
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-400 mt-2 leading-relaxed">
                        {announcement.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 mt-1 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <CalendarDays size={10} />
                    {announcement.date}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock size={10} />
                    {announcement.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Megaphone size={20} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">No announcements found</p>
            <p className="text-[11px] text-gray-300 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
