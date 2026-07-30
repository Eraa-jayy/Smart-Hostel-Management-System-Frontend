import React from "react";
import { Settings as SettingsIcon, CalendarDays } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            System configuration and preferences
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays size={14} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <SettingsIcon className="text-gray-400" size={24} />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          Settings Coming Soon
        </h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          System-wide settings like email configuration, academic year defaults,
          and notification preferences will be available here.
        </p>
      </div>
    </div>
  );
}