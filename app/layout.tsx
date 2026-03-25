import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import StoreProvider from "@/components/providers/storeProvider";
import { pagesMetaData } from "@/lib/metadata";

// Add viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

// Get main metadata with safe fallbacks
const mainMetadata = pagesMetaData.main;

// Enhance metadata with additional SEO fields
export const metadata: Metadata = {
  metadataBase: new URL("https://www.meetingmaker.tech"),
  title: mainMetadata.title || "Astrolab Meeting Maker",
  description: mainMetadata.description || "AI-powered LinkedIn outreach automation",
  icons: mainMetadata.icons,
  openGraph: mainMetadata.openGraph,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: mainMetadata.title || "Astrolab Meeting Maker",
    description: mainMetadata.description || "AI-powered LinkedIn outreach automation",
    images: mainMetadata.openGraph?.images,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
