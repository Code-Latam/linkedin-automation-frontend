"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Map plan + interval to Whop checkout URLs
const WHOP_URLS: Record<string, Record<string, string | undefined>> = {
  premium: {
    month: process.env.NEXT_PUBLIC_WHOP_PREMIUM_MONTHLY,
    year:  process.env.NEXT_PUBLIC_WHOP_PREMIUM_YEARLY,
  },
  agency: {
    month: process.env.NEXT_PUBLIC_WHOP_AGENCY_MONTHLY,
    year:  process.env.NEXT_PUBLIC_WHOP_AGENCY_YEARLY,
  },
};

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = (searchParams.get("plan") || "premium") as "premium" | "agency";
  const interval = (searchParams.get("interval") || "month") as "month" | "year";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: companyName, timezone }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Save JWT + email for later use
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);

      // Redirect to Whop checkout
      const checkoutBase = WHOP_URLS[plan]?.[interval];
      if (checkoutBase) {
        const url = new URL(checkoutBase);
        url.searchParams.set("email", email); // prefill email on Whop
        window.location.href = url.toString();
        return;
      }

      // Fallback (should not happen if env vars are set)
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 py-24">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Create your account
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-400 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:underline">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams requires it in App Router
export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>}>
      <OnboardingForm />
    </Suspense>
  );
}