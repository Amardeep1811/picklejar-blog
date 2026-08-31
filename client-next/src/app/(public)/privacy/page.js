import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - WalletPickle',
  description: 'WalletPickle Privacy Policy explaining how we collect, use, and handle information.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* HEADER AREA */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center flex flex-col items-center">
        <span className="inline-block bg-[var(--green)] text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 font-[var(--font-ui)]">
          Legal & Compliance
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-bold font-[var(--font-heading)] text-[var(--ink)] mb-6 max-w-3xl">
          Privacy Policy
        </h1>
        <p className="text-xl md:text-2xl text-[var(--gray)] italic font-[var(--font-heading)] max-w-2xl mb-10">
          How we handle personal information, data access, third-party service providers, and your privacy choices.
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
        <h2>1. Who We Are & Scope</h2>
        <p>
          WalletPickle is a digital publication providing general educational content, commentary, and product analysis across personal finance and insurance verticals. WalletPickle is currently operated as an unincorporated project.
        </p>
        <p>
          We are an independent publisher. We are not a bank, lender, insurer, insurance agency, broker-dealer, registered investment adviser, tax preparer, or law firm. We do not provide personalized financial, legal, investment, or tax advice.
        </p>
        <p>
          This Privacy Policy explains what information we collect when you visit and interact with WalletPickle, how that information is used and stored, who it is shared with, and your choices regarding your personal data.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We collect information you choose to give us directly, as well as standard technical data collected automatically:</p>
        <ul>
          <li><strong>Newsletter Subscriptions:</strong> When you subscribe to our newsletter, we collect your email address and subscription timestamp.</li>
          <li><strong>Petition Signatures:</strong> If you participate in online petitions hosted on the site, we collect the email address provided and the petition identifier.</li>
          <li><strong>Contact Form Submissions:</strong> If you communicate with us through forms or direct messages, we collect your name, email address, and message contents.</li>
          <li><strong>Standard Server Logs & Technical Data:</strong> When accessing the site, standard connection data is processed, including IP address, browser type, operating system, referral URL, and timestamps.</li>
        </ul>
        <p>
          We do not ask for or collect sensitive financial data such as Social Security numbers, bank account numbers, credit card details, credit reports, or medical history. Please do not transmit sensitive personal data to us.
        </p>

        <h2>3. How We Use Information</h2>
        <p>We process collected information for the following legitimate purposes:</p>
        <ul>
          <li>To deliver, maintain, secure, and improve WalletPickle content and site features.</li>
          <li>To send email newsletters and transactional notifications (e.g., password resets for administrators).</li>
          <li>To monitor application stability, detect technical bugs, and diagnose errors.</li>
          <li>To prevent fraudulent behavior, scraping, spam, and security incidents.</li>
          <li>To attribute referral traffic when readers click outbound sponsor or affiliate links.</li>
        </ul>

        <h2>4. Third Parties with Code or Data Access</h2>
        <p>
          We work with specific infrastructure and service providers to operate the website. The third parties with code or data access on WalletPickle are listed below:
        </p>
        <ul>
          <li><strong>Cloudinary:</strong> Image hosting and media optimization for article banners and graphics.</li>
          <li><strong>SendGrid:</strong> Transactional email and newsletter delivery service.</li>
          <li><strong>Sentry:</strong> Application error tracking and stability monitoring.</li>
          <li><strong>Alpha Vantage:</strong> Market data API provider used for financial tickers (no user data is shared or transmitted to Alpha Vantage).</li>
          <li><strong>MongoDB Atlas:</strong> Secure cloud database hosting for article content, petition records, and subscriber emails.</li>
          <li><strong>Render:</strong> Backend web service and API server hosting.</li>
          <li><strong>Netlify:</strong> Frontend application hosting and CDN edge delivery.</li>
          <li><strong>First-Party Ad System:</strong> WalletPickle operates an internal, first-party direct advertising placement system. We do not currently integrate third-party ad networks (such as Google AdSense) or programmatic tracking ad exchanges.</li>
        </ul>

        <h2>5. Cookies & Tracking Technologies</h2>
        <p>
          We do not utilize third-party behavioral advertising cookies or cross-site tracking pixels. For detailed information regarding our use of technical session cookies and local storage, please review our standalone <Link href="/cookies" className="text-[var(--green)] hover:underline font-semibold">Cookie Policy</Link>.
        </p>

        <h2>6. No Sale or Cross-Context Sharing of Personal Information</h2>
        <p>
          WalletPickle does not sell personal information for monetary compensation, nor do we share personal information with third parties for cross-context behavioral advertising.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We retain personal data only for as long as necessary to fulfill the purposes described in this policy, maintain valid subscription lists, and meet operational or legal obligations.
        </p>
        <div className="placeholder-box">
          [RETENTION PERIODS — TO BE CONFIRMED BY OPERATOR]
        </div>

        <h2>8. Security Practices & Access Controls</h2>
        <p>
          We implement standard administrative and technical safeguards to protect information against unauthorized access, loss, or alteration. All web traffic is encrypted via HTTPS / TLS.
        </p>
        <div className="placeholder-box">
          [SECURITY PRACTICES & ACCESS CONTROLS — TO BE CONFIRMED BY OPERATOR]
        </div>

        <h2>9. Statutory Applicability Thresholds</h2>
        <div className="placeholder-box">
          [LEGAL APPLICABILITY THRESHOLDS — TO BE CONFIRMED BY OPERATOR]
        </div>

        <h2>10. Your Rights & Manual Request Process</h2>
        <p>
          Depending on your jurisdiction, you may have the right to request access to the personal data we hold about you, request corrections to inaccurate information, or request deletion of your subscriber data.
        </p>
        <p>
          Because WalletPickle is currently operated as an unincorporated project without an automated consumer privacy portal, all privacy requests are processed manually by our team.
        </p>
        <p>
          To submit a request to access, update, or delete your email or unsubscribe from newsletters, please contact us with the subject line <em>"Privacy Request"</em> at:
        </p>
        <div className="placeholder-box">
          [privacy@walletpickle.com — to be confirmed]
        </div>
        <p>
          You may also unsubscribe from our newsletter at any time by clicking the unsubscribe link present in every newsletter email.
        </p>

        <h2>11. Children's Privacy</h2>
        <p>
          WalletPickle is directed to a general adult audience seeking personal finance education. We do not knowingly collect personal information from children under the age of 13. If you believe a child has provided us with personal data, please contact us to request prompt deletion.
        </p>

        <h2>12. Changes to this Policy</h2>
        <p>
          We may update this Privacy Policy periodically to reflect changes in our site features, vendors, or legal requirements. Material updates will be indicated by revising the "Last Updated" date at the top of this page.
        </p>
      </div>
    </div>
  );
}
