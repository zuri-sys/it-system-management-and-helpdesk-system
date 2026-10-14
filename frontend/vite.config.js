import { defineConfig } from "vite";
export default defineConfig(({ command }) => {
  if (command === "build" && process.env.VERCEL === "1") {
    let apiUrl;
    try {
      apiUrl = new URL(process.env.VITE_API_URL || "");
    } catch {
      throw new Error(
        "Set VITE_API_URL in Vercel to your Render HTTPS URL ending in /api.",
      );
    }
    if (
      apiUrl.protocol !== "https:" ||
      apiUrl.pathname.replace(/\/$/, "") !== "/api" ||
      apiUrl.search ||
      apiUrl.hash ||
      apiUrl.username ||
      apiUrl.password
    ) {
      throw new Error(
        "VITE_API_URL must be an HTTPS backend URL ending in /api.",
      );
    }
  }

  return { server: { proxy: { "/api": "http://127.0.0.1:8018" } } };
});
