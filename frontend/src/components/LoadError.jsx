import React from "react";

export default function LoadError({ error, reload }) {
  return (
    <div role="alert">
      <p className="error">{error}</p>
      <button className="secondary" onClick={reload}>
        Try Again
      </button>
    </div>
  );
}
