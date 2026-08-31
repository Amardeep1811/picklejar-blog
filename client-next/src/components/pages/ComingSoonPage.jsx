import Link from 'next/link';

export default function ComingSoonPage({ title, description = "This page is coming soon." }) {
  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center py-20 px-6">
      <div className="max-w-xl mx-auto text-center flex flex-col items-center">
        <span className="inline-block bg-[var(--bg-2)] text-[var(--gray)] border border-[var(--line)] px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 font-[var(--font-ui)]">
          Update In Progress
        </span>
        <h1 className="text-4xl md:text-5xl font-bold font-[var(--font-heading)] text-[var(--ink)] mb-4 tracking-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-[var(--gray)] font-[var(--font-heading)] italic mb-8">
          {description}
        </p>
        <div className="w-16 h-0.5 bg-[var(--green)] mb-8"></div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[var(--green)] hover:bg-[var(--green-dark)] text-white px-6 py-2.5 rounded font-semibold text-sm transition-colors font-[var(--font-ui)]"
        >
          &larr; Return to Home
        </Link>
      </div>
    </div>
  );
}
