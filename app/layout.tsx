import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import StoreProvider from "@/components/providers/storeProvider";
import { pagesMetaData } from "@/lib/metadata";

// Add viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb", // Your brand blue color
};

// Enhance metadata with additional SEO fields
export const metadata: Metadata = {
  metadataBase: new URL("https://www.meetingmaker.tech"),
  ...pagesMetaData.main,
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
    title: pagesMetaData.main.title,
    description: pagesMetaData.main.description,
    images: pagesMetaData.main.openGraph?.images,
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
