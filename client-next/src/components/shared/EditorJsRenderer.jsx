"use client";

import React from 'react';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import Image from 'next/image';

const ALLOWED_EMBED_HOSTS = [
  'youtube.com', 'www.youtube.com', 'youtube-nocookie.com',
  'vimeo.com', 'player.vimeo.com'
];

function isAllowedEmbed(url) {
  try {
    const host = new URL(url).hostname;
    return ALLOWED_EMBED_HOSTS.some(allowed => host === allowed || host.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
}

function isCloudinaryUrl(url) {
  try {
    return new URL(url).hostname === 'res.cloudinary.com';
  } catch {
    return false;
  }
}

export default function EditorJsRenderer({ blocks }) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="editor-content prose max-w-none">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'header': {
            const Tag = `h${block.data.level || 2}`;
            const textContent = typeof block.data.text === 'string' ? block.data.text : (block.data.text?.content || String(block.data.text));
            return <Tag key={index} className="font-bold my-4" dangerouslySetInnerHTML={{ __html: sanitizeHtml(textContent) }} />;
          }
          case 'paragraph':
            return <p key={index} className="my-4" dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text) }} />;
          case 'list': {
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className={`my-4 ${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'} ml-6`}>
                {block.data.items.map((item, i) => {
                  const itemContent = typeof item === 'string' ? item : (item?.content || String(item));
                  return <li key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(itemContent) }} />;
                })}
              </ListTag>
            );
          }
          case 'image':
            if (!isCloudinaryUrl(block.data.file?.url)) return null;
            return (
              <figure key={index} className="my-6">
                <Image 
                  src={block.data.file.url} 
                  alt={block.data.caption || 'Post illustration'} 
                  width={800}
                  height={450}
                  className="rounded w-full h-auto object-cover" 
                />
                {block.data.caption && <figcaption className="text-sm text-gray-500 mt-2 text-center">{block.data.caption}</figcaption>}
              </figure>
            );
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-gray-500 pl-4 italic my-6 text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text) }} />
                {block.data.caption && <cite className="block mt-2 text-sm text-gray-500">— {block.data.caption}</cite>}
              </blockquote>
            );
          case 'embed':
            if (!isAllowedEmbed(block.data.embed)) return null;
            return (
              <div key={index} className="my-6 aspect-video">
                <iframe
                  src={block.data.embed}
                  width={block.data.width}
                  height={block.data.height}
                  title="Embedded content"
                  className="w-full h-full rounded"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          case 'delimiter':
            return <hr key={index} className="my-8 border-t border-gray-300" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
