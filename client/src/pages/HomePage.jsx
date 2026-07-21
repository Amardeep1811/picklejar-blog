import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Sidebar from '../components/shared/Sidebar';
import TrendingSection from '../components/home/TrendingSection';
import MoreStoriesSection from '../components/home/MoreStoriesSection';
import EditorsPicksSection from '../components/home/EditorsPicksSection';
import SectionDividerAd from '../components/ads/SectionDividerAd';
import TwoColumnFeaturedSection from '../components/home/TwoColumnFeaturedSection';
import SportsSection from '../components/home/SportsSection';
import NewsletterSection from '../components/home/NewsletterSection';

export default function HomePage() {

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1 w-full">
            <TrendingSection />
            <MoreStoriesSection />
            <EditorsPicksSection />
            <SectionDividerAd />
            <TwoColumnFeaturedSection />
          </div>
        </div>
        
        <SportsSection />
        <NewsletterSection />
      </div>
    </>
  );
}