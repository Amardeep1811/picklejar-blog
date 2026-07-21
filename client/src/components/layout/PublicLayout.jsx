import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Ticker from './Ticker';
import Footer from './Footer';

import TopAdBanner from '../ads/TopAdBanner';

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopAdBanner />
      <Navbar />
      <div>
        <Ticker />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
