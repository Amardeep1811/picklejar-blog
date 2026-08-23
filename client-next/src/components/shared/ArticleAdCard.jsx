"use client";

import React, { useState } from 'react';
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl';
import Image from 'next/image';

export default function ArticleAdCard({ ad }) {
  const [buttonColor, setButtonColor] = useState('var(--green)');
  const [textColor, setTextColor] = useState('#ffffff');
  const [hoverColor, setHoverColor] = useState('var(--green-dark)');
  const [hasSampled, setHasSampled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = (e) => {
    if (hasSampled || !ad?.image) return;
    
    try {
      const img = e.target;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      canvas.width = 10;
      canvas.height = 10;
      
      ctx.drawImage(img, 0, 0, 10, 10);
      const data = ctx.getImageData(0, 0, 10, 10).data;
      
      let r = 0, g = 0, b = 0;
      const pixelCount = 100;
      
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);
      
      const dominantColor = `rgb(${r}, ${g}, ${b})`;
      setButtonColor(dominantColor);
      
      const darken = 30;
      const hr = Math.max(0, r - darken);
      const hg = Math.max(0, g - darken);
      const hb = Math.max(0, b - darken);
      setHoverColor(`rgb(${hr}, ${hg}, ${hb})`);
      
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      setTextColor(luminance > 0.5 ? '#111111' : '#ffffff');
      
      setHasSampled(true);
    } catch (err) {
      console.warn("Could not sample image for dominant color", err);
    }
  };

  if (!ad) {
    return (
      <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--gray-2)] bg-[var(--bg)] min-h-[300px] p-6 text-center mb-6 rounded-lg">
        <span className="font-bold text-lg text-[var(--gray-2)] mb-2">ADVERTISEMENT</span>
        <span className="text-sm text-[var(--gray-2)]">In-Article Slot</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 p-4 flex flex-col relative group mb-6 rounded-lg shadow-sm">
      <div className="text-[10px] text-gray-400 text-center uppercase tracking-wider mb-3 font-sans">
        Advertisement
      </div>
      
      {ad.image ? (
        <div className="w-full aspect-[4/3] mb-4 overflow-hidden bg-gray-100 rounded-md">
          <Image 
            src={optimizeCloudinaryUrl(ad.image, { width: 600, crop: 'fill' })} 
            alt={ad.ctaText || 'Advertisement'} 
            crossOrigin="anonymous"
            width={600}
            height={450}
            onLoad={handleImageLoad}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
      ) : (
        <div className="w-full aspect-[4/3] mb-4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold border border-gray-200 rounded-md">
          Advertisement
        </div>
      )}
      
      <a 
        href={ad.ctaUrl || '#'} 
        target="_blank" 
        rel="noreferrer"
        style={{ 
          backgroundColor: isHovered ? hoverColor : buttonColor, 
          color: textColor,
          transition: 'background-color 0.2s ease-in-out'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full text-center py-3 px-4 text-sm font-bold rounded-md block"
      >
        {ad.ctaText || 'Learn More'}
      </a>
    </div>
  );
}
