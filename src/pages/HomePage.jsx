import React, { useEffect, useRef, useState } from "react";
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
  Utensils,
  CreditCard,
  ClipboardCheck,
  UtensilsCrossed,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Reveal from "../components/Reveal.jsx";
import heroBg from "../assests/herobg.jpg";
import hostel01 from "../assests/hostel01.jpg";

const HOSTELS = [
  {
    name: "Meddawaththa Boy's Hostel",
    note: "Allocated for 1st year male students",
    icon: Users,
  },
  {
    name: "Eliyakanda New Boy's Hostel",
    note: "For 2nd year, 3rd year and 4th year Male students",
    icon: Users,
  },
  {
    name: "Eliyakanda New Girl's Hostel",
    note: "For 2nd year, 3rd year and 4th year Female students",
    icon: Users,
  },
  {
    name: "Wellamadama Girl's Hostel",
    note: "Mainly for 1st year girls",
    icon: Users,
  },
];

const SERVICES = [
  {
    title: "Room Allocation",
    desc: "Automated smart allocation based on your faculty and preferences.",
    icon: BedDouble,
  },
  {
    title: "Online Payments",
    desc: "Pay hostel fees and settle damage fines easily with a secure and convenient online payment system.",
    icon: LayoutGrid,
  },
  {
    title: "Canteen Services",
    desc: "View daily menus, available meals, and food details from the hostel canteen.",
    icon: Utensils,
  },
  {
    title: "Maintenance & Complaints",
    desc: "Report maintenance issues, submit complaints, and track repairing activities for a better hostel experience.",
    icon: UserPlus,
  },
];

const WHY_CHOOSE = [
  {
    title: "Smart Room Management",
    desc: "View room allocations and hostel details through an organized floor-wise management system.",
    icon: LayoutGrid,
  },
  {
    title: "Maintenance Support",
    desc: "Submit maintenance requests online and track repair progress with real-time updates.",
    icon: ClipboardCheck,
  },
  {
    title: "Secure Online Payments",
    desc: "Pay hostel fees, damage charges, and late payment fines securely in one place.",
    icon: CreditCard,
  },
  {
    title: "Daily Canteen Menu",
    desc: "Stay updated with breakfast, lunch, and dinner menus published by hostel canteen staff.",
    icon: Utensils,
  },
  {
    title: "Smart Notifications",
    desc: "Receive important reminders for payments, fines, announcements, and maintenance updates.",
    icon: Bell,
  },
  {
    title: "Efficient Hostel Management",
    desc: "A centralized platform connecting students and hostel staff for transparent and efficient operations.",
    icon: ShieldCheck,
  },
];

const STATS = [
  { value: 1500, suffix: "+", label: "ACTIVE STUDENTS" },
  { value: 4, suffix: "", label: "MAJOR HOSTELS" },
  { value: 600, suffix: "+", label: "READY ROOMS" },
  { value: 24, suffix: "/7", label: "STAFF SUPPORT" },
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

  const statsRef = useRef(null);
  const [startCount, setStartCount] = useState(false);

  const [counts, setCounts] = useState(STATS.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.4,
      },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!startCount) return;

    STATS.forEach((stat, index) => {
      let current = 0;

      const duration = 1800;
      const increment = stat.value / (duration / 20);

      const timer = setInterval(() => {
        current += increment;

        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
        }

        setCounts((prev) => {
          const updated = [...prev];
          updated[index] = Math.floor(current);

          return updated;
        });
      }, 20);
    });
  }, [startCount]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar activeLink="Home" />

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 items-start animate-fadeIn">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              Everything You Need for Hostel Living
            </h1>
            <p className="mt-5 text-white/80 leading-relaxed max-w-md">
              Manage your accommodation, payments, maintenance requests, and
              daily hostel services from one convenient platform.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-slate-900 text-sm font-semibold hover:bg-white/90 transition-all hover:scale-105">
                Explore Hostels <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-3 rounded-lg border-2 border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-all hover:scale-105"
              >
                Student Login
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white/90">
                Select Your Hostel
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {HOSTELS.map((h) => (
                <div
                  key={h.name}
                  className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 hover:bg-white/20 transition-all"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/20 text-white mb-3">
                    <h.icon size={17} />
                  </span>
                  <p className="font-medium text-white text-sm">{h.name}</p>
                  <p className="text-xs text-white/70 mt-0.5">{h.note}</p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-xs font-medium text-white/80 mt-3 hover:text-white"
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
      <Reveal>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Integrated Services
          </h2>
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
      </Reveal>

      {/* Why Choose */}
      <Reveal>
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <img
              src={hostel01}
              alt="Hostel"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Why Choose UniNest?
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Designed to simplify hostel management for students and university
              staff by providing a secure, transparent, and fully digital
              platform for accommodation, communication, and daily hostel
              services.
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {WHY_CHOOSE.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200 text-amber-600 shrink-0">
                    <item.icon size={16} />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Stats */}
      <Reveal>
      <section ref={statsRef} className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, index) => (
            <div key={stat.label}>
              <p className="text-3xl sm:text-4xl font-bold text-amber-400">
                {counts[index]}
                {stat.suffix}
              </p>

              <p className="text-xs tracking-wide text-slate-400 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      {/* Announcements */}
      <Reveal>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Recent Announcements
            </h2>
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
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${a.tagColor}`}
                >
                  {a.tag}
                </span>
                <span className="text-xs text-slate-400">{a.date}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{a.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {a.desc}
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-900"
              >
                Read More <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
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
      </Reveal>

      <Footer />
    </div>
  );
}
