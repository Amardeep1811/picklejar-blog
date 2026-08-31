import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy - WalletPickle',
  description: 'Learn about how WalletPickle uses cookies, local storage, and technical session tokens.',
};

export default function CookiesPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* HEADER AREA */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center flex flex-col items-center">
        <span className="inline-block bg-[var(--green)] text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 font-[var(--font-ui)]">
          Legal & Compliance
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-bold font-[var(--font-heading)] text-[var(--ink)] mb-6 max-w-3xl">
          Cookie Policy
        </h1>
        <p className="text-xl md:text-2xl text-[var(--gray)] italic font-[var(--font-heading)] max-w-2xl mb-10">
          A clear, accurate summary of cookies, local storage, and technical data used on WalletPickle.
        </p>
        <div className="w-full border-t border-b border-[var(--line)] py-3 flex justify-center items-center text-xs font-bold tracking-widest text-[var(--gray)] uppercase font-[var(--font-ui)]">
          <span>Last Updated: August 2026</span>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-3xl mx-auto px-6 text-lg font-[var(--font-body)] text-gray-800 leading-relaxed
        [&_p]:mb-6
        [&_h2]:font-[var(--font-ui)] [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-[var(--ink)]
        [&_h3]:font-[var(--font-ui)] [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-[var(--ink)]
        [&_blockquote]:border-l-[4px] [&_blockquote]:border-[var(--green)] [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-8 [&_blockquote]:text-xl [&_blockquote]:italic [&_blockquote]:text-[var(--ink)]
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul>li]:mb-2
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol>li]:mb-2
      ">
        <h2>1. What Are Cookies and Local Storage?</h2>
        <p>
          Cookies are small text files placed on your device by a web browser when you visit a website. Local storage is a standard browser mechanism that allows web pages to store small pieces of interface state directly on your device.
        </p>

        <h2>2. Our Approach: No Third-Party Marketing or Tracking Cookies</h2>
        <p>
          Unlike many digital publications, <strong>WalletPickle does not deploy third-party advertising cookies, retargeting pixels, or cross-site tracking networks</strong> (such as Google AdSense, Facebook Pixel, or programmatic data aggregators).
        </p>
        <p>
          We do not track your browsing activity across other websites, and we do not sell or trade behavioral tracking profiles with third parties.
        </p>

        <h2>3. What Technologies We Actually Use</h2>
        <p>
          The only cookies and storage mechanisms active on WalletPickle serve strictly technical, administrative, and functional purposes:
        </p>

        <div className="my-8 overflow-x-auto border border-[var(--line)] rounded-lg">
          <table className="w-full text-left border-collapse text-base font-[var(--font-ui)]">
            <thead>
              <tr className="bg-[var(--bg-2)] border-b border-[var(--line)]">
                <th className="p-4 font-bold text-[var(--ink)]">Technology</th>
                <th className="p-4 font-bold text-[var(--ink)]">Type</th>
                <th className="p-4 font-bold text-[var(--ink)]">Purpose</th>
                <th className="p-4 font-bold text-[var(--ink)]">Scope</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--line)]">
                <td className="p-4 font-mono text-sm text-[var(--green-dark)] font-semibold">token</td>
                <td className="p-4 text-sm">HTTP-Only Cookie</td>
                <td className="p-4 text-sm">Secure session authentication for authorized staff accessing the administrative CMS dashboard.</td>
                <td className="p-4 text-sm">Admin routes only (<code className="bg-gray-100 px-1 py-0.5 rounded">/admin/*</code>)</td>
              </tr>
              <tr className="border-b border-[var(--line)]">
                <td className="p-4 font-mono text-sm text-[var(--green-dark)] font-semibold">localStorage</td>
                <td className="p-4 text-sm">Browser Storage</td>
                <td className="p-4 text-sm">Stores client-side user interface preferences (such as selected sports score category tabs) to improve navigation experience.</td>
                <td className="p-4 text-sm">Local to your browser</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-sm text-[var(--green-dark)] font-semibold">Outbound URL Tags</td>
                <td className="p-4 text-sm">Query Parameters</td>
                <td className="p-4 text-sm">When clicking marked sponsor or partner links, standard referral parameters in the destination URL attribute the referral to WalletPickle.</td>
                <td className="p-4 text-sm">Destination website</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>4. Infrastructure & Service Providers</h2>
        <p>
          We utilize reputable third-party infrastructure to deliver and protect the website:
        </p>
        <ul>
          <li><strong>Cloudinary:</strong> Delivers optimized images and graphics over HTTPS.</li>
          <li><strong>Sentry:</strong> Monitors system errors and code exceptions in real time to resolve technical glitches.</li>
          <li><strong>Netlify / Render:</strong> Hosts our static web assets and secure API services.</li>
        </ul>
        <p>
          None of these infrastructure providers are permitted to use visitor data for independent marketing or cross-site tracking purposes.
        </p>

        <h2>5. Controlling Cookies in Your Browser</h2>
        <p>
          You have complete control over cookies through your web browser settings. Most browsers allow you to view, manage, and delete cookies, or disable cookie storage altogether.
        </p>
        <p>
          Because general visitors to WalletPickle are not subjected to tracking cookies, browsing our public guides and articles will function normally even if third-party cookies are disabled in your browser.
        </p>

        <h2>6. Questions</h2>
        <p>
          If you have questions about our cookie usage or technical infrastructure, please consult our <Link href="/privacy" className="text-[var(--green)] hover:underline font-semibold">Privacy Policy</Link> or reach out via our <Link href="/contact" className="text-[var(--green)] hover:underline font-semibold">Contact Page</Link>.
        </p>
      </div>
    </div>
  );
}
