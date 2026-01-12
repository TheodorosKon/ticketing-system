import { Link, Outlet } from 'react-router-dom';

function MainLayout() {
  const role = localStorage.getItem('userRole');
  return (
    <>
      <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
        <Link to="/tickets">Tickets</Link> |{' '}
        <Link to="/tickets/create">Create Ticket</Link>

        {role === 'Admin' && (
          <>
            {' '}| <Link to="/admin/users">Users</Link>
            {' '}| <Link to="/admin/audit">Audit</Link>
          </>
        )}
      </nav>

      <div style={{ padding: 20 }}>
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
