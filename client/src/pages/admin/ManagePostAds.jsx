import { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManagePostAds() {
  const { user: currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);

  const [adSlot1, setAdSlot1] = useState('');
  const [adSlot2, setAdSlot2] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [postsRes, adsRes, verticalsRes] = await Promise.all([
        axios.get('/posts?limit=1000'), // fetching a large number of posts to allow searching
        axios.get('/ads?placement=in-article'),
        axios.get('/verticals')
      ]);
      if (postsRes.data.success) setPosts(postsRes.data.data);
      if (adsRes.data.success) setAds(adsRes.data.data);
      if (verticalsRes.data.success) setVerticals(verticalsRes.data.data);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setAdSlot1(post.adSlot1 || '');
    setAdSlot2(post.adSlot2 || '');
  };

  const handleCancel = () => {
    setEditingPostId(null);
    setAdSlot1('');
    setAdSlot2('');
  };

  const handleSave = async (postId) => {
    try {
      const payload = {
        adSlot1: adSlot1 || null,
        adSlot2: adSlot2 || null
      };
      const res = await axios.put(`/posts/${postId}`, payload);
      if (res.data.success) {
        // Update post in state
        setPosts(posts.map(p => p._id === postId ? { ...p, adSlot1: res.data.data.adSlot1, adSlot2: res.data.data.adSlot2 } : p));
        setEditingPostId(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save assignments');
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

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Post Ads</h1>
          <p className="text-gray-400 mt-2">Assign specific ads to individual posts to override the rotation algorithm.</p>
        </div>
      </div>

      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search posts by title..." 
          className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.map(post => {
          const isEditing = editingPostId === post._id;
          const hasAssignments = post.adSlot1 || post.adSlot2;
          
          return (
            <div key={post._id} className="bg-gray-900 border border-gray-700 p-4 rounded-lg flex flex-col hover:bg-gray-800 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {post.title}
                    {hasAssignments && !isEditing && (
                      <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded font-medium">Overrides Active</span>
                    )}
                  </h3>
                  <div className="flex space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${post.status === 'published' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                      {post.status.toUpperCase()}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700 font-mono">
                      {verticals.find(v => v._id === (post.vertical?._id || post.vertical))?.name || 'Unknown Vertical'}
                    </span>
                  </div>
                </div>
                
                {!isEditing && (
                  <button 
                    onClick={() => handleEditClick(post)}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition-colors"
                  >
                    Manage Ads
                  </button>
                )}
              </div>

              {isEditing && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">Ad Slot 1</label>
                      <select 
                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
                        value={adSlot1}
                        onChange={e => setAdSlot1(e.target.value)}
                      >
                        <option value="">None (use rotation)</option>
                        {ads.map(ad => (
                          <option key={ad._id} value={ad._id}>{ad.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">Ad Slot 2</label>
                      <select 
                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
                        value={adSlot2}
                        onChange={e => setAdSlot2(e.target.value)}
                      >
                        <option value="">None (use rotation)</option>
                        {ads.map(ad => (
                          <option key={ad._id} value={ad._id}>{ad.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleSave(post._id)}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-bold transition-colors"
                    >
                      Save Assignments
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm font-bold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filteredPosts.length === 0 && (
          <div className="p-8 text-center text-gray-400 border border-gray-700 rounded-lg bg-gray-900">
            No posts found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
