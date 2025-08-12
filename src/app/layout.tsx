// src/app/layout.tsx
import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://rsvp-next.vercel.app"),
  title: "הזמנת חתונה – אביתר ושובל | אישור הגעה",
  description:
    "הצטרפו אלינו לחגוג את היום המאושר בחיינו! אשרו את הגעתכם לחתונה של אביתר ושובל ותוכלו לקבל את כל פרטי האירוע.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "הזמנת חתונה – אביתר ושובל | אישור הגעה",
    description:
      "הצטרפו אלינו לחגוג את היום המאושר בחיינו! אשרו את הגעתכם לחתונה של אביתר ושובל ותוכלו לקבל את כל פרטי האירוע.",
    type: "website",
    locale: "he_IL",
    url: "https://rsvp-next.vercel.app",
    siteName: "הזמנת חתונה – אביתר ושובל",
    images: [
      {
        url: "/site-og.png",
        width: 1200,
        height: 630,
        alt: "הזמנת חתונה – אביתר ושובל",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "הזמנת חתונה – אביתר ושובל | אישור הגעה",
    description:
      "הצטרפו אלינו לחגוג את היום המאושר בחיינו! אשרו את הגעתכם לחתונה של אביתר ושובל ותוכלו לקבל את כל פרטי האירוע.",
    images: ["/site-og.png"],
    creator: "@wedding_rsvp",
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
