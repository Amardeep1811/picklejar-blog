import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function SectionDividerAd() {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await axios.get('/ads?placement=section-divider&active=true&limit=1');
        if (res.data.success && res.data.data.length > 0) {
          setAd(res.data.data[0]);
        }
      } catch (err) {
        console.error('Failed to load section divider ad:', err);
      }
    };
    fetchAd();
  }, []);

  return (
    <div className="w-full my-12">
      {ad ? (
        <a href={ad.ctaUrl || '#'} target="_blank" rel="noreferrer" className="block w-full">
          {ad.image ? (
            <img src={ad.image} alt={ad.ctaText || 'Advertisement'} className="w-full h-auto object-cover border border-[var(--line)] rounded-sm" />
          ) : (
            <div className="w-full h-[150px] lg:h-[200px] bg-gradient-to-r from-blue-900 to-indigo-800 flex items-center justify-center text-white text-2xl font-bold rounded-sm border border-[var(--line)]">
              {ad.ctaText || 'Advertisement'}
            </div>
          )}
        </a>
      ) : (
        <div className="w-full h-[150px] lg:h-[200px] border-2 border-dashed border-[var(--gray-2)] flex items-center justify-center text-[var(--gray-2)] bg-[var(--bg)]">
          <span className="font-bold text-sm tracking-widest uppercase">AD SPACE — Section Divider</span>
        </div>
      )}
    </div>
  );
}
