"use client";

import { useState } from "react";
import Navbar from "@/components/landing/navbar";
import { useRouter } from "next/navigation";

export default function FreeToolsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'rate_limited' | null; message: string }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !linkedinUrl || !role) {
      setStatus({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    if (!linkedinUrl.includes('linkedin.com/in/')) {
      setStatus({ type: 'error', message: 'Please enter a valid LinkedIn profile URL' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('https://api.meetingmaker.tech/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, url: linkedinUrl, role }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setStatus({ 
          type: 'rate_limited', 
          message: `You already used your daily audit. Come back ${data.next_available ? new Date(data.next_available).toLocaleDateString() : 'tomorrow'}.` 
        });
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process audit');
      }

      setStatus({ 
        type: 'success', 
        message: `✅ Report sent to ${email}! Check your inbox (and spam folder).` 
      });
      
      // Reset form
      setEmail('');
      setLinkedinUrl('');
      setRole('');

    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err instanceof Error ? err.message : 'Something went wrong. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: '', label: 'Select your role...' },
    { value: 'saas_founder', label: 'SaaS Founder' },
    { value: 'solopreneur', label: 'Solopreneur' },
    { value: 'ceo', label: 'Fractional CEO' },
    { value: 'coo', label: 'Fractional COO' },
    { value: 'cko', label: 'Fractional CKO' },
    { value: 'cfo', label: 'Fractional CFO' },
    { value: 'cio', label: 'Fractional CIO' },
    { value: 'cpo', label: 'Fractional CPO' },
    { value: 'cmo', label: 'Fractional CMO' },
    { value: 'cao', label: 'Fractional CAO' },
    { value: 'cvo', label: 'Fractional CVO' },
    { value: 'cdo', label: 'Fractional CDO' },
    { value: 'cro', label: 'Fractional CRO' },
    { value: 'clo', label: 'Fractional CLO' },
    { value: 'cso', label: 'Fractional CSO' },
    { value: 'cto', label: 'Fractional CTO' },
    { value: 'agency_owner', label: 'Agency Owner' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'coach', label: 'Coach' },
    { value: 'recruiter', label: 'Recruiter' },
    { value: 'head_of_sales', label: 'Head of Sales' },
    { value: 'general', label: 'Executive / Professional' },
  ];

  return (
    <>
      <Navbar />
      <section className="relative py-16 overflow-hidden min-h-screen pt-32 md:pt-36 lg:pt-40">
        {/* Background gradient matching your booking page */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-black"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 pt-8 md:pt-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
              Free LinkedIn Authority Ranking
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              See how your LinkedIn profile compares to peers in your role.
              <br />
              Get a free score and actionable report — no login required.
            </p>
          </div>

          {/* Tool Container */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl border border-gray-800 p-6 sm:p-10">
              
              {/* Description */}
              <p className="text-gray-400 text-sm text-center mb-8">
                One free audit per day. We'll email you the full report.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-300 mb-1.5">
                    LinkedIn Profile URL *
                  </label>
                  <input
                    id="linkedinUrl"
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Your Role *
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
                    disabled={isLoading}
                  >
                    {roles.map((r) => (
                      <option key={r.value} value={r.value} className="bg-gray-900">
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Messages */}
                {status.type && (
                  <div className={`p-4 rounded-xl ${
                    status.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-300' :
                    status.type === 'error' ? 'bg-red-900/30 border border-red-700 text-red-300' :
                    'bg-yellow-900/30 border border-yellow-700 text-yellow-300'
                  }`}>
                    {status.message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 ${
                    isLoading 
                      ? 'bg-blue-600/50 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Get My LAR Report'
                  )}
                </button>
              </form>

              {/* Footer note */}
              <p className="text-xs text-gray-500 text-center mt-6">
                🔒 Your email is safe. We'll only send you your report.
                <br />
                Want unlimited audits? <a href="/dashboard" className="text-blue-400 hover:text-blue-300">Log in</a> or <a href="https://www.meetingmaker.tech" target="_blank" className="text-blue-400 hover:text-blue-300">upgrade</a>.
              </p>
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl border border-gray-800 p-6 px-8">
              <p className="text-gray-300 text-sm">
                🚀 Want to track your progress daily and automate your LinkedIn growth?
                <br />
                <a href="https://www.meetingmaker.tech" target="_blank" className="text-blue-400 hover:text-blue-300 font-medium">
                  Try Meeting Maker Free →
                </a>
              </p>
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