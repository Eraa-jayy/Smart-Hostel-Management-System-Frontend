import React from "react";
import { UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentCard = ({ student }) => {

  const navigate =useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-xl transition">
      <div className="flex items-center gap-4 mb-5">
        <div className="bg-blue-100 p-3 rounded-full">
          <UserCircle size={35} className="text-blue-600" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {student.name}
          </h2>
          <p className="text-gray-500">
            {student.id}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="flex justify-between">
          <span className="text-gray-500">Faculty</span>
          <b>{student.faculty}</b>
        </p>

        <p className="flex justify-between">
          <span className="text-gray-500">Course</span>
          <b>{student.course}</b>
        </p>
      </div>

      <button 
        onClick={()=>navigate(`/student-affairs/student/${student.studentId}`)}
        className="mt-5 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
        View Profile
      </button>
    </div>
  );
};

export default StudentCard;
