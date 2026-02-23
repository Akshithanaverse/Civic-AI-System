import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAssignedIssues, updateIssueStatus } from "../services/api";

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadIssue();
  }, []);

  const loadIssue = async () => {
    const { data } = await getAssignedIssues();
    const found = data.find((i) => i._id === id);
    setIssue(found);
  };

  const updateStatus = async (status) => {
    await updateIssueStatus(id, status);
    alert("Status updated successfully");
    navigate("/issues");
  };

  if (!issue) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <button
        onClick={() => navigate("/issues")}
        className="mb-6 bg-gray-700 px-4 py-2 rounded"
      >
        Back
      </button>

      <h1 className="text-3xl mb-4">{issue.title}</h1>

      {/* Show All Images */}
      {issue.images && issue.images.length > 0 && (
        <div className="mb-6">
          {issue.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Issue"
              className="w-full max-h-96 object-cover rounded mb-4"
            />
          ))}
        </div>
      )}

      <p className="mb-4">{issue.description}</p>

      <p className="text-gray-400">
        Category: {issue.category}
      </p>

      <p className="text-gray-400">
        Location: {issue.location?.lat}, {issue.location?.lng}
      </p>

      <p className="mt-4">
        Status: <span className="text-blue-400">{issue.status}</span>
      </p>

      <div className="mt-6 space-x-4">
        <button
          onClick={() => updateStatus("in_progress")}
          className="bg-yellow-600 px-4 py-2 rounded"
        >
          In Progress
        </button>

        <button
          onClick={() => updateStatus("resolved")}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Resolve
        </button>

        <button
          onClick={() => updateStatus("rejected")}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  );
}