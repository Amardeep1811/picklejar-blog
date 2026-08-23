"use client";


import Navbar from './Navbar';
import Ticker from './Ticker';
import Footer from './Footer';

import TopAdBanner from '../ads/TopAdBanner';

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopAdBanner />
      <Navbar />
      <div>
        <Ticker />
      </div>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
