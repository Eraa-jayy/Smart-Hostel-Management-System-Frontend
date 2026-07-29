import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById } from "../../service/studentService";
import { UserCircle, Mail, Phone, MapPin, BookOpen, CreditCard } from "lucide-react";

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
    return <div className="p-10 text-center text-gray-400">Loading...</div>;
  }

  if (!student) {
    return (
      <div className="p-10 text-center text-gray-400">
        Student not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 mb-5 font-semibold"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow p-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded-full">
            <UserCircle size={50} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {student.fullName}
            </h1>
            <p className="text-gray-500">{student.registrationNumber}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Mail className="text-gray-400 mt-1" size={18} />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{student.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="text-gray-400 mt-1" size={18} />
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-semibold">{student.phoneNumber || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="text-gray-400 mt-1" size={18} />
            <div>
              <p className="text-sm text-gray-500">NIC</p>
              <p className="font-semibold">{student.nic}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <UserCircle className="text-gray-400 mt-1" size={18} />
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-semibold">{student.gender || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="text-gray-400 mt-1" size={18} />
            <div>
              <p className="text-sm text-gray-500">Faculty</p>
              <p className="font-semibold">{student.faculty || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="text-gray-400 mt-1" size={18} />
            <div>
              <p className="text-sm text-gray-500">Academic Year</p>
              <p className="font-semibold">{student.academicYear || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:col-span-2">
            <MapPin className="text-gray-400 mt-1" size={18} />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-semibold">{student.address || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}