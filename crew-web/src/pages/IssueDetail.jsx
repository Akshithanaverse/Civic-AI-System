import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAssignedIssues, updateIssueStatus } from "../services/api";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";

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
    return <div className="text-slate-800 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <button
          onClick={() => navigate("/issues")}
          className="flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft size={20} />
          <span>Back to list</span>
        </button>

        <h1 className="text-3xl font-bold mb-4 text-slate-800">
          {issue.title}
        </h1>

        {/* Show All Images */}
        {issue.images && issue.images.length > 0 && (
          <div className="mb-6 space-y-4">
            {issue.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Issue"
                className="w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        <p className="mb-4 text-slate-700 leading-relaxed">
          {issue.description}
        </p>

        <div className="text-sm text-slate-600 mb-2">
          <p>Category: <span className="font-medium">{issue.category}</span></p>
          <p>Location: <span className="font-medium">{issue.location?.lat}, {issue.location?.lng}</span></p>
        </div>

        <p className="mt-4">
          Status: <span className="text-blue-500 font-semibold">{issue.status}</span>
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => updateStatus("in_progress")}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            <AlertCircle size={18} />
            In Progress
          </button>

          <button
            onClick={() => updateStatus("resolved")}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <CheckCircle size={18} />
            Resolve
          </button>

          <button
            onClick={() => updateStatus("rejected")}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <XCircle size={18} />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}