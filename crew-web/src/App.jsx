import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AssignedIssues from "./pages/AssignedIssues";
import IssueDetail from "./pages/IssueDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

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
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;