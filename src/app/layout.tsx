// src/app/layout.tsx
import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getBaseUrl } from "@/lib/getBaseUrl";

const inter = Inter({ subsets: ["latin"] });

const base = getBaseUrl();
const title = "הזמנת חתונה – אביתר ושובל | אישור הגעה";
const description = "הצטרפו אלינו לחגוג את היום המאושר בחיינו! אשרו את הגעתכם וקבלו את כל פרטי האירוע.";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title,
  description,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title,
    description,
    url: base,
    siteName: "Be there",
    locale: "he_IL",
    type: "website",
    images: [{ url: `${base}/og-image.jpg`, width: 1200, height: 630, alt: "Be there – הזמנת חתונה" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${base}/og-image.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={inter.className}>
        <ErrorBoundary>
          {/* Skip to main content link for accessibility */}
          <a href="#main-content" className="skip-link">
            דלג לתוכן הראשי
          </a>

          <main id="main-content" className="min-h-screen" tabIndex={-1}>
            {children}
          </main>
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
