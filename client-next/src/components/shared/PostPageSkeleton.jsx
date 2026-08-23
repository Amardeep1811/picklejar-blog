"use client";

import ArticleAdCard from './ArticleAdCard';

export default function PostPageSkeleton() {
  return (
    <div className="bg-white min-h-screen pb-20 animate-pulse">
      {/* HEADER AREA */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center flex flex-col items-center">
        {/* Vertical Pill */}
        <div className="w-24 h-6 bg-gray-200 rounded-full mb-6"></div>
        
        {/* Title */}
        <div className="w-full max-w-3xl h-12 md:h-16 bg-gray-200 rounded-md mb-4"></div>
        <div className="w-3/4 max-w-2xl h-12 md:h-16 bg-gray-200 rounded-md mb-6"></div>
        
        {/* Excerpt */}
        <div className="w-4/5 max-w-2xl h-6 bg-gray-100 rounded-md mb-3"></div>
        <div className="w-2/3 max-w-xl h-6 bg-gray-100 rounded-md mb-12"></div>
        
        {/* Byline / Date */}
        <div className="w-full border-t border-b border-gray-100 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="w-32 h-8 bg-gray-100 rounded-md"></div>
          </div>
          <div className="w-24 h-6 bg-gray-100 rounded-md"></div>
        </div>
      </div>

      {/* BANNER IMAGE */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="w-full aspect-[21/9] bg-gray-200 rounded-xl"></div>
      </div>

      {/* TWO COLUMN LAYOUT: ARTICLE + SIDEBAR */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* ARTICLE BODY */}
        <article className="lg:col-span-8 lg:pr-8">
          <div className="space-y-6">
            <div className="h-6 bg-gray-100 rounded-md w-full"></div>
            <div className="h-6 bg-gray-100 rounded-md w-full"></div>
            <div className="h-6 bg-gray-100 rounded-md w-[90%]"></div>
            <div className="h-6 bg-gray-100 rounded-md w-[95%]"></div>
            <div className="h-6 bg-gray-100 rounded-md w-3/4"></div>
            
            <div className="h-8 bg-gray-200 rounded-md w-1/3 mt-10 mb-4"></div>
            
            <div className="h-6 bg-gray-100 rounded-md w-full"></div>
            <div className="h-6 bg-gray-100 rounded-md w-[85%]"></div>
            <div className="h-6 bg-gray-100 rounded-md w-full"></div>
            
            {/* Blockquote */}
            <div className="h-24 bg-gray-100 border-l-4 border-gray-200 rounded-r-md w-[90%] ml-4 my-8"></div>
            
            <div className="h-6 bg-gray-100 rounded-md w-[95%]"></div>
            <div className="h-6 bg-gray-100 rounded-md w-full"></div>
            <div className="h-6 bg-gray-100 rounded-md w-[80%]"></div>
          </div>
        </article>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:col-span-4 relative">
          <div className="sticky top-28 flex flex-col">
            <div className="min-h-[400px]">
              <ArticleAdCard ad={null} />
            </div>
            <div className="min-h-[400px]">
              <ArticleAdCard ad={null} />
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
