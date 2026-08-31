import Link from 'next/link';

export const metadata = {
  title: 'About Us - WalletPickle',
  description: 'Learn about WalletPickle, our editorial mission, and our focus on clear, research-backed insurance and personal finance guidance.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* HEADER AREA */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center flex flex-col items-center">
        <span className="inline-block bg-[var(--green)] text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 font-[var(--font-ui)]">
          About WalletPickle
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-bold font-[var(--font-heading)] text-[var(--ink)] mb-6 max-w-3xl">
          Clear, Independent Financial Guidance for Real-World Decisions
        </h1>
        <p className="text-xl md:text-2xl text-[var(--gray)] italic font-[var(--font-heading)] max-w-2xl mb-10">
          Demystifying complex policies, uncovering hidden costs, and helping you build a resilient financial foundation.
        </p>
        <div className="w-full border-t border-b border-[var(--line)] py-3 flex justify-center items-center text-xs font-bold tracking-widest text-[var(--gray)] uppercase font-[var(--font-ui)]">
          <span>Editorial Mission & Approach</span>
        </div>
      </div>

      {/* ARTICLE BODY */}
      <div className="max-w-3xl mx-auto px-6 text-lg font-[var(--font-body)] text-gray-800 leading-relaxed
        [&_p]:mb-6
        [&_h2]:font-[var(--font-ui)] [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-[var(--ink)]
        [&_h3]:font-[var(--font-ui)] [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-[var(--ink)]
        [&_blockquote]:border-l-[4px] [&_blockquote]:border-[var(--green)] [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-8 [&_blockquote]:text-xl [&_blockquote]:italic [&_blockquote]:text-[var(--ink)]
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul>li]:mb-2
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol>li]:mb-2
      ">
        <h2>Who We Are</h2>
        <p>
          WalletPickle is a digital publication dedicated to making personal finance transparent, actionable, and free from industry jargon. We provide straightforward analysis, in-depth product comparisons, and practical financial education designed for everyday consumers navigating consequential money decisions.
        </p>
        <p>
          Managing money isn’t just about numbers on a spreadsheet; it is about protecting what you have built and securing peace of mind. Whether you are balancing household debt, renovating a home, evaluating investment options, or shopping for coverage, WalletPickle provides the context and clarity needed to act with confidence.
        </p>

        <h2>Why Insurance Is Our Core Focus</h2>
        <p>
          Among all personal finance topics, insurance is where consumers are most vulnerable to confusing terminology, opaque policy documents, and aggressive sales tactics. Most people only find out what their policy actually covers after a crisis occurs—when it is too late to make adjustments.
        </p>
        <p>
          That is why insurance coverage forms the cornerstone of WalletPickle’s editorial coverage. We focus heavily on:
        </p>
        <ul>
          <li><strong>Dissecting Complex Policy Terms:</strong> Translating deductibles, co-pays, exclusions, and riders into plain English.</li>
          <li><strong>Comparing Coverage Types:</strong> Explaining the tangible differences between term vs. whole life, standard auto vs. comprehensive riders, and replacement cost vs. actual cash value in homeowner policies.</li>
          <li><strong>Preventing Underinsurance:</strong> Highlighting critical gaps that leave households exposed to catastrophic out-of-pocket expenses.</li>
          <li><strong>Eliminating Unnecessary Costs:</strong> Identifying redundant add-ons and premium creep so you only pay for coverage you genuinely need.</li>
        </ul>

        <blockquote>
          “Our goal is simple: ensure you never pay for coverage you don’t need, and never discover a fatal gap in coverage when you need it most.”
        </blockquote>

        <h2>Comprehensive Financial Coverage</h2>
        <p>
          Beyond insurance, WalletPickle covers the broader personal finance landscape across several key verticals:
        </p>
        <ul>
          <li><strong>Debt & Credit:</strong> Structured strategies for debt reduction, managing interest rates, understanding loan terms, and building lasting credit health.</li>
          <li><strong>Home & Property:</strong> Navigating mortgages, property maintenance costs, refinancing considerations, and value-adding home improvements.</li>
          <li><strong>Saving & Investing:</strong> Long-term wealth-building fundamentals, high-yield banking options, retirement planning basics, and risk management principles.</li>
          <li><strong>Lifestyle & Consumer Spending:</strong> Smart budgeting methods, consumer rights, avoiding fee traps, and everyday frugality without sacrificing quality of life.</li>
        </ul>

        <h2>Our Editorial Approach</h2>
        <p>
          Our writing is driven by thorough research and consumer utility. We operate under strict principles:
        </p>
        <ol>
          <li><strong>Plain-Language Explanations:</strong> We believe that if a financial concept cannot be explained clearly to a general audience, it hasn’t been explained well enough. We eliminate unnecessary technical jargon.</li>
          <li><strong>No Fluff or Sensationalism:</strong> We avoid clickbait headlines and get-rich-quick narratives. Our articles deliver substantive, actionable facts from line one.</li>
          <li><strong>Methodological Rigor:</strong> We review primary sources, statutory requirements, and provider disclosures directly rather than relying on marketing summaries.</li>
          <li><strong>Uncompromising Independence:</strong> Our editorial judgments and recommendations are made independently by our editorial team. Commercial relationships do not dictate editorial conclusions or rankings.</li>
        </ol>

        <h2>Partnering & Staying In Touch</h2>
        <p>
          We are committed to continually expanding our coverage and providing readers with reliable tools to make informed decisions. For partnership inquiries, review our <Link href="/advertise" className="text-[var(--green)] hover:underline font-semibold">Advertise With Us</Link> page, or learn more about how we fund our operations in our <Link href="/terms" className="text-[var(--green)] hover:underline font-semibold">Terms of Use</Link> and disclosures.
        </p>
      </div>
    </div>
  );
}
