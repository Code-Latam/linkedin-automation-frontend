import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Astrolab Meeting Maker",
  description: "Terms and conditions for using the Astrolab Meeting Maker Chrome extension and platform."
};

export default function Terms() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pt-32 pb-20">
        <h1 className="text-4xl font-bold mb-8 text-gradient-to-r from-purple-400 to-pink-400">
          Terms and Conditions
        </h1>

        <p className="mb-6 text-gray-300">
          Welcome to Astrolab Meeting Maker. By using our Chrome extension and platform, you agree to these terms and conditions. Please read them carefully.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-purple-400">1. Use of Service</h2>
          <p className="text-gray-300">
            You may use the Astrolab Meeting Maker platform only for lawful purposes and in accordance with these terms. You agree not to misuse the platform or access it in an unauthorized manner.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-purple-400">2. Account Responsibilities</h2>
          <p className="text-gray-300">
            Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account. Notify us immediately of any unauthorized use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-purple-400">3. Data and Privacy</h2>
          <p className="text-gray-300">
            By using the service, you consent to the collection, use, and storage of your data as described in our Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-purple-400">4. Intellectual Property</h2>
          <p className="text-gray-300">
            All content, software, and materials provided by Astrolab Meeting Maker are the property of the platform and protected by copyright and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-purple-400">5. Limitation of Liability</h2>
          <p className="text-gray-300">
            Astrolab Meeting Maker is provided "as is." We are not liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-purple-400">6. Changes to Terms</h2>
          <p className="text-gray-300">
            We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-purple-400">7. Contact</h2>
          <p className="text-gray-300">
            If you have questions about these terms, contact us at <span className="text-pink-400">support@meetingmaker.tech</span>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}