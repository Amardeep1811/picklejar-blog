import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import PostTitle from '../components/shared/Typography/PostTitle';
import PostExcerpt from '../components/shared/Typography/PostExcerpt';
import SectionDividerAd from '../components/ads/SectionDividerAd';

export default function VerticalPage() {
  const { verticalSlug } = useParams();
  const [vertical, setVertical] = useState(null);
  const [posts, setPosts] = useState([]);
  const [morePosts, setMorePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        setHasMore(true);
        
        // Find the vertical
        const vertsRes = await axios.get('/verticals');
        if (!vertsRes.data.success) throw new Error('Failed to fetch verticals');
        
        const currentVertical = vertsRes.data.data.find(v => v.slug === verticalSlug);
        if (!currentVertical) {
          throw new Error('Vertical not found');
        }
        setVertical(currentVertical);

        // Fetch posts for this vertical (up to 23 for initial load)
        const postsRes = await axios.get(`/posts?status=published&vertical=${currentVertical._id}&limit=23`);
        if (postsRes.data.success) {
          setPosts(postsRes.data.data.slice(0, 15));
          setMorePosts(postsRes.data.data.slice(15, 23));
          if (postsRes.data.data.length < 23) {
            setHasMore(false);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load vertical');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [verticalSlug]);

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const skipAmount = 15 + morePosts.length;
      const res = await axios.get(`/posts?status=published&vertical=${vertical._id}&limit=8&skip=${skipAmount}`);
      if (res.data.success) {
        const newPosts = res.data.data;
        setMorePosts(prev => [...prev, ...newPosts]);
        if (newPosts.length < 8) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Failed to load more posts', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-red-50 text-red-500 p-6 rounded-lg text-center">{error}</div>
      </div>
    );
  }

  if (!vertical) return null;

  const heroPost = posts[0];
  const gridPosts = posts.slice(1, 7);
  const listPosts = posts.slice(7, 15);
  
  // Split remaining into two columns
  const colA = listPosts.slice(0, Math.ceil(listPosts.length / 2));
  const colB = listPosts.slice(Math.ceil(listPosts.length / 2));

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Page Heading */}
        <h1 className="text-5xl md:text-7xl font-bold font-serif text-[var(--ink)] text-center mb-20 border-b-[4px] border-[var(--ink)] pb-10 tracking-tight capitalize">
          {vertical.name}
        </h1>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg">More stories coming soon.</div>
        ) : (
          <>
            {/* SECTION 1: Times-Style Lead + Grid */}
            <section className="mb-16">
              <div className="flex flex-col lg:flex-row gap-10">
                
                {/* LEAD STORY */}
                {heroPost && (
                  <div className="w-full lg:w-[55%] flex flex-col lg:pr-10 lg:border-r border-[var(--line)]">
                    <Link to={`/${vertical.slug}/${heroPost.slug}`} className="group block transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-4 -mx-4">
                      {heroPost.bannerImage ? (
                        <img src={heroPost.bannerImage} alt={heroPost.title} className="w-full aspect-[16/9] object-cover mb-4 rounded-sm" />
                      ) : (
                        <div className="w-full aspect-[16/9] bg-gray-100 border border-[var(--line)] mb-4 flex items-center justify-center text-gray-400 text-sm rounded-sm">No Image</div>
                      )}
                      
                      <div className="mb-4">
                        <span className="inline-block bg-[var(--green)] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                          {heroPost.editorsPick ? "Editor's Pick" : "New"}
                        </span>
                      </div>
                      
                      <PostTitle title={heroPost.title} size="hero" className="mb-4 leading-tight" />
                      <PostExcerpt excerpt={heroPost.excerpt} size="large" className="text-gray-600 leading-relaxed" />
                    </Link>
                  </div>
                )}
                
                {/* GRID STORIES */}
                {gridPosts.length > 0 && (
                  <div className="w-full lg:w-[45%] flex flex-col">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {gridPosts.map(post => (
                        <Link key={post._id} to={`/${vertical.slug}/${post.slug}`} className="group flex flex-col transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3 -my-3">
                          {post.bannerImage ? (
                            <img src={post.bannerImage} alt={post.title} className="w-full aspect-video object-cover mb-3 rounded-sm" />
                          ) : (
                            <div className="w-full aspect-video bg-gray-100 border border-[var(--line)] mb-3 flex items-center justify-center text-gray-400 text-xs rounded-sm">No Image</div>
                          )}
                          <div className="flex flex-col flex-1">
                            <PostTitle title={post.title} size="small" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
            </section>
            
            {/* SECTION 2: Two-Column Dense List */}
            {listPosts.length > 0 && (
              <section className="mb-12 border-t-[3px] border-[var(--ink)] pt-8">
                <div className="flex flex-col lg:flex-row gap-12">
                  
                  {/* Column A */}
                  <div className="w-full lg:w-1/2 flex flex-col lg:pr-12 lg:border-r border-[var(--line)]">
                    <div className="flex flex-col">
                      {colA.map((post, idx) => (
                        <div key={post._id} className={idx !== 0 ? 'border-t border-[var(--line)] py-4' : 'pb-4 pt-0'}>
                          <Link 
                            to={`/${vertical.slug}/${post.slug}`} 
                            className="group flex gap-5 items-center transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3"
                          >
                            <div className="w-[120px] shrink-0">
                              {post.bannerImage ? (
                                <img src={post.bannerImage} alt={post.title} className="w-full aspect-[4/3] object-cover rounded-sm" />
                              ) : (
                                <div className="w-full aspect-[4/3] bg-gray-100 border border-[var(--line)] flex items-center justify-center text-xs text-gray-400 rounded-sm">No Img</div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <PostTitle title={post.title} size="medium" className="mb-2" />
                              <PostExcerpt excerpt={post.excerpt} size="small" />
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Column B */}
                  <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="flex flex-col">
                      {colB.map((post, idx) => (
                        <div key={post._id} className={idx !== 0 ? 'border-t border-[var(--line)] py-4' : 'pb-4 pt-0'}>
                          <Link 
                            to={`/${vertical.slug}/${post.slug}`} 
                            className="group flex gap-5 items-center transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3"
                          >
                            <div className="w-[120px] shrink-0">
                              {post.bannerImage ? (
                                <img src={post.bannerImage} alt={post.title} className="w-full aspect-[4/3] object-cover rounded-sm" />
                              ) : (
                                <div className="w-full aspect-[4/3] bg-gray-100 border border-[var(--line)] flex items-center justify-center text-xs text-gray-400 rounded-sm">No Img</div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <PostTitle title={post.title} size="medium" className="mb-2" />
                              <PostExcerpt excerpt={post.excerpt} size="small" />
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </div>
              </section>
            )}

            {/* AD SLOT */}
            <div className="w-full flex justify-center mb-16">
              <SectionDividerAd />
            </div>

            {/* SECTION 3: More From Grid */}
            {morePosts.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-2 mb-8 justify-center">
                  <div className="w-1.5 h-4 bg-[var(--green)]"></div>
                  <h2 className="text-xl font-bold tracking-widest text-[var(--ink)] uppercase font-sans">
                    More From {vertical.name}
                  </h2>
                  <div className="w-1.5 h-4 bg-[var(--green)]"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                  {morePosts.map(post => (
                    <Link 
                      key={post._id} 
                      to={`/${vertical.slug}/${post.slug}`} 
                      className="group flex flex-col transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-4 -mx-4 -my-4"
                    >
                      {post.bannerImage ? (
                        <img src={post.bannerImage} alt={post.title} className="w-full aspect-[4/3] object-cover mb-4 rounded-sm" />
                      ) : (
                        <div className="w-full aspect-[4/3] bg-gray-100 border border-[var(--line)] mb-4 flex items-center justify-center text-gray-400 text-xs rounded-sm">No Image</div>
                      )}
                      <div className="flex flex-col flex-1">
                        <PostTitle title={post.title} size="small" />
                      </div>
                    </Link>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center">
                    <button 
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-8 py-3 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white rounded-full font-bold transition-colors disabled:opacity-50"
                    >
                      {loadingMore ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </section>
            )}

          </>
        )}
      </div>
    </div>
  );
}