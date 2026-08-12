import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostTitle from '../shared/Typography/PostTitle';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';
import axios from '../../api/axios';

export default function SportsSection({ data }) {
  const [localPetitions, setLocalPetitions] = useState([]);
  const [signingPetitionId, setSigningPetitionId] = useState(null);
  const [signEmail, setSignEmail] = useState('');
  const [signStatus, setSignStatus] = useState({ id: null, message: '', type: '' });
  const [signLoading, setSignLoading] = useState(false);

  useEffect(() => {
    if (data?.petitions) {
      setLocalPetitions(data.petitions);
    }
  }, [data]);

  const handleSignPetition = async (e, petitionId) => {
    e.preventDefault();
    if (!signEmail) return;

    try {
      setSignLoading(true);
      setSignStatus({ id: petitionId, message: '', type: '' });
      const res = await axios.post(`/petitions/${petitionId}/sign`, { email: signEmail });
      
      setSignStatus({ id: petitionId, message: res.data.message || 'Signed successfully!', type: 'success' });
      localStorage.setItem(`signed_petition_${petitionId}`, 'true');
      
      setLocalPetitions(prev => prev.map(p => 
        p._id === petitionId 
          ? { ...p, signatureCount: res.data.signatureCount || (p.signatureCount + 1) } 
          : p
      ));
      
      setTimeout(() => {
        setSigningPetitionId(null);
      }, 2000);
      
    } catch (err) {
      setSignStatus({ 
        id: petitionId, 
        message: err.response?.data?.message || 'Failed to sign petition', 
        type: 'error' 
      });
    } finally {
      setSignLoading(false);
    }
  };

  if (!data) return null;
  const { posts = [] } = data;

  if (posts.length === 0) return null;

  const heroPost = posts[0];
  const listPosts = posts.slice(1, 7);

  const formatK = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <section className="w-full mb-12 font-[var(--font-ui)]">
      <div className="bg-[var(--ink)] rounded-lg p-8 shadow-sm border border-[var(--ink)]">
        <h2 className="text-lg font-bold tracking-widest text-[var(--green)] mb-6 uppercase font-sans">Sports</h2>
        
        <div className="flex flex-col lg:flex-row items-stretch gap-8 border-t border-[#333] pt-8">
          
          {/* LEFT: Hero Post */}
          <div className="w-full lg:w-[45%] flex flex-col lg:pr-8 lg:border-r border-[#333]">
            <Link to={`/sports/${heroPost.slug}`} className="group block mb-6 transition-all duration-200 ease-in-out hover:bg-white/5 hover:shadow-lg hover:scale-[1.01] rounded-xl p-4 -mx-4 -mt-4">
              {heroPost.bannerImage ? (
                <img src={optimizeCloudinaryUrl(heroPost.bannerImage, { width: 600, crop: 'fill' })} alt={heroPost.title} className="w-full aspect-[16/9] object-cover mb-4" loading="lazy" />
              ) : (
                <div className="w-full aspect-[16/9] bg-[#222] border border-[#333] mb-4 flex items-center justify-center text-gray-500">No Image</div>
              )}
              <div className="mb-3">
                <span className="inline-block bg-[var(--green)] text-[var(--ink)] px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                  Sports
                </span>
              </div>
              <PostTitle title={heroPost.title} size="hero" className="mb-3 text-3xl leading-tight !text-white group-hover:!text-[var(--green)]" />
              <p className="text-[#aaa] text-sm leading-relaxed">
                {heroPost.excerpt}
              </p>
            </Link>
          </div>
          
          {/* MIDDLE: List Posts */}
          <div className="w-full lg:w-[30%] flex flex-col lg:pr-8 lg:border-r border-[#333]">
            <div className="flex flex-col">
              {listPosts.map((post, idx) => (
                <div key={post._id} className={idx !== 0 ? 'border-t border-[#333] py-2' : 'pb-2 pt-0'}>
                  <Link 
                    to={`/sports/${post.slug}`} 
                    className="group block transition-all duration-200 ease-in-out hover:bg-white/5 hover:shadow-lg hover:scale-[1.01] rounded-xl p-3 -mx-3"
                  >
                    <PostTitle title={post.title} size="medium" className="!text-white group-hover:!text-[var(--green)] leading-snug" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          {/* RIGHT: Petitions */}
          <div className="w-full lg:w-[25%] flex flex-col">
            {localPetitions.length > 0 && (
              <div className="bg-[#111] border-t-[3px] border-t-[var(--green)] border border-[#333] rounded-sm py-4 px-5 shadow-sm">
                <div className="text-lg font-bold tracking-widest text-[var(--green)] mb-4 uppercase font-sans">TRENDING PETITIONS</div>
                <div className="flex flex-col">
                  {localPetitions.map(petition => {
                    const progress = Math.min(100, Math.round((petition.signatureCount / petition.goalCount) * 100)) || 0;
                    const isExpanded = signingPetitionId === petition._id;
                    const hasSignedLocal = localStorage.getItem(`signed_petition_${petition._id}`);
                    
                    return (
                      <div key={petition._id} className="border-b border-[#333] last:border-b-0 py-2 first:pt-0 last:pb-0">
                        <div 
                          className="group block cursor-pointer transition-all duration-200 ease-in-out hover:bg-white/5 hover:shadow-lg hover:scale-[1.01] rounded-xl p-3 -mx-3"
                          onClick={() => {
                            if (!isExpanded) {
                              setSigningPetitionId(petition._id);
                              setSignStatus({ id: null, message: '', type: '' });
                              setSignEmail('');
                            }
                          }}
                        >
                          <div className="text-[10px] tracking-[1px] text-[#888] font-bold mb-1 uppercase">
                            {petition.category} &middot; {formatK(petition.signatureCount)} SIGNATURES
                          </div>
                          <PostTitle title={petition.title} size="headline" className="mb-3 !text-white group-hover:!text-[var(--green)]" />
                          <div className="w-full h-1.5 bg-[#333] rounded-full overflow-hidden mb-1.5">
                            <div 
                              className="h-full bg-[var(--green)] rounded-full transition-all duration-1000"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="text-[11px] text-[#aaa] font-medium">
                            {progress}% of {formatK(petition.goalCount)} goal
                          </div>

                          {isExpanded && (
                            <div className="mt-4 p-3 bg-[#222] border border-[#333] rounded-sm text-sm" onClick={(e) => e.stopPropagation()}>
                              {hasSignedLocal ? (
                                <div className="text-[var(--green)] font-bold text-center py-2">
                                  You've already signed this!
                                </div>
                              ) : (
                                <form onSubmit={(e) => handleSignPetition(e, petition._id)} className="flex flex-col space-y-2">
                                  <p className="font-bold mb-1 text-white">Add your signature</p>
                                  <input 
                                    type="email" 
                                    placeholder="Your email address" 
                                    required
                                    value={signEmail}
                                    onChange={(e) => setSignEmail(e.target.value)}
                                    className="w-full bg-[#111] border border-[#444] text-white p-2 text-sm focus:outline-none focus:border-[var(--green)]"
                                  />
                                  {signStatus.id === petition._id && (
                                    <div className={`text-xs ${signStatus.type === 'error' ? 'text-red-500' : 'text-[var(--green)]'}`}>
                                      {signStatus.message}
                                    </div>
                                  )}
                                  <div className="flex gap-2 pt-1">
                                    <button 
                                      type="submit" 
                                      disabled={signLoading}
                                      className="flex-1 bg-[var(--green)] hover:bg-[var(--green-dark)] text-white font-bold py-2 text-xs transition-colors disabled:opacity-70 rounded-sm"
                                    >
                                      {signLoading ? 'Signing...' : 'Sign Petition'}
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => setSigningPetitionId(null)}
                                      className="px-3 bg-[#333] hover:bg-[#444] text-[#ccc] font-bold py-2 text-xs transition-colors rounded-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              )}
                            </div>
                          )}
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
