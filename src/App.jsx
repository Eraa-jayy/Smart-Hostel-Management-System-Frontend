import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading.jsx";
import FloorRooms from "./pages/studentAffairs/FloorRooms.jsx";
import BuildingDetails from "./pages/studentAffairs/BuildingDetails";
import Hostel from "./pages/studentAffairs/Hostels.jsx";
import ManageHostel from "./pages/studentAffairs/ManageHostel";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


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
            <Route path ="student/:id" element={<StudentProfile/>}/>
            </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
