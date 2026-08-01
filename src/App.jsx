import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading.jsx";
import FloorRooms from "./pages/studentAffairs/FloorRooms.jsx";
import BuildingDetails from "./pages/studentAffairs/BuildingDetails";
import Hostel from "./pages/studentAffairs/Hostels.jsx";
import ManageHostel from "./pages/studentAffairs/ManageHostel";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./layout/AdminLayout";

// Loading delay (Demo purpose)
const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* =========================
   PUBLIC PAGES
========================= */

const HomePage = lazy(() =>
  Promise.all([
    import("./pages/HomePage.jsx"),
    delay(2000)
  ]).then(([module]) => module)
);

const LoginPage = lazy(() =>
  Promise.all([
    import("./pages/LoginPage.jsx"),
    delay(2000)
  ]).then(([module]) => module)
);

const About = lazy(() =>
  Promise.all([
    import("./pages/QuickLinks/About.jsx"),
    delay(2000)
  ]).then(([module]) => module)
);

/* =========================
   STUDENT MODULE
========================= */

const StudentLayout = lazy(() =>
  import("./layout/StudentLayout.jsx")
);

const StudentDashboard = lazy(() =>
  import("./pages/Student/StudentDashboard.jsx")
);

const Complaints = lazy(() =>
  import("./pages/Student/Complaints.jsx")
);

const Canteen = lazy(() =>
  import("./pages/Student/Canteen.jsx")
);

const Payments = lazy(() =>
  import("./pages/Student/Payments.jsx")
);

const Notifications = lazy(() =>
  import("./pages/Student/Notifications.jsx")
);
 const ChangePassword = lazy (()=>
import("./pages/ChangePassword.jsx")
);

/* =========================
   STUDENT AFFAIRS MODULE
========================= */

const StudentAffairsLayout = lazy(() =>
  import("./layout/StudentAffairsLayout.jsx")
);

const StudentAffairsDashboard = lazy(() =>
  import("./pages/studentAffairs/Dashboard.jsx")
);

const RoomDetailsLazy = lazy(() =>
  import("./pages/studentAffairs/RoomDetails.jsx")
);

const BulkUploadStudents = lazy(()=>
  import("./pages/studentAffairs/BulkUploadStudents.jsx")
);

const Allocations = lazy(() =>
  import("./pages/studentAffairs/Allocations.jsx")
);
 
const StudentProfile = lazy(()=>
import("./pages/studentAffairs/StudentProfile.jsx")
);
const ComplaintStatus = lazy(() => import("./pages/studentAffairs/ComplaintStatus.jsx"));

/* =========================
   SUB WARDEN MODULE
========================= */

const SubWardenLayout = lazy(() => import("./layout/SubWardenLayout.jsx"));
const SubWardenDashboard = lazy(() => import("./pages/SubWarden/Dashboard.jsx"));
const StudentAllocation = lazy(() => import("./pages/SubWarden/StudentAllocation.jsx"));
const InventoryManagement = lazy(() => import("./pages/SubWarden/InventoryManagement.jsx"));
const SubWardenComplaints = lazy(() => import("./pages/SubWarden/Complaints.jsx"));
const HostelConfig = lazy(() => import("./pages/SubWarden/HostelConfig.jsx"));

/* =========================
   MAINTENANCE MODULE
========================= */
const MaintenanceLayout = lazy(() => import("./layout/MaintenanceLayout.jsx"));
const MaintenanceComplaints = lazy(() => import("./pages/Maintenance/Complaints.jsx"));
const MaintenanceHistory = lazy(() => import("./pages/Maintenance/History.jsx"));

/* =========================
   SYSTEM ADMIN MODULE
========================= */


const Dashbord = lazy(() => import("./pages/admin/DashBord.jsx"));
const Users = lazy(() => import("./pages/admin/Users.jsx"));
const CreateUser = lazy(() => import("./pages/admin/CreateUser.jsx"));
const UserDetails = lazy(() => import("./pages/admin/UserDetails.jsx"));
const ManageRoles = lazy(() => import("./pages/admin/ManageRoles.jsx"));
const StudentAffairsAccounts = lazy(() => import("./pages/admin/StudentAffairsAccounts.jsx"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile.jsx"));
const Settings = lazy(() => import("./pages/admin/Settings.jsx"));


export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/change-password" element={<ChangePassword/>} />
          <Route path="/about" element={<About />} />

          {/* =========================
              STUDENT ROUTES
          ========================= */}

          <Route path="/student" element={<ProtectedRoute allowedRole= "STUDENT"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="canteen" element={<Canteen />} />
            <Route path="payments" element={<Payments />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* =========================
              STUDENT AFFAIRS ROUTES
          ========================= */}

          <Route path="/student-affairs" element={<ProtectedRoute allowedRole="STUDENT_AFFAIRS"><StudentAffairsLayout /></ProtectedRoute>}>
            <Route index element={<StudentAffairsDashboard />} />
            <Route path="dashboard" element={<StudentAffairsDashboard />} />
            <Route path="hostel" element={<Hostel />} />
            <Route path="manage-hostel/:id" element={<ManageHostel />} />
            <Route path="floor/:id" element={<FloorRooms />} />
            <Route path="room/:id" element={<RoomDetailsLazy />} />
            <Route path="building/:id" element={<BuildingDetails />} />
            <Route path="bulk-upload" element={<BulkUploadStudents />} />
            <Route path="allocations" element={<Allocations />} />
            <Route path="complaints" element={<ComplaintStatus />} />
            <Route path ="student/:id" element={<StudentProfile/>}/>
            </Route>

            <Route path="/maintenance" element={<ProtectedRoute allowedRole="MAINTENANCE"><MaintenanceLayout /></ProtectedRoute>}>
              <Route index element={<MaintenanceComplaints />} />
              <Route path="complaints" element={<MaintenanceComplaints />} />
              <Route path="history" element={<MaintenanceHistory />} />
            </Route>

            {/* =========================
               SUB WARDEN ROUTES
            ========================= */}
            <Route path="/subwarden" element={<ProtectedRoute allowedRole="SUB_WARDEN"><SubWardenLayout /></ProtectedRoute>}>
              <Route index element={<SubWardenDashboard />} />
              <Route path="dashboard" element={<SubWardenDashboard />} />
              <Route path="allocations" element={<StudentAllocation />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="complaints" element={<SubWardenComplaints />} />
              <Route path="config" element={<HostelConfig />} />
            </Route>

            {/* =========================
              System administration routes
          ========================= */}
            <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashbord />} />
            <Route path="users" element={<Users />} />
            <Route path="users/create" element={<CreateUser />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="roles" element={<ManageRoles />} />
            <Route path="student-affairs" element={<StudentAffairsAccounts />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<Settings />} />
            </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
