import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { loggedIn, login } = useAuth();
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      data.get("username") === "itadmin" &&
      data.get("password") === "helpdesk123"
    )
      login();
    else setError("Incorrect username or password.");
  }
  if (loggedIn) return <Navigate to="/tickets" replace />;
  return (
    <main className="login">
      <section className="panel">
        <h1>IT Helpdesk System</h1>
        <p>Log in to manage tickets.</p>
        <form onSubmit={submit} noValidate>
          <label>
            Username
            <input
              name="username"
              autoComplete="username"
              required
              aria-describedby={error ? "login-error" : undefined}
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              aria-describedby={error ? "login-error" : undefined}
            />
          </label>
          {error && (
            <p id="login-error" className="error" role="alert">
              {error}
            </p>
          )}
          <button type="submit">Log In</button>
        </form>
      </section>
    </main>
  );
}
