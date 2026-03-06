"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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
            <p><strong>Company:</strong> {user.client?.name}</p>
            <p><strong>Plan:</strong> {user.client?.plan}</p>

            {/* Upgrade to Pro button */}
            {user.client?.plan === "free" && (
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");

                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/billing/create-checkout-session`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  const result = await res.json();

                  if (result.url) {
                    window.location.href = result.url;
                  }
                }}
                className="px-6 py-3 bg-cyan-500 rounded-xl mt-4"
              >
                Upgrade to Pro
              </button>
            )}

            {/* Cancel Subscription button */}
            {user.client?.plan === "pro" && (
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");

                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/billing/cancel-subscription`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  const result = await res.json();
                  if (result.success) {
                    alert("Subscription canceled. You have been reverted to the free version.");
                    window.location.reload();
                  } else {
                    alert("Failed to cancel subscription.");
                  }
                }}
                className="px-6 py-3 bg-red-500 rounded-xl mt-4"
              >
                Cancel Subscription
              </button>
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