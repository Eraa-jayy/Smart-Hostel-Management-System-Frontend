import React from "react";
import { UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentCard = ({ student }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
      <div className="flex items-center gap-4 mb-5">
        <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
          <UserCircle size={28} className="text-blue-600" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-gray-800 truncate">
            {student.name}
          </h2>
          <p className="text-xs text-gray-400">
            {student.id}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="text-xs text-gray-400">Faculty</span>
          <span className="text-sm font-medium text-gray-700">{student.faculty}</span>
        </div>

        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="text-xs text-gray-400">Course</span>
          <span className="text-sm font-medium text-gray-700">{student.course}</span>
        </div>
      </div>

      <button
        onClick={() => navigate(`/student-affairs/student/${student.studentId}`)}
        className="mt-5 w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold text-sm"
      >
        View Profile
      </button>
    </div>
  );
};

export default StudentCard;
