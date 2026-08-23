
import TrendingSection from '@/components/home/TrendingSection';
import FeaturedHeroSection from '@/components/home/FeaturedHeroSection';
import FeaturedVerticalSection from '@/components/home/FeaturedVerticalSection';
import MoreStoriesSection from '@/components/home/MoreStoriesSection';
import SectionDividerAd from '@/components/ads/SectionDividerAd';
import SportsSection from '@/components/home/SportsSection';

export const metadata = {
  title: 'WalletPickle',
  description: 'The latest stories, news, and trends.',
};

const getHomeData = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/home`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) throw new Error('Failed to fetch home data');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function HomePage() {
  const homeData = await getHomeData();

  if (!homeData) {
    return (
      <>

        <div className="max-w-[1440px] mx-auto px-6 py-10 min-h-screen">
          <div className="bg-red-50 text-red-500 p-4 rounded-md">Failed to load content.</div>
        </div>
      </>
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
