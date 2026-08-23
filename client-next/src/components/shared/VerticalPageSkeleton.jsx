"use client";

export default function VerticalPageSkeleton() {
  return (
    <div className="bg-white min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Page Heading Placeholder */}
        <div className="h-16 bg-gray-200 rounded-md max-w-md mx-auto mb-20 border-b-[4px] border-transparent pb-10"></div>
        
        {/* SECTION 1: Lead + Grid */}
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* LEAD STORY */}
            <div className="w-full lg:w-[55%] flex flex-col lg:pr-10 lg:border-r border-gray-100">
              <div className="w-full aspect-[16/9] bg-gray-200 mb-4 rounded-xl"></div>
              <div className="w-24 h-6 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded-md w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded-md w-4/5 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-md w-full mb-2"></div>
              <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
            </div>
            
            {/* GRID STORIES */}
            <div className="w-full lg:w-[45%] flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex flex-col">
                    <div className="w-full aspect-video bg-gray-200 rounded-xl mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-full mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* SECTION 2: Two-Column Dense List */}
        <section className="mb-12 border-t-[3px] border-gray-100 pt-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {[1, 2].map(col => (
              <div key={col} className={`w-full lg:w-1/2 flex flex-col ${col === 1 ? 'lg:pr-12 lg:border-r border-gray-100' : ''}`}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={i !== 1 ? 'border-t border-gray-100 py-4' : 'pb-4 pt-0'}>
                    <div className="flex gap-5 items-center">
                      <div className="w-[120px] aspect-[4/3] bg-gray-200 rounded-xl shrink-0"></div>
                      <div className="flex flex-col w-full">
                        <div className="h-5 bg-gray-200 rounded-md w-full mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
        
        {/* AD SLOT */}
        <div className="w-full flex justify-center mb-16">
          <div className="w-full max-w-[728px] h-[90px] bg-gray-200 rounded-md"></div>
        </div>

        {/* SECTION 3: More From Grid */}
        <section className="mb-16">
          <div className="flex justify-center mb-8">
             <div className="w-48 h-6 bg-gray-200 rounded-md"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col">
                <div className="w-full aspect-[4/3] bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-5 bg-gray-200 rounded-md w-full mb-2"></div>
                <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
              </div>
            ))}
          </div>
        </section>
        
      </div>
    </div>
  );
}
