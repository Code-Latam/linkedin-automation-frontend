"use client";

import { useEffect, useState, useMemo } from "react";
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
  const [activeTab, setActiveTab] = useState("account"); // "account" | "blog" | "widgets"
  
  // Blog state
  const [blogEnabled, setBlogEnabled] = useState(false);
  const [blogSettings, setBlogSettings] = useState({ title: "Blog", layout: "grid", customDomain: "" });
  const [articles, setArticles] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  
  // LinkedIn posting state
  const [postLinkedIn, setPostLinkedIn] = useState(false);
  const [linkedinTemplate, setLinkedinTemplate] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Local title state for debouncing
  const [tempTitle, setTempTitle] = useState("Blog");
  const [tempCustomDomain, setTempCustomDomain] = useState("");
  const debouncedTitle = useDebounce(tempTitle, 1000);
  const debouncedCustomDomain = useDebounce(tempCustomDomain, 1000);

  // 🟢 Onboarding state
  const [includeOnboarding, setIncludeOnboarding] = useState(false);

  // 🟢 NEW: Chat Widget state
  const [chatAgents, setChatAgents] = useState([]);
  const [selectedChatAgentId, setSelectedChatAgentId] = useState("");
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [savingAgent, setSavingAgent] = useState(false);

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

  // Update temp values when blogSettings changes
  useEffect(() => {
    setTempTitle(blogSettings.title);
    setTempCustomDomain(blogSettings.customDomain || "");
  }, [blogSettings.title, blogSettings.customDomain]);

  // Save when debounced title changes
  useEffect(() => {
    if (debouncedTitle !== blogSettings.title) {
      updateBlogSettings({ title: debouncedTitle });
    }
  }, [debouncedTitle]);

  // Save when debounced custom domain changes
  useEffect(() => {
    if (debouncedCustomDomain !== (blogSettings.customDomain || "")) {
      updateBlogSettings({ customDomain: debouncedCustomDomain });
    }
  }, [debouncedCustomDomain]);

  // Fetch data when tabs change
  useEffect(() => {
    if (activeTab === "blog") {
      fetchBlogSettings();
      fetchArticles();
      fetchLinkedInSettings();
    }
    if (activeTab === "widgets") {
      fetchBlogSettings(); // For blog embed code (needs token)
      fetchChatAgents();
      fetchChatWidgetSettings();
    }
  }, [activeTab]);

  // ========== BLOG FUNCTIONS (Existing, unchanged) ==========
  
  async function fetchBlogSettings() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/settings`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    setBlogEnabled(data.enabled);
    setBlogSettings({
      title: data.settings.title,
      layout: data.settings.layout,
      customDomain: data.settings.customDomain || ""
    });
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

  async function fetchLinkedInSettings() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/linkedin-template`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setPostLinkedIn(data.postLinkedIn || false);
      setLinkedinTemplate(data.templateUrl || null);
    } catch (err) {
      console.error("Failed to fetch LinkedIn settings:", err);
    }
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
    setBlogSettings({
      title: data.settings.title,
      layout: data.settings.layout,
      customDomain: data.settings.customDomain || ""
    });
  }

  async function disableBlog() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/disable`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (res.ok) {
      setBlogEnabled(false);
      alert("Blog disabled successfully");
    } else {
      alert("Failed to disable blog");
    }
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
    setBlogSettings({
      title: data.settings.title,
      layout: data.settings.layout,
      customDomain: data.settings.customDomain || ""
    });
  }

  async function updatePostLinkedIn(enabled: boolean) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/linkedin-posting`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ enabled })
      });
      if (res.ok) {
        setPostLinkedIn(enabled);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update setting");
      }
    } catch (err) {
      console.error("Failed to update LinkedIn posting:", err);
      alert("Failed to update setting");
    }
  }

  async function uploadTemplate(file: File) {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("template", file);
    
    setUploading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/linkedin-template`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (res.ok) {
        setLinkedinTemplate(data.imageUrl);
        alert("Template uploaded successfully!");
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function removeTemplate() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/linkedin-template`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        setLinkedinTemplate(null);
        alert("Template removed");
      } else {
        alert("Failed to remove template");
      }
    } catch (err) {
      console.error("Remove failed:", err);
      alert("Failed to remove template");
    }
  }

  // ========== CHAT WIDGET FUNCTIONS (NEW) ==========

  async function fetchChatAgents() {
    const token = localStorage.getItem("token");
    setLoadingAgents(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/chat-representatives`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setChatAgents(data.agents || []);
    } catch (err) {
      console.error("Failed to fetch chat agents:", err);
      setChatAgents([]);
    } finally {
      setLoadingAgents(false);
    }
  }

  async function fetchChatWidgetSettings() {
    const token = localStorage.getItem("token");
    try {
      // Reusing blog settings to store selectedChatAgentId (no backend changes needed)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/settings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setSelectedChatAgentId(data.settings?.selectedChatAgentId || "");
    } catch (err) {
      console.error("Failed to fetch chat widget settings:", err);
    }
  }

  async function updateChatAgent(agentId: string) {
    const token = localStorage.getItem("token");
    setSavingAgent(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/settings`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ selectedChatAgentId: agentId })
      });
      if (res.ok) {
        setSelectedChatAgentId(agentId);
      } else {
        alert("Failed to save chat agent selection");
      }
    } catch (err) {
      console.error("Failed to update chat agent:", err);
      alert("Failed to save chat agent selection");
    } finally {
      setSavingAgent(false);
    }
  }

  // ========== BILLING FUNCTIONS (Existing) ==========

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

  const handleUpgrade = async (plan: "pro" | "premium", includeOnboarding: boolean = false) => {
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
          body: JSON.stringify({ 
            plan,
            includeOnboarding
          }),
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

  // ========== EMBED CODE GENERATION ==========

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  
  // Blog embed code (moved to Widgets tab)
  const blogEmbedCode = useMemo(() => {
    return `<script src="https://api.meetingmaker.tech/widgets/embed.js" data-token="${token}"></script>`;
  }, [token]);

  // Chat embed code (new)
  const chatEmbedCode = useMemo(() => {
    if (!selectedChatAgentId) {
      return null;
    }
    return `<script src="https://api.meetingmaker.tech/widgets/chat.js" data-token="${token}" data-agent-id="${selectedChatAgentId}"></script>`;
  }, [token, selectedChatAgentId]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

  const getPlanDisplay = (plan: string) => {
    switch (plan) {
      case "free": return "NO PLAN";
      case "pro": return "Pro";
      case "premium": return "Premium";
      default: return plan;
    }
  };

  const hasStripeCustomer = !!user.client?.stripeCustomerId;

  return (
    <div className="min-h-screen px-6 pt-24 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Tab Navigation - UPDATED with 3 tabs */}
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
          <button
            onClick={() => setActiveTab("widgets")}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === "widgets" 
                ? "bg-cyan-500 text-white" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Widgets
          </button>
        </div>

        {/* ========== ACCOUNT TAB (Unchanged) ========== */}
        {activeTab === "account" && (
          <>
            <h1 className="text-4xl font-bold text-white">
              Dashboard
            </h1>

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
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeOnboarding}
                        onChange={(e) => setIncludeOnboarding(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 bg-white/10"
                      />
                      <span className="text-gray-300">
                        + Add Onboarding Setup ($450 one-time fee)
                      </span>
                    </label>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleUpgrade("pro", includeOnboarding)}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-cyan-600/20 border border-cyan-500/30 hover:bg-cyan-600/30 rounded-xl text-cyan-400 font-semibold transition disabled:opacity-50"
                      >
                        Upgrade to Pro - $150/mo
                      </button>
                      <button
                        onClick={() => handleUpgrade("premium", includeOnboarding)}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 rounded-xl text-purple-400 font-semibold transition disabled:opacity-50"
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

            <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Chrome Extension
              </h2>

              <p className="text-gray-300 mb-4">
                After upgrading your plan please install your Chrome extension and log in.
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

        {/* ========== BLOG TAB (Content Management Only - No Embed Code) ========== */}
        {activeTab === "blog" && (
          <>
            <h1 className="text-4xl font-bold text-white">
              Blog Management
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
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <span className="text-green-400 inline-flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Blog Enabled
                    </span>
                    <p className="text-gray-400 text-sm mt-1">
                      Articles are being generated automatically by your SEO agents
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to disable the blog? Your existing articles will remain but no new articles will be generated.")) {
                        disableBlog();
                      }
                    }}
                    className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                  >
                    Disable Blog
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
                    <div>
                      <label className="block text-sm font-medium mb-2">Custom Blog Domain</label>
                      <input
                        type="text"
                        placeholder="blog.yourcompany.com"
                        value={tempCustomDomain}
                        onChange={(e) => setTempCustomDomain(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Your blog will be accessible at this domain (e.g., https://blog.yourcompany.com). 
                        Leave empty if you're embedding on your main website.
                      </p>
                    </div>
                  </div>
                </div>

                {/* LinkedIn Auto-Posting */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl">LinkedIn Auto-Posting</h2>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${postLinkedIn ? 'text-green-400' : 'text-gray-500'}`}>
                        {postLinkedIn ? '● Enabled' : '○ Disabled'}
                      </span>
                      <button
                        onClick={() => updatePostLinkedIn(!postLinkedIn)}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          ${postLinkedIn ? 'bg-cyan-500' : 'bg-gray-600'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${postLinkedIn ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 mb-4">
                    Automatically share your blog articles as LinkedIn posts. When enabled, each new article
                    will be posted to your LinkedIn profile (or company page if configured).
                  </p>

                  {postLinkedIn && (
                    <div className="mt-4 p-4 bg-black/30 rounded-lg">
                      <h3 className="font-medium text-white mb-3">LinkedIn Post Template</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Upload a 1200×628 pixel image that will be used as the cover for your LinkedIn posts.
                        The same image will be used for all posts to maintain consistent branding.
                      </p>
                      
                      {linkedinTemplate ? (
                        <div className="mb-4">
                          <div className="flex gap-4 items-start">
                            <div className="w-32 h-32 bg-gray-800 rounded-lg overflow-hidden">
                              <img 
                                src={linkedinTemplate} 
                                alt="Current template" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400 mb-2">Current template</p>
                              <button
                                onClick={removeTemplate}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove Template
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            id="template-upload"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadTemplate(file);
                            }}
                          />
                          <label
                            htmlFor="template-upload"
                            className="cursor-pointer text-cyan-400 hover:text-cyan-300"
                          >
                            {uploading ? "Uploading..." : "Click to upload a template image"}
                          </label>
                          <p className="text-gray-500 text-xs mt-2">
                            Recommended: 1200×628 pixels, JPG, PNG, or WebP (max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Articles Section */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl">Your Articles</h2>
                    <button
                      onClick={fetchArticles}
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      🔄 Refresh
                    </button>
                  </div>
                  
                  {blogLoading ? (
                    <p className="text-gray-400">Loading articles...</p>
                  ) : articles.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-2">No articles yet.</p>
                      <p className="text-gray-500 text-sm">
                        Articles will be generated automatically by your SEO agents. 
                        Make sure you have at least one active SEO Manager agent.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {articles.map((article: any) => (
                        <div key={article._id} className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{article.title}</h3>
                              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{article.excerpt}</p>
                              <div className="flex gap-4 mt-2 flex-wrap">
                                <span className="text-xs text-gray-500">
                                  {article.status === "published" ? "✅ Published" : "📝 Draft"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  📖 {article.readTime} min read
                                </span>
                                {article.publishedAt && (
                                  <span className="text-xs text-gray-500">
                                    📅 {new Date(article.publishedAt).toLocaleDateString()}
                                  </span>
                                )}
                                {article.linkedinPost?.posted && (
                                  <span className="text-xs text-blue-400" title={`Posted at ${new Date(article.linkedinPost.postedAt).toLocaleString()}`}>
                                    📤 LinkedIn: Posted
                                  </span>
                                )}
                                {article.linkedinPost?.error && (
                                  <span className="text-xs text-red-400" title={article.linkedinPost.error}>
                                    ❌ LinkedIn: Failed
                                  </span>
                                )}
                              </div>
                            </div>
                            <a
                              href={`/blog/${article.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 text-sm ml-4"
                            >
                              View →
                            </a>
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

        {/* ========== WIDGETS TAB (NEW - All embed codes) ========== */}
        {activeTab === "widgets" && (
          <>
            <h1 className="text-4xl font-bold text-white">
              Website Widgets
            </h1>
            <p className="text-gray-400 -mt-2">
              Copy and paste these scripts into your website to add Meeting Maker functionality.
            </p>

            {/* Blog Widget Section */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📝</span>
                <h2 className="text-xl">Blog Widget</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Display your blog articles anywhere on your website. The widget will automatically show your latest posts.
              </p>
              
              <label className="block text-sm font-medium mb-2">Embed Code</label>
              <div className="bg-black/30 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap break-all text-xs">{blogEmbedCode}</pre>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(blogEmbedCode)}
                className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm"
              >
                📋 Copy Code
              </button>
            </div>

            {/* Chat Widget Section */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💬</span>
                <h2 className="text-xl">Chat Widget</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Add an AI-powered chat widget to your website. Select which Chat Representative agent will handle conversations.
              </p>

              {/* Agent Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Chat Agent</label>
                {loadingAgents ? (
                  <p className="text-gray-400 text-sm">Loading agents...</p>
                ) : (
                  <>
                    <select
                      value={selectedChatAgentId}
                      onChange={(e) => updateChatAgent(e.target.value)}
                      disabled={savingAgent}
                      className="w-full max-w-md p-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                    >
                      <option value="" className="text-gray-400">-- No agent (widget disabled) --</option>
                      {chatAgents.map((agent: any) => (
                        <option key={agent._id} value={agent._id} className="text-white">
                          {agent.name} ({agent.role})
                        </option>
                      ))}
                    </select>
                    {savingAgent && (
                      <p className="text-gray-400 text-sm mt-1">Saving...</p>
                    )}
                    {chatAgents.length === 0 && !loadingAgents && (
                      <p className="text-yellow-400 text-sm mt-2">
                        ⚠️ No Chat Representative agents found. Create one in the Agents section first.
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Chat Embed Code (only shown if agent selected) */}
              {selectedChatAgentId && chatEmbedCode ? (
                <>
                  <label className="block text-sm font-medium mb-2">Embed Code</label>
                  <div className="bg-black/30 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-all text-xs">{chatEmbedCode}</pre>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(chatEmbedCode)}
                    className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    📋 Copy Code
                  </button>
                </>
              ) : (
                !loadingAgents && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      Select a Chat Representative agent above to generate your chat widget embed code.
                    </p>
                  </div>
                )
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}