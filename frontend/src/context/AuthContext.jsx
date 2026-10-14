import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const storageKey = "helpdesk.login";

function readLogin() {
  try {
    return sessionStorage.getItem(storageKey) === "true";
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(readLogin);
  function updateLogin(value) {
    try {
      if (value) sessionStorage.setItem(storageKey, "true");
      else sessionStorage.removeItem(storageKey);
    } catch {
      /* Login still works when browser storage is unavailable. */
    }
    setLoggedIn(value);
  }
  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        login: () => updateLogin(true),
        logout: () => updateLogin(false),
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
