import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EditorJsRenderer from '../components/shared/EditorJsRenderer';
import axios from '../api/axios';

export default function PostPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const targetSlug = slug || 'test-slug';
        const res = await axios.get(`/posts/${targetSlug}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="error-message text-red-500 p-4 border border-red-500 rounded bg-red-50">{error}</div>
      ) : data ? (
        <article>
          {data.bannerImage && (
            <img 
              src={data.bannerImage} 
              alt="Banner" 
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-8" 
            />
          )}
          <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
          {data.excerpt && <p className="text-xl text-gray-600 mb-8 italic">{data.excerpt}</p>}
          
          <div className="mt-8 text-lg text-gray-800">
            {data.body && data.body.blocks ? (
              <EditorJsRenderer blocks={data.body.blocks} />
            ) : (
              <p>No content available.</p>
            )}
          </div>
        </article>
      ) : null}
    </div>
  );
}