import { Routes, Route } from 'react-router-dom';
import TicketLayout from './pages/TicketLayout';
import Login from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import AuditLog from './pages/AuditLog';

function App() {
  return (
    <Routes>
      <Route path="/tickets/*" element={<TicketLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/audit" element={<AuditLog />} />
    </Routes>
  );
}

export default App;
