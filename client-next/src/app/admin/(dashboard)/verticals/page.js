"use client";
import { useState, useEffect, useContext } from 'react';
import axios from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ManageVerticals() {
  const { user: currentUser } = useContext(AuthContext);
  const [verticals, setVerticals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    active: true,
    featured: false,
    featuredOrder: 1
  });

  useEffect(() => {
    fetchVerticals();
  }, []);

  const fetchVerticals = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/verticals');
      if (res.data.success) {
        setVerticals(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load verticals');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (vertical) => {
    setIsEditing(true);
    setEditingId(vertical._id);
    setFormData({ 
      name: vertical.name, 
      active: vertical.active, 
      featured: vertical.featured || false,
      featuredOrder: vertical.featuredOrder || 1
    });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', active: true, featured: false, featuredOrder: 1 });
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vertical? Posts in this vertical will not be deleted, but will no longer have a valid category.")) {
      return;
    }
    try {
      setError('');
      const res = await axios.delete(`/verticals/${id}`);
      if (res.data.success) {
        fetchVerticals();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete vertical');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.featured) {
      const otherFeatured = verticals.filter(v => v.featured && v._id !== editingId);
      if (otherFeatured.length >= 4) {
        setError('Only 4 verticals can be featured at once — unfeature one first');
        return;
      }
    }

    try {
      if (editingId) {
        const res = await axios.put(`/verticals/${editingId}`, formData);
        if (res.data.success) {
          handleCancel();
          fetchVerticals();
        }
      } else {
        const res = await axios.post('/verticals', formData);
        if (res.data.success) {
          handleCancel();
          fetchVerticals();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vertical');
    }
  };

  if (loading && verticals.length === 0) return <LoadingSpinner />;

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-6 text-[var(--ink)] max-w-5xl mx-auto text-center mt-20">
        <h2 className="text-2xl font-bold text-[var(--red)] mb-2 font-heading">Access Restricted</h2>
        <p className="text-[var(--gray)]">This page is restricted to administrators only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-[var(--ink)] max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold font-heading text-[var(--ink)]">Manage Verticals</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-[var(--green)] px-5 py-2.5 rounded-lg text-white font-bold hover:bg-[var(--green-dark)] hover:-translate-y-0.5 transition-all shadow-sm"
          >
            Create New Vertical
          </button>
        )}
      </div>

      {error && (
        <div className="bg-[var(--red)]/10 border border-[var(--red)] text-[var(--red)] px-4 py-3 rounded-lg mb-6 font-medium">
          {error}
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-[var(--line)] mb-8">
          <h2 className="text-2xl font-bold mb-6 text-[var(--ink)] font-heading">{editingId ? 'Edit Vertical' : 'Create Vertical'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Name</label>
              <input 
                type="text" 
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Technology"
              />
            </div>
            <div className="flex flex-wrap items-center mt-4 md:mt-8 gap-6">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[var(--green)] bg-white border-[var(--line)] rounded focus:ring-[var(--green)] accent-[var(--green)]"
                  checked={formData.active}
                  onChange={e => setFormData({...formData, active: e.target.checked})}
                />
                <span className="ml-2 text-sm font-semibold text-[var(--ink-2)]">Active (Visible on site)</span>
              </label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-[var(--gold)] bg-white border-[var(--line)] rounded focus:ring-[var(--gold)] accent-[var(--gold)]"
                    checked={formData.featured}
                    onChange={e => setFormData({...formData, featured: e.target.checked})}
                  />
                  <span className="ml-2 text-sm font-semibold text-[var(--ink-2)]">Featured</span>
                </label>
                {formData.featured && (
                  <div className="flex items-center space-x-1.5 ml-2 bg-[var(--bg-2)] px-3 py-1 rounded-lg border border-[var(--line)]">
                    <span className="text-xs text-[var(--ink-2)] font-semibold">Priority:</span>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      className="w-14 bg-white border border-[var(--line)] rounded-md px-2 py-0.5 text-center text-sm font-bold text-[var(--gold)] focus:outline-none focus:border-[var(--gold)]"
                      value={formData.featuredOrder}
                      onChange={e => setFormData({...formData, featuredOrder: Math.min(3, Math.max(1, parseInt(e.target.value) || 1))})}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4 border-t border-[var(--line)] mt-8">
            <button type="submit" className="bg-[var(--green)] px-6 py-2.5 rounded-lg text-white font-bold hover:bg-[var(--green-dark)] hover:-translate-y-0.5 transition-all shadow-sm">
              {editingId ? 'Save Changes' : 'Create'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-white border border-[var(--line)] text-[var(--ink)] px-6 py-2.5 rounded-lg font-bold hover:bg-[var(--bg-2)] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-[var(--line)] overflow-hidden">
        {verticals.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-2)] border-b border-[var(--line)]">
                <th className="p-4 font-bold text-[var(--ink)] font-heading">Name</th>
                <th className="p-4 font-bold text-[var(--ink)] font-heading">Slug</th>
                <th className="p-4 font-bold text-[var(--ink)] font-heading">Status</th>
                <th className="p-4 font-bold text-[var(--ink)] font-heading text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verticals.map(vertical => (
                <tr key={vertical._id} className="border-b border-[var(--line)] hover:bg-[var(--bg-2)]/50 transition-colors group">
                  <td className="p-4 font-bold text-[var(--ink)]">{vertical.name}</td>
                  <td className="p-4 text-[var(--gray)] font-mono text-sm">{vertical.slug}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${vertical.active ? 'bg-[var(--green)]/10 text-[var(--green-dark)]' : 'bg-[var(--red)]/10 text-[var(--red)]'}`}>
                      {vertical.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    {vertical.featured && (
                      <span className="ml-2 text-xs px-2.5 py-1 rounded-full font-bold bg-[var(--gold)]/20 text-[var(--gold)]">
                        FEATURED #{vertical.featuredOrder || 1}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button 
                      onClick={() => handleEditClick(vertical)}
                      className="text-[var(--gray)] hover:text-[var(--green)] text-sm font-bold transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(vertical._id)}
                      className="text-[var(--red)] opacity-80 hover:opacity-100 text-sm font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-[var(--gray)] font-medium">
            <p>No verticals yet — create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}