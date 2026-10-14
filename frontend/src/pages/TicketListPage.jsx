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
      <h1>Helpdesk Tickets</h1>
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
        <p>No tickets yet. Add a ticket to get started.</p>
      ) : (
        <TicketTable tickets={tickets} />
      )}
      <Link className="fab" to="/tickets/new" aria-label="Add Ticket">
        +
      </Link>
    </>
  );
}
