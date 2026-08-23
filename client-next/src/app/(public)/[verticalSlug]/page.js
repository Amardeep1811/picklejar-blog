import VerticalPageClient from '@/components/pages/VerticalPageClient';
import { notFound } from 'next/navigation';

const getVerticalData = async (slug) => {
  try {
    const res = await fetch(`${process.env.API_URL}/verticals`, {
      next: { revalidate: 300 }
    });
    const data = await res.json();
    const vertical = data.data?.find(v => v.slug === slug);

    if (!vertical) return { vertical: null, posts: [], morePosts: [], hasMore: false };

    const postsRes = await fetch(`${process.env.API_URL}/posts?status=published&vertical=${vertical._id}&limit=23`, {
      next: { revalidate: 300 }
    });
    const postsData = await postsRes.json();
    
    const allPosts = postsData.data || [];
    return {
      vertical,
      posts: allPosts.slice(0, 15),
      morePosts: allPosts.slice(15, 23),
      hasMore: allPosts.length >= 23
    };
  } catch (error) {
    return { vertical: null, posts: [], morePosts: [], hasMore: false };
  }
};

export async function generateMetadata({ params }) {
  const { verticalSlug } = await params;
  const { vertical } = await getVerticalData(verticalSlug);
  
  if (!vertical) return { title: 'Vertical Not Found | WalletPickle' };

  return {
    title: `${vertical.name} - WalletPickle`,
    description: `Read the latest stories about ${vertical.name} on WalletPickle.`,
  };
}

export default async function VerticalPage({ params }) {
  const { verticalSlug } = await params;
  const { vertical, posts, morePosts, hasMore } = await getVerticalData(verticalSlug);

  if (!vertical) {
    notFound();
  }

  return (
    <>

      <VerticalPageClient 
        vertical={vertical} 
        initialPosts={posts} 
        initialMorePosts={morePosts}
        initialHasMore={hasMore}
      />
    </>
  );
}
