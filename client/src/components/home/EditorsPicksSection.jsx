import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import LoadingSpinner from '../shared/LoadingSpinner';
import PostTitle from '../shared/Typography/PostTitle';
import PostExcerpt from '../shared/Typography/PostExcerpt';

export default function EditorsPicksSection() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const res = await axios.get('/posts?editorsPick=true&status=published&limit=7');
        if (res.data.success) {
          setPicks(res.data.data);
        }
      } catch (err) {
        console.error(`Failed to load Editor\\'s Picks:`, err);
        setError('Failed to load content.');
      } finally {
        setLoading(false);
      }
    };
    fetchPicks();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <section className="mb-12 font-['Inter']">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
      </section>
    );
  }

  if (picks.length === 0) return null;

  const largePost = picks[0];
  const mediumPosts = picks.slice(1, 3);
  const gridPosts = picks.slice(3, 7);

  return (
    <section className="mb-12 font-['Inter']">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-4 bg-[var(--green)]"></div>
        <h2 className="text-sm font-black tracking-widest text-[var(--ink)] uppercase">Editor's Picks</h2>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-6 border-t border-[var(--line)] pt-8">

        {/* LEFT COLUMN: 65% Width */}
        <div className="w-full lg:w-[65%] flex flex-col lg:pr-6 pb-6 lg:pb-0 lg:border-r border-[var(--line)]">
          {largePost && (
            <Link to={`/${largePost.vertical?.slug || 'vertical'}/${largePost.slug}`} className="group flex flex-col md:flex-row gap-6 mb-6">
              {/* TEXT COLUMN */}
              <div className="w-full md:w-[45%] flex flex-col justify-start">
                <PostTitle title={largePost.title} size="hero" className="mb-3 text-3xl leading-tight" />
                <PostExcerpt excerpt={largePost.excerpt} size="medium" className="mb-4" />
                <span className="inline-block bg-[var(--green)] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase self-start">
                  {largePost.vertical?.name || 'Category'}
                </span>
              </div>
              {/* IMAGE COLUMN */}
              <div className="w-full md:w-[55%] shrink-0">
                {largePost.bannerImage ? (
                  <img src={largePost.bannerImage} alt={largePost.title} className="w-full aspect-[16/9] object-cover" />
                ) : (
                  <div className="w-full aspect-[16/9] bg-gray-100 border border-[var(--line)] flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
            </Link>
          )}

          {mediumPosts.length > 0 && (
            <div className="pt-6 border-t border-[var(--line)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mediumPosts.map(post => (
                  <Link key={post._id} to={`/${post.vertical?.slug || 'vertical'}/${post.slug}`} className="group block">
                    <div className="flex gap-4">
                      <div className="w-[120px] shrink-0">
                        {post.bannerImage ? (
                          <img src={post.bannerImage} alt={post.title} className="w-full aspect-[4/3] object-cover" />
                        ) : (
                          <div className="w-full aspect-[4/3] bg-gray-100 border border-[var(--line)] flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                      </div>
                      <div className="flex flex-col justify-start">
                        <PostTitle title={post.title} size="small" className="mb-2" />
                        <span className="inline-block bg-[var(--green)] text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase self-start">
                          {post.vertical?.name || 'Category'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: 35% Width */}
        <div className="w-full lg:w-[35%] flex flex-col">
          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              {gridPosts.map((post, idx) => (
                <Link key={post._id} to={`/${post.vertical?.slug || 'vertical'}/${post.slug}`} className="group flex flex-col h-full">
                  {post.bannerImage ? (
                    <img src={post.bannerImage} alt={post.title} className="w-full aspect-video object-cover mb-3" />
                  ) : (
                    <div className="w-full aspect-video bg-gray-100 border border-[var(--line)] mb-3 flex items-center justify-center text-xs text-gray-400">No Img</div>
                  )}
                  <div className="flex flex-col flex-1">
                    <span className="inline-block bg-[var(--green)] text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase mb-2 self-start">
                      {post.vertical?.name || 'Category'}
                    </span>
                    <PostTitle title={post.title} size="small" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
