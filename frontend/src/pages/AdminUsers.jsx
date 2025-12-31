import { useState } from 'react';

function AdminUsers() {
  const [form, setForm] = useState({});

  const submit = async () => {
    const res = await fetch('http://localhost:3000/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(form)
    });

    if (!res.ok) alert('Failed to create user');
    else alert('User created');
  };

  return (
    <div>
      <h2>Create User</h2>

      <input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input placeholder="First name" onChange={e => setForm({...form, first_name: e.target.value})} />
      <input placeholder="Last name" onChange={e => setForm({...form, last_name: e.target.value})} />
      <input placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} />
      <input placeholder="Role ID" onChange={e => setForm({...form, role_id: e.target.value})} />

      <button onClick={submit}>Create User</button>
    </div>
  );
}

export default AdminUsers;
