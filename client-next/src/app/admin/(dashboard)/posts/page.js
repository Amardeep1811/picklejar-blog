"use client";
import { useState, useEffect, useRef } from 'react';
import axios from "@/api/axios";
import dynamic from 'next/dynamic';
const PostEditor = dynamic(() => import('@/components/admin/PostEditor'), { ssr: false });
import { uploadToCloudinary } from '@/utils/cloudinaryUpload';
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { optimizeCloudinaryUrl } from '@/utils/optimizeCloudinaryUrl';
import Image from 'next/image';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('All');
  
  const editorRef = useRef(null);

  const defaultForm = {
    title: '',
    vertical: '',
    excerpt: '',
    bannerImage: '',
    status: 'draft',
    editorsPick: false,
    sendNewsletter: false,
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
          sendNewsletter: false,
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

      let savedPostId = null;

      if (editingId) {
        const res = await axios.put(`/posts/${editingId}`, postPayload);
        if (res.data.success) {
          savedPostId = editingId;
        }
      } else {
        const res = await axios.post('/posts', postPayload);
        if (res.data.success) {
          savedPostId = res.data.data._id;
        }
      }

      if (savedPostId) {
        if (formData.sendNewsletter) {
          try {
            const nlRes = await axios.post(`/posts/${savedPostId}/send-newsletter`);
            alert(`Post saved! Newsletter status: ${nlRes.data.message}`);
          } catch (nlErr) {
            alert(`Post saved, but failed to send newsletter: ${nlErr.response?.data?.message || 'Unknown error'}`);
          }
        } else {
          alert('Post saved successfully!');
        }
        handleCancel();
        fetchInitialData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save post');
    }
  };

  if (loading) return <LoadingSpinner />;

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const verticalId = typeof post.vertical === 'object' ? post.vertical?._id : post.vertical;
    const matchesVertical = selectedVertical === 'All' || verticalId === selectedVertical;
    return matchesSearch && matchesVertical;
  });

  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-heading text-[var(--ink)]">Manage Posts</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-[var(--green)] px-5 py-2.5 rounded-lg text-white font-bold hover:bg-[var(--green-dark)] hover:-translate-y-0.5 transition-all shadow-sm"
          >
            Create New Post
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm mb-8 border border-[var(--line)]">
          <h2 className="text-2xl font-bold mb-6 text-[var(--ink)] font-heading">
            {editingId ? `Editing: ${formData.title}` : 'Create New Post'}
          </h2>
          
          <div>
            <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Title</label>
            <input 
              type="text" 
              required
              className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Vertical</label>
              <select 
                required
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
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
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Status</label>
              <select 
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <div className="col-span-2 flex flex-col gap-3 mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editorsPick"
                  checked={formData.editorsPick}
                  onChange={e => setFormData({...formData, editorsPick: e.target.checked})}
                  className="w-4 h-4 text-[var(--green)] bg-white border-[var(--line)] rounded focus:ring-[var(--green)] accent-[var(--green)]"
                />
                <label htmlFor="editorsPick" className="ml-2 text-sm font-semibold text-[var(--ink-2)] cursor-pointer">
                  Editor's Pick (Display in Sidebar)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendNewsletter"
                  checked={formData.sendNewsletter}
                  onChange={e => setFormData({...formData, sendNewsletter: e.target.checked})}
                  className="w-4 h-4 text-[var(--green)] bg-white border-[var(--line)] rounded focus:ring-[var(--green)] accent-[var(--green)]"
                />
                <label htmlFor="sendNewsletter" className="ml-2 text-sm font-semibold text-[var(--ink-2)] cursor-pointer">
                  Send Newsletter (Trigger email to all subscribers on save)
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Excerpt</label>
            <textarea 
              className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 h-24 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
              value={formData.excerpt} 
              onChange={e => setFormData({...formData, excerpt: e.target.value})} 
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Banner Image</label>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp"
              onChange={handleBannerUpload}
              className="mb-2 block w-full text-sm text-[var(--gray)] file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--bg-2)] file:text-[var(--ink)] hover:file:bg-[var(--line)] hover:file:text-[var(--ink)] file:transition-colors file:font-semibold cursor-pointer border border-[var(--line)] rounded-lg"
            />
            {uploadingBanner && <p className="text-sm text-[var(--gray)] font-medium">Uploading...</p>}
            {formData.bannerImage && (
              <Image src={optimizeCloudinaryUrl(formData.bannerImage, { width: 400, crop: 'fill' })} alt="Banner Preview" width={400} height={128} className="h-32 object-cover rounded-lg mt-3 border border-[var(--line)] shadow-sm" />
            )}
          </div>

          <div className="bg-[var(--bg)] p-4 rounded-lg border border-[var(--line)]">
            <label className="block mb-4 text-sm font-semibold text-[var(--ink-2)]">Body Content (Editor.js)</label>
            <div className="text-[var(--ink)]">
              <PostEditor key={editingId || 'new'} editorRef={editorRef} initialData={formData.body} />
            </div>
          </div>

          <div className="flex space-x-4 pt-4 border-t border-[var(--line)] mt-8">
            <button type="submit" className="bg-[var(--green)] px-6 py-2.5 rounded-lg font-bold text-white hover:bg-[var(--green-dark)] hover:-translate-y-0.5 transition-all shadow-sm">
              {editingId ? 'Save Changes' : 'Create Post'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-white border border-[var(--line)] text-[var(--ink)] px-6 py-2.5 rounded-lg font-bold hover:bg-[var(--bg-2)] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-[var(--line)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-full md:w-1/3">
              <input 
                type="text" 
                placeholder="Search posts..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[var(--line)] rounded-full px-4 py-2 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors text-sm font-medium"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedVertical('All')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors border ${selectedVertical === 'All' ? 'bg-[var(--ink)] text-white border-[var(--ink)]' : 'bg-white text-[var(--ink)] border-[var(--line)] hover:border-[var(--gray)] hover:bg-[var(--bg-2)]'}`}
              >
                All
              </button>
              {verticals.map(v => (
                <button
                  key={v._id}
                  onClick={() => setSelectedVertical(v._id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors border ${selectedVertical === v._id ? 'bg-[var(--ink)] text-white border-[var(--ink)]' : 'bg-white text-[var(--ink)] border-[var(--line)] hover:border-[var(--gray)] hover:bg-[var(--bg-2)]'}`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map(post => (
              <div key={post._id} className="bg-white border border-[var(--line)] p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group gap-4">
                <div className="flex items-center space-x-5 w-full sm:w-auto">
                  {post.bannerImage ? (
                    <Image src={optimizeCloudinaryUrl(post.bannerImage, { width: 100, crop: 'fill' })} width={80} height={80} className="w-20 h-20 object-cover rounded-lg border border-[var(--line)] shadow-sm shrink-0" alt="Thumbnail" />
                  ) : (
                    <div className="w-20 h-20 bg-[var(--bg-2)] rounded-lg border border-[var(--line)] flex items-center justify-center text-[var(--gray)] text-xs font-medium shrink-0">No img</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-[var(--ink)] font-heading group-hover:text-[var(--green)] transition-colors truncate">{post.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${post.status === 'published' ? 'bg-[var(--green)]/10 text-[var(--green-dark)]' : 'bg-[var(--gold)]/20 text-[var(--gold)]'}`}>
                        {post.status.toUpperCase()}
                      </span>
                      {post.editorsPick && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[var(--tan-dark)]/50 text-[var(--ink)]">
                          EDITOR'S PICK
                        </span>
                      )}
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-2)] text-[var(--gray)] border border-[var(--line)] font-mono">
                        {post.slug}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4 sm:shrink-0 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => handleEditClick(post)}
                    className="text-[var(--gray)] hover:text-[var(--green)] text-sm font-bold transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(post._id)}
                    className="text-[var(--red)] opacity-80 hover:opacity-100 text-sm font-bold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {filteredPosts.length === 0 && (
              <div className="p-12 text-center text-[var(--gray)] border border-[var(--line)] rounded-xl bg-white shadow-sm font-medium">
                No posts found matching the current filters.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}