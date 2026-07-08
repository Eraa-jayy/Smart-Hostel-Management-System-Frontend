import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Users,
  UserRound,
  GraduationCap,
  BedDouble,
  LayoutGrid,
  Wrench,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  Bell,
  ClipboardCheck,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const HOSTELS = [
  { name: "Meddawaththa Boys", note: "Near Engineering Faculty", icon: Users },
  { name: "Eliyakanda New Boys", note: "Newly Renovated Complex", icon: Users },
  { name: "Eliyakanda Girls", note: "Secure & Comfortable", icon: UserRound },
  { name: "Wellamadama Boys", note: "Close to Main Campus", icon: GraduationCap },
];

const SERVICES = [
  {
    title: "Room Allocation",
    desc: "Automated smart allocation based on your faculty and preferences.",
    icon: BedDouble,
  },
  {
    title: "Online Applications",
    desc: "Seamlessly apply for room renewal or new admissions digitally.",
    icon: LayoutGrid,
  },
  {
    title: "Maintenance",
    desc: "Track status of your repair requests with real-time notifications.",
    icon: Wrench,
  },
  {
    title: "Visitor Mgmt",
    desc: "Easy pre-registration for parents and guests for better security.",
    icon: UserPlus,
  },
];

const WHY_CHOOSE = [
  { title: "Easy Selection", desc: "Browse by faculty proximity", icon: CheckCircle2 },
  { title: "Digital Allocation", desc: "Fair and transparent process", icon: LayoutGrid },
  { title: "Complaint Tracking", desc: "Real-time status updates", icon: ClipboardCheck },
  { title: "Announcements", desc: "Push notifications for alerts", icon: Bell },
  { title: "Visitor Logs", desc: "Integrated security portal", icon: ShieldCheck },
  { title: "Online Leave", desc: "Apply for leave easily", icon: CheckCircle2 },
];

const STATS = [
  { value: "1500+", label: "ACTIVE STUDENTS" },
  { value: "4", label: "MAJOR HOSTELS" },
  { value: "600+", label: "READY ROOMS" },
  { value: "24/7", label: "STAFF SUPPORT" },
];

const ANNOUNCEMENTS = [
  {
    tag: "Hostel Notice",
    tagColor: "bg-slate-100 text-slate-600",
    date: "Oct 24, 2024",
    title: "Semester Room Re-allocation Schedule",
    desc: "Detailed schedule for the upcoming semester room re-allocations is now available for all...",
  },
  {
    tag: "Event",
    tagColor: "bg-amber-100 text-amber-700",
    date: "Oct 20, 2024",
    title: "Annual Hostel Cultural Night 2024",
    desc: "Join us for a night of talent, food, and culture at the university main grounds this coming...",
  },
  {
    tag: "Maintenance Notice",
    tagColor: "bg-rose-100 text-rose-600",
    date: "Oct 18, 2024",
    title: "Water Supply Interruption - Wellamadama",
    desc: "Emergency pipe maintenance scheduled for Wellamadama block C between 10:00 AM...",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar activeLink="Home" />

      {/* Hero */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-5">
              <Sparkles size={13} /> ACADEMIC HOUSING PORTAL
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Find Your University <br /> Hostel with Ease
            </h1>
            <p className="mt-5 text-slate-600 leading-relaxed max-w-md">
              Select your hostel to access notices, room information,
              applications, maintenance requests, visitor management, and
              more. A centralized hub for all your residential needs.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
                Explore Hostels <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-3 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-white transition-colors"
              >
                Student Login
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Select Your Hostel</h2>
              <a href="#hostels" className="text-sm text-slate-500 hover:text-slate-800">
                View All
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {HOSTELS.map((h) => (
                <div
                  key={h.name}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 mb-3">
                    <h.icon size={17} />
                  </span>
                  <p className="font-medium text-slate-900 text-sm">{h.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{h.note}</p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 mt-3 hover:text-slate-900"
                  >
                    Select <ArrowRight size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrated Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Integrated Services</h2>
          <div className="w-14 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-slate-900 text-white mb-4">
                <s.icon size={19} />
              </span>
              <h3 className="font-semibold text-slate-900 mb-1.5">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-indigo-100 to-slate-200 flex items-center justify-center">
            <ImageIcon size={40} className="text-indigo-300" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Why Choose Our Hostel System?
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Our platform is designed to provide a hassle-free administrative
              experience for both students and staff, ensuring safety,
              efficiency, and transparency.
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {WHY_CHOOSE.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200 text-amber-600 shrink-0">
                    <item.icon size={16} />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl sm:text-4xl font-bold text-amber-400">{stat.value}</p>
              <p className="text-xs tracking-wide text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Recent Announcements</h2>
            <p className="text-slate-500 text-sm mt-1">
              Stay updated with the latest news and schedules.
            </p>
          </div>
          <button className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ANNOUNCEMENTS.map((a) => (
            <div
              key={a.title}
              className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${a.tagColor}`}>
                  {a.tag}
                </span>
                <span className="text-xs text-slate-400">{a.date}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{a.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{a.desc}</p>
              <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-slate-900">
                Read More <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-gradient-to-br from-amber-300 to-amber-400 px-8 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 max-w-xl mx-auto">
            Ready to Manage Your Hostel Experience?
          </h2>
          <p className="text-slate-800/80 mt-4 max-w-lg mx-auto">
            Join over 1,500 students who are already using our digital portal
            for a better, more secure residential life.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
            >
              Register Now
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-3 rounded-lg bg-white/70 text-slate-900 text-sm font-medium hover:bg-white"
            >
              Login to Portal
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
