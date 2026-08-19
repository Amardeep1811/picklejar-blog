import { Outlet, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]" style={{ fontFamily: 'var(--font-ui)' }}>
      {/* Top Bar */}
      <header className="bg-[var(--bg-2)] border-b border-[var(--line)] py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard" className="text-2xl font-bold hover:opacity-80 transition-opacity" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="text-[var(--ink)]">Wallet</span>
            <span className="text-[var(--green)]">Pickle</span>
          </Link>
          <span className="px-2 py-1 bg-[var(--green)] text-white text-xs font-bold rounded">
            {user?.role === 'editor' ? 'Editor' : 'Administrator'}
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-[var(--gray)]">
            {user?.email}
          </span>
          <button
            onClick={logout}
            className="bg-[var(--red)] text-white px-4 py-2 rounded font-bold hover:opacity-90 transition-opacity text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
