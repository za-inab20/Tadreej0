import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import OtpVerify from "./components/OtpVerify";
import ResetPassword from "./components/ResetPassword";
import Roadmap from "./pages/Roadmap";
import ProjectIntro from "./pages/ProjectIntro";
import Phase1 from "./pages/phases/Phase1";
import Phase2 from "./pages/phases/Phase2";
import Phase3 from "./pages/phases/Phase3";
import Phase4 from "./pages/phases/Phase4";
import Phase5 from "./pages/phases/Phase5";
import Phase6 from "./pages/phases/Phase6";
import Phase7 from "./pages/phases/Phase7";
import Phase8 from "./pages/phases/Phase8";
import Freelancers from "./pages/Freelancers";
import FreelancerProfile from "./pages/FreelancerProfile";
import Courses from "./pages/Courses";
import Suggestions from "./pages/Suggestions";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Header />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OtpVerify />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/project-intro" element={<PrivateRoute><ProjectIntro /></PrivateRoute>} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/freelancers" element={<Freelancers />} />
            <Route path="/freelancer/:id" element={<FreelancerProfile />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/suggestions" element={<PrivateRoute><Suggestions /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            <Route path="/phase1" element={<PrivateRoute><Phase1 /></PrivateRoute>} />
            <Route path="/phase2" element={<PrivateRoute><Phase2 /></PrivateRoute>} />
            <Route path="/phase3" element={<PrivateRoute><Phase3 /></PrivateRoute>} />
            <Route path="/phase4" element={<PrivateRoute><Phase4 /></PrivateRoute>} />
            <Route path="/phase5" element={<PrivateRoute><Phase5 /></PrivateRoute>} />
            <Route path="/phase6" element={<PrivateRoute><Phase6 /></PrivateRoute>} />
            <Route path="/phase7" element={<PrivateRoute><Phase7 /></PrivateRoute>} />
            <Route path="/phase8" element={<PrivateRoute><Phase8 /></PrivateRoute>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
