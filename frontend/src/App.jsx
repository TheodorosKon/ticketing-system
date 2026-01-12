import { Routes, Route } from 'react-router-dom';
import TicketLayout from './pages/TicketLayout';
import Login from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import AuditLog from './pages/AuditLog';
import ChangePassword from './pages/ChangePassword';
import MainLayout from './pages/MainLayout';
import AuthGuard from './components/AuthGuard';
import IndexRedirect from './pages/IndexRedirect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexRedirect />} />

      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />

      <Route
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route path="/tickets/*" element={<TicketLayout />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/audit" element={<AuditLog />} />
      </Route>
    </Routes>
  );
}

export default App;
