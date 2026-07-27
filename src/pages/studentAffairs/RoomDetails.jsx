import React from "react";
import StudentCard from "../../components/studentAffairs/StudentCard";

const RoomDetails = () => {
  const students = [
    { id: "CS002", name: "Nimal Silva", faculty: "Computing", course: "Information Technology" },
    { id: "CS003", name: "Amal Fernando", faculty: "Engineering", course: "Software Engineering" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-2xl p-6 shadow mb-8">
        <h1 className="text-3xl font-bold">
          Room 101
        </h1>
        <p className="text-gray-500 mt-2">
          Capacity: 4 | Occupied: 3
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-5">
        Room Students
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomDetails;
