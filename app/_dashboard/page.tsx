"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Only run in the browser
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/onboarding"); // Redirect to login if no token
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/onboarding");
      })
      .finally(() => setCheckingAuth(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Wait for auth check before rendering
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

  if (!user) return null; // Should never happen now

  const getPlanDisplay = (plan: string) => {
    switch (plan) {
      case "free": return "No Plan";
      case "postboost": return "🚀 Post Boost";
      case "marketing": return "📊 Marketing";
      case "premium": return "💎 Premium";
      case "enterprise": return "🏢 Enterprise";
      default: return plan || "No Plan";
    }
  };

  return (
    <div className="min-h-screen px-6 pt-24 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>

        {/* Account Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Account Information
          </h2>

          <div className="space-y-2 text-gray-300">
            <p>
              <strong>Email:</strong> {user.user.email}
            </p>
            <p>
              <strong>Company:</strong> {user.client?.name}
            </p>
            <p>
              <strong>Plan:</strong> {getPlanDisplay(user.client?.plan)}
            </p>
          </div>
        </div>

        {/* Web App Access - Updated */}
        <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Web App Access
          </h2>

          <p className="text-gray-300 mb-4">
            Log in to the Meeting Maker web app to manage your blog, LinkedIn posts, and more.
          </p>

          <a
            href="https://app.meetingmaker.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2"
          >
            Go to Web App →
          </a>
        </div>

        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}