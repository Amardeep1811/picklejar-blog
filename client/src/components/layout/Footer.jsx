import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

export default function Footer() {
  const [verticals, setVerticals] = useState([]);

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

  return (
    <footer className="bg-[var(--ink)] text-[#c9c6ba] mt-16 font-['Inter']">
      <div className="max-w-[1440px] mx-auto p-14 px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col">
          <h5 className="text-[11.5px] tracking-[1.4px] text-[var(--gold)] mb-4 font-semibold">SECTIONS</h5>
          {verticals.map(v => (
            <Link key={v._id} to={`/vertical/${v.slug}`} className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">
              {v.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col">
          <h5 className="text-[11.5px] tracking-[1.4px] text-[var(--gold)] mb-4 font-semibold">COMPANY</h5>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">About</Link>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Careers</Link>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Press</Link>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Contact</Link>
        </div>
        <div className="flex flex-col">
          <h5 className="text-[11.5px] tracking-[1.4px] text-[var(--gold)] mb-4 font-semibold">RESOURCES</h5>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Newsletters</Link>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Archive</Link>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">RSS</Link>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Sitemap</Link>
        </div>
        <div className="flex flex-col">
          <h5 className="text-[11.5px] tracking-[1.4px] text-[var(--gold)] mb-4 font-semibold">LEGAL</h5>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Privacy</Link>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Terms</Link>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Cookies</Link>
          <Link to="#" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Advertise</Link>
        </div>
      </div>
      <div className="border-t border-[#2a2d24] py-6 px-8 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center text-[13px] gap-2 md:gap-0">
        <div className="font-['Playfair_Display'] font-black text-[19px] text-[#f2eee2]">PICKLE JAR</div>
        <div className="text-[#7d7a6c] text-[11.5px]">&copy; 2026 Pickle Jar Media. All rights reserved.</div>
      </div>
    </footer>
  );
}