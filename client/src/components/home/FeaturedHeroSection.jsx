import { Link } from 'react-router-dom';
import PostTitle from '../shared/Typography/PostTitle';
import PostExcerpt from '../shared/Typography/PostExcerpt';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';

export default function FeaturedHeroSection({ data }) {
  if (!data) return null;
  const { vertical, posts } = data;

  if (!vertical || posts.length === 0) return null;

  // Post allocations (up to 8 posts)
  const heroPost = posts[0];
  const rightColumnPosts = posts.slice(1, 4);
  const bottomGridPosts = posts.slice(4, 8);

  const getSlug = (p) => `/${p.vertical?.slug || vertical.slug}/${p.slug}`;

  return (
    <section className="mb-12 font-[var(--font-ui)]">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-4 bg-[var(--green)]"></div>
        <h2 className="text-lg font-bold tracking-widest text-[var(--ink)] uppercase font-sans">
          {vertical.name}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-8 pb-8 border-t border-[var(--line)] pt-8">
        
        {/* LEFT COLUMN: 1 Hero Article (~60% width) */}
        <div className="w-full lg:w-[60%] flex flex-col lg:pr-8 lg:border-r border-[var(--line)]">
          {heroPost && (
            <Link 
              to={getSlug(heroPost)} 
              className="group flex flex-col md:flex-row items-stretch gap-8 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-4 -mx-4 -mt-4 h-full"
            >
              <div className="w-full md:w-[50%] flex flex-col justify-start order-2 md:order-1">
                <PostTitle title={heroPost.title} size="hero" as="h1" className="mb-4 leading-tight text-4xl" />
                <PostExcerpt excerpt={heroPost.excerpt} size="large" className="text-gray-600 leading-relaxed" />
              </div>
              <div className="w-full md:w-[50%] shrink-0 order-1 md:order-2">
                {heroPost.bannerImage ? (
                  <img 
                    src={optimizeCloudinaryUrl(heroPost.bannerImage, { width: 460, crop: 'fill' })} 
                    alt={heroPost.title} 
                    className="w-full h-full object-cover rounded-sm shadow-sm"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 border border-[var(--line)] flex items-center justify-center text-gray-400 rounded-sm">
                    No Image Available
                  </div>
                )}
              </div>
            </Link>
          )}
        </div>

        {/* RIGHT COLUMN: 3 Stories List (~40% width) */}
        <div className="w-full lg:w-[40%] flex flex-col justify-start">
          <div className="flex flex-col h-full justify-between">
            {rightColumnPosts.map((post, idx) => (
              <div key={post._id} className={`flex-1 flex flex-col ${idx !== 0 ? "pt-4 border-t border-[var(--line)] mt-4" : ""}`}>
                <Link 
                  to={getSlug(post)} 
                  className="group flex flex-col h-full transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-2 -mx-2"
                >
                  <div className="flex items-stretch gap-4 h-full">
                    <div className="flex-1 flex flex-col justify-start min-w-0 pt-1">
                      <PostTitle title={post.title} size="small" className="text-lg leading-snug font-bold line-clamp-3" />
                    </div>
                    <div className="w-2/5 shrink-0">
                      {post.bannerImage ? (
                        <img src={optimizeCloudinaryUrl(post.bannerImage, { width: 400, crop: 'fill' })} alt={post.title} className="w-full h-full object-cover rounded-sm shadow-sm" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 border border-[var(--line)] flex items-center justify-center text-[10px] text-gray-400 rounded-sm">No Img</div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM GRID ROW: 4 articles */}
      {bottomGridPosts.length > 0 && (
        <div className="pt-8 border-t border-dashed border-[var(--line)] mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bottomGridPosts.map(post => (
              <Link 
                key={post._id} 
                to={getSlug(post)} 
                className="group block transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-3 -mx-3"
              >
                <div className="mb-3">
                  {post.bannerImage ? (
                    <img src={optimizeCloudinaryUrl(post.bannerImage, { width: 600, crop: 'fill' })} alt={post.title} className="w-full aspect-[16/10] object-cover rounded-sm" loading="lazy" />
                  ) : (
                    <div className="w-full aspect-[16/10] bg-gray-100 border border-[var(--line)] flex items-center justify-center text-xs text-gray-400 rounded-sm">No Image</div>
                  )}
                </div>
                <PostTitle title={post.title} size="small" className="text-base leading-tight font-bold line-clamp-3" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
