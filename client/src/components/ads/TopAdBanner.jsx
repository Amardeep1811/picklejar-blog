import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function TopAdBanner() {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await axios.get('/ads?placement=top-banner&active=true&limit=1');
        if (res.data.success && res.data.data.length > 0) {
          setAd(res.data.data[0]);
        }
      } catch (err) {
        console.error('Failed to load top banner ad:', err);
      }
    };
    fetchAd();
  }, []);

  if (!ad) {
    return (
      <div className="w-full bg-black flex justify-center py-4 border-b border-black">
        <div className="w-full max-w-[970px] h-[150px] border border-[#333] flex items-center justify-center text-gray-400 bg-[#111]">
          <span className="font-bold text-sm tracking-widest uppercase">AD SPACE — 970×150</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#82c6b4] flex justify-center">
      <a href={ad.ctaUrl || '#'} target="_blank" rel="noreferrer" className="block w-full max-w-[1200px]">
        {ad.image ? (
          <img src={ad.image} alt={ad.ctaText || 'Advertisement'} className="w-full h-auto max-h-[150px] object-cover" />
        ) : (
          <div className="w-full py-6 text-center text-white font-bold text-lg">
            {ad.ctaText || 'Advertisement'}
          </div>
        )}
      </a>
    </div>
  );
}
