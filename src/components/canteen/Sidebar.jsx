import { ClipboardList, LogOut, UtensilsCrossed } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function CanteenSidebar() {
  const navigate = useNavigate();
  const logout = () => { ["token", "username", "role", "fullName"].forEach((key) => localStorage.removeItem(key)); navigate("/login"); };
  return <aside className="w-[260px] min-h-screen bg-[#0a0f1e] flex flex-col flex-shrink-0">
    <div className="px-6 pt-7 pb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center"><UtensilsCrossed size={20} className="text-white" /></div><div><h1 className="text-base font-bold text-white">UniNest</h1><p className="text-[11px] text-slate-500 font-medium">Canteen Portal</p></div></div>
    <div className="mx-5 h-px bg-white/5" /><nav className="flex-1 px-3 pt-5"><NavLink to="/canteen" end className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium ${isActive ? "bg-orange-500/10 text-orange-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}><ClipboardList size={17} /> Meal management</NavLink></nav>
    <div className="px-3 pb-4"><div className="mb-3 h-px bg-white/5" /><button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400 hover:bg-red-500/10"><LogOut size={17} /> LOGOUT</button></div>
  </aside>;
}
