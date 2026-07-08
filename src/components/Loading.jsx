import React from "react";
import { Building2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#000080] to-slate-900">

      <div className="flex flex-col items-center gap-5">

        {/* Logo */}
        <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#d4af37] text-[#000080] shadow-lg">
          <Building2 size={32} />
        </span>

        {/* Brand Name */}
        <h1 className="font-bold text-2xl tracking-wide text-white">
          UniNest
        </h1>

        {/* Three Dot Loader */}
        <div className="flex items-center gap-2">

          <span className="w-3 h-3 rounded-full bg-[#d4af37] animate-bounce"></span>

          <span
            className="w-3 h-3 rounded-full bg-[#d4af37] animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>

          <span
            className="w-3 h-3 rounded-full bg-[#d4af37] animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></span>

        </div>

      </div>

    </div>
  );
}