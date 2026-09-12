import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Login nathi nam login page ekata yanna
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role matching (e.g. SUB_WARDEN vs SUBWARDEN)
  const normRole = role ? role.replace(/_/g, "").toUpperCase() : "";
  const normAllowed = allowedRole ? allowedRole.replace(/_/g, "").toUpperCase() : "";

  // Role mismatch nam login page ekata yanna
  if (allowedRole && normRole !== normAllowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}