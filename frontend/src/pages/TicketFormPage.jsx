import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ticketApi } from "../api";
import { emptyTicket } from "../constants/tickets";
import { validateTicket, ticketPayload, fieldErrors } from "../utils/tickets";
import TicketFormFields from "../components/TicketFormFields";
import LoadError from "../components/LoadError";

export default function TicketFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyTicket);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setForm(emptyTicket);
    setLoading(Boolean(id));
    setLoadError("");
    setErrors({});
    setError("");
    if (id)
      ticketApi
        .get(id, { signal: controller.signal })
        .then((data) => {
          if (active) setForm(data);
        })
        .catch((err) => {
          if (active) setLoadError(err.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    return () => {
      active = false;
      controller.abort();
    };
  }, [id, attempt]);
  async function submit(event) {
    event.preventDefault();
    const nextErrors = validateTicket(form, Boolean(id));
    setErrors(nextErrors);
    setError("");
    if (busy) return;
    if (Object.keys(nextErrors).length) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    setBusy(true);
    try {
      await ticketApi.save(id, ticketPayload(form, Boolean(id)));
      navigate("/tickets", {
        state: { message: id ? "Ticket updated." : "Ticket added." },
      });
    } catch (err) {
      setError(err.message);
      setErrors(fieldErrors(err.fields));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <h1>{id ? "Edit Ticket" : "Add Ticket"}</h1>
      {loading ? (
        <p role="status">Loading ticket...</p>
      ) : loadError ? (
        <LoadError
          error={loadError}
          reload={() => setAttempt((value) => value + 1)}
        />
      ) : (
        <form className="panel ticket-form" onSubmit={submit} noValidate>
          <TicketFormFields
            form={form}
            setForm={setForm}
            errors={errors}
            busy={busy}
            editing={Boolean(id)}
          />
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="actions">
            <button disabled={busy}>
              {busy ? "Saving..." : "Save Ticket"}
            </button>
            <Link to={id ? "/tickets/" + id : "/tickets"}>Cancel</Link>
          </div>
        </form>
      )}
      <p>
        <Link to="/tickets">Back to Ticket List</Link>
      </p>
    </>
  );
}
