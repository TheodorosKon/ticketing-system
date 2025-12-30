import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../services/api';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTickets().then(setTickets);
  }, []);

  return (
    <>
      {tickets.map(t => (
        <div
          key={t.ticket_id}
          className="ticket-item"
          onClick={() => navigate(`/tickets/${t.ticket_id}`)}
        >
          <strong>{t.title}</strong><br />
          <small>Status: {t.status} | Priority: {t.priority}</small><br />
          <small>ID: {t.ticket_id}</small>
        </div>
      ))}
    </>
  );
}

export default TicketList;
