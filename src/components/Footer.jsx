import React from "react";
import { Building2, Facebook, Twitter, Instagram, Phone, Mail, MapPin } from "lucide-react";

const QUICK_LINKS = ["About Us", "Hostel Rules", "Privacy Policy", "Terms of Service"];
const SUPPORT_LINKS = ["Support Center", "Emergency Contacts", "Maintenance Help", "FAQ"];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10">
              <Building2 size={18} className="text-white" />
            </span>
            <span className="font-semibold text-white">University Housing</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Providing safe, modern, and high-quality residential services to
            empower student academic success since 1978.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-3 text-sm">
            {SUPPORT_LINKS.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400" />
              <span>
                University Main Office, Housing Department, Broadway, Main
                Campus.
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="shrink-0 text-slate-400" />
              <span>+94 11 223 4455</span>
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="shrink-0 text-slate-400" />
              <span>housing@university.edu</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} University Hostel Management System. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Designed for Excellence</span>
            <span>Student First Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
