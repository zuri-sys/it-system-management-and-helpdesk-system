import { getToken, expireSession } from "./auth.js";

const baseUrl = (import.meta.env?.VITE_API_URL || "/api").replace(/\/$/, "");

export async function request(path, options = {}) {
  const token = getToken();
  let response;
  try {
    response = await fetch(baseUrl + path, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    if (options.signal?.aborted)
      throw new DOMException("Request cancelled", "AbortError");
    throw new Error("Cannot connect to the server. Please try again.");
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401) expireSession(token);
    const error = new Error(
      data?.message || "The request failed. Please try again.",
    );
    error.fields = data?.errors || {};
    error.status = response.status;
    throw error;
  }
  if (data === null)
    throw new Error(
      "The server returned an invalid response. Please try again.",
    );
  return data;
}

export const ticketApi = {
  get: (id, options) => request("/tickets/" + encodeURIComponent(id), options),
  save: (id, data) =>
    request("/tickets" + (id ? "/" + encodeURIComponent(id) : ""), {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(data),
    }),
  remove: (id) =>
    request("/tickets/" + encodeURIComponent(id), { method: "DELETE" }),
};
