import Link from 'next/link';

export const metadata = {
  title: 'Advertise With Us - WalletPickle',
  description: 'Partner with WalletPickle to reach engaged readers actively making insurance, debt, property, and personal finance decisions.',
};

export default function AdvertisePage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* HEADER AREA */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center flex flex-col items-center">
        <span className="inline-block bg-[var(--green)] text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 font-[var(--font-ui)]">
          Partner With Us
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-bold font-[var(--font-heading)] text-[var(--ink)] mb-6 max-w-3xl">
          Connect With High-Intent Financial Decision Makers
        </h1>
        <p className="text-xl md:text-2xl text-[var(--gray)] italic font-[var(--font-heading)] max-w-2xl mb-10">
          Direct, high-impact sponsorships tailored for brands delivering real value in insurance, personal finance, and consumer tools.
        </p>
        <div className="w-full border-t border-b border-[var(--line)] py-3 flex justify-center items-center text-xs font-bold tracking-widest text-[var(--gray)] uppercase font-[var(--font-ui)]">
          <span>Direct Advertising & Sponsorships</span>
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
        <h2>Direct Brand Partnerships</h2>
        <p>
          WalletPickle is an independent digital publication read by individuals actively researching insurance policies, debt management strategies, banking products, and homeownership investments.
        </p>
        <p>
          We do not operate through programmatic ad networks or automated self-serve exchanges. Every placement on WalletPickle is coordinated directly with our team, configured manually in our content management platform, and vetted to ensure a clean, high-quality reader experience.
        </p>

        <h2>Available Placements</h2>
        <p>
          We offer prominent, uncluttered sponsorship positions designed to capture reader attention without disrupting editorial flow:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
          <div className="bg-[var(--bg-2)] border border-[var(--line)] p-6 rounded-xl">
            <h3 className="text-lg font-bold text-[var(--ink)] mb-2 font-[var(--font-ui)]">Top Header Banner</h3>
            <p className="text-sm text-gray-700 font-[var(--font-ui)]">
              Site-wide premium visibility positioned directly above navigation across both desktop and mobile views.
            </p>
          </div>
          <div className="bg-[var(--bg-2)] border border-[var(--line)] p-6 rounded-xl">
            <h3 className="text-lg font-bold text-[var(--ink)] mb-2 font-[var(--font-ui)]">Sticky Sidebar Display</h3>
            <p className="text-sm text-gray-700 font-[var(--font-ui)]">
              Persistent desktop placement alongside full-length editorial guides and policy breakdowns.
            </p>
          </div>
          <div className="bg-[var(--bg-2)] border border-[var(--line)] p-6 rounded-xl">
            <h3 className="text-lg font-bold text-[var(--ink)] mb-2 font-[var(--font-ui)]">In-Article Sponsorship Cards</h3>
            <p className="text-sm text-gray-700 font-[var(--font-ui)]">
              Contextually integrated visual cards within specific articles or topic categories.
            </p>
          </div>
          <div className="bg-[var(--bg-2)] border border-[var(--line)] p-6 rounded-xl">
            <h3 className="text-lg font-bold text-[var(--ink)] mb-2 font-[var(--font-ui)]">Section Divider Banners</h3>
            <p className="text-sm text-gray-700 font-[var(--font-ui)]">
              Full-width category breaks on high-traffic vertical index pages (Insurance, Debt, Real Estate, Investing).
            </p>
          </div>
        </div>

        <h2>Our Audience</h2>
        <p>
          WalletPickle readers are proactive consumers seeking practical financial clarity. Our core readership focuses heavily on:
        </p>
        <ul>
          <li><strong>Insurance Shoppers:</strong> Comparing auto, home, life, health, and commercial coverage options.</li>
          <li><strong>Borrowers & Homeowners:</strong> Exploring refinancing, personal loans, mortgages, and home renovation financing.</li>
          <li><strong>Savers & Investors:</strong> Seeking competitive high-yield accounts, debt paydown strategies, and long-term asset building.</li>
        </ul>

        <h2>Advertising & Compliance Standards</h2>
        <p>
          To maintain reader trust and uphold FTC disclosure guidelines, all sponsor campaigns must adhere to clear standards:
        </p>
        <ol>
          <li><strong>Clear Labeling:</strong> All paid creative and sponsored modules are conspicuously marked with standard disclosure indicators.</li>
          <li><strong>Editorial Independence:</strong> Advertisers do not write, review, or alter editorial articles. Our coverage and product comparisons remain strictly independent.</li>
          <li><strong>Truth in Advertising:</strong> Advertised claims, rates, and terms must be substantiated and compliant with applicable state and federal lending/insurance regulations.</li>
        </ol>

        <h2>Get In Touch</h2>
        <p>
          To inquire about campaign availability, custom category sponsorships, and placement pricing, reach out to our team:
        </p>
        <div className="bg-[var(--bg-2)] border border-[var(--line)] p-6 rounded-xl my-6">
          <p className="font-semibold text-[var(--ink)] mb-2 font-[var(--font-ui)]">
            Ready to partner with WalletPickle?
          </p>
          <p className="text-sm text-gray-700 mb-4 font-[var(--font-ui)]">
            Contact us with your brand name, target vertical, and desired campaign timeline via our <Link href="/contact" className="text-[var(--green)] hover:underline font-semibold">Contact Page</Link> <em>[direct advertising email to be confirmed]</em>.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[var(--green)] hover:bg-[var(--green-dark)] text-white px-5 py-2.5 rounded font-semibold text-sm transition-colors font-[var(--font-ui)]"
          >
            Go to Contact Page &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
