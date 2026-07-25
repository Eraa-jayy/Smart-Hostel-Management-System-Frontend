import React from "react";

export default function StudentDetails({ student, close }) {

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl p-6 w-[500px]">

        <h2 className="text-2xl font-bold mb-5">
          Student Details
        </h2>

        <div className="space-y-2">

          <p><strong>Student ID:</strong> {student.studentId}</p>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Faculty:</strong> {student.faculty}</p>
          <p><strong>Year:</strong> {student.year}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Phone:</strong> {student.phone}</p>
          <p><strong>Hostel:</strong> {student.hostel}</p>
          <p><strong>Room:</strong> {student.room}</p>
          <p><strong>Status:</strong> {student.status}</p>

        </div>

        <button
          onClick={close}
          className="mt-6 w-full bg-red-500 text-white py-3 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>
  );
}