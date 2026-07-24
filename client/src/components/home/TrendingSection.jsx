import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import LoadingSpinner from '../shared/LoadingSpinner';
import PostTitle from '../shared/Typography/PostTitle';
import PostExcerpt from '../shared/Typography/PostExcerpt';
import PostMeta from '../shared/Typography/PostMeta';

export default function TrendingSection() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, latestRes, adRes] = await Promise.all([
          axios.get('/trending'),
          axios.get('/posts?status=published&limit=10'),
          axios.get('/ads?placement=sidebar&active=true&limit=1')
        ]);

        if (trendingRes.data.success && trendingRes.data.data.length === 3) {
          const tPosts = trendingRes.data.data;
          setTrendingPosts(tPosts);

          if (latestRes.data.success) {
            const trendingIds = tPosts.map(p => p._id);
            const filteredLatest = latestRes.data.data
              .filter(p => !trendingIds.includes(p._id))
              .slice(0, 5);
            setLatestPosts(filteredLatest);
          }
        } else {
          setError('Not enough trending data available.');
        }

        if (adRes.data.success && adRes.data.data.length > 0) {
          setAd(adRes.data.data[0]);
        }
      } catch (err) {
        console.error('Failed to load trending data:', err);
        setError('Failed to load trending posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <section className="mb-12 border-t-[3px] border-[var(--green)] pt-4 font-['Inter']">
        <h2 className="text-lg font-bold tracking-widest text-[var(--green)] mb-6 uppercase font-sans">TRENDING</h2>
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      </section>
    );
  }

  if (trendingPosts.length < 3) return null;

  const topPost = trendingPosts[0];
  const midTopPost = trendingPosts[1];
  const midBottomPost = trendingPosts[2];

  return (
    <section className="mb-12 font-['Inter']">
      <h2 className="text-lg font-bold tracking-widest text-[var(--green)] uppercase font-sans">TRENDING</h2>

      <div className="flex flex-col lg:flex-row items-start gap-6 border-t border-[var(--line)] pt-8">

        {/* LEFT COLUMN: 50% Hero */}
        <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--line)] lg:pr-6 pb-6 lg:pb-0">
          <Link to={`/${topPost.vertical?.slug || 'vertical'}/${topPost.slug}`} className="group block cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-4 -mx-4 -mt-4">
            {topPost.bannerImage ? (
              <img src={topPost.bannerImage} alt={topPost.title} className="w-full h-[280px] lg:h-[320px] object-cover mb-5 rounded-md" />
            ) : (
              <div className="w-full h-[280px] lg:h-[320px] bg-gray-100 border border-[var(--line)] mb-5 flex items-center justify-center text-gray-400 rounded-md">No Image</div>
            )}
            <div className="mb-3">
              <span className="inline-block bg-[var(--green)] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                {topPost.vertical?.name || 'Category'}
              </span>
            </div>
            <PostTitle title={topPost.title} size="hero" className="mb-4 text-4xl lg:text-5xl leading-tight" />
            <PostExcerpt excerpt={topPost.excerpt} size="medium" className="text-lg" />
          </Link>
        </div>

        {/* MIDDLE COLUMN: 25% #2 and #3 Trending */}
        <div className="w-full lg:w-1/4 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--line)] lg:pr-6 pb-6 lg:pb-0">
          <div className="border-b border-[var(--line)] pb-6 mb-6">
            <Link to={`/${midTopPost.vertical?.slug || 'vertical'}/${midTopPost.slug}`} className="group block cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3 -mt-3">
            {midTopPost.bannerImage ? (
              <img src={midTopPost.bannerImage} alt={midTopPost.title} className="w-full aspect-video object-cover mb-4 rounded-md" />
            ) : (
              <div className="w-full aspect-video bg-gray-100 border border-[var(--line)] mb-4 flex items-center justify-center text-xs text-gray-400 rounded-md">No Img</div>
            )}
            <div className="mb-2">
              <span className="inline-block bg-[var(--green)] text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase">
                {midTopPost.vertical?.name || 'Category'}
              </span>
            </div>
            <PostTitle title={midTopPost.title} size="medium" className="mb-2" />
            <PostExcerpt excerpt={midTopPost.excerpt} size="small" />
            </Link>
          </div>

          <div className="pb-6">
            <Link to={`/${midBottomPost.vertical?.slug || 'vertical'}/${midBottomPost.slug}`} className="group block cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3">
            <div className="mb-2">
              <span className="inline-block bg-[var(--green)] text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase">
                {midBottomPost.vertical?.name || 'Category'}
              </span>
            </div>
            <PostTitle title={midBottomPost.title} size="medium" className="mb-2" />
            <PostExcerpt excerpt={midBottomPost.excerpt} size="small" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: 25% The Latest & Ad */}
        <div className="w-full lg:w-1/4 flex flex-col">
          <div className="h-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--red)]"></span>
            <h2 className="text-lg font-bold tracking-widest text-[var(--red)] uppercase font-sans">THE LATEST</h2>
          </div>
          
          <div className="flex flex-col">
            {latestPosts.length > 0 && (
              <div className="pb-6 pt-2">
                <Link
                  key={latestPosts[0]._id}
                  to={`/${latestPosts[0].vertical?.slug || 'vertical'}/${latestPosts[0].slug}`}
                  className="group block transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3"
                >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-[var(--green)] text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase">
                    {latestPosts[0].vertical?.name || 'Category'}
                  </span>
                  <PostMeta date={latestPosts[0].createdAt} className="text-[var(--gray-2)] m-0" />
                </div>
                <PostTitle title={latestPosts[0].title} size="headline" />
                </Link>
              </div>
            )}

            {latestPosts.slice(1).map((post, idx) => (
              <div key={post._id} className="border-t border-[var(--line)] py-6">
                <Link
                  to={`/${post.vertical?.slug || 'vertical'}/${post.slug}`}
                  className="group block transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3"
                >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-[var(--green)] text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase">
                    {post.vertical?.name || 'Category'}
                  </span>
                  <PostMeta date={post.createdAt} className="text-[var(--gray-2)] m-0" />
                </div>
                <PostTitle title={post.title} size="headline" />
                </Link>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
