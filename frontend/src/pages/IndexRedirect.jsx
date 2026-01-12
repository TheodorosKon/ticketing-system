import { Navigate } from 'react-router-dom';

export default function IndexRedirect() {
  const token = localStorage.getItem('accessToken');
  return <Navigate to={token ? '/tickets' : '/login'} />;
}
