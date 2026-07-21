export default function Ticker() {
  return (
    <div className="bg-[#1f2418] text-[#d9d8c9] overflow-hidden whitespace-nowrap border-t border-[#2b3122] font-['Inter'] text-[12px]">
      <div className="inline-flex gap-[56px] py-[9px] animate-ticker hover:[animation-play-state:paused]">
        <span className="inline-flex items-center gap-2 opacity-90 text-[#9fd39a]">&#8599; 14 NEW STORIES TODAY</span>
        <span className="inline-flex items-center gap-2 opacity-90">&#8599; DEBT &middot; reading now: 2,918</span>
        <span className="inline-flex items-center gap-2 opacity-90">&#8599; INSURANCE desk update: 09:12 UTC</span>
        <span className="inline-flex items-center gap-2 opacity-90">&#8599; INVESTING &middot; most shared this week</span>
        <span className="inline-flex items-center gap-2 opacity-90">&#8599; HOME IMPROVEMENT &middot; 7 min average read</span>
        <span className="inline-flex items-center gap-2 opacity-90">&#8599; SPORTS &middot; live scores updating</span>
        <span className="inline-flex items-center gap-2 opacity-90 text-[#9fd39a]">&#8599; RATES +0.3%</span>
        
        {/* Duplicate for seamless loop */}
        <span className="inline-flex items-center gap-2 opacity-90 text-[#9fd39a]">&#8599; 14 NEW STORIES TODAY</span>
        <span className="inline-flex items-center gap-2 opacity-90">&#8599; DEBT &middot; reading now: 2,918</span>
        <span className="inline-flex items-center gap-2 opacity-90">&#8599; INSURANCE desk update: 09:12 UTC</span>
        <span className="inline-flex items-center gap-2 opacity-90">&#8599; INVESTING &middot; most shared this week</span>
        <span className="inline-flex items-center gap-2 opacity-90">&#8599; HOME IMPROVEMENT &middot; 7 min average read</span>
        <span className="inline-flex items-center gap-2 opacity-90">&#8599; SPORTS &middot; live scores updating</span>
        <span className="inline-flex items-center gap-2 opacity-90 text-[#9fd39a]">&#8599; RATES +0.3%</span>
      </div>
    </div>
  );
}