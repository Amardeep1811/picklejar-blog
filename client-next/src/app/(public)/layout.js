import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Ticker from "@/components/layout/Ticker";
import TopAdBanner from "@/components/ads/TopAdBanner";

const getVerticals = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/verticals`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.filter(v => v.active) || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default async function PublicLayout({ children }) {
  const verticals = await getVerticals();

  return (
    <>
      <TopAdBanner />
      <Navbar verticals={verticals} />
      <Ticker />
      {children}
      <Footer />
    </>
  );
}
