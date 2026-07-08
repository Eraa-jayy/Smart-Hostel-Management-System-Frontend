import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/#contactUs" },
  { label: "Announcements", href: "/#announcements" },
];

export default function Navbar({ activeLink = "Home" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#000080]/95 backdrop-blur-md border-b border-blue-800 shadow-lg transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-all duration-300"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#d4af37] text-[#00008B] shadow-md transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
              <Building2 size={22} />
            </span>

            <span className="font-bold text-lg tracking-wide text-white transition-colors duration-300 group-hover:text-[#d4af37]">
              UniNest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative text-sm font-semibold transition-all duration-300 hover:scale-105
                after:absolute after:left-0 after:-bottom-2 after:h-[2px]
                after:bg-[#d4af37] after:transition-all after:duration-300
                ${
                  link.label === activeLink
                    ? "text-[#d4af37] after:w-full"
                    : "text-white after:w-0 hover:text-[#d4af37] hover:after:w-full"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-xl border-2 border-[#d4af37]
              text-[#d4af37] font-semibold
              transition-all duration-300
              hover:bg-[#d4af37]
              hover:text-[#00008B]
              hover:scale-105"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-xl bg-[#d4af37]
              text-[#00008B] font-semibold
              transition-all duration-300
              hover:bg-[#d4af37]
              hover:scale-105
              hover:shadow-xl"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 transition-transform duration-300 hover:rotate-90"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#00008B] border-t border-blue-800 px-5 py-5">

          <nav className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-base font-medium transition-all duration-300 hover:translate-x-2 ${
                  link.label === activeLink
                    ? "text-[#d4af37]"
                    : "text-white hover:text-[#d4af37]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-3 mt-6">

            <button
              onClick={() => {
                navigate("/login");
                setMobileOpen(false);
              }}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#d4af37]
              text-[#d4af37] font-semibold
              transition-all duration-300
              hover:bg-[#d4af37]
              hover:text-[#00008B]"
            >
              Login
            </button>

            <button
              onClick={() => {
                navigate("/login");
                setMobileOpen(false);
              }}
              className="flex-1 py-2.5 rounded-xl bg-[#d4af37]
              text-[#00008B] font-semibold
              transition-all duration-300
              hover:bg-[#d4af37]"
            >
              Register
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}