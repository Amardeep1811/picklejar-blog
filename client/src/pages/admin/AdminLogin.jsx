import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)] font-ui">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--bg-2)] border-r border-[var(--line)] flex-col items-center justify-center p-12">
        <div className="w-full max-w-md">
          {/* Placeholder for real image asset */}
          <img src="https://via.placeholder.com/800x600.png?text=WalletPickle+Brand+Image" alt="WalletPickle Brand" className="w-full h-auto object-contain rounded-lg shadow-sm" />
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center lg:hidden mb-8">
            <img src="https://via.placeholder.com/400x200.png?text=Brand" alt="WalletPickle" className="mx-auto h-16 w-auto object-contain" />
          </div>

          <h1 className="text-3xl font-bold text-center mb-8 font-heading text-[var(--ink)]">
            Login to WalletPickle
          </h1>
          
          {error && (
            <div className="bg-[var(--bg-2)] border border-[var(--red)] text-[var(--red)] px-4 py-3 rounded mb-6 text-center text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-xl shadow-sm border border-[var(--line)]">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[var(--ink-2)]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[var(--line)] rounded-lg px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-[var(--ink-2)]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[var(--line)] rounded-lg px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                placeholder="••••••••"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => navigate('/admin/forgot-password')}
                  className="text-xs text-[var(--gray)] hover:text-[var(--green)] transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all transform hover:scale-[1.02] hover:shadow-md ${
                loading ? 'bg-[var(--gray-2)] cursor-not-allowed' : 'bg-[var(--green)] hover:bg-[var(--green-dark)]'
              }`}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}