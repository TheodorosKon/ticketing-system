import { Routes, Route } from 'react-router-dom';
import TicketLayout from './pages/TicketLayout';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/tickets/*" element={<TicketLayout />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
