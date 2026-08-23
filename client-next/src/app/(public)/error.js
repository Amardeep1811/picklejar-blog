"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Something went wrong!</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        We encountered an error while trying to load this page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-[var(--green)] hover:bg-[var(--green-dark)] text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
