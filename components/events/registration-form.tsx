// components/events/registration-form.tsx
"use client";

import { useState } from "react";

interface RegistrationFormProps {
  slug: string;
  attendeeLabel?: string | null;
}

export default function WebinarRegistrationForm({ slug, attendeeLabel }: RegistrationFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/webinars/${slug}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            email,
            company,
            jobTitle,
            linkedInUrl,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMap: Record<string, string> = {
          already_registered: "This email is already registered for this event.",
          event_full: "This event has reached capacity.",
          event_not_open: "Registration is closed for this event.",
          valid_email_required: "Please enter a valid email address.",
          full_name_required: "Please enter your full name.",
        };
        setError(errorMap[data?.error] || data?.error || "Registration failed. Please try again.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">You&apos;re registered! 🎉</h3>
        <p className="text-gray-300">
          We&apos;ve sent a confirmation email to <strong>{email}</strong> with the details.
          We&apos;ll also remind you 1 day and 30 minutes before the event.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4 max-w-lg mx-auto"
    >
      <h3 className="text-2xl font-bold text-white">Register for this event</h3>

      {attendeeLabel && (
        <p className="animate-pulse text-cyan-400 font-semibold">
          🔥 {attendeeLabel} attending
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Full name *</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-cyan-500"
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-cyan-500"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Company name</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-cyan-500"
          placeholder="Acme Inc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Job title</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-cyan-500"
          placeholder="Head of Sales"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn URL</label>
        <input
          type="text"
          value={linkedInUrl}
          onChange={(e) => setLinkedInUrl(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-cyan-500"
          placeholder="https://linkedin.com/in/..."
        />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white hover:from-cyan-400 hover:to-blue-400 transition disabled:opacity-50"
      >
        {submitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
