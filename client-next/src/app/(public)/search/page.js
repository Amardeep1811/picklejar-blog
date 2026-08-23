"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import axios from "@/api/axios";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PostTitle from "@/components/shared/Typography/PostTitle";
import PostExcerpt from "@/components/shared/Typography/PostExcerpt";
import SectionDividerAd from "@/components/ads/SectionDividerAd";
import { optimizeCloudinaryUrl } from '@/utils/optimizeCloudinaryUrl';
import Image from 'next/image';
import { Suspense } from 'react';

function SearchContent() {
  const [query, setQuery] = useState('');
  const [verticals, setVerticals] = useState([]);
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [timeRange, setTimeRange] = useState('any');
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const [isVisible, setIsVisible] = useState(false);
  const searchTimeout = useRef(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    setIsVisible(true);
    
    axios.get('/verticals').then(res => {
      if (res.data.success) {
        setVerticals(res.data.data.filter(v => v.active));
      }
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const q = searchParams?.get('q') || '';
    const v = searchParams?.get('vertical') || 'all';
    const t = searchParams?.get('timeRange') || 'any';
    
    if (q !== query) setQuery(q);
    if (v !== selectedVertical) setSelectedVertical(v);
    if (t !== timeRange) setTimeRange(t);
    
    fetchResults(q, v, t, true);
  }, [searchParams]);

  const fetchResults = async (q, v, t, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      
      const skip = reset ? 0 : posts.length;
      const res = await axios.get(`/posts/search?q=${encodeURIComponent(q)}&vertical=${v}&timeRange=${t}&limit=10&skip=${skip}`);
      
      if (res.data.success) {
        const newPosts = res.data.data;
        if (reset) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
        
        if (newPosts.length < 10) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Failed to fetch search results', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    searchTimeout.current = setTimeout(() => {
      updateUrl(val, selectedVertical, timeRange);
    }, 500);
  };

  const clearSearch = () => {
    setQuery('');
    updateUrl('', selectedVertical, timeRange);
  };

  const updateUrl = (q, v, t) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (v !== 'all') params.set('vertical', v);
    if (t !== 'any') params.set('timeRange', t);
    
    router.push(`${pathname}?${params.toString()}`, { replace: true });
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);
    
    if (diffHrs < 24) {
      return diffHrs === 0 ? 'Just now' : `${diffHrs} hr ago`;
    }
    
    return date.toLocaleDateString('en-US', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className={`bg-white min-h-screen pb-20 transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Search Header Area */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 border-b border-[var(--ink)] pb-4">
          <div className="relative flex-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black absolute left-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search Wallet Pickle" 
              value={query}
              onChange={handleSearchChange}
              className="w-full bg-transparent text-black text-2xl md:text-3xl font-sans font-bold outline-none pl-10 pr-10 placeholder-gray-400"
            />
            {query && (
              <button onClick={clearSearch} className="absolute right-0 text-gray-500 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm font-sans shrink-0">
            <select 
              value={selectedVertical}
              onChange={(e) => updateUrl(query, e.target.value, timeRange)}
              className="bg-white text-black border border-gray-300 rounded px-4 py-2 outline-none hover:border-[var(--ink)] cursor-pointer"
            >
              <option value="all">All types</option>
              {verticals.map(v => (
                <option key={v._id} value={v._id}>{v.name}</option>
              ))}
            </select>
            
            <select 
              value={timeRange}
              onChange={(e) => updateUrl(query, selectedVertical, e.target.value)}
              className="bg-white text-black border border-gray-300 rounded px-4 py-2 outline-none hover:border-[var(--ink)] cursor-pointer"
            >
              <option value="any">Any time</option>
              <option value="24h">Last 24 hours</option>
              <option value="week">Last week</option>
              <option value="month">Last month</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Content Layout */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Results */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex justify-between items-end border-b border-[var(--line)] pb-4 mb-6">
            <h2 className="text-lg font-bold text-[var(--ink)] font-sans uppercase tracking-wider">
              {query ? 'All Results' : 'Latest Stories'}
            </h2>
          </div>
          
          {loading ? (
            <div className="py-12"><LoadingSpinner /></div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-lg">No results found for your search.</div>
          ) : (
            <div className="flex flex-col">
              {posts.map((post, idx) => (
                <div key={post._id} className={`flex flex-col sm:flex-row gap-6 ${idx !== 0 ? 'border-t border-[var(--line)] pt-6' : ''} pb-6 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] transition-all duration-200 rounded-xl p-4 -mx-4`}>
                  <div className="w-full sm:w-[120px] shrink-0 text-sm text-[var(--gray-2)] font-sans">
                    {formatTimestamp(post.publishDate || post.createdAt)}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <Link href={`/${post.vertical?.slug || 'vertical'}/${post.slug}`} className="group block mb-3">
                      <PostTitle title={post.title} size="medium" className="mb-2 group-hover:text-[var(--green)] transition-colors" />
                      <PostExcerpt excerpt={post.excerpt} size="small" className="text-gray-600 line-clamp-2" />
                    </Link>
                    <div className="flex items-center gap-2 mt-auto">
                      {post.vertical && (
                        <span className="inline-block bg-[var(--green)] text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase">
                          {post.vertical.name}
                        </span>
                      )}
                      <span className="text-xs text-[var(--gray-2)]">
                        By {post.author?.name || 'Editorial Team'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-[180px] shrink-0">
                    <Link href={`/${post.vertical?.slug || 'vertical'}/${post.slug}`}>
                      {post.bannerImage ? (
                        <Image src={optimizeCloudinaryUrl(post.bannerImage, { width: 360, crop: 'fill' })} alt={post.title} width={360} height={202} className="w-full aspect-video object-cover rounded-sm border border-[var(--line)]" />
                      ) : (
                        <div className="w-full aspect-video bg-gray-100 border border-[var(--line)] flex items-center justify-center text-xs text-gray-400 rounded-sm">No Img</div>
                      )}
                    </Link>
                  </div>
                </div>
              ))}
              
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={() => fetchResults(query, selectedVertical, timeRange, false)}
                    disabled={loadingMore}
                    className="px-8 py-3 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white rounded-full font-bold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Right Sidebar */}
        <aside className="lg:col-span-4 relative">
          <div className="sticky top-6 flex flex-col gap-12">
            
            {/* Ad Widget */}
            <div className="w-full bg-white flex justify-center py-4 border border-gray-200">
              <SectionDividerAd />
            </div>
            
          </div>
        </aside>
        
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><LoadingSpinner /></div>}>
      <SearchContent />
    </Suspense>
  );
}