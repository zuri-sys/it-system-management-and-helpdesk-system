import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  validateTicket,
  ticketPayload,
  fieldErrors,
} from "../src/utils/tickets.js";
import { request, ticketApi } from "../src/api.js";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
const valid = {
  requester_name: " Test User ",
  requester_email: " test@example.com ",
  category: "Network",
  priority: "High",
  subject: " Connection issue ",
  description: " Cannot connect ",
  status: "Open",
};

test("ticket validation trims values and omits status when creating", () => {
  assert.deepEqual(validateTicket(valid), {});
  assert.equal(ticketPayload(valid).requester_name, "Test User");
  assert.equal("status" in ticketPayload(valid), false);
  assert.equal(ticketPayload(valid, true).status, "Open");
});

test("ticket validation rejects empty, invalid and oversized fields", () => {
  const errors = validateTicket(
    {
      ...valid,
      requester_name: " ",
      requester_email: "invalid",
      category: "Unknown",
      subject: "a".repeat(256),
      description: "a".repeat(10001),
      status: "",
    },
    true,
  );
  for (const key of [
    "requester_name",
    "requester_email",
    "category",
    "subject",
    "description",
    "status",
  ])
    assert.ok(errors[key]);
});

test("API validation errors retain field messages", async () => {
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        message: "Invalid data",
        errors: { subject: ["Subject is required."] },
      }),
      { status: 422 },
    );
  await assert.rejects(request("/tickets"), (error) => {
    assert.equal(error.message, "Invalid data");
    assert.deepEqual(fieldErrors(error.fields), {
      subject: "Subject is required.",
    });
    return true;
  });
});

test("API rejects HTML responses and connection failures", async () => {
  globalThis.fetch = async () => new Response("<html>Wrong server</html>");
  await assert.rejects(request("/tickets"), /invalid response/);
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };
  await assert.rejects(request("/tickets"), /Cannot connect/);
});

test("delete accepts an empty response and uses the correct endpoint", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/tickets/12");
    assert.equal(options.method, "DELETE");
    return new Response(null, { status: 204 });
  };
  assert.equal(await ticketApi.remove(12), null);
});
