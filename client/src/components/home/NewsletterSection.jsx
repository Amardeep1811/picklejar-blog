import { useState } from 'react';
import axios from '../../api/axios';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('');
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setSubLoading(true);
      setSubStatus('');
      await axios.post('/subscribers', { email });
      setSubStatus('success');
      setEmail('');
    } catch (err) {
      setSubStatus(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <section className="font-['Inter'] w-full mb-12">
      <div className="bg-[var(--ink)] text-[#f2eee2] px-8 py-10 shadow-lg rounded-lg flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-['Playfair_Display'] font-black text-3xl mb-2">Get the morning brief</h3>
          <p className="text-[var(--gray-2)]">Your daily brief on money, markets, and more.</p>
        </div>
        
        <div className="flex-1 w-full max-w-md">
          {subStatus === 'success' ? (
            <div className="bg-[var(--green)]/20 border border-[var(--green)] text-white p-4 text-center font-bold rounded-sm">
              Thanks for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Email address" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full sm:w-[65%] bg-white/10 border border-[#2b3122] p-3 text-white focus:outline-none focus:border-[var(--green)] transition-colors rounded-sm"
              />
              <button 
                type="submit" 
                disabled={subLoading}
                className="w-full sm:w-[35%] bg-[var(--green)] hover:bg-[var(--green-dark)] text-white font-bold py-3 px-6 transition-colors disabled:opacity-70 rounded-sm whitespace-nowrap shrink-0"
              >
                {subLoading ? 'Submitting...' : 'Sign Up'}
              </button>
            </form>
          )}
          {subStatus && subStatus !== 'success' && <div className="text-red-400 text-xs mt-2 text-center md:text-left">{subStatus}</div>}
        </div>
      </div>
    </section>
  );
}
