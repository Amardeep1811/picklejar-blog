import { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';

export default function ManageAds() {
  const { user: currentUser } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const initialFormState = {
    _id: null,
    name: '',
    type: 'banner',
    placement: 'homepage',
    ctaText: '',
    ctaUrl: '',
    image: '',
    active: true,
    targetVertical: '',
    startDate: '',
    endDate: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchAds();
    fetchVerticals();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/ads');
      if (res.data.success) {
        setAds(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load ads', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerticals = async () => {
    try {
      const res = await axios.get('/verticals');
      if (res.data.success) {
        setVerticals(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch verticals', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error) {
      alert(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.targetVertical) payload.targetVertical = null;
      if (!payload.startDate) payload.startDate = null;
      if (!payload.endDate) payload.endDate = null;

      if (formData._id) {
        const res = await axios.put(`/ads/${formData._id}`, payload);
        if (res.data.success) {
          alert('Ad updated successfully!');
        }
      } else {
        delete payload._id;
        const res = await axios.post('/ads', payload);
        if (res.data.success) {
          alert('Ad created successfully!');
        }
      }
      setFormData(initialFormState);
      setIsEditing(false);
      fetchAds();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save ad');
    }
  };

  const handleEditClick = (ad) => {
    setFormData({
      _id: ad._id,
      name: ad.name || '',
      type: ad.type,
      placement: ad.placement,
      ctaText: ad.ctaText || '',
      ctaUrl: ad.ctaUrl || '',
      image: ad.image || '',
      active: ad.active,
      targetVertical: ad.targetVertical || '',
      startDate: ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '',
      endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        const res = await axios.delete(`/ads/${id}`);
        if (res.data.success) {
          fetchAds();
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete ad');
      }
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setIsEditing(false);
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

  // Summary counts for active in-article ads grouped by vertical
  const inArticleAds = ads.filter(ad => ad.placement === 'in-article' && ad.active);
  const summaryCounts = {};
  
  // Initialize with all verticals set to 0
  verticals.forEach(v => {
    summaryCounts[v.name] = 0;
  });
  summaryCounts['Global'] = 0;

  inArticleAds.forEach(ad => {
    if (ad.targetVertical) {
      const vName = verticals.find(v => v._id === ad.targetVertical)?.name || 'Unknown';
      summaryCounts[vName] = (summaryCounts[vName] || 0) + 1;
    } else {
      summaryCounts['Global']++;
    }
  });

  const summaryString = Object.entries(summaryCounts)
    .filter(([_, count]) => count > 0 || Object.keys(summaryCounts).length > 0)
    .map(([name, count]) => `${name}: ${count}`)
    .join(' · ');

  return (
    <div className="p-6 text-[var(--ink)] max-w-5xl mx-auto py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-heading text-[var(--ink)]">Manage Ads</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-[var(--green)] px-5 py-2.5 rounded-lg text-white font-bold hover:bg-[var(--green-dark)] hover:-translate-y-0.5 transition-all shadow-sm"
          >
            Create New Ad
          </button>
        )}
      </div>

      {!isEditing && inArticleAds.length >= 0 && (
        <div className="mb-6 bg-[var(--bg-2)] border border-[var(--line)] p-4 rounded-lg text-sm text-[var(--ink)]">
          <span className="font-bold text-[var(--ink)] mr-2 font-heading">In-Article Coverage:</span>
          {summaryString || 'No in-article ads active.'}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-[var(--line)] mb-8">
          <div>
            <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Ad Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Type</label>
              <select 
                required
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="banner">Banner</option>
                <option value="sponsored">Sponsored</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Placement</label>
              <select 
                required
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.placement} 
                onChange={e => setFormData({...formData, placement: e.target.value})}
              >
                <option value="homepage">Homepage</option>
                <option value="sidebar">Sidebar</option>
                <option value="in-article">In-Article</option>
                <option value="top-banner">Top Banner</option>
                <option value="section-divider">Section Divider</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">CTA Text</label>
              <input 
                type="text" 
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.ctaText} 
                onChange={e => setFormData({...formData, ctaText: e.target.value})} 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">CTA URL</label>
              <input 
                type="url" 
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.ctaUrl} 
                onChange={e => setFormData({...formData, ctaUrl: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Target Vertical</label>
              <select 
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.targetVertical} 
                onChange={e => setFormData({...formData, targetVertical: e.target.value})}
              >
                <option value="">Global / No target</option>
                {verticals.map(v => (
                  <option key={v._id} value={v._id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Start Date</label>
              <input 
                type="date" 
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.startDate} 
                onChange={e => setFormData({...formData, startDate: e.target.value})} 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">End Date</label>
              <input 
                type="date" 
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.endDate} 
                onChange={e => setFormData({...formData, endDate: e.target.value})} 
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <input 
              type="checkbox" 
              id="active"
              checked={formData.active}
              onChange={e => setFormData({...formData, active: e.target.checked})}
              className="w-4 h-4 text-[var(--green)] bg-white border-[var(--line)] rounded focus:ring-[var(--green)] accent-[var(--green)]"
            />
            <label htmlFor="active" className="text-sm font-semibold text-[var(--ink-2)] cursor-pointer">Active</label>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Ad Image</label>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp"
              onChange={handleImageUpload}
              className="mb-2 block w-full text-sm text-[var(--gray)] file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--bg-2)] file:text-[var(--ink)] hover:file:bg-[var(--line)] hover:file:text-[var(--ink)] file:transition-colors file:font-semibold cursor-pointer border border-[var(--line)] rounded-lg"
            />
            {uploadingImage && <p className="text-sm text-[var(--gray)] font-medium">Uploading...</p>}
            {formData.image && (
              <img src={optimizeCloudinaryUrl(formData.image, { width: 400, crop: 'fill' })} alt="Ad Preview" className="h-32 object-cover rounded-lg mt-3 border border-[var(--line)] shadow-sm" />
            )}
          </div>

          <div className="flex space-x-4 pt-4 border-t border-[var(--line)] mt-8">
            <button type="submit" className="flex-1 bg-[var(--green)] py-3 rounded-lg text-white font-bold hover:bg-[var(--green-dark)] hover:-translate-y-0.5 transition-all shadow-sm">
              {formData._id ? 'Update Ad' : 'Save Ad'}
            </button>
            <button type="button" onClick={handleCancel} className="flex-1 bg-white border border-[var(--line)] text-[var(--ink)] py-3 rounded-lg font-bold hover:bg-[var(--bg-2)] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {ads.map(ad => (
            <div key={ad._id} className="bg-white border border-[var(--line)] p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group gap-4">
              <div className="flex items-center space-x-5 w-full sm:w-auto">
                {ad.image ? (
                  <img src={optimizeCloudinaryUrl(ad.image, { width: 150, crop: 'fill' })} className="w-24 h-24 object-cover rounded-lg border border-[var(--line)] shadow-sm shrink-0" alt="Ad Thumbnail" />
                ) : (
                  <div className="w-24 h-24 bg-[var(--bg-2)] rounded-lg border border-[var(--line)] flex items-center justify-center text-[var(--gray)] text-xs font-medium shrink-0">No Image</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-[var(--ink)] font-heading group-hover:text-[var(--green)] transition-colors flex items-center gap-2 truncate">
                    {ad.name}
                    {!ad.active && <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[var(--red)]/10 text-[var(--red)]">Inactive</span>}
                  </h3>
                  <p className="text-sm text-[var(--gray)] mt-1">Type: <span className="text-[var(--ink)] font-semibold">{ad.type.toUpperCase()}</span> | Placement: <span className="text-[var(--ink)] font-semibold">{ad.placement}</span></p>
                  
                  {ad.placement === 'in-article' && (
                    <p className="text-sm text-[var(--gray)] mt-1">
                      Target: <span className="text-[var(--ink)] font-semibold">
                        {ad.targetVertical ? (verticals.find(v => v._id === ad.targetVertical)?.name || 'Unknown') : 'Global'}
                      </span>
                    </p>
                  )}
                  
                  {ad.endDate && (
                    <p className="text-sm text-[var(--red)] font-semibold mt-1">
                      Expires: {new Date(ad.endDate).toLocaleDateString()}
                    </p>
                  )}
                  
                  <a href={ad.ctaUrl} target="_blank" rel="noreferrer" className="text-[var(--green)] text-sm font-semibold hover:underline block mt-2 truncate">
                    {ad.ctaText || 'No CTA Text / Link'}
                  </a>
                </div>
              </div>
              <div className="flex space-x-4 sm:shrink-0 w-full sm:w-auto justify-end">
                <button 
                  onClick={() => handleEditClick(ad)}
                  className="text-[var(--gray)] hover:text-[var(--green)] text-sm font-bold transition-colors bg-transparent px-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(ad._id)}
                  className="text-[var(--red)] opacity-80 hover:opacity-100 text-sm font-bold transition-colors bg-transparent px-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {ads.length === 0 && <p className="text-[var(--gray)] p-12 text-center border border-[var(--line)] rounded-xl bg-white shadow-sm font-medium">No ads found.</p>}
        </div>
      )}
    </div>
  );
}