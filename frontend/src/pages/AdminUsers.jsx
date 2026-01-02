import { useEffect, useState } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({});
  const myUserId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).user_id;

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };

  const loadUsers = async () => {
    const res = await fetch('http://localhost:3000/admin/users', { headers: authHeader });
    setUsers(await res.json());
  };

  const loadRoles = async () => {
    const res = await fetch('http://localhost:3000/roles', { headers: authHeader });
    setRoles(await res.json());
  };

  const createUser = async () => {
    await fetch('http://localhost:3000/admin/users', {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify(form)
    });
    setForm({});
    loadUsers();
  };

  const toggleUser = async (id, is_active) => {
    await fetch(`http://localhost:3000/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: authHeader,
      body: JSON.stringify({ is_active })
    });
    loadUsers();
  };

  const changeRole = async (id, role_id) => {
    await fetch(`http://localhost:3000/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: authHeader,
      body: JSON.stringify({ role_id })
    });
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  return (
    <div>
      <h2>Create User</h2>

      <input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input placeholder="First name" onChange={e => setForm({...form, first_name: e.target.value})} />
      <input placeholder="Last name" onChange={e => setForm({...form, last_name: e.target.value})} />
      <input placeholder="Phone" onChange={e => setForm({...form, phone_main: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />

      <select onChange={e => setForm({...form, role_id: e.target.value})}>
        <option>Select role</option>
        {roles.map(r => (
          <option key={r.role_id} value={r.role_id} title={r.description}>
            {r.role_name}
          </option>
        ))}
      </select>

      <button onClick={createUser}>Create User</button>

      <hr />

      <h2>User Management</h2>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => {
            const isSelf = u.user_id === myUserId;

            return (
              <tr key={u.user_id} style={isSelf ? { opacity: 0.5 } : {}}>
                <td>{u.first_name} {u.last_name}</td>
                <td>{u.email}</td>

                <td>
                  <select
                    value={u.role_id}
                    disabled={isSelf}
                    onChange={e => changeRole(u.user_id, e.target.value)}
                  >
                    {roles.map(r => (
                      <option key={r.role_id} value={r.role_id} title={r.description}>
                        {r.role_name}
                      </option>
                    ))}
                  </select>
                </td>

                <td>{u.is_active ? 'Active' : 'Disabled'}</td>

                <td>
                  <button
                    disabled={isSelf}
                    onClick={() => toggleUser(u.user_id, u.is_active ? 0 : 1)}
                  >
                    {u.is_active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
