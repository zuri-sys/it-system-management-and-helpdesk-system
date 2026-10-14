import { useEffect, useState } from "react";
import { request } from "../api";

export default function useApi(path) {
  const [result, setResult] = useState({ path: null, data: null, error: "" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setResult({ path, data: null, error: "" });
    request(path, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setResult({ path, data, error: "" });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setResult({ path, data: null, error: error.message });
      });
    return () => controller.abort();
  }, [path, attempt]);
  return {
    data: result.path === path ? result.data : null,
    error: result.path === path ? result.error : "",
    reload: () => setAttempt((value) => value + 1),
  };
}
