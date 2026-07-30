import { Link } from 'react-router-dom';
import PostTitle from '../shared/Typography/PostTitle';
import PostExcerpt from '../shared/Typography/PostExcerpt';
import PostMeta from '../shared/Typography/PostMeta';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';

export default function TrendingSection({ data: trendingPosts = [], latestData: latestPosts = [], adData: ad = null }) {



  if (trendingPosts.length < 3) return null;

  const topPost = trendingPosts[0];
  const midTopPost = trendingPosts[1];
  const midBottomPost = trendingPosts[2];

  const displayLatest = latestPosts.slice(0, 5);

  return (
    <section className="mb-12 font-[var(--font-ui)]">
      <h2 className="text-lg font-bold tracking-widest text-[var(--green)] uppercase font-sans">TRENDING</h2>

      <div className="flex flex-col lg:flex-row items-start gap-6 border-t border-[var(--line)] pt-8">

        {/* LEFT COLUMN: 50% Hero */}
        <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--line)] lg:pr-6 pb-6 lg:pb-0">
          <Link to={`/${topPost.vertical?.slug || 'vertical'}/${topPost.slug}`} className="group block cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-4 -mx-4 -mt-4">
            {topPost.bannerImage ? (
              <img src={optimizeCloudinaryUrl(topPost.bannerImage, { width: 800, crop: 'fill' })} alt={topPost.title} className="w-full h-[280px] lg:h-[320px] object-cover mb-5 rounded-md" fetchPriority="high" />
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
              <img src={optimizeCloudinaryUrl(midTopPost.bannerImage, { width: 400, crop: 'fill' })} alt={midTopPost.title} className="w-full aspect-video object-cover mb-4 rounded-md" loading="lazy" />
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
            {displayLatest.length > 0 && (
              <div className="pb-6 pt-2">
                <Link
                  key={displayLatest[0]._id}
                  to={`/${displayLatest[0].vertical?.slug || 'vertical'}/${displayLatest[0].slug}`}
                  className="group block transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3"
                >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-[var(--green)] text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase">
                    {displayLatest[0].vertical?.name || 'Category'}
                  </span>
                  <PostMeta date={displayLatest[0].createdAt} className="text-[var(--gray-2)] m-0" />
                </div>
                <PostTitle title={displayLatest[0].title} size="headline" />
                </Link>
              </div>
            )}

            {displayLatest.slice(1).map((post, idx) => (
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
