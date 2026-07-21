import React from 'react';

export default function EditorJsRenderer({ blocks }) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="editor-content prose max-w-none">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'header': {
            const Tag = `h${block.data.level || 2}`;
            return <Tag key={index} className="font-bold my-4">{block.data.text}</Tag>;
          }
          case 'paragraph':
            return <p key={index} className="my-4">{block.data.text}</p>;
          case 'list': {
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className={`my-4 ${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'} ml-6`}>
                {block.data.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ListTag>
            );
          }
          case 'image':
            return (
              <figure key={index} className="my-6">
                <img 
                  src={block.data.file.url} 
                  alt={block.data.caption || 'Image'} 
                  className="rounded w-full h-auto object-cover" 
                />
                {block.data.caption && <figcaption className="text-sm text-gray-500 mt-2 text-center">{block.data.caption}</figcaption>}
              </figure>
            );
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-gray-500 pl-4 italic my-6 text-gray-700">
                <div>{block.data.text}</div>
                {block.data.caption && <cite className="block mt-2 text-sm text-gray-500">— {block.data.caption}</cite>}
              </blockquote>
            );
          case 'embed':
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
