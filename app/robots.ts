import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",           // Block API routes
        "/dashboard/",     // Block user dashboard
        "/onboarding",     // Block signup page (user action page)
        "/login",          // Block login page (user action page)
        "/auth/",          // Block any auth routes
        "/admin/",         // Block admin pages if any
        "/*/edit$",        // Block edit pages pattern
        "/*/delete$",      // Block delete actions pattern
      ],
    },
    sitemap: "https://www.meetingmaker.tech/sitemap.xml",
  };
}