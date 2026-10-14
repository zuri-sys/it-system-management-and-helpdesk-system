import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { getToken, setToken, onUnauthorized } from "../src/auth.js";
import { request } from "../src/api.js";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
  setToken(null);
});

test("authenticated requests include the bearer token", async () => {
  setToken("test-token");
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers.Authorization, "Bearer test-token");
    return new Response(JSON.stringify([]));
  };
  assert.deepEqual(await request("/tickets"), []);
});

test("an expired token clears the session and notifies the app", async () => {
  setToken("expired-token");
  let notified = false;
  const unsubscribe = onUnauthorized(() => {
    notified = true;
  });
  try {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ message: "Unauthenticated." }), {
        status: 401,
      });
    await assert.rejects(request("/tickets"), (error) => error.status === 401);
    assert.equal(getToken(), null);
    assert.equal(notified, true);
  } finally {
    unsubscribe();
  }
});

test("a stale unauthorized response cannot clear a newly logged in session", async () => {
  setToken("old-token");
  globalThis.fetch = async () => {
    setToken("new-token");
    return new Response(JSON.stringify({ message: "Unauthenticated." }), {
      status: 401,
    });
  };
  await assert.rejects(request("/tickets"), (error) => error.status === 401);
  assert.equal(getToken(), "new-token");
});

test("wrong login credentials do not expire an existing session", async () => {
  setToken("existing-token");
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ message: "Incorrect username or password." }),
      { status: 422 },
    );
  await assert.rejects(request("/auth/login", { method: "POST" }));
  assert.equal(getToken(), "existing-token");
});
