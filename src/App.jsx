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

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
