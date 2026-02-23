import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCrew } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerCrew(form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded w-96">
        <h2 className="text-2xl mb-6">Crew Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-4 bg-gray-800 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 bg-gray-800 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-gray-800 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-green-600 p-2 rounded">
          Register
        </button>

        <p className="mt-4 text-sm">
          Already have account? <Link to="/login" className="text-blue-400">Login</Link>
        </p>
      </form>
    </div>
  );
}