import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import LoadingSpinner from '../shared/LoadingSpinner';
import PostTitle from '../shared/Typography/PostTitle';
import PostExcerpt from '../shared/Typography/PostExcerpt';

export default function FeaturedVerticalSection({ vertical: inputVertical }) {
  const [vertical, setVertical] = useState(inputVertical || null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let targetVertical = inputVertical;

        if (!targetVertical) {
          const vertsRes = await axios.get('/verticals/featured');
          if (vertsRes.data.success && vertsRes.data.data.length > 1) {
            targetVertical = vertsRes.data.data[1]; // 2nd-priority featured vertical (featuredOrder: 2)
          } else if (vertsRes.data.success && vertsRes.data.data.length > 0) {
            targetVertical = vertsRes.data.data[0];
          }
        }

        if (targetVertical) {
          setVertical(targetVertical);
          const postsRes = await axios.get(`/posts?status=published&vertical=${targetVertical._id}&limit=7`);
          if (postsRes.data.success) {
            setPosts(postsRes.data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load featured vertical section:', err);
        setError('Failed to load content.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [inputVertical]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <section className="mb-12 font-[var(--font-ui)]">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
      </section>
    );
  }

  if (!vertical || posts.length === 0) return null;

  const largePost = posts[0];
  const mediumPosts = posts.slice(1, 3);
  const gridPosts = posts.slice(3, 7);

  return (
    <section className="mb-12 font-[var(--font-ui)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-4 bg-[var(--green)]"></div>
        <h2 className="text-lg font-bold tracking-widest text-[var(--ink)] uppercase font-sans">
          {vertical.name}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-6 border-t border-[var(--line)] pt-8">

        {/* LEFT COLUMN: 60% Width */}
        <div className="w-full lg:w-[65%] flex flex-col lg:pr-6 pb-6 lg:pb-0 lg:border-r border-[var(--line)]">
          {largePost && (
            <Link
              to={`/${largePost.vertical?.slug || vertical.slug}/${largePost.slug}`}
              className="group flex flex-col md:flex-row gap-6 mb-6 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-4 -mx-4 -mt-4"
            >
              {/* TEXT COLUMN */}
              <div className="w-full md:w-[40%] flex flex-col justify-start">
                <PostTitle title={largePost.title} size="hero" className="mb-3 text-3xl leading-tight" />
                <PostExcerpt excerpt={largePost.excerpt} size="medium" className="mb-4" />
              </div>
              {/* IMAGE COLUMN */}
              <div className="w-full md:w-[55%] shrink-0">
                {largePost.bannerImage ? (
                  <img src={largePost.bannerImage} alt={largePost.title} className="w-full aspect-[16/9] object-cover rounded-sm" />
                ) : (
                  <div className="w-full aspect-[16/9] bg-gray-100 border border-[var(--line)] flex items-center justify-center text-gray-400 rounded-sm">No Image</div>
                )}
              </div>
            </Link>
          )}

          {mediumPosts.length > 0 && (
            <div className="pt-6 border-t border-[var(--line)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mediumPosts.map(post => (
                  <Link
                    key={post._id}
                    to={`/${post.vertical?.slug || vertical.slug}/${post.slug}`}
                    className="group block transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3 -my-3"
                  >
                    <div className="flex gap-4">
                      <div className="w-[120px] shrink-0">
                        {post.bannerImage ? (
                          <img src={post.bannerImage} alt={post.title} className="w-full aspect-[4/3] object-cover rounded-sm" />
                        ) : (
                          <div className="w-full aspect-[4/3] bg-gray-100 border border-[var(--line)] flex items-center justify-center text-xs text-gray-400 rounded-sm">No Img</div>
                        )}
                      </div>
                      <div className="flex flex-col justify-start">
                        <PostTitle title={post.title} size="small" className="mb-2" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: 40% Width */}
        <div className="w-full lg:w-[35%] flex flex-col justify-between">
          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              {gridPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/${post.vertical?.slug || vertical.slug}/${post.slug}`}
                  className="group flex flex-col transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3 -my-3"
                >
                  {post.bannerImage ? (
                    <img src={post.bannerImage} alt={post.title} className="w-full aspect-[4/3] object-cover mb-3 rounded-sm" />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-gray-100 border border-[var(--line)] mb-3 flex items-center justify-center text-xs text-gray-400 rounded-sm">No Img</div>
                  )}
                  <div className="flex flex-col flex-1">
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
