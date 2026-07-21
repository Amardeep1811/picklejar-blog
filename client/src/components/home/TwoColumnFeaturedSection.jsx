import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import LoadingSpinner from '../shared/LoadingSpinner';
import PostTitle from '../shared/Typography/PostTitle';
import PostExcerpt from '../shared/Typography/PostExcerpt';

export default function TwoColumnFeaturedSection() {
  const [verticalA, setVerticalA] = useState(null);
  const [verticalB, setVerticalB] = useState(null);
  const [postsA, setPostsA] = useState([]);
  const [postsB, setPostsB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vertsRes = await axios.get('/verticals/featured');
        if (vertsRes.data.success && vertsRes.data.data) {
          const vData = vertsRes.data.data;
          
          if (vData.length > 2) {
            setVerticalA(vData[2]);
            const pResA = await axios.get(`/posts?status=published&vertical=${vData[2]._id}&limit=3`);
            if (pResA.data.success) setPostsA(pResA.data.data);
          }
          
          if (vData.length > 3) {
            setVerticalB(vData[3]);
            const pResB = await axios.get(`/posts?status=published&vertical=${vData[3]._id}&limit=3`);
            if (pResB.data.success) setPostsB(pResB.data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load two-column featured section:', err);
        setError('Failed to load content.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <section className="mb-12 font-['Inter']">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
      </section>
    );
  }

  // If no 3rd/4th verticals exist, return null gracefully
  if (!verticalA && !verticalB) return null;

  return (
    <section className="mb-12 font-['Inter']">
      <div className="flex flex-col lg:flex-row items-start gap-12 border-t border-[var(--line)] pt-8">
        
        {/* LEFT COLUMN */}
        {verticalA && (
          <div className="w-full lg:w-1/2 flex flex-col lg:pr-12 lg:border-r border-[var(--line)]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-4 bg-[var(--green)]"></div>
              <h2 className="text-sm font-black tracking-widest text-[var(--ink)] uppercase">{verticalA.name}</h2>
            </div>
            
            <div className="flex flex-col">
              {postsA.map((post, idx) => {
                const isFirst = idx === 0;
                return (
                  <Link 
                    key={post._id} 
                    to={`/${verticalA.slug}/${post.slug}`} 
                    className={`group block py-5 ${idx !== 0 ? 'border-t border-[var(--line)]' : 'pt-0'}`}
                  >
                    {isFirst && (
                      <div className="mb-4">
                        {post.bannerImage ? (
                          <img src={post.bannerImage} alt={post.title} className="w-full aspect-[16/9] object-cover" />
                        ) : (
                          <div className="w-full aspect-[16/9] bg-gray-100 border border-[var(--line)] flex items-center justify-center text-gray-400 text-sm">No Image</div>
                        )}
                      </div>
                    )}
                    <PostTitle title={post.title} size={isFirst ? "medium" : "small"} className="mb-2" />
                    <PostExcerpt excerpt={post.excerpt} size="small" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* RIGHT COLUMN */}
        {verticalB && (
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-4 bg-[var(--green)]"></div>
              <h2 className="text-sm font-black tracking-widest text-[var(--ink)] uppercase">{verticalB.name}</h2>
            </div>
            
            <div className="flex flex-col">
              {postsB.map((post, idx) => {
                const isSecond = idx === 1;
                return (
                  <Link 
                    key={post._id} 
                    to={`/${verticalB.slug}/${post.slug}`} 
                    className={`group block py-5 ${idx !== 0 ? 'border-t border-[var(--line)]' : 'pt-0'}`}
                  >
                    {isSecond && (
                      <div className="mb-4">
                        {post.bannerImage ? (
                          <img src={post.bannerImage} alt={post.title} className="w-full aspect-[16/9] object-cover" />
                        ) : (
                          <div className="w-full aspect-[16/9] bg-gray-100 border border-[var(--line)] flex items-center justify-center text-gray-400 text-sm">No Image</div>
                        )}
                      </div>
                    )}
                    <PostTitle title={post.title} size={isSecond ? "medium" : "small"} className="mb-2" />
                    <PostExcerpt excerpt={post.excerpt} size="small" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
