import { useState, useEffect, useRef } from 'react';
import axios from '../../api/axios';
import PostEditor from '../../components/admin/PostEditor';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  
  const editorRef = useRef(null);

  const defaultForm = {
    title: '',
    vertical: '',
    excerpt: '',
    bannerImage: '',
    status: 'draft',
    editorsPick: false,
    body: { blocks: [] }
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [postsRes, verticalsRes] = await Promise.all([
        axios.get('/posts'),
        axios.get('/verticals')
      ]);
      if (postsRes.data.success) setPosts(postsRes.data.data);
      if (verticalsRes.data.success) setVerticals(verticalsRes.data.data);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingBanner(true);
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, bannerImage: url }));
    } catch (error) {
      alert(error.message);
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleEditClick = async (post) => {
    try {
      const res = await axios.get(`/posts/${post.slug}`);
      if (res.data.success) {
        const fullPost = res.data.data;
        setIsEditing(true);
        setEditingId(fullPost._id);
        setFormData({
          title: fullPost.title,
          vertical: fullPost.vertical._id || fullPost.vertical,
          excerpt: fullPost.excerpt || '',
          bannerImage: fullPost.bannerImage || '',
          status: fullPost.status,
          editorsPick: fullPost.editorsPick || false,
          body: fullPost.body || { blocks: [] }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch full post data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await axios.delete(`/posts/${id}`);
      if (res.data.success) {
        fetchInitialData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(defaultForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let bodyData = formData.body;
      if (editorRef.current) {
        bodyData = await editorRef.current.save();
      }

      const postPayload = {
        ...formData,
        body: bodyData
      };

      if (editingId) {
        const res = await axios.put(`/posts/${editingId}`, postPayload);
        if (res.data.success) {
          alert('Post updated successfully!');
          handleCancel();
          fetchInitialData();
        }
      } else {
        const res = await axios.post('/posts', postPayload);
        if (res.data.success) {
          alert('Post created successfully!');
          handleCancel();
          fetchInitialData();
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save post');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Posts</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-600 px-4 py-2 rounded text-white font-bold hover:bg-blue-700 transition-colors"
          >
            Create New Post
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-blue-400">
            {editingId ? `Editing: ${formData.title}` : 'Create New Post'}
          </h2>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input 
              type="text" 
              required
              className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Vertical</label>
              <select 
                required
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
                value={formData.vertical} 
                onChange={e => setFormData({...formData, vertical: e.target.value})}
              >
                <option value="">Select Vertical...</option>
                {verticals.map(v => (
                  <option key={v._id} value={v._id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Status</label>
              <select 
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <div className="col-span-2 flex items-center mt-2">
              <input
                type="checkbox"
                id="editorsPick"
                checked={formData.editorsPick}
                onChange={e => setFormData({...formData, editorsPick: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500"
              />
              <label htmlFor="editorsPick" className="ml-2 text-sm font-medium text-gray-300">
                Editor's Pick (Display in Sidebar)
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Excerpt</label>
            <textarea 
              className="w-full bg-gray-800 border border-gray-600 rounded p-2 h-20 focus:outline-none focus:border-blue-500"
              value={formData.excerpt} 
              onChange={e => setFormData({...formData, excerpt: e.target.value})} 
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Banner Image</label>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp"
              onChange={handleBannerUpload}
              className="mb-2 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
            />
            {uploadingBanner && <p className="text-sm text-gray-400">Uploading...</p>}
            {formData.bannerImage && (
              <img src={optimizeCloudinaryUrl(formData.bannerImage, { width: 400, crop: 'fill' })} alt="Banner Preview" className="h-32 object-cover rounded mt-2 border border-gray-600" />
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Body Content (Editor.js)</label>
            <PostEditor key={editingId || 'new'} editorRef={editorRef} initialData={formData.body} />
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700 transition-colors">
              {editingId ? 'Save Changes' : 'Create Post'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-600 px-6 py-2 rounded font-bold hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {posts.map(post => (
            <div key={post._id} className="bg-gray-900 border border-gray-700 p-4 rounded-lg flex items-center justify-between hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                {post.bannerImage ? (
                  <img src={optimizeCloudinaryUrl(post.bannerImage, { width: 100, crop: 'fill' })} className="w-16 h-16 object-cover rounded border border-gray-600" alt="Thumbnail" />
                ) : (
                  <div className="w-16 h-16 bg-gray-800 rounded border border-gray-600 flex items-center justify-center text-gray-500 text-xs">No img</div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <div className="flex space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${post.status === 'published' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                      {post.status.toUpperCase()}
                    </span>
                    {post.editorsPick && (
                      <span className="text-xs px-2 py-1 rounded font-bold bg-blue-900 text-blue-300">
                        EDITOR'S PICK
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700 font-mono">
                      {post.slug}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleEditClick(post)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(post._id)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="p-8 text-center text-gray-400 border border-gray-700 rounded-lg bg-gray-900">
              No posts found — click "Create New Post" to start writing!
            </div>
          )}
        </div>
      )}
    </div>
  );
}