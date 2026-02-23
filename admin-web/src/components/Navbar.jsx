import { useNavigate } from "react-router-dom";

export default function Navbar({ setActivePage, activePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${activePage === "allissues" ? "bg-blue-800" : "hover:bg-blue-700"}`}
          onClick={() => setActivePage("allissues")}
        >
          All Issues
        </button>
        <button
          className={`px-4 py-2 rounded ${activePage === "analytics" ? "bg-blue-800" : "hover:bg-blue-700"}`}
          onClick={() => setActivePage("analytics")}
        >
          Analytics
        </button>
        <button
          className={`px-4 py-2 rounded ${activePage === "crew" ? "bg-blue-800" : "hover:bg-blue-700"}`}
          onClick={() => setActivePage("crew")}
        >
          Crew Management
        </button>
        <button
          className="px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}