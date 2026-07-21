import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function SportsSection() {
  const [posts, setPosts] = useState([]);
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sportsRes = await axios.get('/verticals?slug=sports');
        const vertical = sportsRes.data.success && sportsRes.data.data.find(v => v.slug === 'sports');
        
        if (vertical) {
          const [pRes, petRes] = await Promise.all([
            axios.get(`/posts?status=published&vertical=${vertical._id}&limit=6`),
            axios.get('/petitions?active=true&limit=5')
          ]);
          if (pRes.data.success) setPosts(pRes.data.data);
          if (petRes.data.success) setPetitions(petRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load sports section', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (posts.length === 0) return null;

  const heroPost = posts[0];
  const listPosts = posts.slice(1, 6);

  const formatK = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <section className="w-full mb-12 font-['Inter']">
      <div className="bg-[var(--ink)] rounded-lg p-8 shadow-sm border border-[var(--ink)]">
        <h2 className="text-sm font-black tracking-widest text-[var(--green)] mb-6 uppercase">Sports</h2>
        
        <div className="flex flex-col lg:flex-row items-start gap-8 border-t border-[#333] pt-8">
          
          {/* LEFT: Hero Post */}
          <div className="w-full lg:w-[45%] flex flex-col lg:pr-8 lg:border-r border-[#333]">
            <Link to={`/sports/${heroPost.slug}`} className="group block mb-6">
              {heroPost.bannerImage ? (
                <img src={heroPost.bannerImage} alt={heroPost.title} className="w-full aspect-[16/9] object-cover mb-4" />
              ) : (
                <div className="w-full aspect-[16/9] bg-[#222] border border-[#333] mb-4 flex items-center justify-center text-gray-500">No Image</div>
              )}
              <div className="mb-3">
                <span className="inline-block bg-[var(--green)] text-[var(--ink)] px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                  Sports
                </span>
              </div>
              <h3 className="font-bold text-3xl text-white mb-3 leading-tight group-hover:text-[var(--green)] transition-colors">
                {heroPost.title}
              </h3>
              <p className="text-[#aaa] text-sm leading-relaxed">
                {heroPost.excerpt}
              </p>
            </Link>
          </div>
          
          {/* MIDDLE: List Posts */}
          <div className="w-full lg:w-[30%] flex flex-col lg:pr-8 lg:border-r border-[#333]">
            <div className="flex flex-col">
              {listPosts.map((post, idx) => (
                <Link 
                  key={post._id} 
                  to={`/sports/${post.slug}`} 
                  className={`group block py-4 ${idx !== 0 ? 'border-t border-[#333]' : 'pt-0'}`}
                >
                  <h4 className="font-bold text-lg text-white group-hover:text-[var(--green)] transition-colors leading-snug">
                    {post.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
          
          {/* RIGHT: Petitions */}
          <div className="w-full lg:w-[25%] flex flex-col">
            {petitions.length > 0 && (
              <div className="bg-[#111] border-t-[3px] border-t-[var(--green)] border border-[#333] rounded-sm py-4 px-5 shadow-sm">
                <div className="text-[11px] font-bold tracking-widest text-[var(--green)] mb-4">TRENDING PETITIONS</div>
                <div className="flex flex-col">
                  {petitions.map(petition => {
                    const progress = Math.min(100, Math.round((petition.signatureCount / petition.goalCount) * 100)) || 0;
                    return (
                      <div key={petition._id} className="group block border-b border-[#333] last:border-b-0 py-4 first:pt-0 last:pb-0 cursor-pointer transition-all duration-300 hover:bg-[#1a1a1a] px-3 -mx-3 rounded-md">
                        <div className="text-[10px] tracking-[1px] text-[#888] font-bold mb-1 uppercase">
                          {petition.category} &middot; {formatK(petition.signatureCount)} SIGNATURES
                        </div>
                        <h4 className="font-['Playfair_Display'] font-bold text-[16px] leading-snug mb-3 text-white group-hover:text-[var(--green)] transition-colors">
                          {petition.title}
                        </h4>
                        <div className="w-full h-1.5 bg-[#333] rounded-full overflow-hidden mb-1.5">
                          <div 
                            className="h-full bg-[var(--green)] rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-[11px] text-[#aaa] font-medium">
                          {progress}% of {formatK(petition.goalCount)} goal
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
