import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Power, Trash2 } from "lucide-react";

export default function UserTable({ users, onToggleStatus, onDelete }) {
  const navigate = useNavigate();

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
        No users found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
            <th className="p-4 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Username</th>
            <th className="p-4 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Role</th>
            <th className="p-4 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Linked Student</th>
            <th className="p-4 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Status</th>
            <th className="p-4 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">First Login</th>
            <th className="p-4 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td className="p-4 font-medium text-gray-800">{user.username}</td>
              <td className="p-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                  {user.role}
                </span>
              </td>
              <td className="p-4 text-gray-600">{user.studentName || "-"}</td>
              <td className="p-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    user.enabled
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {user.enabled ? "Active" : "Disabled"}
                </span>
              </td>
              <td className="p-4 text-gray-600">
                <span className={`text-xs font-medium ${user.firstLogin ? "text-amber-600" : "text-emerald-600"}`}>
                  {user.firstLogin ? "Pending" : "Completed"}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onToggleStatus(user.id)}
                    className="p-2 rounded-lg hover:bg-amber-50 text-gray-500 hover:text-amber-600 transition-colors"
                    title={user.enabled ? "Disable" : "Enable"}
                  >
                    <Power size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
