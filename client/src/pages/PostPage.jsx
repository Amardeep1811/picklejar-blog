import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import PostPageSkeleton from '../components/shared/PostPageSkeleton';
import EditorJsRenderer from '../components/shared/EditorJsRenderer';
import ArticleAdCard from '../components/shared/ArticleAdCard';
import PostTitle from '../components/shared/Typography/PostTitle';
import PostExcerpt from '../components/shared/Typography/PostExcerpt';
import { optimizeCloudinaryUrl } from '../utils/optimizeCloudinaryUrl';

export default function PostPage() {
  const { postSlug } = useParams();
  const [data, setData] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [inArticleAds, setInArticleAds] = useState([null, null]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const targetSlug = postSlug;
        if (!targetSlug) throw new Error("Post slug is missing.");
        
        const res = await axios.get(`/posts/${targetSlug}`);
        if (res.data.success) {
          const post = res.data.data;
          setData(post);
          setRelatedPosts(post.relatedPosts || []);
          
          if (post.inArticleAds && post.inArticleAds.length >= 2) {
            setInArticleAds([post.inArticleAds[0], post.inArticleAds[1]]);
          } else if (post.inArticleAds && post.inArticleAds.length === 1) {
            setInArticleAds([post.inArticleAds[0], post.inArticleAds[0]]);
          } else {
            setInArticleAds([null, null]);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postSlug]);

  if (loading) return <PostPageSkeleton />;
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-red-50 text-red-500 p-6 rounded-lg text-center">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  // Render bottom grid with up to 4 posts
  const morePosts = relatedPosts.slice(0, 4);

  const formattedDate = new Date(data.publishDate || data.createdAt).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* HEADER AREA */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center flex flex-col items-center">
        {data.vertical && (
          <Link to={`/${data.vertical.slug}`} className="inline-block bg-[var(--green)] text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 hover:bg-green-700 transition-colors">
            {data.vertical.name}
          </Link>
        )}
        
        <h1 className="text-5xl md:text-6xl lg:text-[4rem] leading-[1.1] font-bold font-serif text-[var(--ink)] mb-6 max-w-3xl">
          {data.title}
        </h1>
        
        {data.excerpt && (
          <p className="text-xl md:text-2xl text-gray-600 italic font-serif max-w-2xl mb-12">
            {data.excerpt}
          </p>
        )}
        
        <div className="w-full border-t border-b border-gray-300 py-4 flex flex-col md:flex-row justify-between items-center text-xs font-bold tracking-widest text-gray-500 uppercase font-sans gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-lg">
              {data.author?.name ? data.author.name.charAt(0) : 'A'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[var(--ink)]">{data.author?.name || 'Editorial Team'}</span>
              <span className="text-[10px] tracking-wider font-normal">Correspondent</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* BANNER IMAGE */}
      {data.bannerImage && (
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <img 
            src={optimizeCloudinaryUrl(data.bannerImage, { width: 1200, crop: 'fill' })} 
            alt={data.title} 
            className="w-full aspect-[21/9] object-cover object-center"
            fetchPriority="high"
          />
        </div>
      )}

      {/* TWO COLUMN LAYOUT: ARTICLE + SIDEBAR */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* ARTICLE BODY */}
        <article className="lg:col-span-8 lg:pr-8">
          <div className="
            text-lg md:text-xl font-serif text-gray-800 leading-relaxed
            [&_p]:mb-6
            [&_h2]:font-sans [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:uppercase [&_h2]:tracking-wider
            [&_h3]:font-sans [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-4
            [&_blockquote]:border-l-[4px] [&_blockquote]:border-[var(--green)] [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-8 [&_blockquote]:text-2xl [&_blockquote]:italic [&_blockquote]:text-[var(--ink)]
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul>li]:mb-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol>li]:mb-2
          ">
            {data.body && data.body.blocks ? (
              <EditorJsRenderer blocks={data.body.blocks} />
            ) : (
              <p>No content available for this post.</p>
            )}
          </div>
        </article>

        {/* RIGHT SIDEBAR (STICKY) */}
        <aside className="lg:col-span-4 relative">
          <div className="sticky top-28 flex flex-col">
            <div className="min-h-[400px]">
              <ArticleAdCard ad={inArticleAds[0]} />
            </div>
            <div className="min-h-[400px]">
              <ArticleAdCard ad={inArticleAds[1]} />
            </div>
          </div>
        </aside>

      </div>

      {/* BELOW ARTICLE: MORE FROM VERTICAL */}
      {morePosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-20 pt-16 border-t-[3px] border-[var(--ink)]">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-1.5 h-4 bg-[var(--green)]"></div>
            <h2 className="text-xl font-bold tracking-widest text-[var(--ink)] uppercase font-sans">
              More From {data.vertical?.name || 'This Section'}
            </h2>
            <div className="w-1.5 h-4 bg-[var(--green)]"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {morePosts.map(post => (
              <Link 
                key={post._id} 
                to={`/${data.vertical?.slug || 'vertical'}/${post.slug}`} 
                className="group flex flex-col transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-4 -mx-4 -my-4"
              >
                {post.bannerImage ? (
                  <img src={optimizeCloudinaryUrl(post.bannerImage, { width: 400, crop: 'fill' })} alt={post.title} className="w-full aspect-[4/3] object-cover mb-4 rounded-sm" loading="lazy" />
                ) : (
                  <div className="w-full aspect-[4/3] bg-gray-100 border border-[var(--line)] mb-4 flex items-center justify-center text-gray-400 text-xs rounded-sm">No Image</div>
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
  );
}