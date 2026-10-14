import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadError from "./LoadError";

export default function ProtectedRoute() {
  const { loggedIn, checking, authError, retryAuth } = useAuth();
  if (checking)
    return (
      <main className="container">
        <p role="status">Checking your session...</p>
      </main>
    );
  if (authError)
    return (
      <main className="container">
        <LoadError error={authError} reload={retryAuth} />
      </main>
    );
  return loggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
