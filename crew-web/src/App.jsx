import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AssignedIssues from "./pages/AssignedIssues";
import IssueDetail from "./pages/IssueDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";

// Debug component to show app is loading
const DebugInfo = () => {
  console.log("🚀 Crew Web App Loaded Successfully");
  console.log("📡 API Base URL:", import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api");
  return null; // Invisible component
};

function App() {
  return (
    <Router>
      <DebugInfo /> {/* Add debug info */}
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/issues"
              element={
                <ProtectedRoute>
                  <AssignedIssues />
                </ProtectedRoute>
              }
            />

            <Route
              path="/issues/:id"
              element={
                <ProtectedRoute>
                  <IssueDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* Catch-all route for debugging */}
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;