import { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManageAds() {
  const { user: currentUser } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'banner',
    placement: 'homepage',
    ctaText: '',
    ctaUrl: '',
    image: '',
    active: true
  });

  useEffect(() => {
    fetchAds();
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
      const res = await axios.post('/ads', formData);
      if (res.data.success) {
        alert('Ad created successfully!');
        setFormData({ type: 'banner', placement: 'homepage', ctaText: '', ctaUrl: '', image: '', active: true });
        setIsEditing(false);
        fetchAds();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save ad');
    }
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

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Ads</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          {isEditing ? 'Cancel' : 'Create New Ad'}
        </button>
      </div>

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

          <button type="submit" className="w-full bg-green-600 py-3 rounded font-bold hover:bg-green-700">
            Save Ad
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ads.map(ad => (
            <div key={ad._id} className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex items-center space-x-4">
              {ad.image && (
                <img src={ad.image} className="w-24 h-24 object-cover rounded" alt="Ad Thumbnail" />
              )}
              <div>
                <h3 className="font-bold text-lg">{ad.type.toUpperCase()}</h3>
                <p className="text-sm text-gray-400">Placement: {ad.placement}</p>
                <a href={ad.ctaUrl} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline">
                  {ad.ctaText || 'Link'}
                </a>
              </div>
            </div>
          ))}
          {ads.length === 0 && <p className="text-gray-400">No ads found.</p>}
        </div>
      )}
    </div>
  );
}