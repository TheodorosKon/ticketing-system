import { useState } from 'react';
import { authFetch } from '../services/authFetch';

function CreateTicket() {
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  const submit = async () => {
    const res = await authFetch('http://localhost:3000/tickets', {
      method: 'POST',
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      setMessage('Failed to create ticket');
      return;
    }

    setMessage('Ticket created successfully');
    setForm({});
  };

  return (
    <div>
      <h2>Create Ticket</h2>

      <input placeholder="Title"
        onChange={e => setForm({ ...form, title: e.target.value })} />

      <textarea placeholder="Description"
        onChange={e => setForm({ ...form, description: e.target.value })} />

      <input placeholder="Device manufacturer"
        onChange={e => setForm({ ...form, device_manufacturer: e.target.value })} />

      <input placeholder="Device model"
        onChange={e => setForm({ ...form, device_model: e.target.value })} />

      <input placeholder="Serial number"
        onChange={e => setForm({ ...form, device_serial_number: e.target.value })} />

      <input placeholder="OS"
        onChange={e => setForm({ ...form, device_os: e.target.value })} />

      <button onClick={submit}>Create</button>

      <p>{message}</p>
    </div>
  );
}

export default CreateTicket;
