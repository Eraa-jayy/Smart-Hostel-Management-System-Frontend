import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Login nathi nam login page ekata yanna
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch nam login page ekata yanna
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}