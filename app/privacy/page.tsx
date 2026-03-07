import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Astrolab Meeting Maker",
  description: "Privacy policy for the Astrolab Meeting Maker Chrome extension and platform."
};

export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pt-32 pb-20">
       
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <p className="mb-6">
          Astrolab Meeting Maker respects your privacy. This policy explains how
          we collect, use, and protect information when you use our Chrome
          extension and platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>User account information such as email address.</li>
          <li>LinkedIn profile information necessary to export leads.</li>
          <li>Authentication tokens required to maintain login sessions.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Information</h2>
        <p>
          Information is used solely to provide the core functionality of the
          Astrolab Meeting Maker platform, including exporting LinkedIn leads,
          enabling automated outreach agents, and tracking outreach analytics.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Sharing</h2>
        <p>
          We do not sell or share user data with third parties except where
          required to operate the service (such as authentication providers).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
        <p>
          All communication with our servers occurs over secure HTTPS
          connections and we take appropriate measures to protect user data.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
        <p>
          If you have questions regarding this policy, contact us at
          support@meetingmaker.tech.
        </p>
      </main>

      <Footer />
    </div>
  );
}