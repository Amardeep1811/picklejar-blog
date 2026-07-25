import { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

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
      <div className="p-6 text-white max-w-5xl mx-auto text-center mt-20">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Access Restricted</h2>
        <p className="text-gray-400">This page is restricted to administrators only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Verticals</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-600 px-4 py-2 rounded text-white font-bold hover:bg-blue-700 transition-colors"
          >
            Create New Vertical
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Vertical' : 'Create Vertical'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input 
                type="text" 
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Technology"
              />
            </div>
            <div className="flex flex-wrap items-center mt-4 md:mt-8 gap-6">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-blue-600 rounded bg-gray-800 border-gray-600"
                  checked={formData.active}
                  onChange={e => setFormData({...formData, active: e.target.checked})}
                />
                <span className="ml-2 text-sm font-medium">Active (Visible on site)</span>
              </label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-5 w-5 text-yellow-500 rounded bg-gray-800 border-gray-600"
                    checked={formData.featured}
                    onChange={e => setFormData({...formData, featured: e.target.checked})}
                  />
                  <span className="ml-2 text-sm font-medium">Featured</span>
                </label>
                {formData.featured && (
                  <div className="flex items-center space-x-1.5 ml-2 bg-gray-800 px-3 py-1 rounded border border-gray-700">
                    <span className="text-xs text-gray-300 font-medium">Priority:</span>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      className="w-14 bg-gray-900 border border-gray-600 rounded px-2 py-0.5 text-center text-sm font-bold text-yellow-400 focus:outline-none focus:border-yellow-500"
                      value={formData.featuredOrder}
                      onChange={e => setFormData({...formData, featuredOrder: Math.min(4, Math.max(1, parseInt(e.target.value) || 1))})}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700 transition-colors">
              {editingId ? 'Save Changes' : 'Create'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-600 px-6 py-2 rounded font-bold hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
        {verticals.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="p-4 font-bold text-gray-300">Name</th>
                <th className="p-4 font-bold text-gray-300">Slug</th>
                <th className="p-4 font-bold text-gray-300">Status</th>
                <th className="p-4 font-bold text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verticals.map(vertical => (
                <tr key={vertical._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium">{vertical.name}</td>
                  <td className="p-4 text-gray-400 font-mono text-sm">{vertical.slug}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${vertical.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {vertical.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    {vertical.featured && (
                      <span className="ml-2 text-xs px-2 py-1.5 rounded font-bold bg-yellow-900 text-yellow-300">
                        FEATURED #{vertical.featuredOrder || 1}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button 
                      onClick={() => handleEditClick(vertical)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(vertical._id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p>No verticals yet — create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}