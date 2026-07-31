import { Link } from 'react-router-dom';
import PostTitle from '../shared/Typography/PostTitle';
import PostExcerpt from '../shared/Typography/PostExcerpt';
import PostMeta from '../shared/Typography/PostMeta';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';
import NewsletterSection from './NewsletterSection';

export default function MoreStoriesSection({ data: moreStories = [], vertAData = null, vertBData = null, adData: ad = null }) {
  const featuredVertA = vertAData?.vertical;
  const vertAPosts = vertAData?.posts || [];
  const featuredVertB = vertBData?.vertical;
  const vertBPosts = vertBData?.posts || [];


  const numFeatured = featuredVertA ? 1 : 0;

  return (
    <section className="mb-12 font-[var(--font-ui)]">
      <div className="flex flex-col lg:flex-row items-stretch gap-6 border-t border-[var(--line)] pt-8">
        
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
                            <img src={optimizeCloudinaryUrl(post.bannerImage, { width: 600, crop: 'fill' })} alt={post.title} className="w-full aspect-[16/9] object-cover mb-3" loading="lazy" />
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
          <div className={`w-full lg:w-[45%] flex flex-col lg:pr-6 pb-6 lg:pb-0`}>
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
                        <img src={optimizeCloudinaryUrl(vertAPosts[0].bannerImage, { width: 600, crop: 'fill' })} alt={vertAPosts[0].title} className="w-full aspect-video object-cover mb-3" loading="lazy" />
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
                          <img src={optimizeCloudinaryUrl(post.bannerImage, { width: 300, crop: 'fill' })} alt={post.title} className="w-full aspect-[4/3] object-cover mb-2" loading="lazy" />
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

        {/* RIGHT COLUMN: Ad + Newsletter */}
        <div className={`w-full ${numFeatured === 0 ? 'lg:w-[40%]' : 'lg:w-[30%]'} flex flex-col`}>
          
          {/* Ad Slot */}
          <div className="mb-4 min-h-[320px] border-b border-[var(--line)] pb-4">
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

          {/* Newsletter (takes remaining height to match middle column) */}
          <div className="flex-1 flex flex-col pt-4">
            <div className="bg-[var(--ink)] text-[#f2eee2] px-8 py-16 shadow-lg rounded-lg flex flex-col justify-center flex-1">
              <div className="text-center mb-6">
                <h3 className="font-[var(--font-heading)] font-black text-2xl lg:text-3xl mb-3 leading-tight">Get the morning brief</h3>
                <p className="text-[var(--gray-2)] text-base">Your daily brief on money, markets, and more.</p>
              </div>
              <NewsletterSection compact={true} />
            </div>
          </div>

        </div>
        
      </div>
    </section>
  );
}
