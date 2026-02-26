import { useEffect, useState } from "react";
import { getAssignedIssues } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FileText, MapPin, ArrowLeft } from "lucide-react";

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

  const statusBadge = (status) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
      case "in progress":
        return "bg-orange-100 text-orange-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft size={20} />
            <span>Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <FileText size={28} className="text-emerald-600" />
            My Assigned Issues
          </h1>
          <div />
        </div>

        {issues.length === 0 && (
          <p className="text-slate-600">No issues assigned yet.</p>
        )}

        <div className="space-y-6">
          {issues.map((issue) => (
            <div
              key={issue._id}
              onClick={() => navigate(`/issues/${issue._id}`)}
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              {issue.images && issue.images.length > 0 && (
                <img
                  src={issue.images[0]}
                  alt="Issue"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  {issue.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                  <MapPin size={16} />
                  <span>
                    {issue.location?.lat?.toFixed(4)}, {issue.location?.lng?.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(issue.status)}`}>
                    {issue.status}
                  </span>
                  <span className="text-sm text-slate-500">{issue.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}