import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

export default function Navbar() {
  const [verticals, setVerticals] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const navigate = useNavigate();
  const moreTimeoutRef = useRef(null);

  const handleMoreEnter = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    setMoreOpen(true);
    setSearchOpen(false);
  };

  const handleMoreLeave = () => {
    moreTimeoutRef.current = setTimeout(() => {
      setMoreOpen(false);
    }, 200);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribeStatus('loading');
    try {
      const res = await axios.post('/subscribers', { email });
      if (res.data.success) {
        setSubscribeStatus('success');
        setSubscribeMessage('Thanks for subscribing!');
        setTimeout(() => {
          setIsSubscribeModalOpen(false);
          setSubscribeStatus('idle');
          setSubscribeMessage('');
          setEmail('');
        }, 3000);
      }
    } catch (err) {
      setSubscribeStatus('error');
      setSubscribeMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    if (mobileMenuOpen || isSubscribeModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, isSubscribeModalOpen]);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const fetchVerticals = async () => {
      try {
        const res = await axios.get('/verticals');
        if (res.data.success) {
          setVerticals(res.data.data.filter(v => v.active));
        }
      } catch (err) {
        console.error('Failed to load verticals', err);
      }
    };
    fetchVerticals();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > 50) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }

          if (currentScrollY > lastScrollY.current && currentScrollY > 250) {
            setHidden(true);
            setSearchOpen(false);
            setMoreOpen(false);
          } else {
            setHidden(false);
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`sticky top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <nav
          className={`w-full ${isScrolled || searchOpen ? 'bg-black/95 backdrop-blur shadow-sm' : 'bg-black'} px-6 py-4 flex justify-between items-center text-[#f2eee2] relative z-20 transition-colors duration-300`}
        >
          <Link to="/" className="flex items-center" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "26px", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
            <span className="text-[#f2eee2]">Wallet</span>
            <span className="text-[var(--green)]">Pickle</span>
          </Link>

          <div className="hidden xl:flex items-center text-[#f2eee2]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "11px", letterSpacing: "0.9px", fontWeight: 600, gap: "18px" }}>
            {verticals.slice(0, 9).map(v => (
              <Link
                key={v._id}
                to={`/${v.slug}`}
                onClick={() => { setSearchOpen(false); setMoreOpen(false); }}
                className="relative group py-1 uppercase text-[#f2eee2]"
              >
                {v.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--green)] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            {verticals.length > 9 && (
              <button
                onMouseEnter={handleMoreEnter}
                onMouseLeave={handleMoreLeave}
                onClick={() => {
                  setMoreOpen(!moreOpen);
                  setSearchOpen(false);
                }}
                className={`relative group py-1 uppercase transition-colors ${moreOpen ? 'text-[var(--green)]' : 'text-[#f2eee2]'}`}
              >
                MORE
                <svg xmlns="http://www.w3.org/2000/svg" className={`inline-block w-3 h-3 ml-1 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--green)] transition-all duration-300 group-hover:w-full"></span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <button
              className="text-[#f2eee2] opacity-85 hover:opacity-100 hover:text-[var(--green)] p-1 transition-colors"
              onClick={() => {
                setSearchOpen(!searchOpen);
                setMoreOpen(false);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              aria-label="Toggle Search"
            >
              {searchOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
            <button 
              onClick={() => setIsSubscribeModalOpen(true)}
              className="hidden sm:block bg-[var(--green)] hover:bg-[var(--green-dark)] text-white px-5 py-2 cursor-pointer font-semibold text-sm transition-colors" style={{ borderRadius: "3px" }}>
              Subscribe
            </button>
            <button
              className="xl:hidden text-[#f2eee2] p-1"
              onClick={() => {
                setMobileMenuOpen(true);
                setSearchOpen(false);
              }}
              aria-label="Open Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* More Dropdown Panel */}
        <div
          className={`hidden xl:block absolute top-full left-0 w-full bg-[#111] overflow-hidden transition-all duration-250 ease-in-out z-40 ${moreOpen ? 'max-h-96 opacity-100 py-6 px-6 border-b border-gray-800' : 'max-h-0 opacity-0 py-0 px-6'}`}
          onMouseEnter={handleMoreEnter}
          onMouseLeave={handleMoreLeave}
        >
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[#f2eee2]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "11px", letterSpacing: "0.9px", fontWeight: 600 }}>
              {verticals.map(v => (
                <Link
                  key={v._id}
                  to={`/${v.slug}`}
                  onClick={() => setMoreOpen(false)}
                  className="relative group py-1 uppercase text-[#f2eee2]"
                >
                  {v.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--green)] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Search Dropdown Panel */}
        <div className={`absolute top-full left-0 w-full bg-[#111] overflow-hidden transition-all duration-250 ease-in-out z-40 ${searchOpen ? 'max-h-96 opacity-100 py-8 px-6 border-b border-gray-800' : 'max-h-0 opacity-0 py-0 px-6'}`}>
          <form onSubmit={handleSearchSubmit} className="max-w-6xl mx-auto">
            <input
              type="text"
              className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded text-lg outline-none placeholder-gray-400 font-sans"
              placeholder="Search Wallet Pickle"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            <div className="mt-8">
              <h3 className="text-white font-bold mb-4 font-sans tracking-wide text-sm">Explore Topics</h3>
              <div className="flex flex-wrap gap-2">
                <Link to="/search" onClick={() => setSearchOpen(false)} className="px-3 py-1.5 border border-gray-600 rounded text-sm text-gray-300 hover:text-white hover:border-gray-400 transition-colors font-sans">
                  Latest
                </Link>
                {verticals.map(v => (
                  <Link key={v._id} to={`/${v.slug}`} onClick={() => setSearchOpen(false)} className="px-3 py-1.5 border border-gray-600 rounded text-sm text-gray-300 hover:text-white hover:border-gray-400 transition-colors font-sans">
                    {v.name}
                  </Link>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div className={`relative w-72 h-full bg-[var(--green)] shadow-xl transform transition-transform duration-300 ease-out flex flex-col p-6 text-[var(--bg)] font-[var(--font-ui)] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-end mb-8">
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="p-2 text-[var(--bg)] hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col space-y-6 text-lg font-medium overflow-y-auto">
            {verticals.map(v => (
              <Link
                key={v._id}
                to={`/${v.slug}`}
                className="uppercase text-[#f2eee2]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {v.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-[var(--bg-2)]/20 flex flex-col space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="flex items-center space-x-2 text-[var(--bg)] hover:text-white transition-colors text-left font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSubscribeModalOpen(true);
              }}
              className="bg-white text-[var(--green)] hover:bg-[var(--bg)] py-3 rounded-md cursor-pointer font-bold text-center transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Subscribe Modal */}
      {isSubscribeModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Join WalletPickle</h3>
              <button 
                onClick={() => setIsSubscribeModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-sm font-medium">Get the latest personal finance tips and side hustle guides delivered straight to your inbox.</p>
              
              {subscribeStatus === 'success' ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-center font-bold">
                  {subscribeMessage}
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                    />
                  </div>
                  
                  {subscribeStatus === 'error' && (
                    <div className="text-red-600 text-sm font-medium">{subscribeMessage}</div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={subscribeStatus === 'loading'}
                    className="w-full bg-[var(--green)] hover:bg-[var(--green-dark)] text-white py-3 rounded-lg font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {subscribeStatus === 'loading' ? (
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : 'Subscribe Now'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}