const API_BASE = 'http://localhost:3000';

export async function getTickets() {
  const res = await fetch(`${API_BASE}/tickets`);
  return res.json();
}

export async function getTicketById(id) {
  const res = await fetch(`${API_BASE}/tickets/${id}`);
  return res.json();
}
