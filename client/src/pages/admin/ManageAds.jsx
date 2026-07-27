import { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManageAds() {
  const { user: currentUser } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const initialFormState = {
    _id: null,
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
      <div className="p-6 text-white max-w-5xl mx-auto text-center mt-20">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Access Restricted</h2>
        <p className="text-gray-400">This page is restricted to administrators only.</p>
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
    <div className="p-6 text-white max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Ads</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            Create New Ad
          </button>
        )}
      </div>

      {!isEditing && inArticleAds.length >= 0 && (
        <div className="mb-6 bg-gray-900 p-4 rounded text-sm text-gray-300">
          <span className="font-bold text-white mr-2">In-Article Coverage:</span>
          {summaryString || 'No in-article ads active.'}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Type</label>
              <select 
                required
                className="w-full bg-gray-800 border border-gray-700 rounded p-2"
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="banner">Banner</option>
                <option value="sponsored">Sponsored</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Placement</label>
              <select 
                required
                className="w-full bg-gray-800 border border-gray-700 rounded p-2"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">CTA Text</label>
              <input 
                type="text" 
                className="w-full bg-gray-800 border border-gray-700 rounded p-2"
                value={formData.ctaText} 
                onChange={e => setFormData({...formData, ctaText: e.target.value})} 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">CTA URL</label>
              <input 
                type="url" 
                className="w-full bg-gray-800 border border-gray-700 rounded p-2"
                value={formData.ctaUrl} 
                onChange={e => setFormData({...formData, ctaUrl: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Target Vertical</label>
              <select 
                className="w-full bg-gray-800 border border-gray-700 rounded p-2"
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
              <label className="block mb-2 text-sm font-medium">Start Date</label>
              <input 
                type="date" 
                className="w-full bg-gray-800 border border-gray-700 rounded p-2"
                value={formData.startDate} 
                onChange={e => setFormData({...formData, startDate: e.target.value})} 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">End Date</label>
              <input 
                type="date" 
                className="w-full bg-gray-800 border border-gray-700 rounded p-2"
                value={formData.endDate} 
                onChange={e => setFormData({...formData, endDate: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="active"
              checked={formData.active}
              onChange={e => setFormData({...formData, active: e.target.checked})}
              className="w-4 h-4 text-green-600 bg-gray-800 border-gray-700 rounded"
            />
            <label htmlFor="active" className="text-sm font-medium">Active</label>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Ad Image</label>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp"
              onChange={handleImageUpload}
              className="mb-2 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600"
            />
            {uploadingImage && <p className="text-sm text-gray-400">Uploading...</p>}
            {formData.image && (
              <img src={formData.image} alt="Ad Preview" className="h-32 object-cover rounded mt-2" />
            )}
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="flex-1 bg-green-600 py-3 rounded font-bold hover:bg-green-700">
              {formData._id ? 'Update Ad' : 'Save Ad'}
            </button>
            <button type="button" onClick={handleCancel} className="flex-1 bg-gray-600 py-3 rounded font-bold hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {ads.map(ad => (
            <div key={ad._id} className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {ad.image ? (
                  <img src={ad.image} className="w-24 h-24 object-cover rounded" alt="Ad Thumbnail" />
                ) : (
                  <div className="w-24 h-24 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
                )}
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {ad.type.toUpperCase()}
                    {!ad.active && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">Inactive</span>}
                  </h3>
                  <p className="text-sm text-gray-400">Placement: <span className="text-white">{ad.placement}</span></p>
                  
                  {ad.placement === 'in-article' && (
                    <p className="text-sm text-gray-400">
                      Target: <span className="text-white">
                        {ad.targetVertical ? (verticals.find(v => v._id === ad.targetVertical)?.name || 'Unknown') : 'Global'}
                      </span>
                    </p>
                  )}
                  
                  {ad.endDate && (
                    <p className="text-sm text-red-400 font-medium">
                      Expires: {new Date(ad.endDate).toLocaleDateString()}
                    </p>
                  )}
                  
                  <a href={ad.ctaUrl} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline block mt-1">
                    {ad.ctaText || 'No CTA Text / Link'}
                  </a>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditClick(ad)}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(ad._id)}
                  className="bg-red-600/80 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {ads.length === 0 && <p className="text-gray-400">No ads found.</p>}
        </div>
      )}
    </div>
  );
}