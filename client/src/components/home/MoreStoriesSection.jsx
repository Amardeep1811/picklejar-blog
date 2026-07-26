import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import LoadingSpinner from '../shared/LoadingSpinner';
import PostTitle from '../shared/Typography/PostTitle';
import PostExcerpt from '../shared/Typography/PostExcerpt';
import PostMeta from '../shared/Typography/PostMeta';

export default function MoreStoriesSection() {
  const [moreStories, setMoreStories] = useState([]);
  const [featuredVertA, setFeaturedVertA] = useState(null);
  const [vertAPosts, setVertAPosts] = useState([]);
  const [featuredVertB, setFeaturedVertB] = useState(null);
  const [vertBPosts, setVertBPosts] = useState([]);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch base data
        const [trendingRes, allPostsRes, vertsRes, adRes] = await Promise.all([
          axios.get('/trending'),
          axios.get('/posts?status=published&limit=15'),
          axios.get('/verticals/featured'),
          axios.get('/ads?placement=sidebar&active=true&limit=1')
        ]);

        // 1. Process "More Stories" (excluding trending)
        let excludedIds = [];
        if (trendingRes.data.success && trendingRes.data.data) {
          excludedIds = trendingRes.data.data.map(p => p._id);
        }
        
        if (allPostsRes.data.success) {
          const filtered = allPostsRes.data.data
            .filter(p => !excludedIds.includes(p._id))
            .slice(0, 7);
          setMoreStories(filtered);
        }

        // 2. Set Ad
        if (adRes.data.success && adRes.data.data.length > 0) {
          setAd(adRes.data.data[0]);
        }

        // 3. Process Featured Verticals
        if (vertsRes.data.success && vertsRes.data.data) {
          const vData = vertsRes.data.data;
          const vertA = vData.find(v => v.featuredOrder === 3);
          const vertB = vData.find(v => v.featuredOrder === 4);

          if (vertA) {
            setFeaturedVertA(vertA);
            const pResA = await axios.get(`/posts?status=published&vertical=${vertA._id}&limit=4`);
            if (pResA.data.success) setVertAPosts(pResA.data.data);
          }
          if (vertB) {
            setFeaturedVertB(vertB);
            const pResB = await axios.get(`/posts?status=published&vertical=${vertB._id}&limit=3`);
            if (pResB.data.success) setVertBPosts(pResB.data.data);
          }
        }

      } catch (err) {
        console.error('Failed to load More Stories section:', err);
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
      <section className="mb-12 font-[var(--font-ui)]">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
      </section>
    );
  }

  const numFeatured = (featuredVertA ? 1 : 0) + (featuredVertB ? 1 : 0);

  return (
    <section className="mb-12 font-[var(--font-ui)]">
      <div className="flex flex-col lg:flex-row items-start gap-6 border-t border-[var(--line)] pt-8">
        
        {/* LEFT COLUMN: More Stories */}
        <div className={`w-full ${numFeatured === 0 ? 'lg:w-[60%]' : 'lg:w-[25%]'} flex flex-col ${numFeatured > 0 ? 'lg:pr-6 pb-6 lg:pb-0' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-[var(--ink)]"></div>
            <h2 className="text-lg font-bold tracking-widest text-[var(--ink)] uppercase font-sans">MORE TOP STORIES</h2>
          </div>
          
          <div className="flex flex-col">
            {moreStories.length > 0 ? (
              moreStories.map((post, idx) => {
                const isFirst = idx === 0;
                return (
                  <div key={post._id} className={!isFirst ? 'border-t border-[var(--line)] py-1' : 'pb-1 pt-0'}>
                    <Link 
                      to={`/${post.vertical?.slug || 'vertical'}/${post.slug}`}
                      className="group block transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3"
                    >
                      {isFirst ? (
                        <div>
                          {post.bannerImage ? (
                            <img src={post.bannerImage} alt={post.title} className="w-full aspect-[16/9] object-cover mb-3" />
                          ) : (
                            <div className="w-full aspect-[16/9] bg-gray-100 border border-[var(--line)] mb-3 flex items-center justify-center text-xs text-gray-400">No Img</div>
                          )}
                          <PostTitle title={post.title} size="medium" />
                        </div>
                      ) : (
                        <PostTitle title={post.title} size="small" />
                      )}
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-[var(--gray-2)]">No additional stories.</div>
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: Featured Vertical A */}
        {featuredVertA && (
          <div className={`w-full ${numFeatured === 1 ? 'lg:w-[60%]' : 'lg:w-[45%]'} flex flex-col ${numFeatured === 2 ? 'lg:pr-6 pb-6 lg:pb-0' : ''}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-[var(--green)]"></div>
              <h2 className="text-lg font-bold tracking-widest text-[var(--ink)] uppercase font-sans">{featuredVertA.name}</h2>
            </div>
            
            <div className="flex flex-col">
              {vertAPosts.length > 0 ? (
                <>
                  <div className="pb-5 mb-5 border-b border-[var(--line)]">
                    <Link to={`/${featuredVertA.slug}/${vertAPosts[0].slug}`} className="group block transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3">
                      {vertAPosts[0].bannerImage ? (
                        <img src={vertAPosts[0].bannerImage} alt={vertAPosts[0].title} className="w-full aspect-video object-cover mb-3" />
                      ) : (
                        <div className="w-full aspect-video bg-gray-100 border border-[var(--line)] mb-3 flex items-center justify-center text-xs text-gray-400">No Img</div>
                      )}
                      <PostTitle title={vertAPosts[0].title} size="medium" className="mb-2" />
                      <PostExcerpt excerpt={vertAPosts[0].excerpt} size="small" />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {vertAPosts.slice(1, 4).map(post => (
                      <Link key={post._id} to={`/${featuredVertA.slug}/${post.slug}`} className="group block transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-2 -mx-2">
                        {post.bannerImage ? (
                          <img src={post.bannerImage} alt={post.title} className="w-full aspect-[4/3] object-cover mb-2" />
                        ) : (
                          <div className="w-full aspect-[4/3] bg-gray-100 border border-[var(--line)] mb-2 flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                        <PostTitle title={post.title} size="small" className="text-xs leading-snug" />
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-xs text-[var(--gray-2)]">No stories yet.</div>
              )}
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Ad + Featured Vertical B (or just Ad if 0/1 verts) */}
        <div className={`w-full ${numFeatured === 0 ? 'lg:w-[40%]' : 'lg:w-[30%]'} flex flex-col`}>
          
          {/* Ad Slot */}
          <div className={`mb-4 ${numFeatured > 1 ? 'border-b border-[var(--line)] pb-4' : ''}`}>
            <div className="text-[10px] text-[var(--gray-2)] text-center uppercase tracking-wider mb-2">ADVERTISEMENT</div>
            <div className="w-full flex justify-center">
              {ad ? (
                <a href={ad.ctaUrl || '#'} target="_blank" rel="noreferrer" className="block w-full max-w-[300px] h-[250px]">
                  {ad.image ? (
                    <img src={ad.image} alt={ad.ctaText || 'Ad'} className="w-full h-full object-cover border border-[var(--line)]" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 border border-[var(--line)] flex items-center justify-center text-gray-400 text-sm font-bold">
                      {ad.ctaText || 'Placeholder (300x250)'}
                    </div>
                  )}
                </a>
              ) : (
                <div className="w-full max-w-[300px] h-[250px] border-2 border-dashed border-[var(--gray-2)] flex flex-col items-center justify-center text-[var(--gray-2)] bg-[var(--bg)]">
                  <span className="font-bold text-lg">ADVERTISEMENT</span>
                  <span className="text-sm">300 &times; 250</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Vertical B */}
          {featuredVertB && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-[var(--green)]"></div>
                <h2 className="text-lg font-bold tracking-widest text-[var(--ink)] uppercase font-sans">{featuredVertB.name}</h2>
              </div>
              
              <div className="flex flex-col">
                {vertBPosts.length > 0 ? (
                  vertBPosts.slice(0, 3).map((post, idx) => {
                    const isFirst = idx === 0;
                    return (
                      <div key={post._id} className={!isFirst ? 'border-t border-[var(--line)] py-1' : 'pb-1 pt-0'}>
                        <Link 
                          to={`/${featuredVertB.slug}/${post.slug}`}
                          className="group block transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3"
                        >
                          {isFirst ? (
                            <div className="block">
                              {post.bannerImage ? (
                                <img src={post.bannerImage} alt={post.title} className="w-full aspect-video object-cover mb-3" />
                              ) : (
                                <div className="w-full aspect-video bg-gray-100 border border-[var(--line)] mb-3 flex items-center justify-center text-xs text-gray-400">No Img</div>
                              )}
                              <PostTitle title={post.title} size="small" className="mb-2" />
                              <PostExcerpt excerpt={post.excerpt} size="small" />
                            </div>
                          ) : (
                            <PostTitle title={post.title} size="small" />
                          )}
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-[var(--gray-2)]">No stories yet.</div>
                )}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
}
