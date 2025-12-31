const API_BASE = 'http://localhost:3000';

export const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getTickets = async () => {
  const res = await fetch(`${API_BASE}/tickets`, {
    headers: authHeader()
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  return res.json();
};

export const getTicketById = async () => {
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    headers: authHeader()
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  return res.json();
};