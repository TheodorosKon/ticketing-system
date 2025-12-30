import { Routes, Route } from 'react-router-dom';
import TicketList from '../components/TicketList';
import TicketDetails from '../components/TicketDetails';

function TicketLayout() {
  return (
    <div className="container">
      <div className="left">
        <TicketList />
      </div>
      <div className="right">
        <Routes>
          <Route path=":id" element={<TicketDetails />} />
          <Route path="*" element={<p>Select a ticket</p>} />
        </Routes>
      </div>
    </div>
  );
}

export default TicketLayout;
