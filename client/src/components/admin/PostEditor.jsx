import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Quote from '@editorjs/quote';
import Embed from '@editorjs/embed';
import Delimiter from '@editorjs/delimiter';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

export default function PostEditor({ initialData, editorRef }) {
  const containerRef = useRef(null);
  const isReady = useRef(false);

  useEffect(() => {
    if (!isReady.current && containerRef.current) {
      isReady.current = true;
      const editor = new EditorJS({
        holder: containerRef.current,
        data: initialData || { blocks: [] },
        placeholder: 'Write your story...',
        tools: {
          header: Header,
          list: List,
          quote: Quote,
          embed: Embed,
          delimiter: Delimiter,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile(file) {
                  return uploadToCloudinary(file)
                    .then(url => {
                      return {
                        success: 1,
                        file: {
                          url: url
                        }
                      };
                    })
                    .catch(err => {
                      return {
                        success: 0,
                        message: err.message || 'Image upload failed'
                      };
                    });
                }
              }
            }
          }
        },
      });
      
      if (editorRef) {
        editorRef.current = editor;
      }
    }

    return () => {
      if (editorRef && editorRef.current && editorRef.current.destroy && isReady.current) {
        // Only destroy if it's actually initialized and we are unmounting
        try {
          editorRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors (sometimes Editor.js complains if it wasn't fully ready)
        }
        editorRef.current = null;
        isReady.current = false;
      }
    };
  }, []);

  return (
    <div className="border border-gray-700 bg-gray-900 rounded p-4 text-white editor-container min-h-[400px]">
      <div ref={containerRef} className="prose prose-invert max-w-none" />
    </div>
  );
}
