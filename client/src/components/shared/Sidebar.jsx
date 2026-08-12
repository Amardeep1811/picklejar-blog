import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import PostTitle from '../shared/Typography/PostTitle';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';

export default function Sidebar() {
  const [sponsoredAd, setSponsoredAd] = useState(null);
  const [bannerAd, setBannerAd] = useState(null);
  const [petitions, setPetitions] = useState([]);
  const [editorsPicks, setEditorsPicks] = useState([]);
  
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('');
  const [subLoading, setSubLoading] = useState(false);

  const [signingPetitionId, setSigningPetitionId] = useState(null);
  const [signEmail, setSignEmail] = useState('');
  const [signStatus, setSignStatus] = useState({ id: null, message: '', type: '' });
  const [signLoading, setSignLoading] = useState(false);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [sponsoredRes, bannerRes, petitionsRes, picksRes] = await Promise.all([
          axios.get('/ads?placement=sidebar&type=sponsored&active=true&limit=1'),
          axios.get('/ads?placement=sidebar&type=banner&active=true&limit=1'),
          axios.get('/petitions?active=true&limit=5')
        ]);

        if (sponsoredRes.data.success && sponsoredRes.data.data.length > 0) {
          setSponsoredAd(sponsoredRes.data.data[0]);
        }
        if (bannerRes.data.success && bannerRes.data.data.length > 0) {
          setBannerAd(bannerRes.data.data[0]);
        }
        if (petitionsRes.data.success) {
          setPetitions(petitionsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load sidebar data', err);
      }
    };
    fetchSidebarData();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setSubLoading(true);
      setSubStatus('');
      await axios.post('/subscribers', { email });
      setSubStatus('success');
      setEmail('');
    } catch (err) {
      setSubStatus(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubLoading(false);
    }
  };

  const handleSignPetition = async (e, petitionId) => {
    e.preventDefault();
    if (!signEmail) return;

    try {
      setSignLoading(true);
      setSignStatus({ id: petitionId, message: '', type: '' });
      const res = await axios.post(`/petitions/${petitionId}/sign`, { email: signEmail });
      
      setSignStatus({ id: petitionId, message: res.data.message || 'Signed successfully!', type: 'success' });
      localStorage.setItem(`signed_petition_${petitionId}`, 'true');
      
      setPetitions(prev => prev.map(p => 
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

  const formatK = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  const adStyles = "group block w-full bg-[var(--bg-2)] border border-[var(--line)] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md";

  return (
    <aside className="w-full flex flex-col space-y-10 font-[var(--font-ui)]">
      
      {/* 1. Sponsored Card */}
      <div>
        <div className="text-[10px] tracking-wider text-[var(--gray)] mb-2 font-semibold">SPONSORED</div>
        <div className="w-full bg-[var(--bg-2)] border border-[var(--line)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md group">
          {sponsoredAd ? (
            <a href={sponsoredAd.ctaUrl} target="_blank" rel="noreferrer" className="block w-full h-full">
              {sponsoredAd.image ? (
                <img src={optimizeCloudinaryUrl(sponsoredAd.image, { width: 300, crop: 'fill' })} alt="Sponsored" className="w-full h-[250px] object-cover bg-gray-200" />
              ) : (
                <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
              )}
              <div className="bg-[var(--green)] text-white text-center py-2 text-sm font-bold opacity-90 group-hover:opacity-100 transition-opacity">
                {sponsoredAd.ctaText || 'Learn More'}
              </div>
            </a>
          ) : (
            <div className="block w-full h-full p-4">
              <div className="w-full h-[218px] border-2 border-dashed border-[var(--gray-2)] flex flex-col items-center justify-center text-[var(--gray-2)] bg-[var(--bg)]">
                <span className="font-bold text-lg">SPONSORED</span>
                <span className="text-sm">300 &times; 250</span>
              </div>
              <div className="py-2 text-sm font-bold text-transparent text-center bg-transparent">
                Placeholder
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Trending Petitions */}
      {petitions.length > 0 && (
        <div className="bg-white border-t-[3px] border-t-[var(--green)] border border-[var(--line)] rounded-sm py-4 px-5 shadow-sm">
          <div className="text-lg font-bold tracking-widest text-[var(--green)] mb-4 uppercase font-sans">TRENDING PETITIONS</div>
          <div className="flex flex-col">
            {petitions.map(petition => {
              const progress = Math.min(100, Math.round((petition.signatureCount / petition.goalCount) * 100)) || 0;
              const isExpanded = signingPetitionId === petition._id;
              const hasSignedLocal = localStorage.getItem(`signed_petition_${petition._id}`);
              return (
                <div 
                  key={petition._id} 
                  className="group block border-b border-[var(--line)] last:border-b-0 py-4 first:pt-0 last:pb-0 cursor-pointer transition-all duration-300 hover:bg-[#faf8f2] hover:shadow-[0_10px_22px_-10px_rgba(20,22,29,0.14)] hover:-translate-y-1 hover:scale-[1.01] px-3 -mx-3 rounded-md z-10 relative"
                  onClick={() => {
                    if (!isExpanded) {
                      setSigningPetitionId(petition._id);
                      setSignStatus({ id: null, message: '', type: '' });
                      setSignEmail('');
                    }
                  }}
                >
                  <div className="text-[10px] tracking-[1px] text-[var(--gray-2)] font-bold mb-1 uppercase">
                    {petition.category} &middot; {formatK(petition.signatureCount)} SIGNATURES
                  </div>
                  <PostTitle title={petition.title} size="headline" className="mb-3" />
                  <div className="w-full h-1.5 bg-[var(--tan)] rounded-full overflow-hidden mb-1.5">
                    <div 
                      className="h-full bg-[var(--green)] rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] text-[var(--gray)] font-medium">
                    {progress}% of {formatK(petition.goalCount)} goal
                  </div>

                  {isExpanded && (
                    <div className="mt-4 p-3 bg-[var(--bg-2)] border border-[var(--line)] rounded-sm text-sm" onClick={(e) => e.stopPropagation()}>
                      {hasSignedLocal ? (
                        <div className="text-[var(--green)] font-bold text-center py-2">
                          You've already signed this!
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleSignPetition(e, petition._id)} className="flex flex-col space-y-2">
                          <p className="font-bold mb-1 text-[var(--ink)]">Add your signature</p>
                          <input 
                            type="email" 
                            placeholder="Your email address" 
                            required
                            value={signEmail}
                            onChange={(e) => setSignEmail(e.target.value)}
                            className="w-full border border-[var(--line)] p-2 text-sm focus:outline-none focus:border-[var(--green)]"
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
                              className="px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 text-xs transition-colors rounded-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* 4. Banner Ad */}
      <div>
        <div className="text-[10px] tracking-wider text-[var(--gray)] mb-2 font-semibold">ADVERTISEMENT</div>
        <div className="w-full bg-[var(--bg-2)] border border-[var(--line)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md group">
          {bannerAd ? (
            <a href={bannerAd.ctaUrl} target="_blank" rel="noreferrer" className="block w-full h-full">
              {bannerAd.image ? (
                <img src={optimizeCloudinaryUrl(bannerAd.image, { width: 300, crop: 'fill' })} alt="Advertisement" className="w-full h-[250px] object-cover bg-gray-200" />
              ) : (
                <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
              )}
              <div className="bg-[var(--ink)] text-white text-center py-2 text-sm font-bold opacity-90 group-hover:opacity-100 transition-opacity">
                {bannerAd.ctaText || 'Learn More'}
              </div>
            </a>
          ) : (
            <div className="block w-full h-full p-4">
              <div className="w-full h-[218px] border-2 border-dashed border-[var(--gray-2)] flex flex-col items-center justify-center text-[var(--gray-2)] bg-[var(--bg)]">
                <span className="font-bold text-lg">ADVERTISEMENT</span>
                <span className="text-sm">300 &times; 250</span>
              </div>
              <div className="py-2 text-sm font-bold text-transparent text-center bg-transparent">
                Placeholder
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Newsletter */}
      <div className="bg-[var(--ink)] text-[#f2eee2] p-6 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h3 className="font-[var(--font-heading)] font-black text-xl mb-2">The Wallet Pickle Daily</h3>
        <p className="text-sm text-[var(--gray-2)] mb-5">Your daily brief on money, markets, and more.</p>
        
        {subStatus === 'success' ? (
          <div className="bg-[var(--green)]/20 border border-[var(--green)] text-white p-3 text-sm text-center font-bold">
            Thanks for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
            <input 
              type="email" 
              placeholder="Email address" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[var(--ink-2)] border border-[#2b3122] p-3 text-white focus:outline-none focus:border-[var(--green)] text-sm transition-colors"
            />
            {subStatus && <div className="text-red-400 text-xs">{subStatus}</div>}
            <button 
              type="submit" 
              disabled={subLoading}
              className="w-full bg-[var(--green)] hover:bg-[var(--green-dark)] text-white font-bold py-3 text-sm transition-colors disabled:opacity-70"
            >
              {subLoading ? 'Submitting...' : 'Sign Up'}
            </button>
          </form>
        )}
      </div>

    </aside>
  );
}
