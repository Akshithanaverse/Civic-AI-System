import { useEffect, useState } from "react";
import { getAllIssues, assignIssue, getCrews } from "../services/api";

export default function AllIssues() {
  const [issues, setIssues] = useState([]);
  const [crews, setCrews] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issuesRes = await getAllIssues(token);
        setIssues(issuesRes.data);
        const crewsRes = await getCrews(token);
        setCrews(crewsRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch data");
      }
    };
    fetchData();
  }, [token]);

  const handleAssign = async (issueId, crewId) => {
    try {
      await assignIssue(issueId, crewId, token);
      alert("Assigned successfully!");
      // Refresh issues
      const res = await getAllIssues(token);
      setIssues(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to assign issue");
    }
  };

  const openModal = (issue) => {
    setSelectedIssue(issue);
  };

  const closeModal = () => {
    setSelectedIssue(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Issues</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Reported By</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id} className="hover:bg-gray-100">
              <td
                className="border p-2 cursor-pointer hover:underline text-blue-600"
                onClick={() => openModal(issue)}
              >
                {issue.title}
              </td>
              <td className="border p-2">{issue.category}</td>
              <td className="border p-2">{issue.status}</td>
              <td className="border p-2">{issue.reportedBy?.name}</td>
              <td className="border p-2">
                <select
                  className="border p-1 mr-2"
                  id={`crew-${issue._id}`}
                >
                  <option value="">Select Crew</option>
                  {crews.map((crew) => (
                    <option key={crew._id} value={crew._id}>
                      {crew.name}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    const select = document.getElementById(`crew-${issue._id}`);
                    const crewId = select.value;
                    if (!crewId) {
                      alert("Please select a crew");
                      return;
                    }
                    handleAssign(issue._id, crewId);
                  }}
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedIssue.title}</h2>
            <p><strong>Description:</strong> {selectedIssue.description}</p>
            <p><strong>Category:</strong> {selectedIssue.category}</p>
            <p><strong>Status:</strong> {selectedIssue.status}</p>
            <p><strong>Reported By:</strong> {selectedIssue.reportedBy?.name}</p>
            <p><strong>Location:</strong> Lat: {selectedIssue.location?.lat}, Lng: {selectedIssue.location?.lng}</p>
            {selectedIssue.images && selectedIssue.images.length > 0 && (
              <div>
                <strong>Images:</strong>
                {selectedIssue.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Issue" className="w-full mt-2" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}