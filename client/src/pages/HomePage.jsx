import { useState, useEffect } from 'react';
import axios from '../api/axios';
import TrendingSection from '../components/home/TrendingSection';
import FeaturedHeroSection from '../components/home/FeaturedHeroSection';
import FeaturedVerticalSection from '../components/home/FeaturedVerticalSection';
import MoreStoriesSection from '../components/home/MoreStoriesSection';
import SectionDividerAd from '../components/ads/SectionDividerAd';
import SportsSection from '../components/home/SportsSection';
import HomeSkeleton from '../components/home/HomeSkeleton';

export default function HomePage() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await axios.get('/home');
        if (res.data.success) {
          setHomeData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
        setError('Failed to load content.');
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return <HomeSkeleton />;
  
  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 w-full">
            <TrendingSection data={homeData.trending} latestData={homeData.moreStories} adData={homeData.ads?.sidebar} />
            <FeaturedHeroSection data={homeData.heroVertical} />
            <FeaturedVerticalSection data={homeData.featuredVertical} />
            <SectionDividerAd data={homeData.ads?.sectionDivider} />
            <MoreStoriesSection data={homeData.moreStories} vertAData={homeData.featuredVertA} adData={homeData.ads?.sidebar} />
          </div>
        </div>
        
        <SportsSection data={homeData.sports} />
      </div>
    </>
  );
}