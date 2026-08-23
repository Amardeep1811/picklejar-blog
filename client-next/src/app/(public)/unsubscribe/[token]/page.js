"use client";
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import axios from "@/api/axios";

export default function Unsubscribe() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Processing your request...');

  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    
    const processUnsubscribe = async () => {
      hasFired.current = true;
      try {
        const res = await axios.get(`/subscribers/unsubscribe/${token}`);
        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message || "You've been successfully unsubscribed.");
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Invalid or expired unsubscribe link.');
      }
    };
    
    if (token) {
      processUnsubscribe();
    } else {
      setStatus('error');
      setMessage('No token provided.');
    }
  }, [token]);

  return (
    <>

      
      <div className="max-w-xl mx-auto px-6 py-20 min-h-[50vh] flex flex-col items-center justify-center text-center font-[var(--font-ui)]">
        <h1 className="text-3xl font-bold font-[var(--font-heading)] mb-6 text-[var(--ink)]">
          Newsletter Unsubscribe
        </h1>
        
        {status === 'loading' && (
          <div className="text-lg text-[var(--gray-2)]">
            <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-[var(--green)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {message}
          </div>
        )}
        
        {status === 'success' && (
          <div className="bg-[#e8f5ed] border border-[#a6d7bb] text-[var(--green-dark)] p-6 rounded-md">
            <p className="text-lg font-medium">{message}</p>
            <p className="mt-4 text-sm text-[var(--gray-2)]">You will no longer receive our newsletter emails.</p>
            <Link href="/" className="inline-block mt-6 px-6 py-2 bg-[var(--ink)] text-white font-medium rounded-md hover:bg-black transition-colors">
              Return Home
            </Link>
          </div>
        )}
        
        {status === 'error' && (
          <div className="bg-[#fceeed] border border-[#e8a39d] text-[var(--red)] p-6 rounded-md">
            <p className="text-lg font-medium">{message}</p>
            <Link href="/" className="inline-block mt-6 px-6 py-2 bg-[var(--ink)] text-white font-medium rounded-md hover:bg-black transition-colors">
              Return Home
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
