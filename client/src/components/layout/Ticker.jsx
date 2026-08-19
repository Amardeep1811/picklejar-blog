import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function Ticker() {
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const res = await axios.get('/market/ticker');
        if (res.data.success) {
          setTickerData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch ticker data', err);
      }
    };
    fetchTickerData();
  }, []);

  return (
    <div className="bg-[#1f2418] text-[#d9d8c9] overflow-hidden whitespace-nowrap border-t border-[#2b3122] font-[var(--font-ui)] text-[12px]">
      <div className="inline-flex py-[9px] animate-ticker hover:[animation-play-state:paused]">
        
        {/* First Set */}
        <div className="inline-flex gap-[56px] pr-[56px]">
          {tickerData.length === 0 ? (
            <span className="inline-flex items-center gap-2 opacity-90">&#8599; Loading market data...</span>
          ) : (
            tickerData.map((item, i) => (
              <span key={`1-${i}`} className={`inline-flex items-center gap-2 opacity-90 font-bold ${item.isStatic ? 'text-[#f2eee2] tracking-wider' : (item.up ? 'text-[#9fd39a]' : 'text-[#d39a9a]')}`}>
                {!item.isStatic && <span dangerouslySetInnerHTML={{ __html: item.up ? '&#8599;' : '&#8600;' }} />} 
                {item.symbol} {item.change && <span className="opacity-75 font-normal">{item.change}</span>}
              </span>
            ))
          )}
        </div>
        
        {/* Second Set (Duplicate for seamless loop) */}
        <div className="inline-flex gap-[56px] pr-[56px]">
          {tickerData.length === 0 ? (
            <span className="inline-flex items-center gap-2 opacity-90">&#8599; Loading market data...</span>
          ) : (
            tickerData.map((item, i) => (
              <span key={`2-${i}`} className={`inline-flex items-center gap-2 opacity-90 font-bold ${item.isStatic ? 'text-[#f2eee2] tracking-wider' : (item.up ? 'text-[#9fd39a]' : 'text-[#d39a9a]')}`}>
                {!item.isStatic && <span dangerouslySetInnerHTML={{ __html: item.up ? '&#8599;' : '&#8600;' }} />} 
                {item.symbol} {item.change && <span className="opacity-75 font-normal">{item.change}</span>}
              </span>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
}