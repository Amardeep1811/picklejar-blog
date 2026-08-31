import Link from 'next/link';

export const metadata = {
  title: 'Terms of Use - WalletPickle',
  description: 'Terms and conditions governing use of WalletPickle articles, guides, and services.',
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* HEADER AREA */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center flex flex-col items-center">
        <span className="inline-block bg-[var(--green)] text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 font-[var(--font-ui)]">
          Legal & Compliance
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-bold font-[var(--font-heading)] text-[var(--ink)] mb-6 max-w-3xl">
          Terms of Use
        </h1>
        <p className="text-xl md:text-2xl text-[var(--gray)] italic font-[var(--font-heading)] max-w-2xl mb-10">
          The terms and conditions that govern your access to and use of WalletPickle.
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
        [&_.placeholder-box]:bg-[var(--bg-2)] [&_.placeholder-box]:border [&_.placeholder-box]:border-[var(--line)] [&_.placeholder-box]:p-4 [&_.placeholder-box]:rounded-lg [&_.placeholder-box]:my-6 [&_.placeholder-box]:font-mono [&_.placeholder-box]:text-sm [&_.placeholder-box]:text-[var(--ink)]
      ">
        <h2>1. Acceptance of Terms</h2>
        <p>
          These Terms of Use govern your access to and use of WalletPickle (the "Site"), including all content, articles, tools, and features published on the Site. WalletPickle is currently operated as an unincorporated project ("we," "us," or "our").
        </p>
        <p>
          By accessing or using the Site, you agree to be bound by these Terms of Use and our <Link href="/privacy" className="text-[var(--green)] hover:underline font-semibold">Privacy Policy</Link>. If you do not agree to these terms, please do not use the Site.
        </p>

        <h2>2. Nature of the Publication</h2>
        <p>
          WalletPickle is a digital financial education, news, and commentary publication. We publish educational articles, policy explanations, debt strategies, homeownership considerations, and financial product comparisons for general informational purposes only.
        </p>
        <p>
          <strong>What We Are Not:</strong> We are not a licensed bank, credit union, lender, mortgage broker, insurance carrier, insurance agency, insurance producer, broker-dealer, registered investment adviser, tax preparer, or legal practice. We do not underwrite, sell, broker, or originate financial or insurance products.
        </p>

        <h2>3. No Personalized Financial or Professional Advice</h2>
        <p>
          All information published on WalletPickle is general in nature and addressed to a broad audience. It does not constitute, and should not be relied upon as, individualized financial, investment, tax, legal, credit, or insurance advice.
        </p>
        <p>
          We do not evaluate your individual financial situation, risk tolerance, health, tax status, or specific credit profile. Before making significant financial or insurance decisions, you should consult with a licensed professional (such as a certified financial planner, licensed insurance agent, CPA, or attorney) who can assess your specific circumstances.
        </p>

        <h2>4. No Guarantees of Rates, Savings, or Approvals</h2>
        <p>
          We make no warranty or guarantee regarding your eligibility for, or approval by, any third-party product or service mentioned on the Site. Any rates, APYs, loan amounts, discounts, premiums, or coverage terms displayed are approximations and may change without notice. Authoritative rates and approval decisions are determined solely by the issuing institution.
        </p>

        <h2>5. Accuracy and Currency of Content</h2>
        <p>
          While we strive to keep information accurate and up to date, financial products, insurance regulations, and rates change rapidly. Articles reflect the facts known at the time of publication or revision. We make no warranty that all information on the Site is complete, current, or error-free.
        </p>

        <h2>6. Advertising and Commercial Relationships</h2>
        <p>
          WalletPickle is supported through direct advertising sponsorships and affiliate partnerships. When you click certain outbound links and apply for or purchase products, we may earn compensation.
        </p>
        <p>
          Commercial partnerships do not dictate our editorial conclusions or integrity. To learn more about our sponsorship model and placement options, visit our <Link href="/advertise" className="text-[var(--green)] hover:underline font-semibold">Advertise With Us</Link> page.
        </p>

        <h2>7. Third-Party Products and External Links</h2>
        <p>
          The Site contains links to external third-party websites and service providers. These links are provided solely for reader convenience and informational reference.
        </p>
        <p>
          We do not own, operate, endorse, or guarantee third-party providers. When you leave WalletPickle, the third party’s terms and privacy practices apply. We are not liable for any transaction, loss, or dispute arising between you and any third-party company.
        </p>

        <h2>8. Intellectual Property Rights</h2>
        <p>
          All content published on WalletPickle—including articles, editorial analysis, headlines, graphics, site design, code, logos, and trademarks—is the property of WalletPickle or its licensors and is protected by copyright and intellectual property laws.
        </p>
        <p>
          You may view, download, and print content for your personal, non-commercial use. You may not republish, redistribute, scrape, resell, or duplicate substantial portions of the Site without prior written authorization.
        </p>

        <h2>9. Prohibited Conduct</h2>
        <p>When using WalletPickle, you agree not to:</p>
        <ul>
          <li>Engage in automated data harvesting, bulk scraping, or crawling that bypasses robots.txt or burdens site infrastructure.</li>
          <li>Attempt to gain unauthorized access to our systems, servers, or admin interfaces.</li>
          <li>Introduce malicious code, viruses, or disruptive scripts.</li>
          <li>Misrepresent your identity or imply an official endorsement by WalletPickle.</li>
        </ul>

        <h2>10. Disclaimer of Warranties</h2>
        <p className="uppercase text-sm font-semibold tracking-wide text-[var(--gray)]">
          THE SITE AND ALL CONTENT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p className="uppercase text-sm font-semibold tracking-wide text-[var(--gray)]">
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WALLETPICKLE AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SITE OR RELIANCE ON ANY CONTENT PUBLISHED HEREIN.
        </p>

        <h2>12. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless WalletPickle and its operators from and against any claims, liabilities, damages, judgments, losses, and expenses (including reasonable legal fees) arising from your violation of these Terms or misuse of the Site.
        </p>

        <h2>13. Governing Law & Dispute Resolution</h2>
        <div className="placeholder-box">
          [GOVERNING LAW / JURISDICTION — TO BE CONFIRMED]
        </div>

        <h2>14. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Use at any time. Continued use of the Site following the posting of revised terms indicates your acceptance of the updated terms.
        </p>

        <h2>15. Contact</h2>
        <p>
          For legal inquiries or questions regarding these Terms, please contact us via our <Link href="/contact" className="text-[var(--green)] hover:underline font-semibold">Contact Page</Link> or at:
        </p>
        <div className="placeholder-box">
          [privacy@walletpickle.com — to be confirmed]
        </div>
      </div>
    </div>
  );
}
