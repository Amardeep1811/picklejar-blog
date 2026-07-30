

export default function SectionDividerAd({ data: ad }) {

  return (
    <div className="w-full my-12 h-[150px] lg:h-[200px]">
      {ad ? (
        <a href={ad.ctaUrl || '#'} target="_blank" rel="noreferrer" className="block w-full h-full">
          {ad.image ? (
            <img src={ad.image} alt={ad.ctaText || 'Advertisement'} className="w-full h-full object-cover border border-[var(--line)] rounded-sm" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-800 flex items-center justify-center text-white text-2xl font-bold rounded-sm border border-[var(--line)]">
              {ad.ctaText || 'Advertisement'}
            </div>
          )}
        </a>
      ) : (
        <div className="w-full h-full border-2 border-dashed border-[var(--gray-2)] flex items-center justify-center text-[var(--gray-2)] bg-[var(--bg)]">
          <span className="font-bold text-sm tracking-widest uppercase">AD SPACE — Section Divider</span>
        </div>
      )}
    </div>
  );
}
