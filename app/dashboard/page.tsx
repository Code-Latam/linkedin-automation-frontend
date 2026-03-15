"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  console.log("in dashboard page");

  useEffect(() => {
    console.log("in use effect");
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
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
        router.push("/login");
      });
  }, [router]);

  const handleManageSubscription = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/billing/create-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (result.url) {
        window.location.href = result.url; // Redirect to Stripe Customer Portal
      } else {
        alert("Failed to open subscription management.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: "pro" | "premium") => {
    router.push(`/pricing?selected=${plan}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

  // Helper to format plan name nicely
  const getPlanDisplay = (plan: string) => {
    switch (plan) {
      case "free": return "Free";
      case "pro": return "Pro";
      case "premium": return "Premium";
      default: return plan;
    }
  };

  const hasStripeCustomer = !!user.client?.stripeCustomerId;

  return (
    <div className="min-h-screen px-6 pt-24 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">

        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        {/* Account Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Account Information
          </h2>

          <div className="space-y-2 text-gray-300">
            <p><strong>Email:</strong> {user.user.email}</p>
            <p><strong>Company:</strong> {user.client?.name || "—"}</p>
            <p>
              <strong>Plan:</strong>{" "}
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium ml-2
                ${user.client?.plan === "free" ? "bg-gray-600 text-gray-200" : ""}
                ${user.client?.plan === "pro" ? "bg-cyan-600 text-white" : ""}
                ${user.client?.plan === "premium" ? "bg-purple-600 text-white" : ""}
              `}>
                {getPlanDisplay(user.client?.plan)}
              </span>
            </p>

            {/* Free User - Show Upgrade Options */}
            {user.client?.plan === "free" && (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-gray-400">Choose your plan:</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleUpgrade("pro")}
                    className="flex-1 px-6 py-3 bg-cyan-600/20 border border-cyan-500/30 hover:bg-cyan-600/30 rounded-xl text-cyan-400 font-semibold transition"
                  >
                    Upgrade to Pro - $150/mo
                  </button>
                  <button
                    onClick={() => handleUpgrade("premium")}
                    className="flex-1 px-6 py-3 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 rounded-xl text-purple-400 font-semibold transition"
                  >
                    Upgrade to Premium - $350/mo
                  </button>
                </div>
              </div>
            )}

            {/* Paid User - Show Manage Subscription */}
            {(user.client?.plan === "pro" || user.client?.plan === "premium") && (
              <div className="mt-6">
                {!hasStripeCustomer ? (
                  // This shouldn't happen, but just in case
                  <p className="text-yellow-400 text-sm">
                    Subscription issue detected. Please contact support.
                  </p>
                ) : (
                  <>
                    <button
                      onClick={handleManageSubscription}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-xl text-white font-semibold transition disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Manage Subscription"}
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                      Upgrade, downgrade, or cancel your subscription
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Extension Info */}
        <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Chrome Extension
          </h2>

          <p className="text-gray-300 mb-4">
            Make sure the extension is installed and you're logged in.
          </p>

          <a
            href="/install-extension"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Install / View Instructions →
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