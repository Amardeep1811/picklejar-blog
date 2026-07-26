import { useContext } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, isLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/admin/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
            WalletPickle Admin
          </Link>
          <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
            {user.role === 'admin' ? 'Administrator' : 'Editor'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">{user.email}</span>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}