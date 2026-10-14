import React, { createContext, useContext, useEffect, useState } from "react";
import { request } from "../api";
import { getToken, setToken, onUnauthorized } from "../auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(() => Boolean(getToken()));
  const [authError, setAuthError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(
    () =>
      onUnauthorized(() => {
        setUser(null);
        setAuthError("");
        setChecking(false);
      }),
    [],
  );

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setChecking(false);
      return;
    }
    const controller = new AbortController();
    setChecking(true);
    setAuthError("");
    request("/auth/me", { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted && getToken() === token)
          setUser(data.user);
      })
      .catch((error) => {
        if (controller.signal.aborted || (getToken() && getToken() !== token))
          return;
        if (error.status === 401) {
          setUser(null);
          setToken(null);
        } else setAuthError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false);
      });
    return () => controller.abort();
  }, [attempt]);

  async function login(username, password) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setToken(data.token);
    setUser(data.user);
    setAuthError("");
    setChecking(false);
  }

  async function logout() {
    await request("/auth/logout", { method: "POST" });
    setToken(null);
    setUser(null);
    setAuthError("");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loggedIn: Boolean(user),
        checking,
        authError,
        login,
        logout,
        retryAuth: () => setAttempt((value) => value + 1),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
