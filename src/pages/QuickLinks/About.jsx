import React from "react";
import {
  Building2,
  Users,
  ShieldCheck,
  Wrench,
  Utensils,
  CreditCard,
  Bell,
  BedDouble,
  Package,
  CheckCircle,
} from "lucide-react";

const roles = [
  {
    title: "Students",
    icon: Users,
    description:
      "Students can manage their hostel experience by viewing room details, submitting complaints, receiving maintenance updates, checking canteen menus, and making payments.",
  },
  {
    title: "Student Affairs",
    icon: ShieldCheck,
    description:
      "Student Affairs acts as the system administrator by managing hostels, eligible students, staff access, fines, inventory, and overall hostel operations.",
  },
  {
    title: "Wardens",
    icon: Building2,
    description:
      "Wardens can monitor hostel activities, view student information, manage hostel notices, and oversee hostel operations.",
  },
  {
    title: "Sub Wardens",
    icon: BedDouble,
    description:
      "Sub Wardens manage floor-wise room allocations, handle student complaints, update inventory, and monitor maintenance activities.",
  },
  {
    title: "Maintenance Staff",
    icon: Wrench,
    description:
      "Maintenance staff receive repair requests, update job progress, communicate with students, and complete assigned maintenance tasks.",
  },
  {
    title: "Canteen Staff",
    icon: Utensils,
    description:
      "Canteen staff can publish daily menus and update meal information for students.",
  },
];

const features = [
  {
    title: "Smart Room Allocation",
    icon: BedDouble,
    description:
      "Manage hostel rooms floor-wise and allocate students efficiently with accurate occupancy information.",
  },
  {
    title: "Complaint Management",
    icon: Wrench,
    description:
      "Students can submit complaints and track maintenance progress through a transparent communication system.",
  },
  {
    title: "Digital Payments",
    icon: CreditCard,
    description:
      "Students can make hostel fee payments, damage charges, and late payment fine payments securely.",
  },
  {
    title: "Inventory Management",
    icon: Package,
    description:
      "Monitor hostel equipment, manage damaged items, and maintain accurate inventory records.",
  },
  {
    title: "Canteen Management",
    icon: Utensils,
    description:
      "Provide students with updated daily hostel meal menus through the system.",
  },
  {
    title: "Smart Notifications",
    icon: Bell,
    description:
      "Send important updates including hostel fee reminders, fines, notices, and maintenance updates.",
  },
];

export default function About() {
  return (
    <div className="bg-slate-50 text-gray-800">

      {/* Hero Section */}
      <section className="bg-[#000080] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-[#d4af37]">RuHostel</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-200">
            RuHostel is a digital hostel management system developed for the
            University of Ruhuna to simplify hostel administration, improve
            communication, and provide a better accommodation experience for
            students.
          </p>

        </div>
      </section>


      {/* About System */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div className="bg-white rounded-2xl shadow-lg p-10">
            <Building2
              size={60}
              className="text-[#d4af37] mb-6"
            />

            <h2 className="text-3xl font-bold text-[#000080] mb-5">
              What is RuHostel?
            </h2>

            <p className="leading-7 text-gray-600">
              RuHostel is an integrated hostel management platform that connects
              students, Student Affairs, wardens, sub wardens, maintenance staff,
              and canteen staff in one centralized system.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              The system replaces traditional manual hostel processes with
              efficient digital solutions for room allocation, complaints,
              payments, inventory management, and communication.
            </p>

          </div>


          <div className="space-y-4">

            {[
              "Digital hostel management",
              "Floor-wise room allocation",
              "Complaint and maintenance tracking",
              "Online hostel fee and fine payments",
              "Inventory monitoring",
              "Daily canteen menu updates",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow"
              >
                <CheckCircle
                  className="text-[#d4af37]"
                />

                <span>{item}</span>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* Mission */}
      <section className="bg-[#000080] py-16 px-6 text-white">

        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-5">
            Our Mission
          </h2>

          <p className="text-gray-200 text-lg leading-8">
            To create a smarter and more efficient hostel environment by using
            technology to improve transparency, communication, and management
            between students and university staff.
          </p>

        </div>

      </section>


      {/* User Roles */}
      <section className="py-16 px-6">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-bold text-center text-[#000080] mb-12">
            Who Uses RuHostel?
          </h2>


          <div className="grid md:grid-cols-3 gap-6">

            {roles.map((role, index) => {

              const Icon = role.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition border-t-4 border-[#d4af37]"
                >

                  <Icon
                    size={40}
                    className="text-[#000080] mb-4"
                  />

                  <h3 className="text-xl font-bold mb-3">
                    {role.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-6">
                    {role.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      {/* Features */}
      <section className="py-16 px-6 bg-white">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-bold text-center text-[#000080] mb-12">
            Key Features
          </h2>


          <div className="grid md:grid-cols-3 gap-6">

            {features.map((feature,index)=>{

              const Icon = feature.icon;

              return(
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-slate-50 shadow"
                >

                  <Icon
                    size={38}
                    className="text-[#d4af37] mb-4"
                  />

                  <h3 className="font-bold text-xl mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600">
                    {feature.description}
                  </p>

                </div>
              )

            })}

          </div>

        </div>

      </section>


      {/* Hostel Section */}
      <section className="bg-[#000080] py-16 px-6 text-white">

        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-10">
            University of Ruhuna Hostels
          </h2>


          <div className="grid md:grid-cols-4 gap-5">

            {[
              "Meddawaththa Boys Hostel",
              "Eliyakanda New Boys Hostel",
              "Eliyakanda Girls Hostel",
              "Wellamadama Girls Hostel",
            ].map((hostel,index)=>(

              <div
                key={index}
                className="bg-white text-gray-800 rounded-xl p-5 shadow"
              >

                <Building2
                  className="mx-auto text-[#d4af37] mb-3"
                />

                <h3 className="font-semibold">
                  {hostel}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
}