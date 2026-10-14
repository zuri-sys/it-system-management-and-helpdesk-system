import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { loggedIn, login, checking } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setError("");
    setBusy(true);
    try {
      await login(
        String(data.get("username")).trim(),
        String(data.get("password")),
      );
    } catch (error) {
      setError(
        error.fields?.username?.[0] ||
          error.fields?.password?.[0] ||
          (error.status === 429
            ? "Too many login attempts. Please wait one minute."
            : error.message),
      );
    } finally {
      setBusy(false);
    }
  }
  if (checking)
    return (
      <main className="login">
        <p role="status">Checking your session...</p>
      </main>
    );
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
              disabled={busy}
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
              disabled={busy}
              aria-describedby={error ? "login-error" : undefined}
            />
          </label>
          {error && (
            <p id="login-error" className="error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy}>
            {busy ? "Logging In..." : "Log In"}
          </button>
        </form>
      </section>
    </main>
  );
}
