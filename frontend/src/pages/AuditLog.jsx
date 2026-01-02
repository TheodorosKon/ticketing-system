import { useEffect, useState } from 'react';

function AuditLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/admin/audit', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(setLogs);
  }, []);

  return (
    <div>
      <h2>Audit Log</h2>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>When</th>
            <th>Action</th>
            <th>Actor</th>
            <th>Target</th>
          </tr>
        </thead>

        <tbody>
          {logs.map(l => (
            <tr key={l.audit_id}>
              <td>{new Date(l.created_at).toLocaleString()}</td>
              <td>{l.action}</td>
              <td>{l.actor || 'System'}</td>
              <td>{l.target || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuditLog;
