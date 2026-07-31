export default function HomeSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-10 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 w-full">
          {/* TrendingSection */}
          <div className="h-[400px] bg-gray-100 rounded-xl mb-12"></div>
          {/* FeaturedHeroSection */}
          <div className="h-[600px] bg-gray-200 rounded-xl mb-12"></div>
          {/* FeaturedVerticalSection */}
          <div className="h-[500px] bg-gray-100 rounded-xl mb-12"></div>
          {/* SectionDividerAd */}
          <div className="h-[90px] bg-gray-200 rounded-xl mb-12 max-w-[728px] mx-auto"></div>
          {/* MoreStoriesSection */}
          <div className="h-[800px] bg-gray-100 rounded-xl mb-12"></div>
        </div>
      </div>
      {/* SportsSection */}
      <div className="h-[400px] bg-gray-200 rounded-xl mb-12"></div>
      {/* NewsletterSection */}
      <div className="h-[300px] bg-gray-100 rounded-xl"></div>
    </div>
  );
}
