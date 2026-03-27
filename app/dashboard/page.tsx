"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Debounce hook
function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("account"); // "account" | "blog"
  
  // Blog state
  const [blogEnabled, setBlogEnabled] = useState(false);
  const [blogSettings, setBlogSettings] = useState({ title: "Blog", layout: "grid" });
  const [articles, setArticles] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  
  // Local title state for debouncing
  const [tempTitle, setTempTitle] = useState("Blog");
  const debouncedTitle = useDebounce(tempTitle, 1000);

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

  // Update tempTitle when blogSettings changes
  useEffect(() => {
    setTempTitle(blogSettings.title);
  }, [blogSettings.title]);

  // Save when debounced title changes
  useEffect(() => {
    if (debouncedTitle !== blogSettings.title) {
      updateBlogSettings({ title: debouncedTitle });
    }
  }, [debouncedTitle]);

  // Fetch blog data when tab changes to blog
  useEffect(() => {
    if (activeTab === "blog") {
      fetchBlogSettings();
      fetchArticles();
    }
  }, [activeTab]);

  async function fetchBlogSettings() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/settings`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    setBlogEnabled(data.enabled);
    setBlogSettings(data.settings);
  }

  async function fetchArticles() {
    const token = localStorage.getItem("token");
    setBlogLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/dashboard/articles`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    setArticles(data.articles);
    setBlogLoading(false);
  }

  async function enableBlog() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/enable`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();
    setBlogEnabled(true);
    setBlogSettings(data.settings);
  }

  async function updateBlogSettings(updates: any) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/settings`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    setBlogSettings(data.settings);
  }

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
        window.location.href = result.url;
      } else {
        alert("Failed to open subscription management.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: "pro" | "premium") => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/billing/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan }),
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to start upgrade process.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const embedCode = `<script src="https://api.meetingmaker.tech/widgets/embed.js?token=${token}"></script>`;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

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

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("account")}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === "account" 
                ? "bg-cyan-500 text-white" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === "blog" 
                ? "bg-cyan-500 text-white" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Blog
          </button>
        </div>

        {/* Account Tab */}
        {activeTab === "account" && (
          <>
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

                {(user.client?.plan === "pro" || user.client?.plan === "premium") && (
                  <div className="mt-6">
                    {!hasStripeCustomer ? (
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
          </>
        )}

        {/* Blog Tab - DISPLAY ONLY */}
        {activeTab === "blog" && (
          <>
            <h1 className="text-4xl font-bold text-white">
              Blog Settings
            </h1>

            {!blogEnabled ? (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl mb-4">Enable Blog</h2>
                <p className="text-gray-400 mb-4">
                  Enable blog functionality to automatically generate SEO-optimized articles 
                  that will be published on your website. This helps drive organic traffic 
                  and establish your authority in the B2B sales space.
                </p>
                <button 
                  onClick={enableBlog}
                  className="bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-400 transition"
                >
                  Enable Blog
                </button>
              </div>
            ) : (
              <>
                {/* Embed Code Section */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl mb-2">Embed on Your Website</h2>
                  <p className="text-gray-400 mb-4">
                    Copy this code and paste it anywhere on your website where you want your blog to appear:
                  </p>
                  <div className="bg-black/30 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-all text-xs">{embedCode}</pre>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(embedCode)}
                    className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    📋 Copy Code
                  </button>
                </div>

                {/* Blog Settings */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl mb-4">Blog Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Blog Title</label>
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Layout</label>
                      <select
                        value={blogSettings.layout}
                        onChange={(e) => updateBlogSettings({ layout: e.target.value })}
                        className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
                      >
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Articles Section - DISPLAY ONLY */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl mb-4">Your Articles</h2>
                  
                  {blogLoading ? (
                    <p className="text-gray-400">Loading articles...</p>
                  ) : articles.length === 0 ? (
                    <p className="text-gray-400">No articles yet. Articles will be generated automatically by the SEO agent.</p>
                  ) : (
                    <div className="space-y-3">
                      {articles.map((article: any) => (
                        <div key={article._id} className="border border-white/10 rounded-lg p-4">
                          <h3 className="font-semibold text-white">{article.title}</h3>
                          <p className="text-gray-400 text-sm mt-1">{article.excerpt}</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-xs text-gray-500">
                              {article.status === "published" ? "✅ Published" : "📝 Draft"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {article.readTime} min read
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(article.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}