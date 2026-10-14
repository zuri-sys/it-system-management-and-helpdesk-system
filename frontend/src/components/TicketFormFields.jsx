import React from "react";
import { labels, choices } from "../constants/tickets";

export default function TicketFormFields({
  form,
  setForm,
  errors,
  busy,
  editing,
}) {
  return (
    <>
      {Object.entries(labels)
        .filter(([key]) => editing || key !== "status")
        .map(([key, label]) => (
          <label key={key} htmlFor={key}>
            {label}
            {choices[key] ? (
              <select
                id={key}
                value={form[key]}
                disabled={busy}
                required
                onChange={(event) =>
                  setForm({ ...form, [key]: event.target.value })
                }
                aria-invalid={Boolean(errors[key])}
                aria-describedby={errors[key] ? key + "-error" : undefined}
              >
                <option value="">Select {label}</option>
                {choices[key].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            ) : key === "description" ? (
              <textarea
                id={key}
                rows="5"
                value={form[key]}
                required
                disabled={busy}
                aria-invalid={Boolean(errors[key])}
                aria-describedby={errors[key] ? key + "-error" : undefined}
                onChange={(event) =>
                  setForm({ ...form, [key]: event.target.value })
                }
              />
            ) : (
              <input
                id={key}
                type={key === "requester_email" ? "email" : "text"}
                value={form[key]}
                required
                disabled={busy}
                aria-invalid={Boolean(errors[key])}
                aria-describedby={errors[key] ? key + "-error" : undefined}
                onChange={(event) =>
                  setForm({ ...form, [key]: event.target.value })
                }
              />
            )}
            {errors[key] && (
              <span id={key + "-error"} className="error">
                {errors[key]}
              </span>
            )}
          </label>
        ))}
    </>
  );
}
