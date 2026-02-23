import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96 text-center">
        <h1 className="text-3xl font-bold mb-6">Admin Portal</h1>
        <p className="mb-6">Welcome to the Smart City Admin Dashboard</p>
        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white p-3 rounded hover:bg-green-700"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}