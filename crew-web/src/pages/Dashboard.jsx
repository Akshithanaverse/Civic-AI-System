import { useEffect, useState } from "react";
import { getAssignedIssues } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const { data } = await getAssignedIssues();
    setIssues(data);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const pending = issues.filter(i => i.status === "assigned").length;
  const inProgress = issues.filter(i => i.status === "in_progress").length;
  const resolved = issues.filter(i => i.status === "resolved").length;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl">Crew Dashboard</h1>
        <button onClick={logout} className="bg-red-600 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded">
          <h2>Assigned</h2>
          <p className="text-2xl">{pending}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded">
          <h2>In Progress</h2>
          <p className="text-2xl">{inProgress}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded">
          <h2>Resolved</h2>
          <p className="text-2xl">{resolved}</p>
        </div>
      </div>

      <button
        onClick={() => navigate("/issues")}
        className="mt-8 bg-blue-600 px-6 py-3 rounded"
      >
        View Assigned Issues
      </button>
    </div>
  );
}