"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from '@/api/axios';


import PostPageSkeleton from '@/components/shared/PostPageSkeleton';
import EditorJsRenderer from '@/components/shared/EditorJsRenderer';
import ArticleAdCard from '@/components/shared/ArticleAdCard';
import PostTitle from '@/components/shared/Typography/PostTitle';
import PostExcerpt from '@/components/shared/Typography/PostExcerpt';
import { optimizeCloudinaryUrl } from '@/utils/optimizeCloudinaryUrl';

export default function PostPageClient({ initialData, initialRelatedPosts, initialAds }) {
  const data = initialData;
  const relatedPosts = initialRelatedPosts;
  const inArticleAds = initialAds;
  
  
  
  // Render bottom grid with up to 4 posts
  const morePosts = relatedPosts.slice(0, 4);

  const formattedDate = new Date(data.publishDate || data.createdAt).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const trimmedExcerpt = data.excerpt?.trim() || data.title;

  return (
    <div className="bg-white min-h-screen pb-20">
      
      
      {/* HEADER AREA */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center flex flex-col items-center">
        {data.vertical && (
          <Link href={`/${data.vertical.slug}`} className="inline-block bg-[var(--green)] text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 hover:bg-green-700 transition-colors">
            {data.vertical.name}
          </Link>
        )}
        
        <h1 className="text-5xl md:text-6xl lg:text-[4rem] leading-[1.1] font-bold font-serif text-[var(--ink)] mb-6 max-w-3xl">
          {data.title}
        </h1>
        
        {data.excerpt && (
          <p className="text-xl md:text-2xl text-gray-600 italic font-serif max-w-2xl mb-12">
            {data.excerpt}
          </p>
        )}
        
        <div className="w-full border-t border-b border-gray-300 py-4 flex justify-center items-center text-xs font-bold tracking-widest text-gray-500 uppercase font-sans">
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* BANNER IMAGE */}
      {data.bannerImage && (
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <Image 
            src={optimizeCloudinaryUrl(data.bannerImage, { width: 1200, crop: 'fill' })} 
            alt={data.title} 
            width={1200}
            height={514}
            className="w-full aspect-[21/9] object-cover object-center"
            priority
          />
        </div>
      )}

      {/* TWO COLUMN LAYOUT: ARTICLE + SIDEBAR */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* ARTICLE BODY */}
        <article className="lg:col-span-8 lg:pr-8">
          <div className="
            text-lg md:text-xl font-serif text-gray-800 leading-relaxed
            [&_p]:mb-6
            [&_h2]:font-sans [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:uppercase [&_h2]:tracking-wider
            [&_h3]:font-sans [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-4
            [&_blockquote]:border-l-[4px] [&_blockquote]:border-[var(--green)] [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-8 [&_blockquote]:text-2xl [&_blockquote]:italic [&_blockquote]:text-[var(--ink)]
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul>li]:mb-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol>li]:mb-2
          ">
            {data.body && data.body.blocks ? (
              <EditorJsRenderer blocks={data.body.blocks} />
            ) : (
              <p>No content available for this post.</p>
            )}
          </div>
        </article>

        {/* RIGHT SIDEBAR (STICKY) */}
        <aside className="lg:col-span-4 relative">
          <div className="sticky top-4 flex flex-col">
            <div className="min-h-[400px]">
              <ArticleAdCard ad={inArticleAds[0]} />
            </div>
            <div className="min-h-[400px]">
              <ArticleAdCard ad={inArticleAds[1]} />
            </div>
          </div>
        </aside>

      </div>

      {/* BELOW ARTICLE: MORE FROM VERTICAL */}
      {morePosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-20 pt-16 border-t-[3px] border-[var(--ink)]">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-1.5 h-4 bg-[var(--green)]"></div>
            <h2 className="text-xl font-bold tracking-widest text-[var(--ink)] uppercase font-sans">
              More From {data.vertical?.name || 'This Section'}
            </h2>
            <div className="w-1.5 h-4 bg-[var(--green)]"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {morePosts.map(post => (
              <Link 
                key={post._id} 
                href={`/${data.vertical?.slug || 'vertical'}/${post.slug}`} 
                className="group flex flex-col transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] rounded-xl p-4 -mx-4 -my-4"
              >
                {post.bannerImage ? (
                  <Image src={optimizeCloudinaryUrl(post.bannerImage, { width: 400, crop: 'fill' })} alt={post.title} width={400} height={300} className="w-full aspect-[4/3] object-cover mb-4 rounded-sm" />
                ) : (
                  <div className="w-full aspect-[4/3] bg-gray-100 border border-[var(--line)] mb-4 flex items-center justify-center text-gray-400 text-xs rounded-sm">No Image</div>
                )}
                <div className="flex flex-col flex-1">
                  <PostTitle title={post.title} size="small" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}