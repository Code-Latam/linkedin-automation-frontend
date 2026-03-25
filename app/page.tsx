import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Pricing from "@/components/landing/pricing";
import Contact from "@/components/landing/contact";
import FAQ from "@/components/landing/faqs";
import Footer from "@/components/landing/footer";
import { MoreFeatures } from "@/components/landing/morefeatures";
import HowItWorks from "@/components/landing/howitworks";
import type { Metadata } from "next";
import { pagesMetaData } from "@/lib/metadata";
import Script from "next/script";

export const metadata: Metadata = pagesMetaData.home;

export default function Home() {
  // Structured Data: Software Application
  const softwareStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Astrolab Meeting Maker",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, Chrome Extension",
    "description": "AI-powered LinkedIn outreach automation that finds leads, starts conversations, and books meetings automatically.",
    "offers": {
      "@type": "Offer",
      "price": "150",
      "priceCurrency": "USD",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/OnlineOnly",
      "eligibleRegion": "Global"
    },
    "featureList": "Automated LinkedIn outreach, AI meeting scheduling, CRM integration, Lead research, Smart conversation management",
    "screenshot": "https://www.meetingmaker.tech/og-image.png",
    "softwareVersion": "2.0"
  };

  // Structured Data: Organization
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Astrolab Meeting Maker",
    "url": "https://www.meetingmaker.tech",
    "logo": "https://www.meetingmaker.tech/logo/logo.jpeg",
    "sameAs": [
      "https://www.linkedin.com/showcase/astrolab-meeting-maker/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@meetingmaker.tech",
      "contactType": "customer support",
      "availableLanguage": ["English"]
    }
  };

  // Structured Data: FAQ Page
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does Meeting Maker work with LinkedIn?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Meeting Maker integrates with LinkedIn via Chrome extension. You can select leads from LinkedIn and our AI agents handle personalized outreach, conversations, and meeting booking automatically."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between Pro and Premium plans?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pro plan includes human-powered lead selection, while Premium adds AI-powered automatic lead selection, priority support, and advanced analytics."
        }
      },
      {
        "@type": "Question",
        "name": "Does Meeting Maker respect LinkedIn limits?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Meeting Maker respects LinkedIn's daily connection request and message limits to ensure account safety and compliance with LinkedIn's terms of service."
        }
      }
    ]
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      {/* Structured Data Scripts - Added for rich search results */}
      <Script
        id="software-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareStructuredData) }}
        strategy="afterInteractive"
      />
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        strategy="afterInteractive"
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        strategy="afterInteractive"
      />

      <main className="w-full">
        <Navbar />
        <Hero />
        <Features />
        <MoreFeatures />
        <HowItWorks />
        <Pricing />
        <Contact />
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}
