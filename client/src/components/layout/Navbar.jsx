import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

export default function Navbar() {
  const [verticals, setVerticals] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
      <nav 
        className={`sticky top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out ${hidden ? '-translate-y-full' : 'translate-y-0'} ${isScrolled ? 'bg-[var(--ink)]/95 backdrop-blur shadow-sm' : 'bg-[var(--ink)]'} px-6 py-4 flex justify-between items-center text-[#f2eee2]`}
      >
        <Link to="/" className="text-2xl font-bold font-['Playfair_Display'] tracking-tight flex items-center">
          <span className="text-[#f2eee2]">PICKLE</span>
          <span className="text-[var(--green)]">JAR</span>
        </Link>
        
        <div className="hidden xl:flex items-center space-x-8 font-['Inter'] text-[#f2eee2] text-sm font-medium">
          {verticals.map(v => (
            <Link 
              key={v._id} 
              to={`/vertical/${v.slug}`}
              className="relative group py-1 transition-colors duration-300 opacity-85 hover:opacity-100 hover:text-[var(--green)]"
            >
              {v.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--green)] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <div className="hidden xl:flex items-center space-x-6">
          <button className="text-[#f2eee2] opacity-85 hover:opacity-100 hover:text-[var(--green)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="bg-[var(--green)] hover:bg-[var(--green-dark)] text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors">
            Subscribe
          </button>
        </div>

        <button 
          className="xl:hidden text-[#f2eee2] p-2"
          onClick={() => setMobileMenuOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="absolute inset-0 bg-black/50" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div className={`relative w-72 h-full bg-[var(--green)] shadow-xl transform transition-transform duration-300 ease-out flex flex-col p-6 text-[var(--bg)] font-['Inter'] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-end mb-8">
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[var(--bg)] hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col space-y-6 text-lg font-medium overflow-y-auto">
            {verticals.map(v => (
              <Link 
                key={v._id} 
                to={`/vertical/${v.slug}`}
                className="hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {v.name}
              </Link>
            ))}
          </div>
          
          <div className="mt-auto pt-8 border-t border-[var(--bg-2)]/20 flex flex-col space-y-4">
            <button className="flex items-center space-x-2 text-[var(--bg)] hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </button>
            <button className="bg-white text-[var(--green)] hover:bg-[var(--bg)] py-3 rounded-full font-bold text-center transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </>
  );
}