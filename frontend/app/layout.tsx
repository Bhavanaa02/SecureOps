import "./globals.css";
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'


import Providers from "./providers";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecureOps - DevSecOps Security Platform",
  description:
    "Automated Security Analysis and Developer Guidance Platform",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="bg-black text-white">

        
        {/* ✅ Providers FIRST (important for session) */}
        <Providers>

          {/* ✅ Pages */}
          {children}

        </Providers>

        <Analytics />
      </body>
    </html>


);
}


