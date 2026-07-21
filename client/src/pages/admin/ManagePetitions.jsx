import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManagePetitions() {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentPetition, setCurrentPetition] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    signatureCount: 0,
    goalCount: 0,
    active: true
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchPetitions();
  }, []);

  const fetchPetitions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/petitions');
      if (res.data.success) {
        setPetitions(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch petitions');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.category || formData.goalCount <= 0) {
      setFormError('Title, Category, and positive Goal Count are required');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`/petitions/${currentPetition._id}`, formData);
      } else {
        await axios.post('/petitions', formData);
      }
      setIsEditing(false);
      setCurrentPetition(null);
      setFormData({ title: '', category: '', signatureCount: 0, goalCount: 0, active: true });
      fetchPetitions();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save petition');
    }
  };

  const handleEdit = (petition) => {
    setIsEditing(true);
    setCurrentPetition(petition);
    setFormData({
      title: petition.title,
      category: petition.category,
      signatureCount: petition.signatureCount,
      goalCount: petition.goalCount,
      active: petition.active
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this petition?')) {
      try {
        await axios.delete(`/petitions/${id}`);
        fetchPetitions();
      } catch (err) {
        alert('Failed to delete petition');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Manage Petitions</h1>
      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              {isEditing ? 'Edit Petition' : 'Add New Petition'}
            </h2>
            {formError && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm">{formError}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-1">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Signature Count</label>
                <input
                  type="number"
                  name="signatureCount"
                  value={formData.signatureCount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Goal Count *</label>
                <input
                  type="number"
                  name="goalCount"
                  value={formData.goalCount}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500"
                />
                <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-300">
                  Active
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors flex-1"
                >
                  {isEditing ? 'Update' : 'Create'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentPetition(null);
                      setFormData({ title: '', category: '', signatureCount: 0, goalCount: 0, active: true });
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors flex-1"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-900 text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Progress</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {petitions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No petitions found
                      </td>
                    </tr>
                  ) : (
                    petitions.map(petition => (
                      <tr key={petition._id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-4 py-3 font-medium text-white max-w-[200px] truncate" title={petition.title}>{petition.title}</td>
                        <td className="px-4 py-3">{petition.category}</td>
                        <td className="px-4 py-3">
                          {petition.signatureCount} / {petition.goalCount}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${petition.active ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                            {petition.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleEdit(petition)}
                            className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(petition._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
