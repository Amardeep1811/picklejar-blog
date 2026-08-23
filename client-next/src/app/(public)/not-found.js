import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-4xl font-black text-[var(--ink)] mb-4 font-heading">404 - Not Found</h2>
      <p className="text-[var(--gray-2)] mb-8 text-lg max-w-md">
        We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link 
        href="/"
        className="bg-[var(--green)] hover:bg-[var(--green-dark)] text-white font-bold py-3 px-8 rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
      >
        Return Home
      </Link>
    </div>
  );
}
