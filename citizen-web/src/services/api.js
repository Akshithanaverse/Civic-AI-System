import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // match your backend port
});

// Login function
export const loginUser = async (email, password) => {
  return API.post("/auth/login", { email, password });
};

// Register function
export const registerUser = async (name, email, password) => {
  return API.post("/auth/register", { name, email, password });
};

// Submit Issue function
export const submitIssue = async (issueData, token) => {
  return API.post("/issues", issueData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyReports = () => {
  const token = localStorage.getItem("token");

  return axios.get("http://localhost:5000/api/issues/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};