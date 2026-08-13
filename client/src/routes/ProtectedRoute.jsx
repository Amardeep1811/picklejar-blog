import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}