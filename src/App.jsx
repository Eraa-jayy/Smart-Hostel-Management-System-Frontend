import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading.jsx";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const HomePage = lazy(() =>
  Promise.all([import("./pages/HomePage.jsx"), delay(2000)]).then(
    ([module]) => module
  )
);

const LoginPage = lazy(() =>
  Promise.all([import("./pages/LoginPage.jsx"), delay(2000)]).then(
    ([module]) => module
  )
);

const About = lazy(() =>
  Promise.all([import("./pages/QuickLinks/About.jsx"), delay(2000)]).then(
    ([module]) => module
  )
);


const StudentDashboard = lazy(() =>
  import("./pages/Student/StudentDashboard.jsx")
);


// Student Pages
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



export default function App() {
  return (
    <BrowserRouter>

      <Suspense fallback={<Loading />}>

        <Routes>

          {/* Main Pages */}
          <Route 
            path="/" 
            element={<HomePage />} 
          />

          <Route 
            path="/login" 
            element={<LoginPage />} 
          />

          <Route 
            path="/about" 
            element={<About />} 
          />


          {/* Student Dashboard */}
          <Route 
            path="/student-dashboard" 
            element={<StudentDashboard />} 
          />


          {/* Student Pages */}
          <Route 
            path="/student-complaints" 
            element={<Complaints />} 
          />

          <Route 
            path="/student-canteen" 
            element={<Canteen />} 
          />

          <Route 
            path="/student-payments" 
            element={<Payments />} 
          />

          <Route 
            path="/student-notifications" 
            element={<Notifications />} 
          />


        </Routes>

      </Suspense>

    </BrowserRouter>
  );
}