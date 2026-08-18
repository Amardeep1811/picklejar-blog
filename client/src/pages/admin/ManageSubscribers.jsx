import { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManageSubscribers() {
  const { user: currentUser } = useContext(AuthContext);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/subscribers');
      if (res.data.success) {
        setSubscribers(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load subscribers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this subscriber?")) {
      return;
    }
    try {
      const res = await axios.delete(`/subscribers/${id}`);
      if (res.data.success) {
        fetchSubscribers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subscriber');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-6 text-[var(--ink)] max-w-5xl mx-auto text-center mt-20">
        <h2 className="text-2xl font-bold text-[var(--red)] mb-2 font-heading">Access Restricted</h2>
        <p className="text-[var(--gray)]">This page is restricted to administrators only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-[var(--ink)] max-w-5xl mx-auto py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-heading text-[var(--ink)]">Manage Subscribers</h1>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-[var(--line)] shadow-sm">
        <table className="w-full text-left text-sm text-[var(--ink)]">
          <thead className="text-xs text-[var(--ink)] uppercase bg-[var(--bg-2)] border-b border-[var(--line)] font-bold">
            <tr>
              <th className="px-6 py-4 font-heading">Email</th>
              <th className="px-6 py-4 font-heading">Subscribed On</th>
              <th className="px-6 py-4 font-heading text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map(s => (
              <tr key={s._id} className="border-b border-[var(--line)] hover:bg-[var(--bg-2)]/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-[var(--ink)]">
                  {s.email}
                </td>
                <td className="px-6 py-4 text-[var(--ink)] font-medium">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button 
                    onClick={() => handleDelete(s._id)}
                    className="text-[var(--red)] opacity-80 hover:opacity-100 text-sm font-bold transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <div className="p-12 text-center text-[var(--gray)] font-medium">
            No subscribers found.
          </div>
        )}
      </div>
    </div>
  );
}
