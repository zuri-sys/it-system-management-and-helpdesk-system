const storageKey = "helpdesk.token";
let token = null;
try {
  token = sessionStorage.getItem(storageKey);
} catch {
  /* Storage may be unavailable. */
}
const listeners = new Set();

export function getToken() {
  return token;
}

export function setToken(value) {
  token = value;
  try {
    if (value) sessionStorage.setItem(storageKey, value);
    else sessionStorage.removeItem(storageKey);
    sessionStorage.removeItem("helpdesk.login");
  } catch {
    /* Keep the current session in memory. */
  }
}

export function onUnauthorized(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function expireSession(requestToken) {
  if (!requestToken || requestToken !== token) return;
  setToken(null);
  listeners.forEach((listener) => listener());
}
