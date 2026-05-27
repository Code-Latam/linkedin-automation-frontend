"use client";

import Navbar from "@/components/landing/navbar";

const backlinks = [
  {
    name: "Medium - Steven Code LATAM",
    url: "https://medium.com/@stevencodelatam/how-to-build-a-b2b-lead-generation-machine-without-paid-ads-c3c0da1a8026",
  },
  {
    name: "SourceForge - Astrolab Meeting Maker",
    url: "https://sourceforge.net/software/product/Astrolab-Meeting-Maker/",
  },
  {
    name: "Crunchbase - Astrolab Meeting Maker",
    url: "https://www.crunchbase.com/organization/astrolab-meeting-maker",
  },
  {
    name: "Trustpilot - Meeting Maker",
    url: "https://www.trustpilot.com/review/meetingmaker.tech",
  },
  {
    name: "Behance - Steven Code-la",
    url: "https://www.behance.net/stevencode-la",
  },
  {
    name: "ProvenExpert - Steven Jonathan",
    url: "https://www.provenexpert.com/steven-jonathan/",
  },
  {
    name: "About.me - Steven Jonathan",
    url: "https://about.me/stevenjonathan",
  },
  {
    name: "Gravatar - Steven Jonathan",
    url: "https://gravatar.com/passionated0455633ae",
  },
  {
    name: "SlideShare - Steven Jonathan",
    url: "https://www.slideshare.net/StevenJonathan19?tab=about",
  },
  {
    name: "Tumblr - Steven Jonathan",
    url: "https://www.tumblr.com/blog/stevenjonathana",
  },
  {
    name: "CodePen - Steven Jonathan",
    url: "https://codepen.io/Steven-Jonathan",
  },
  {
    name: "Mix - Steven Jonathan",
    url: "https://mix.com/!1375165637671911424?liked_by=stevenjonathana",
  },
  {
    name: "Vocal.media - Steven Jonathan",
    url: "https://vocal.media/authors/steven-jonathan",
  },
  {
    name: "SmartCustomer - Meeting Maker",
    url: "https://www.smartcustomer.com/reviews/meetingmaker.tech",
  },
  {
    name: "G2 - Astrolab Meeting Maker Reviews",
    url: "https://www.g2.com/products/astrolab-meeting-maker/reviews",
  },
];

export default function BacklinksPage() {
  return (
    <>
      <Navbar />
      <section className="relative py-16 overflow-hidden min-h-screen pt-32 md:pt-36 lg:pt-40">
        {/* Background gradient matching your contact page */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-black"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 pt-8 md:pt-12">
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
              Places that link back to us
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              A collection of websites, directories, and platforms that feature
              <br />
              links to Meeting Maker and its creators.
            </p>
          </div>

          {/* Backlinks Grid */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 sm:p-10">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {backlinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-4 rounded-xl bg-white/5 border border-gray-700 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors break-words">
                          {link.name}
                        </h3>
                        <p className="text-gray-400 text-xs mt-2 break-all">
                          {link.url}
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>

              {/* Footer note */}
              <div className="mt-8 text-center text-gray-500 text-sm border-t border-gray-800 pt-6">
                Total {backlinks.length} backlinks — updated regularly
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}