import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, setIsLoggedIn }) => {
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Pass setIsLoggedIn down to children
  if (React.isValidElement(children)) {
    return React.cloneElement(children, { setIsLoggedIn });
  }

  return children;
};

export default ProtectedRoute;