import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ticketApi } from "../api";
import useApi from "../hooks/useApi";
import LoadError from "../components/LoadError";
import { labels, date } from "../constants/tickets";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const { data: ticket, error, reload } = useApi("/tickets/" + id);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();
  async function remove() {
    setBusy(true);
    setDeleteError("");
    try {
      await ticketApi.remove(id);
      navigate("/tickets", { state: { message: "Ticket deleted." } });
    } catch (err) {
      setDeleteError(err.message);
      setBusy(false);
    }
  }
  return (
    <>
      <h1>Ticket Details</h1>
      {error ? (
        <LoadError error={error} reload={reload} />
      ) : !ticket ? (
        <p role="status">Loading ticket...</p>
      ) : (
        <section className="panel">
          <h2>{ticket.ticket_number}</h2>
          <dl>
            {Object.entries(labels).map(([key, label]) => (
              <React.Fragment key={key}>
                <dt>{label}</dt>
                <dd>{ticket[key]}</dd>
              </React.Fragment>
            ))}
            <dt>Date Created</dt>
            <dd>{date(ticket.created_at)}</dd>
          </dl>
          <div className="actions">
            <Link to={`/tickets/${id}/edit`}>Edit Ticket</Link>
            <button
              className="danger"
              onClick={() => setConfirming(true)}
              disabled={busy}
            >
              Delete Ticket
            </button>
          </div>
          {confirming && (
            <div className="confirmation">
              <p>Delete this ticket? This cannot be undone.</p>
              <div className="actions">
                <button className="danger" disabled={busy} onClick={remove}>
                  {busy ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  className="secondary"
                  disabled={busy}
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {deleteError && (
            <p className="error" role="alert">
              {deleteError}
            </p>
          )}
        </section>
      )}
      <p>
        <Link to="/tickets">Back to Ticket List</Link>
      </p>
    </>
  );
}
