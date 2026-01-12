const API_BASE = 'http://localhost:3000';

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!res.ok) {
    localStorage.clear();
    window.location.href = '/login';
    return null;
  }

  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('userRole', data.roleName);
  return data.accessToken;
};

export const apiFetch = async (endpoint, options = {}) => {
  let res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) return res;

    res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`
      }
    });
  }

  return res;
};

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

export const getToken = () => localStorage.getItem('accessToken');
export const getRole = () => localStorage.getItem('role');
