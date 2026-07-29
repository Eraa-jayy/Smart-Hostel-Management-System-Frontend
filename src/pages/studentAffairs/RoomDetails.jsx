import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StudentCard from "../../components/studentAffairs/StudentCard";
import { getRoomMembers } from "../../service/studentAllocationService";

const RoomDetails = () => {
  const location = useLocation();
  const room = location.state;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (room) {
      loadRoomMembers();
    }
  }, [room]);

  const loadRoomMembers = async () => {
    try {
      const response = await getRoomMembers(room.id);
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return (
      <div className="p-10 text-center text-gray-400">
        Room not found. Please navigate from the floor page.
      </div>
    );
  }

  // Allocation status ACTIVE witharak pennanawa (released students ain karala)
  const activeStudents = students.filter((s) => s.status === "ACTIVE");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-2xl p-6 shadow mb-8">
        <h1 className="text-3xl font-bold">
          Room {room.number}
        </h1>
        <p className="text-gray-500 mt-2">
          Capacity: {room.capacity} | Occupied: {room.occupied}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-5">
        Room Students
      </h2>

      {loading ? (
        <div className="text-center text-gray-400 p-10">Loading...</div>
      ) : activeStudents.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-400">
          No students allocated to this room yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeStudents.map((allocation) => (
            <StudentCard
              key={allocation.id}
              student={{
                studentId:allocation.studentId,
                id: allocation.registrationNumber,
                name: allocation.studentName,
                faculty: allocation.academicYear || "-",
                course: allocation.status,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomDetails;