import { Inter, Playfair_Display, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "WalletPickle",
  description: "The best place for sports and finance news.",
};

import { headers } from 'next/headers';

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${sourceSerif.variable} font-[family-name:var(--font-ui)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
