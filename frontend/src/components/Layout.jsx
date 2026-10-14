import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function handleLogout() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await logout();
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header>
        <Link className="brand" to="/tickets">
          <span>
            IT Helpdesk<small>Ticket management</small>
          </span>
        </Link>
        <div>
          <button className="secondary" onClick={handleLogout} disabled={busy}>
            {busy ? "Logging Out..." : "Log Out"}
          </button>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </div>
      </header>
      <main id="main-content" className="container">
        <Outlet />
      </main>
    </>
  );
}
