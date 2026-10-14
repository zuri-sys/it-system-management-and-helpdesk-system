import { choices, labels } from "../constants/tickets.js";

export function ticketPayload(form, editing = false) {
  return Object.fromEntries(
    Object.keys(labels)
      .filter((key) => editing || key !== "status")
      .map((key) => [key, String(form[key] ?? "").trim()]),
  );
}

export function validateTicket(form, editing = false) {
  const values = ticketPayload(form, editing);
  const errors = {};
  for (const [key, value] of Object.entries(values)) {
    if (!value) errors[key] = labels[key] + " is required.";
    else if (choices[key] && !choices[key].includes(value))
      errors[key] = "Select a valid " + labels[key].toLowerCase() + ".";
    else if (
      ["requester_name", "requester_email", "subject"].includes(key) &&
      value.length > 255
    )
      errors[key] = "Use 255 characters or fewer.";
  }
  if (
    values.requester_email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.requester_email)
  )
    errors.requester_email = "Enter a valid email address.";
  if (values.description.length > 10000)
    errors.description = "Use 10,000 characters or fewer.";
  return errors;
}

export function fieldErrors(fields = {}) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, messages]) => [
      key,
      Array.isArray(messages) ? messages[0] : messages,
    ]),
  );
}
