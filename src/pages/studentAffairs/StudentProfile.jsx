import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById } from "../../service/studentService";
import { UserCircle, Mail, Phone, MapPin, BookOpen, CreditCard, ArrowLeft, GraduationCap } from "lucide-react";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      const response = await getStudentById(id);
      setStudent(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">Loading...</div>;
  }

  if (!student) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
        Student not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center">
            <UserCircle size={40} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {student.fullName}
            </h1>
            <p className="text-sm text-gray-400">{student.registrationNumber}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <Mail className="text-gray-400 mt-0.5" size={16} />
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-semibold text-gray-700">{student.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <Phone className="text-gray-400 mt-0.5" size={16} />
            <div>
              <p className="text-xs text-gray-400">Phone Number</p>
              <p className="text-sm font-semibold text-gray-700">{student.phoneNumber || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <CreditCard className="text-gray-400 mt-0.5" size={16} />
            <div>
              <p className="text-xs text-gray-400">NIC</p>
              <p className="text-sm font-semibold text-gray-700">{student.nic}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <UserCircle className="text-gray-400 mt-0.5" size={16} />
            <div>
              <p className="text-xs text-gray-400">Gender</p>
              <p className="text-sm font-semibold text-gray-700">{student.gender || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <GraduationCap className="text-gray-400 mt-0.5" size={16} />
            <div>
              <p className="text-xs text-gray-400">Faculty</p>
              <p className="text-sm font-semibold text-gray-700">{student.faculty || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <BookOpen className="text-gray-400 mt-0.5" size={16} />
            <div>
              <p className="text-xs text-gray-400">Academic Year</p>
              <p className="text-sm font-semibold text-gray-700">{student.academicYear || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl md:col-span-2">
            <MapPin className="text-gray-400 mt-0.5" size={16} />
            <div>
              <p className="text-xs text-gray-400">Address</p>
              <p className="text-sm font-semibold text-gray-700">{student.address || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
