import React from "react";
import { Link } from "react-router-dom";
import { date } from "../constants/tickets";
import TicketBadge from "./TicketBadge";

export default function TicketTable({ tickets }) {
  return (
    <div className="table-wrap">
      <table>
        <caption className="sr-only">Helpdesk ticket list</caption>
        <thead>
          <tr>
            {[
              "Ticket Number",
              "Requester Name",
              "Subject",
              "Priority",
              "Status",
              "Date Created",
            ].map((label) => (
              <th key={label} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>
                <Link to={`/tickets/${ticket.id}`}>{ticket.ticket_number}</Link>
              </td>
              <td>{ticket.requester_name}</td>
              <td>
                <Link to={`/tickets/${ticket.id}`}>{ticket.subject}</Link>
              </td>
              <td>
                <TicketBadge value={ticket.priority} />
              </td>
              <td>
                <TicketBadge value={ticket.status} />
              </td>
              <td className="date-cell">{date(ticket.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
