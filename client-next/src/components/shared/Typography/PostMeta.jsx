"use client";

export default function PostMeta({ category, date, author, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 text-[10px] tracking-wider font-bold uppercase mb-1 ${className}`}>
      {category && (
        <span className="text-[var(--green)]">{category}</span>
      )}
      {date && (
        <>
          {category && <span className="text-[var(--line)]">•</span>}
          <span className="text-[var(--gray-2)]">{new Date(date).toLocaleDateString()}</span>
        </>
      )}
      {author && (
        <>
          {(category || date) && <span className="text-[var(--line)]">•</span>}
          <span className="text-[var(--gray)]">{author}</span>
        </>
      )}
    </div>
  );
}
