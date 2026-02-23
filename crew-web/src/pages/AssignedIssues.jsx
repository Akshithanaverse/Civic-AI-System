import { useEffect, useState } from "react";
import { getAssignedIssues } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AssignedIssues() {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const { data } = await getAssignedIssues();
    setIssues(data);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-6">My Assigned Issues</h1>

      {issues.length === 0 && (
        <p className="text-gray-400">No issues assigned yet.</p>
      )}

      {issues.map((issue) => (
        <div
          key={issue._id}
          onClick={() => navigate(`/issues/${issue._id}`)}
          className="bg-gray-800 p-4 mb-6 rounded cursor-pointer hover:bg-gray-700 transition"
        >
          {/* Image Preview */}
          {issue.images && issue.images.length > 0 && (
            <img
              src={issue.images[0]}
              alt="Issue"
              className="w-full h-48 object-cover rounded mb-4"
            />
          )}

          <h2 className="text-lg font-semibold">{issue.title}</h2>
          <p className="text-sm text-gray-400">
            Category: {issue.category}
          </p>
          <p className="mt-2">
            Status: <span className="text-blue-400">{issue.status}</span>
          </p>
        </div>
      ))}
    </div>
  );
}