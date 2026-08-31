"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[#c9c6ba] mt-16 font-[var(--font-ui)]">
      <div className="max-w-[1440px] mx-auto p-14 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col">
          <h5 className="text-[11.5px] tracking-[1.4px] text-[var(--gold)] mb-4 font-semibold uppercase">COMPANY</h5>
          <Link href="/about" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">About</Link>
          <Link href="/careers" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Careers</Link>
          <Link href="/press" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Press</Link>
          <Link href="/contact" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Contact</Link>
        </div>
        <div className="flex flex-col">
          <h5 className="text-[11.5px] tracking-[1.4px] text-[var(--gold)] mb-4 font-semibold uppercase">LEGAL</h5>
          <Link href="/privacy" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Privacy</Link>
          <Link href="/terms" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Terms</Link>
          <Link href="/cookies" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Cookies</Link>
          <Link href="/advertise" className="text-[14.5px] text-[#e5e2d5] mb-3 opacity-85 hover:opacity-100 hover:pl-1 hover:text-white transition-all duration-200">Advertise</Link>
        </div>
        <div className="flex flex-col md:items-start">
          <Link
            href="/"
            className="inline-flex items-center mb-3 hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "26px", letterSpacing: "0.5px", whiteSpace: "nowrap" }}
          >
            <span className="text-[#f2eee2]">Wallet</span>
            <span className="text-[var(--green)]">Pickle</span>
          </Link>
          <p className="text-[13.5px] text-[#a8a495] leading-relaxed max-w-sm">
            Clear, research-backed personal finance and insurance guidance helping you make confident, informed financial decisions.
          </p>
        </div>
      </div>
      <div className="border-t border-[#2a2d24] py-6 px-8 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center text-[11.5px] text-[#7d7a6c] gap-2 md:gap-0">
        <div>&copy; 2026 Wallet Pickle Media. All rights reserved.</div>
      </div>
    </footer>
  );
}