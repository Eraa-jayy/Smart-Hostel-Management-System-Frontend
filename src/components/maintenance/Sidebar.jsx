import { ClipboardList, History, LogOut, Wrench } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = () => {
    ["token", "username", "role", "fullName"].forEach((key) => localStorage.removeItem(key));
    navigate("/login");
  };
  const links = [
    { label: "Complaints", to: "/maintenance/complaints", icon: ClipboardList },
    { label: "History", to: "/maintenance/history", icon: History },
  ];

  return (
    <aside className="w-[260px] min-h-screen bg-[#0a0f1e] flex flex-col flex-shrink-0">
      <div className="px-6 pt-7 pb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Wrench size={20} className="text-white" /></div>
        <div><h1 className="text-base font-bold text-white">UniNest</h1><p className="text-[11px] text-slate-500 font-medium">Maintenance Portal</p></div>
      </div>
      <div className="mx-5 h-px bg-white/5" />
      <p className="px-6 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Work orders</p>
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium ${isActive ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
          <Icon size={17} /> {label}
        </NavLink>)}
      </nav>
      <div className="px-3 pb-4"><div className="mb-3 h-px bg-white/5" /><button type="button" onClick={logout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400 hover:bg-red-500/10"><LogOut size={17} /> LOGOUT</button></div>
    </aside>
  );
}
