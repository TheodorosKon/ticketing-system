import { Routes, Route } from 'react-router-dom';
import TicketLayout from './pages/TicketLayout';
import Login from './pages/Login';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <Routes>
      <Route path="/tickets/*" element={<TicketLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/users" element={<AdminUsers />} />
    </Routes>
  );
}

export default App;
