"use client";

import Navbar from "@/components/landing/navbar";

export default function BookMeetingPage() {
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
          {/* Header - added more top padding */}
          <div className="text-center mb-16 pt-8 md:pt-12">
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
              Book a Meeting
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Schedule a one-on-one session with our expert team. 
              <br />
              We'd love to discuss your ideas, challenges, and opportunities.
            </p>
          </div>

          {/* Calendly Container */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 sm:p-10">
              <div className="flex justify-center items-center">
                <iframe 
                  src="https://calendly.com/steven-apiastrolab/30min"
                  width="100%"
                  height="700"
                  frameBorder="0"
                  title="Schedule a meeting with Meeting Maker"
                  className="rounded-xl"
                  style={{ maxWidth: "100%", minWidth: "320px", height: "700px", border: "none" }}
                />
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