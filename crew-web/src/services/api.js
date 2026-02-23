import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth
export const registerCrew = (data) =>
  API.post("/auth/register", { ...data, role: "crew" });

export const loginCrew = (data) =>
  API.post("/auth/login", data);

// Issues
export const getAssignedIssues = () =>
  API.get("/issues/assigned");

export const updateIssueStatus = (id, status) =>
  API.put(`/issues/${id}/status`, { status });