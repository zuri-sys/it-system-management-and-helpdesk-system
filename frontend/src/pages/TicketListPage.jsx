import React from "react";
import { Link, useLocation } from "react-router-dom";
import useApi from "../hooks/useApi";
import LoadError from "../components/LoadError";
import TicketTable from "../components/TicketTable";

export default function TicketListPage() {
  const { data: tickets, error, reload } = useApi("/tickets");
  const location = useLocation();
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Helpdesk Tickets</h1>
          <p>View requests and keep track of their progress.</p>
        </div>
        {tickets && (
          <span className="ticket-count">
            {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}
          </span>
        )}
      </div>
      {location.state?.message && (
        <p role="status" className="success">
          {location.state.message}
        </p>
      )}
      {error ? (
        <LoadError error={error} reload={reload} />
      ) : !tickets ? (
        <p role="status">Loading tickets...</p>
      ) : !tickets.length ? (
        <section className="panel empty-state">
          <h2>No tickets yet</h2>
          <p>Add your first ticket to start tracking a request.</p>
          <Link className="button-link" to="/tickets/new">
            Add Ticket
          </Link>
        </section>
      ) : (
        <TicketTable tickets={tickets} />
      )}
      <Link className="fab" to="/tickets/new" aria-label="Add Ticket">
        +
      </Link>
    </>
  );
}
