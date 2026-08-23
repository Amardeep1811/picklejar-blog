"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from '../../api/axios';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';

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

  return (
    <div className="w-full bg-[var(--bg-2)] flex justify-center py-4 border-b border-[var(--line)]">
      <div className="w-full max-w-[970px] h-[150px]">
        {ad ? (
          <a href={ad.ctaUrl || '#'} target="_blank" rel="noreferrer" className="block w-full h-full">
            {ad.image ? (
              <Image src={optimizeCloudinaryUrl(ad.image, { width: 970, crop: 'fill' })} alt={ad.ctaText || 'Advertisement'} width={970} height={150} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#82c6b4] flex items-center justify-center text-white font-bold text-lg">
                {ad.ctaText || 'Advertisement'}
              </div>
            )}
          </a>
        ) : (
          <div className="w-full h-full border-2 border-dashed border-[var(--gray-2)] flex items-center justify-center text-[var(--gray-2)] bg-[var(--bg)]">
            <span className="font-bold text-sm tracking-widest uppercase">AD SPACE — 970×150</span>
          </div>
        )}
      </div>
    </div>
  );
}
