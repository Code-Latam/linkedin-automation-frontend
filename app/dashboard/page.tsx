"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    endorsely_referral?: string;
  }
}

// ─────────────────────────────────────────────────────────────
// Whop checkout URLs (public links — safe to expose)
// ─────────────────────────────────────────────────────────────
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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
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

  const handleChangePassword = async () => {
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setChangePasswordLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "current_password_incorrect") {
          setPasswordError("Current password is incorrect");
        } else if (data.error === "password_too_short") {
          setPasswordError("Password must be at least 6 characters");
        } else {
          setPasswordError(data.error || "Failed to change password");
        }
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePasswordModal(false);
      alert("Password changed successfully!");

    } catch (err) {
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Manage subscription → open Whop's member portal, or show a
  // support message if the user needs to cancel/change.
  // ─────────────────────────────────────────────────────────────
  const handleManageSubscription = () => {
    // Whop does not offer a Stripe-style self-serve portal.
    // Show the user how to manage their subscription.
    const email = localStorage.getItem("email") || user?.user?.email || "";

    alert(
      "To manage or cancel your subscription, please contact support at:\n\n" +
      "support@meetingmaker.tech\n\n" +
      "Include the email you subscribed with: " + email
    );
  };

  // ─────────────────────────────────────────────────────────────
  // Upgrade → send the user directly to the Whop checkout page
  // ─────────────────────────────────────────────────────────────
  const handleUpgrade = (
    plan: "premium" | "agency",
    interval: "month" | "year" = "month"
  ) => {
    setLoading(true);

    const checkoutBase = WHOP_URLS[plan]?.[interval];
    if (!checkoutBase) {
      alert("Checkout is not configured for this plan yet.");
      console.error(`Missing Whop URL for plan=${plan}, interval=${interval}`);
      setLoading(false);
      return;
    }

    const url = new URL(checkoutBase);
    const email = localStorage.getItem("email") || user?.user?.email;
    if (email) url.searchParams.set("email", email);

    window.location.href = url.toString();
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

  const getPlanDisplay = (plan: string) => {
    switch (plan) {
      case "free": return "No Plan";
      case "postboost": return "🚀 Post Boost";
      case "marketing": return "📊 Marketing";
      case "premium": return "💎 Premium";
      case "agency": return "🏢 Agency & Enterprise";
      case "enterprise": return "🏢 Enterprise"; // legacy — kept for old records
      default: return plan || "No Plan";
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Subscription detection now uses Whop fields instead of Stripe
  // ─────────────────────────────────────────────────────────────
  const hasWhopMembership = !!user.client?.whopMembershipId;
  const isPaidPlan = ["postboost", "marketing", "premium", "agency", "enterprise"].includes(
    user.client?.plan
  );
  const hasValidSubscription = hasWhopMembership && isPaidPlan;

  return (
    <div className="min-h-screen px-6 pt-24 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>

          <div className="space-y-2 text-gray-300">
            <p><strong>Email:</strong> {user.user.email}</p>
            <p><strong>Company:</strong> {user.client?.name || "—"}</p>
            <p>
              <strong>Plan:</strong>{" "}
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium ml-2
                ${user.client?.plan === "free" ? "bg-gray-600 text-gray-200" : ""}
                ${user.client?.plan === "postboost" ? "bg-purple-600 text-white" : ""}
                ${user.client?.plan === "marketing" ? "bg-cyan-600 text-white" : ""}
                ${user.client?.plan === "premium" ? "bg-amber-600 text-white" : ""}
                ${user.client?.plan === "agency" ? "bg-purple-600 text-white" : ""}
                ${user.client?.plan === "enterprise" ? "bg-purple-600 text-white" : ""}
              `}>
                {getPlanDisplay(user.client?.plan)}
              </span>
              {user.client?.subscriptionInterval === 'year' && (
                <span className="ml-2 text-xs text-green-400">(Yearly)</span>
              )}
            </p>

            {!hasValidSubscription && (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-gray-400">
                  {user.client?.plan === "free" ? "Choose your plan:" : "You need to subscribe to a plan:"}
                </p>

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
                  <button
                    onClick={() => setBillingInterval("month")}
                    className={`px-4 py-1.5 rounded-lg text-sm transition ${
                      billingInterval === "month"
                        ? "bg-cyan-500 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingInterval("year")}
                    className={`px-4 py-1.5 rounded-lg text-sm transition ${
                      billingInterval === "year"
                        ? "bg-cyan-500 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Yearly
                    <span className="ml-1 text-xs text-green-400">Save 20%</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-amber-500/30">
                    <div>
                      <h4 className="font-semibold text-white">💎 Premium</h4>
                      <p className="text-sm text-gray-400">Full platform access with AI Sales and Marketing Team. Great for Founders, Solopreneurs and Fractional Leaders with CRM</p>
                      <span className="text-xs text-amber-400">Most Popular</span>
                    </div>
                    <button
                      onClick={() => handleUpgrade("premium", billingInterval)}
                      disabled={loading}
                      className="px-4 py-2 bg-amber-600/20 border border-amber-500/30 hover:bg-amber-600/30 rounded-lg text-amber-400 font-semibold transition disabled:opacity-50 text-sm"
                    >
                      {billingInterval === "month" ? "$199/mo" : "$1,910/yr"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-purple-500/30">
                    <div>
                      <h4 className="font-semibold text-white">🏢 Agency & Enterprise Edition</h4>
                      <p className="text-sm text-gray-400">Manage unlimited sales reps, fractional team members, and client accounts at scale</p>
                      <span className="text-xs text-purple-400">For Enterprises and Agencies</span>
                    </div>
                    <button
                      onClick={() => handleUpgrade("agency", billingInterval)}
                      disabled={loading}
                      className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 rounded-lg text-purple-400 font-semibold transition disabled:opacity-50 text-sm"
                    >
                      {billingInterval === "month" ? "$799/mo" : "$7,670/yr"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {hasValidSubscription && (
              <div className="mt-6">
                <div className="p-4 bg-white/5 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-3">
                    You are currently on the <strong className="text-white">{getPlanDisplay(user.client?.plan)}</strong> plan.
                    {user.client?.subscriptionInterval === 'year' && (
                      <span className="ml-2 text-green-400">(Yearly)</span>
                    )}
                  </p>

                  {user.client?.cancelAtPeriodEnd && (
                    <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-400 text-sm">
                        ⚠️ Your subscription is set to cancel at the end of the current billing period.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleManageSubscription}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-xl text-white font-semibold transition disabled:opacity-50"
                  >
                    Manage Subscription
                  </button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Contact support to upgrade, downgrade, or cancel
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Updated: Web App Access */}
        <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Access the Meeting Maker:
          </h2>
          <p className="text-gray-300 mb-4">
            Once you are subscribed login to the Meeting Maker using your credentials.
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

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition"
          >
            Change Password
          </button>
          <a
            href="/forgot-password"
            className="px-6 py-3 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-xl hover:bg-gray-500/30 transition text-center"
          >
            Forgot Password?
          </a>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Change Password</h2>
              <button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordError("");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="Enter your current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="Re-enter your new password"
                />
              </div>

              {passwordError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{passwordError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleChangePassword}
                  disabled={changePasswordLoading}
                  className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-white font-semibold transition disabled:opacity-50"
                >
                  {changePasswordLoading ? "Changing..." : "Change Password"}
                </button>
                <button
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPasswordError("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}