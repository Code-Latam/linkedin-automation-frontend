"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setSubmitted(true);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-green-400 text-5xl mb-4">📧</div>
          <h2 className="text-xl font-semibold text-white mb-2">Check Your Email</h2>
          <p className="text-gray-400 mb-4">
            We've sent a password reset link to <strong className="text-cyan-400">{email}</strong>
          </p>
          <p className="text-gray-500 text-sm">The link will expire in 1 hour.</p>
          <a href="/login" className="mt-6 inline-block text-cyan-400 hover:text-cyan-300">
            Back to Login →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
        <p className="text-gray-400 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your email address"
            required
            className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white hover:from-cyan-400 hover:to-blue-400 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-gray-400 text-sm text-center mt-4">
            <a href="/login" className="text-cyan-400 hover:text-cyan-300">
              Back to Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}