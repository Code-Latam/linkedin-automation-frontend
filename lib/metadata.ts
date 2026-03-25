import { Metadata } from "next";

const name = "Astrolab Meeting Maker";
const baseUrl = "https://www.meetingmaker.tech";

// Image paths (assuming these files exist in /public/)
const faviconPath = "/favicon.ico";
const appleIconPath = "/apple-icon.png";
const ogImagePath = "/og-image.png";
const logoPath = "/logo/logo.jpeg";

// Full URLs for Open Graph and Twitter
const fullOgImageUrl = `${baseUrl}${ogImagePath}`;
const fullLogoUrl = `${baseUrl}${logoPath}`;

export const pagesMetaData = {
  // Main layout metadata (fallback for pages without specific metadata)
  main: {
    title: `${name} | AI-Powered LinkedIn Outreach & Meeting Automation`,
    description:
      "Automate your LinkedIn outreach with AI agents. Find leads, start real conversations, and book meetings automatically. Get 3x more meetings with smart lead selection and personalized messaging.",
    icons: {
      icon: faviconPath,
      apple: appleIconPath,
    },
    openGraph: {
      title: `${name} | AI-Powered LinkedIn Outreach`,
      description:
        "AI-powered LinkedIn automation that finds leads, starts conversations, and books meetings automatically. Scale your outreach with intelligent agents.",
      url: baseUrl,
      siteName: name,
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: `${name} - AI-Powered LinkedIn Outreach Automation`,
          type: "image/png",
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | AI-Powered LinkedIn Outreach`,
      description:
        "AI-powered LinkedIn automation that finds leads, starts conversations, and books meetings automatically.",
      images: [fullOgImageUrl],
      site: "@meetingmaker",
      creator: "@meetingmaker",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
  } as Metadata,

  // Homepage
  home: {
    title: `${name} | AI-Powered LinkedIn Outreach & Meeting Automation`,
    description:
      "Automate your LinkedIn lead generation with Meeting Maker. AI agents handle prospecting, conversations, and meeting booking automatically. Start getting 3x more meetings today.",
    icons: {
      icon: faviconPath,
      apple: appleIconPath,
    },
    openGraph: {
      title: `${name} | AI-Powered LinkedIn Outreach`,
      description:
        "AI-powered LinkedIn automation that finds leads, starts conversations, and books meetings automatically.",
      url: baseUrl,
      siteName: name,
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: `${name} - AI-Powered LinkedIn Outreach`,
          type: "image/png",
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | AI-Powered LinkedIn Outreach`,
      description:
        "AI-powered LinkedIn automation that finds leads, starts conversations, and books meetings automatically.",
      images: [fullOgImageUrl],
      site: "@meetingmaker",
      creator: "@meetingmaker",
    },
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
    },
  } as Metadata,

  // Terms page
  terms: {
    title: `${name} | Terms and Conditions`,
    description:
      "Terms and conditions for using Astrolab Meeting Maker. Learn about your rights, responsibilities, and our service terms.",
    icons: {
      icon: faviconPath,
      apple: appleIconPath,
    },
    openGraph: {
      title: `${name} | Terms and Conditions`,
      description: "Terms and conditions for using Astrolab Meeting Maker's LinkedIn outreach automation platform.",
      url: `${baseUrl}/terms`,
      siteName: name,
      images: [
        {
          url: fullLogoUrl,
          width: 1200,
          height: 630,
          alt: `${name} - Terms and Conditions`,
          type: "image/jpeg",
        },
      ],
      type: "website",
    },
    alternates: {
      canonical: "/terms",
    },
    robots: {
      index: true,
      follow: true,
    },
  } as Metadata,

  // Privacy page
  privacy: {
    title: `${name} | Privacy Policy`,
    description:
      "Privacy policy for Astrolab Meeting Maker. Learn how we collect, use, and protect your data when using our Chrome extension and platform.",
    icons: {
      icon: faviconPath,
      apple: appleIconPath,
    },
    openGraph: {
      title: `${name} | Privacy Policy`,
      description: "Privacy policy for Astrolab Meeting Maker. Learn how we protect your data.",
      url: `${baseUrl}/privacy`,
      siteName: name,
      images: [
        {
          url: fullLogoUrl,
          width: 1200,
          height: 630,
          alt: `${name} - Privacy Policy`,
          type: "image/jpeg",
        },
      ],
      type: "website",
    },
    alternates: {
      canonical: "/privacy",
    },
    robots: {
      index: true,
      follow: true,
    },
  } as Metadata,

  // Onboarding/Signup page (noindex to prevent search indexing)
  onboarding: {
    title: `${name} | Create Your Account`,
    description:
      "Create your Astrolab Meeting Maker account to start automating LinkedIn outreach with AI agents.",
    icons: {
      icon: faviconPath,
    },
    robots: {
      index: false,
      follow: true,
    },
  } as Metadata,

  // Login page (noindex to prevent search indexing)
  login: {
    title: `${name} | Log In`,
    description: "Log in to your Astrolab Meeting Maker account to manage your LinkedIn outreach campaigns.",
    icons: {
      icon: faviconPath,
    },
    robots: {
      index: false,
      follow: true,
    },
  } as Metadata,
};