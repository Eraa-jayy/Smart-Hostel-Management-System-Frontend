import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading.jsx";
import Students from "./pages/studentAffairs/Students";
import HostelDetails from "./pages/studentAffairs/HostelDetails";
import FloorRooms from "./pages/studentAffairs/FloorRooms.jsx";
import RoomCard from "./components/studentAffairs/RoomCard.jsx";
import Hostel from "./pages/StudentAffairs/Hostels.jsx";

// Loading delay (Demo purpose)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* =========================================================
   PUBLIC PAGES
   ========================================================= */

// Home Page
const HomePage = lazy(() =>
  Promise.all([import("./pages/HomePage.jsx"), delay(2000)]).then(
    ([module]) => module
  )
);

// Login Page
const LoginPage = lazy(() =>
  Promise.all([import("./pages/LoginPage.jsx"), delay(2000)]).then(
    ([module]) => module
  )
);

// About Page
const About = lazy(() =>
  Promise.all([import("./pages/QuickLinks/About.jsx"), delay(2000)]).then(
    ([module]) => module
  )
);

/* =========================================================
   STUDENT MODULE
   ========================================================= */

// Student Layout
const StudentLayout = lazy(() =>
  import("./layout/StudentLayout.jsx")
);

// Student Pages
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

/*  STUDENT AFFAIRS MODULE */

// Student Affairs Layout
const StudentAffairsLayout = lazy(() =>
  import("./layout/StudentAffairsLayout.jsx")
);

// Student Affairs Pages
const StudentAffairsDashboard = lazy(() =>
  import("./pages/studentAffairs/Dashboard.jsx")
);

const RoomDetails = lazy(
()=>import("./pages/studentAffairs/RoomDetails")
);

export default function App() {
  return (
    <BrowserRouter>
      {/* Suspense shows Loading component while pages load */}
      <Suspense fallback={<Loading />}>

        <Routes>

          {/* =====================================================
              PUBLIC ROUTES
          ====================================================== */}

          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/about" element={<About />} />



          {/* =====================================================
              STUDENT ROUTES
          ====================================================== */}

          <Route path="/student" element={<StudentLayout />}>

            {/* Default Student Dashboard */}
            <Route index element={<StudentDashboard />} />

            {/* Complaint Management */}
            <Route
              path="complaints"
              element={<Complaints />}
            />

            {/* Canteen Module */}
            <Route
              path="canteen"
              element={<Canteen />}
            />

            {/* Payment Module */}
            <Route
              path="payments"
              element={<Payments />}
            />

            {/* Student Notifications */}
            <Route
              path="notifications"
              element={<Notifications />}
            />

          </Route>



          {/* =====================================================
              STUDENT AFFAIRS ROUTES
          ====================================================== */}

          <Route path="/student-affairs"
            element={<StudentAffairsLayout />}
          >
            <Route
            path="/student-affairs/hostel/:id"
            element={<HostelDetails />}
            />

            <Route
            path="/student-affairs/floor/:id"
            element={<FloorRooms />}
            />

            <Route
            path="/student-affairs/room/:id"
            element={<RoomDetails/>}
            />


            {/* Default Student Affairs Dashboard */}

            <Route 
            index
            element={<StudentAffairsDashboard/>}
            />

            <Route
              path="/student-affairs/dashboard"
              element={<StudentAffairsDashboard />}
            />

            <Route

              path="/student-affairs/students"
              element={<Students />}
            />

            <Route
              path="/student-affairs/hostel"
              element={<Hostel />}
            />

            

          </Route>

        </Routes>

      </Suspense>
    </BrowserRouter>
  );
}