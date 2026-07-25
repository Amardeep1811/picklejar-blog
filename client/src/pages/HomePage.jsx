import { useState, useEffect } from 'react';
import TrendingSection from '../components/home/TrendingSection';
import FeaturedHeroSection from '../components/home/FeaturedHeroSection';
import FeaturedVerticalSection from '../components/home/FeaturedVerticalSection';
import MoreStoriesSection from '../components/home/MoreStoriesSection';
import SectionDividerAd from '../components/ads/SectionDividerAd';
import SportsSection from '../components/home/SportsSection';
import NewsletterSection from '../components/home/NewsletterSection';

export default function HomePage() {
  return (
    <>
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 w-full">
            <TrendingSection />
            <FeaturedHeroSection />
            <FeaturedVerticalSection />
            <SectionDividerAd />
            <MoreStoriesSection />
          </div>
        </div>
        
        <SportsSection />
        <NewsletterSection />
      </div>
    </>
  );
}