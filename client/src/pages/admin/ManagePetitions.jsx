import { useState, useEffect, Fragment, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../api/axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManagePetitions() {
  const { user: currentUser } = useContext(AuthContext);
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentPetition, setCurrentPetition] = useState(null);
  
  const [expandedPetitionId, setExpandedPetitionId] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [loadingSignatures, setLoadingSignatures] = useState(false);
  
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

  const fetchSignatures = async (id) => {
    if (expandedPetitionId === id) {
      setExpandedPetitionId(null);
      setSignatures([]);
      return;
    }
    try {
      setExpandedPetitionId(id);
      setLoadingSignatures(true);
      const res = await axios.get(`/petitions/${id}/signatures`);
      if (res.data.success) {
        setSignatures(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch signatures', err);
    } finally {
      setLoadingSignatures(false);
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

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-6 text-[var(--ink)] max-w-5xl mx-auto text-center mt-20">
        <h2 className="text-2xl font-bold text-[var(--red)] mb-2 font-heading">Access Restricted</h2>
        <p className="text-[var(--gray)]">This page is restricted to administrators only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto py-4">
      <h1 className="text-4xl font-bold text-[var(--ink)] mb-8 font-heading">Manage Petitions</h1>
      {error && <div className="bg-[var(--red)]/10 border border-[var(--red)] text-[var(--red)] p-4 rounded-lg mb-6 font-medium">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-8 border border-[var(--line)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-6 font-heading">
              {isEditing ? 'Edit Petition' : 'Add New Petition'}
            </h2>
            {formError && <div className="bg-[var(--red)]/10 text-[var(--red)] p-3 rounded-lg mb-4 text-sm font-medium">{formError}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[var(--ink-2)] text-sm mb-2 font-semibold">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[var(--ink-2)] text-sm mb-2 font-semibold">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[var(--ink-2)] text-sm mb-2 font-semibold">Signature Count</label>
                <input
                  type="number"
                  name="signatureCount"
                  value={formData.signatureCount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[var(--ink-2)] text-sm mb-2 font-semibold">Goal Count *</label>
                <input
                  type="number"
                  name="goalCount"
                  value={formData.goalCount}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
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
                  className="w-4 h-4 text-[var(--green)] bg-white border-[var(--line)] rounded focus:ring-[var(--green)] accent-[var(--green)]"
                />
                <label htmlFor="active" className="ml-2 text-sm font-semibold text-[var(--ink-2)] cursor-pointer">
                  Active
                </label>
              </div>
              
              <div className="flex space-x-3 pt-6">
                <button
                  type="submit"
                  className="bg-[var(--green)] hover:bg-[var(--green-dark)] text-white px-4 py-2.5 rounded-lg transition-all hover:-translate-y-0.5 shadow-sm flex-1 font-bold"
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
                    className="bg-white border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--bg-2)] px-4 py-2.5 rounded-lg transition-colors flex-1 font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[var(--line)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[var(--ink)]">
                <thead className="bg-[var(--bg-2)] text-[var(--ink)] font-bold border-b border-[var(--line)]">
                  <tr>
                    <th className="px-4 py-4 font-heading">Title</th>
                    <th className="px-4 py-4 font-heading">Category</th>
                    <th className="px-4 py-4 font-heading">Progress</th>
                    <th className="px-4 py-4 font-heading">Status</th>
                    <th className="px-4 py-4 font-heading text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {petitions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center text-[var(--gray)] font-medium">
                        No petitions found
                      </td>
                    </tr>
                  ) : (
                    petitions.map(petition => (
                      <Fragment key={petition._id}>
                        <tr className="hover:bg-[var(--bg-2)]/50 transition-colors group">
                          <td className="px-4 py-4 font-bold text-[var(--ink)] max-w-[200px] truncate group-hover:text-[var(--green)] transition-colors" title={petition.title}>{petition.title}</td>
                          <td className="px-4 py-4 font-medium">{petition.category}</td>
                          <td className="px-4 py-4 font-medium">
                            {petition.signatureCount} / {petition.goalCount}
                          </td>
                          <td className="px-4 py-4 font-medium">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${petition.active ? 'bg-[var(--green)]/10 text-[var(--green-dark)]' : 'bg-[var(--gray)]/10 text-[var(--gray-2)]'}`}>
                              {petition.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-medium text-right">
                            <button
                              onClick={() => fetchSignatures(petition._id)}
                              className="text-[var(--gray)] hover:text-[var(--green)] mr-3 transition-colors font-bold"
                            >
                              View Signatures ({petition.signatureCount})
                            </button>
                            <button
                              onClick={() => handleEdit(petition)}
                              className="text-[var(--gray)] hover:text-[var(--green)] mr-3 transition-colors font-bold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(petition._id)}
                              className="text-[var(--red)] opacity-80 hover:opacity-100 transition-colors font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                        {expandedPetitionId === petition._id && (
                          <tr className="bg-[var(--bg-2)]/30">
                            <td colSpan="5" className="px-4 py-4">
                              <div className="bg-white rounded-lg p-5 border border-[var(--line)] text-left shadow-sm m-2">
                                <h3 className="text-[var(--ink)] font-bold mb-4 font-heading">Signatures for {petition.title}</h3>
                                {loadingSignatures ? (
                                  <div className="text-[var(--gray)] font-medium">Loading signatures...</div>
                                ) : signatures.length === 0 ? (
                                  <div className="text-[var(--gray)] font-medium">No signatures yet.</div>
                                ) : (
                                  <div className="max-h-60 overflow-y-auto pr-2">
                                    <table className="w-full text-sm text-left">
                                      <thead className="text-[var(--ink)] sticky top-0 bg-white font-bold border-b border-[var(--line)]">
                                        <tr>
                                          <th className="py-2 font-medium">Email</th>
                                          <th className="py-2 font-medium">Signed At</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-[var(--line)]">
                                        {signatures.map((sig, idx) => (
                                          <tr key={idx} className="text-[var(--ink)] font-medium">
                                            <td className="py-2">{sig.email}</td>
                                            <td className="py-2">{new Date(sig.createdAt).toLocaleString()}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
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
