import React from "react";
import { Building2, Phone, Mail, MapPin } from "lucide-react";

const QUICK_LINKS = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms and Conditions", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#000080] text-slate-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-14">
        
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-10
        ">

          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10">
                <Building2 size={20} className="text-white" />
              </span>

              <span className="font-semibold text-lg text-white">
                UniNest
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto sm:mx-0">
              One Platform. Complete Hostel Management.
            </p>
          </div>


          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-semibold mb-4">
              Quick Links
            </h4>

            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          {/* Contact */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-semibold mb-4">
              Contact Us
            </h4>

            <ul className="space-y-4 text-sm">

              <li className="
                flex 
                flex-col 
                sm:flex-row 
                items-center 
                sm:items-start 
                gap-2 
                sm:gap-3
              ">
                <MapPin 
                  size={17} 
                  className="shrink-0 text-slate-400 mt-1" 
                />

                <span className="leading-relaxed">
                  Department of Computer Science, 
                  Faculty of Science, 
                  University of Ruhuna.
                </span>
              </li>


              <li className="
                flex 
                items-center 
                justify-center 
                sm:justify-start 
                gap-3
              ">
                <Phone 
                  size={16} 
                  className="shrink-0 text-slate-400" 
                />

                <span>
                  +94 11 223 4455
                </span>
              </li>


              <li className="
                flex 
                items-center 
                justify-center 
                sm:justify-start 
                gap-3
              ">
                <Mail 
                  size={16} 
                  className="shrink-0 text-slate-400" 
                />

                <span className="break-all">
                  uninest@gmail.com
                </span>
              </li>

            </ul>
          </div>

        </div>
      </div>


      {/* Bottom Section */}
      <div className="border-t border-white/10">

        <div className="
          max-w-7xl 
          mx-auto 
          px-5 
          sm:px-6 
          lg:px-8 
          py-5 
          flex 
          flex-col 
          sm:flex-row 
          items-center 
          justify-center 
          gap-2 
          text-center
          text-xs 
          text-slate-500
        ">

          <p>
            &copy; {new Date().getFullYear()} University Hostel Management System.
            <span className="block sm:inline sm:ml-1">
              All rights reserved.
            </span>
          </p>

        </div>

      </div>

    </footer>
  );
}