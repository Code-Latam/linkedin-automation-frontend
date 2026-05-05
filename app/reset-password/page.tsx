"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// --- Create a new component that uses useSearchParams ---
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate token and email exist
  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or expired password reset link.");
    }
  }, [token, email]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!token || !email) {
      setError("Invalid or expired password reset link.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "invalid_or_expired_token") {
          throw new Error("Reset link has expired. Please request a new one.");
        }
        throw new Error(data.error || "Failed to reset password");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading and error states
  if (error && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Invalid Reset Link</h2>
          <p className="text-gray-400">{error}</p>
          <a href="/forgot-password" className="mt-6 inline-block text-cyan-400 hover:text-cyan-300">
            Request New Reset Link →
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-green-400 text-5xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-white mb-2">Password Reset Successfully!</h2>
          <p className="text-gray-400 mb-4">Redirecting you to your dashboard...</p>
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-gray-400 mb-6">Enter your new password below.</p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              required
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your new password"
              required
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

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
            {loading ? "Resetting..." : "Reset Password"}
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

// --- Main Page Component with Suspense Boundary ---
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}