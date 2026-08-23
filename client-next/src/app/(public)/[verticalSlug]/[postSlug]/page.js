import PostPageClient from '@/components/pages/PostPageClient';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

const getPostData = async (slug) => {
  try {
    const res = await fetch(`${process.env.API_URL}/posts/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { postSlug } = await params;
  const post = await getPostData(postSlug);
  
  if (!post) return { title: 'Post Not Found | WalletPickle' };

  return {
    title: `${post.title} - WalletPickle`,
    description: post.excerpt || `Read ${post.title} on WalletPickle`,
    openGraph: {
      title: `${post.title} - WalletPickle`,
      description: post.excerpt || `Read ${post.title} on WalletPickle`,
      images: [
        {
          url: post.bannerImage || 'https://walletpickle.com/logo.png',
        }
      ],
      type: 'article',
    }
  };
}

export default async function PostPage({ params }) {
  const nonce = (await headers()).get('x-nonce');
  const { postSlug } = await params;
  const post = await getPostData(postSlug);

  if (!post) {
    notFound();
  }

  let initialAds = [null, null];
  if (post.inArticleAds && post.inArticleAds.length >= 2) {
    initialAds = [post.inArticleAds[0], post.inArticleAds[1]];
  } else if (post.inArticleAds && post.inArticleAds.length === 1) {
    initialAds = [post.inArticleAds[0], post.inArticleAds[0]];
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.bannerImage ? [post.bannerImage] : [],
    datePublished: post.publishDate || post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'WalletPickle Editorial',
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostPageClient 
        initialData={post}
        initialRelatedPosts={post.relatedPosts || []}
        initialAds={initialAds}
      />
    </>
  );
}
