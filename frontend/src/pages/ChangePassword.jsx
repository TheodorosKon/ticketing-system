import { useState } from 'react';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    const res = await fetch('http://localhost:3000/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    window.location.href = '/tickets';
  };

  return (
    <div>
      <h2>Change Password</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="password"
        placeholder="Current password"
        onChange={e => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New password"
        onChange={e => setNewPassword(e.target.value)}
      />

      <button onClick={submit}>Update Password</button>
    </div>
  );
}

export default ChangePassword;
