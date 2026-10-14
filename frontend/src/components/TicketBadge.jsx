import React from "react";

const tones = {
  Open: "blue",
  "In Progress": "amber",
  Resolved: "green",
  Closed: "neutral",
  Low: "neutral",
  Medium: "blue",
  High: "amber",
  Urgent: "red",
};

export default function TicketBadge({ value }) {
  return (
    <span className={`badge badge-${tones[value] || "neutral"}`}>{value}</span>
  );
}
