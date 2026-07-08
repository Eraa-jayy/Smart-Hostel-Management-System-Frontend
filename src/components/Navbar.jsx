import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Hostels", href: "/#hostels" },
  { label: "Facilities", href: "/#facilities" },
  { label: "Announcements", href: "/#announcements" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar({ activeLink = "Home" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white">
              <Building2 size={18} />
            </span>
            <span className="font-semibold text-slate-900 text-[15px] tracking-tight">
              Hostel Management System
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.label === activeLink
                    ? "text-amber-600 border-b-2 border-amber-500 pb-[21px] mt-[21px]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Register
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`block text-sm font-medium ${
                link.label === activeLink ? "text-amber-600" : "text-slate-600"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-slate-900 text-white"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
