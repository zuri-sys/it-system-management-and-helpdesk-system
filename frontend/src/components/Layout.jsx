import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { logout } = useAuth();
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header>
        <Link to="/tickets">IT Helpdesk System</Link>
        <button className="secondary" onClick={logout}>
          Log Out
        </button>
      </header>
      <main id="main-content" className="container">
        <Outlet />
      </main>
    </>
  );
}
