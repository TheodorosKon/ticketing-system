import { useEffect, useState } from 'react';
import { getTickets, getTicketById } from './services/api';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getTickets().then(data => {
      setTickets(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    setFiltered(
      tickets.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, tickets]);

  const selectTicket = async (id) => {
    const ticket = await getTicketById(id);
    setSelectedTicket(ticket);
  };

  return (
    <div className="container">

      {/* LEFT COLUMN */}
      <div className="left">
        <input
          className="search"
          placeholder="Search tickets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {filtered.map(ticket => (
          <div
            key={ticket.ticket_id}
            className="ticket-item"
            onClick={() => selectTicket(ticket.ticket_id)}
          >
            <strong>{ticket.title}</strong><br />
            <small>ID: {ticket.ticket_id}</small>
          </div>
        ))}
      </div>

      {/* RIGHT COLUMN */}
      <div className="right">
        {selectedTicket ? (
          <>
            <h2>{selectedTicket.title}</h2>
            <p><b>Status:</b> {selectedTicket.status}</p>
            <p><b>Priority:</b> {selectedTicket.priority}</p>
            <p><b>Description:</b></p>
            <p>{selectedTicket.description}</p>

            <hr />

            <p><b>Device:</b></p>
            <p>{selectedTicket.device_manufacturer} {selectedTicket.device_model}</p>
            <p>Serial: {selectedTicket.device_serial_number}</p>
          </>
        ) : (
          <p>Select a ticket to view details</p>
        )}
      </div>

    </div>
  );
}

export default App;
