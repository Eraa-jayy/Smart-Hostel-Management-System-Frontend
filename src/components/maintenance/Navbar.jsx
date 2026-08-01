import { Wrench } from "lucide-react";

export default function Navbar() {
  const fullName = localStorage.getItem("fullName") || localStorage.getItem("username") || "Maintenance Staff";
  return <header className="h-[68px] bg-white border-b border-gray-200/80 flex items-center justify-between px-6 lg:px-8"><div><h2 className="text-lg font-semibold text-gray-800">Maintenance <span className="text-indigo-600">Workspace</span></h2><p className="text-xs text-gray-400">Complete forwarded hostel repair work orders</p></div><div className="flex items-center gap-2 text-sm font-semibold text-gray-700"><span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Wrench size={17} /></span>{fullName}</div></header>;
}
