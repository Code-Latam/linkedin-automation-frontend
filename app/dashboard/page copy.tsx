"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

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
  const [activeTab, setActiveTab] = useState("account");
  
  // Blog state
  const [blogEnabled, setBlogEnabled] = useState(false);
  const [blogSettings, setBlogSettings] = useState({ title: "Blog", layout: "grid", customDomain: "" });
  const [articles, setArticles] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  
  // SSR Blog state
  const [blogType, setBlogType] = useState<'widget' | 'ssr' | 'both'>('widget');
  const [ssrSubdomain, setSsrSubdomain] = useState('');
  const [tempSsrSubdomain, setTempSsrSubdomain] = useState('');
  const [ssrCustomDomain, setSsrCustomDomain] = useState('');
  const [tempSsrCustomDomain, setTempSsrCustomDomain] = useState('');
  
  const debouncedSsrSubdomain = useDebounce(tempSsrSubdomain, 1000);
  const debouncedSsrCustomDomain = useDebounce(tempSsrCustomDomain, 1000);
  
  // LinkedIn posting state
  const [postLinkedIn, setPostLinkedIn] = useState(false);
  const [linkedinTemplate, setLinkedinTemplate] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Local title state for debouncing
  const [tempTitle, setTempTitle] = useState("Blog");
  const [tempCustomDomain, setTempCustomDomain] = useState("");
  const debouncedTitle = useDebounce(tempTitle, 1000);
  const debouncedCustomDomain = useDebounce(tempCustomDomain, 1000);

  // Onboarding state
  const [includeOnboarding, setIncludeOnboarding] = useState(false);

  // Chat Widget state
  const [chatAgents, setChatAgents] = useState([]);
  const [selectedChatAgentId, setSelectedChatAgentId] = useState("");
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [savingAgent, setSavingAgent] = useState(false);

  // Change Password state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Article pagination and filtering
  const [articlesPage, setArticlesPage] = useState(1);
  const [articlesTotal, setArticlesTotal] = useState(0);
  const [articlesTotalPages, setArticlesTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [publishingWorkflow, setPublishingWorkflow] = useState('auto');

  // Article editing modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: ''
  });
  const [savingArticle, setSavingArticle] = useState(false);

  // TipTap editor instance
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: editFormData.content,
    onUpdate: ({ editor }) => {
      setEditFormData({ ...editFormData, content: editor.getHTML() });
    },
  });

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

  // Save when debounced widget custom domain changes
  useEffect(() => {
    if (debouncedCustomDomain !== (blogSettings.customDomain || "")) {
      updateBlogSettings({ customDomain: debouncedCustomDomain });
    }
  }, [debouncedCustomDomain]);

  // Save when debounced SSR subdomain changes
  useEffect(() => {
    if (debouncedSsrSubdomain !== ssrSubdomain) {
      console.log("Saving subdomain:", debouncedSsrSubdomain);
      updateBlogSettings({ ssrSubdomain: debouncedSsrSubdomain });
    }
  }, [debouncedSsrSubdomain]);

  // Save when debounced SSR custom domain changes
  useEffect(() => {
    if (debouncedSsrCustomDomain !== ssrCustomDomain) {
      console.log("Saving custom domain:", debouncedSsrCustomDomain);
      updateBlogSettings({ ssrCustomDomain: debouncedSsrCustomDomain });
    }
  }, [debouncedSsrCustomDomain]);

  // Fetch data when tabs change
  useEffect(() => {
    if (activeTab === "blog") {
      fetchBlogSettings();
      fetchPublishingWorkflow();
      fetchArticles(1, 'all');
      fetchLinkedInSettings();
    }
    if (activeTab === "widgets") {
      fetchBlogSettings();
      fetchChatAgents();
      fetchChatWidgetSettings();
    }
  }, [activeTab]);

  // Update editor content when editFormData.content changes
  useEffect(() => {
    if (editor && editFormData.content !== editor.getHTML()) {
      editor.commands.setContent(editFormData.content);
    }
  }, [editFormData.content, editor]);

  // ========== BLOG FUNCTIONS ==========
  
  async function fetchBlogSettings() {
    const token = localStorage.getItem("token");
    // Try SSR endpoint first
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/ssr/dashboard/settings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("SSR Settings loaded:", data);
        setBlogEnabled(data.enabled);
        setBlogType(data.type || 'widget');
        setSsrSubdomain(data.ssrSubdomain || '');
        setTempSsrSubdomain(data.ssrSubdomain || '');
        setSsrCustomDomain(data.ssrCustomDomain || '');
        setTempSsrCustomDomain(data.ssrCustomDomain || '');
        setBlogSettings({
          title: data.title || "Blog",
          layout: data.layout || "grid",
          customDomain: data.customDomain || ""
        });
        setTempTitle(data.title || "Blog");
        setTempCustomDomain(data.customDomain || "");
        return;
      }
    } catch (err) {
      console.log("SSR endpoint not available, falling back");
    }
    
    // Fallback to existing endpoint for backward compatibility
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
    setTempTitle(data.settings.title);
    setTempCustomDomain(data.settings.customDomain || "");
  }

  async function fetchArticles(page: number = 1, status: string = statusFilter) {
    const token = localStorage.getItem("token");
    setBlogLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/blog/dashboard/articles?page=${page}&limit=10&status=${status}`;
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setArticles(data.articles);
      setArticlesTotal(data.total);
      setArticlesPage(data.page);
      setArticlesTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setBlogLoading(false);
    }
  }

  async function fetchPublishingWorkflow() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/settings/publishing-workflow`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setPublishingWorkflow(data.publishingWorkflow);
    } catch (err) {
      console.error("Failed to fetch publishing workflow:", err);
    }
  }

  async function updatePublishingWorkflow(workflow: string) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/settings/publishing-workflow`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ publishingWorkflow: workflow })
      });
      if (res.ok) {
        setPublishingWorkflow(workflow);
        alert(`Publishing workflow set to ${workflow === 'auto' ? 'Auto-publish' : 'Manual approval'}`);
      }
    } catch (err) {
      console.error("Failed to update publishing workflow:", err);
    }
  }

  async function updateDraftArticle(articleId: string, data: any) {
    const token = localStorage.getItem("token");
    setSavingArticle(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/dashboard/articles/${articleId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchArticles(articlesPage, statusFilter);
        setShowEditModal(false);
        setEditingArticle(null);
        alert("Article saved successfully");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save article");
      }
    } catch (err) {
      console.error("Failed to update article:", err);
      alert("Failed to save article");
    } finally {
      setSavingArticle(false);
    }
  }

 async function submitArticle(articleId: string) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/dashboard/articles/${articleId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "published", publishedAt: new Date().toISOString() })
    });
    if (res.ok) {
      await fetchArticles(articlesPage, statusFilter);
      alert("Article published successfully!");
    } else {
      const error = await res.json();
      alert(error.error || "Failed to publish article");
    }
  } catch (err) {
    console.error("Failed to publish article:", err);
    alert("Failed to publish article");
  }
}

  function openEditModal(article: any) {
    setEditingArticle(article);
    setEditFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      featuredImage: article.featuredImage || ''
    });
    setShowEditModal(true);
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
    
    const payload: any = {};
    
    // Widget fields
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.layout !== undefined) payload.layout = updates.layout;
    if (updates.customDomain !== undefined) payload.customDomain = updates.customDomain;
    
    // SSR fields
    if (updates.type !== undefined) payload.type = updates.type;
    if (updates.ssrSubdomain !== undefined) payload.ssrSubdomain = updates.ssrSubdomain;
    if (updates.ssrCustomDomain !== undefined) payload.ssrCustomDomain = updates.ssrCustomDomain;
    
    // Handle legacy field name
    if (updates.subdomain !== undefined && updates.ssrSubdomain === undefined) {
      payload.ssrSubdomain = updates.subdomain;
    }
    
    console.log("Saving settings:", payload);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/ssr/dashboard/settings`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log("Settings saved response:", data);
      if (data.type !== undefined) setBlogType(data.type);
      if (data.ssrSubdomain !== undefined) setSsrSubdomain(data.ssrSubdomain);
      if (data.ssrCustomDomain !== undefined) setSsrCustomDomain(data.ssrCustomDomain);
      setBlogSettings({
        title: data.title || blogSettings.title,
        layout: data.layout || blogSettings.layout,
        customDomain: data.customDomain || blogSettings.customDomain
      });
    } else {
      const error = await res.json();
      console.error("Failed to save settings:", error);
      alert(error.error || "Failed to save settings");
    }
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

  // ========== CHAT WIDGET FUNCTIONS ==========

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

  // ========== CHANGE PASSWORD FUNCTION ==========

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

  // ========== BILLING FUNCTIONS ==========

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
  
  const blogEmbedCode = useMemo(() => {
    return `<script src="https://api.meetingmaker.tech/widgets/embed.js" data-token="${token}"></script>`;
  }, [token]);

  const chatEmbedCode = useMemo(() => {
    if (!selectedChatAgentId) {
      return null;
    }
    return `<script src="https://api.meetingmaker.tech/widgets/chat.js" data-token="${token}" data-agent-id="${selectedChatAgentId}"></script>`;
  }, [token, selectedChatAgentId]);

  const ssrBlogUrl = useMemo(() => {
    if (ssrCustomDomain) {
      return `https://${ssrCustomDomain}`;
    }
    if (ssrSubdomain && (blogType === 'ssr' || blogType === 'both')) {
      return `https://${ssrSubdomain}.meetingmaker.tech`;
    }
    return null;
  }, [ssrCustomDomain, ssrSubdomain, blogType]);

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

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-white/10 pb-4 flex-wrap">
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

        {/* ========== ACCOUNT TAB ========== */}
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
          </>
        )}

        {/* ========== BLOG TAB ========== */}
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
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center flex-wrap gap-4">
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

                {/* Widget Blog Settings - Existing */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl mb-4">Widget Blog Settings</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    These settings apply to the widget embedded on your website.
                  </p>
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
                      <label className="block text-sm font-medium mb-2">Custom Domain (for widget)</label>
                      <input
                        type="text"
                        placeholder="yourwebsite.com"
                        value={tempCustomDomain}
                        onChange={(e) => setTempCustomDomain(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Where your website is hosted. Leave empty if you're embedding on your main website.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Publishing Workflow Setting */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl mb-4">Article Publishing Workflow</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Control how automatically generated articles are published.
                  </p>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition">
                      <input
                        type="radio"
                        name="publishingWorkflow"
                        value="auto"
                        checked={publishingWorkflow === 'auto'}
                        onChange={() => updatePublishingWorkflow('auto')}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-white">Auto-publish</div>
                        <p className="text-gray-400 text-sm">Articles go live immediately when generated. No review needed.</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition">
                      <input
                        type="radio"
                        name="publishingWorkflow"
                        value="manual"
                        checked={publishingWorkflow === 'manual'}
                        onChange={() => updatePublishingWorkflow('manual')}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-white">Manual approval</div>
                        <p className="text-gray-400 text-sm">Articles are saved as drafts. You review, edit, and submit for publishing.</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Blog Delivery Method - SSR Section */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl mb-4">Blog Delivery Method</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Choose how your blog is delivered to visitors. The widget is quick to set up, 
                    while SSR blog provides better SEO and is readable by AI search engines.
                  </p>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition">
                      <input
                        type="radio"
                        name="blogType"
                        value="widget"
                        checked={blogType === 'widget'}
                        onChange={() => updateBlogSettings({ type: 'widget' })}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-white">Widget (Current)</div>
                        <p className="text-gray-400 text-sm">Embed script on your site. Quick setup, but limited SEO visibility.</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition">
                      <input
                        type="radio"
                        name="blogType"
                        value="ssr"
                        checked={blogType === 'ssr'}
                        onChange={() => updateBlogSettings({ type: 'ssr' })}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-white">SSR Blog (SEO Optimized)</div>
                        <p className="text-gray-400 text-sm">Fully server-rendered blog on its own domain. Best for SEO and LLM visibility.</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition">
                      <input
                        type="radio"
                        name="blogType"
                        value="both"
                        checked={blogType === 'both'}
                        onChange={() => updateBlogSettings({ type: 'both' })}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-white">Both</div>
                        <p className="text-gray-400 text-sm">Use widget on your main site AND have a dedicated SSR blog subdomain.</p>
                      </div>
                    </label>
                  </div>
                  
                  {/* SSR Settings - Shown when SSR or Both is selected */}
                  {(blogType === 'ssr' || blogType === 'both') && (
                    <div className="mt-6 p-4 bg-black/30 rounded-lg">
                      <h3 className="font-medium text-white mb-3">SSR Blog Configuration</h3>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Subdomain</label>
                        <div className="flex items-center gap-2 flex-wrap">
                          <input
                            type="text"
                            defaultValue={ssrSubdomain}
                            onBlur={(e) => {
                              const value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                              setSsrSubdomain(value);
                              setTempSsrSubdomain(value);
                              updateBlogSettings({ ssrSubdomain: value });
                            }}
                            placeholder="yourbrand"
                            className="flex-1 min-w-[200px] p-2 rounded-lg bg-white/10 border border-white/20"
                          />
                          <span className="text-gray-400">.meetingmaker.tech</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Your blog will be available at: {tempSsrSubdomain ? `https://${tempSsrSubdomain}.meetingmaker.tech` : 'Enter a subdomain'}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Custom Domain (optional)</label>
                        <input
                          type="text"
                          defaultValue={ssrCustomDomain}
                          onBlur={(e) => {
                            const value = e.target.value;
                            setSsrCustomDomain(value);
                            setTempSsrCustomDomain(value);
                            updateBlogSettings({ ssrCustomDomain: value });
                          }}
                          placeholder="blog.yourcompany.com"
                          className="w-full p-2 rounded-lg bg-white/10 border border-white/20"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Configure DNS: CNAME record for <strong>{tempSsrCustomDomain || 'blog.yourcompany.com'}</strong> → <strong>ssr-blog-renderer.vercel.app</strong>
                        </p>
                      </div>
                      
                      {ssrBlogUrl && (
                        <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                          <p className="text-sm text-cyan-400">
                            ✅ Your SSR blog will be live at: 
                            <a 
                              href={ssrBlogUrl}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="underline ml-2 hover:text-cyan-300 break-all"
                            >
                              {ssrBlogUrl}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* LinkedIn Auto-Posting */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
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
                          <div className="flex gap-4 items-start flex-wrap">
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

                {/* Articles Section with Filters and Pagination */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <h2 className="text-xl">Your Articles</h2>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          fetchArticles(1, 'all');
                        }}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          statusFilter === 'all' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('draft');
                          fetchArticles(1, 'draft');
                        }}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          statusFilter === 'draft' ? 'bg-yellow-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        Draft
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('submitted');
                          fetchArticles(1, 'submitted');
                        }}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          statusFilter === 'submitted' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        Submitted
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('published');
                          fetchArticles(1, 'published');
                        }}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          statusFilter === 'published' ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        Published
                      </button>
                    </div>
                  </div>
                  
                  {blogLoading ? (
                    <p className="text-gray-400">Loading articles...</p>
                  ) : articles.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-2">No articles found.</p>
                      <p className="text-gray-500 text-sm">
                        {statusFilter === 'draft' && 'No draft articles waiting for review.'}
                        {statusFilter === 'submitted' && 'No articles pending publishing.'}
                        {statusFilter === 'published' && 'No published articles yet.'}
                        {statusFilter === 'all' && 'Articles will appear here once generated.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {articles.map((article: any) => (
                          <div key={article._id} className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <h3 className="font-semibold text-white break-words">{article.title}</h3>
                                  {article.status === 'draft' && (
                                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Draft</span>
                                  )}
                                  {article.status === 'submitted' && (
                                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Submitted</span>
                                  )}
                                  {article.status === 'published' && (
                                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Published</span>
                                  )}
                                </div>
                                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{article.excerpt}</p>
                                <div className="flex gap-4 mt-2 flex-wrap">
                                  <span className="text-xs text-gray-500">📖 {article.readTime} min read</span>
                                  {article.publishedAt && (
                                    <span className="text-xs text-gray-500">
                                      📅 {new Date(article.publishedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                  {article.linkedinPost?.posted && (
                                    <span className="text-xs text-blue-400">📤 LinkedIn: Posted</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 shrink-0">
  {article.status === 'draft' && (
    <>
      <button
        onClick={() => openEditModal(article)}
        className="text-cyan-400 hover:text-cyan-300 text-sm px-3 py-1 rounded border border-cyan-400/30 hover:bg-cyan-400/10 transition"
      >
        ✏️ Edit
      </button>
      <button
        onClick={() => submitArticle(article._id)}
        className="text-green-400 hover:text-green-300 text-sm px-3 py-1 rounded border border-green-400/30 hover:bg-green-400/10 transition"
      >
        📤 Submit
      </button>
      <button
      onClick={() => {
        const token = localStorage.getItem("token");
        const previewUrl = `${process.env.NEXT_PUBLIC_API_URL}/blog/dashboard/articles/preview/${article._id}`;
        const win = window.open();
        win?.document.write(`
          <html>
            <head><title>Preview: ${article.title}</title>
            <style>body{font-family:sans-serif;max-width:800px;margin:0 auto;padding:2rem;line-height:1.6}img{max-width:100%}.warning{background:#fef3c7;border:1px solid #f59e0b;padding:1rem;border-radius:0.5rem;margin-bottom:1rem}</style>
            </head>
            <body>
              <div id="content">Loading...</div>
              <script>
                fetch('${previewUrl}',{headers:{'Authorization':'Bearer ${token}'}})
                  .then(r=>r.json())
                  .then(d=>{
                    if(d.article){
                      document.body.innerHTML = \`
                        <a href="#" onclick="window.close()">← Close</a>
                        <div class="warning">⚠️ Preview - Not yet published</div>
                        <h1>\${d.article.title}</h1>
                        \${d.article.featuredImage ? '<img src="'+d.article.featuredImage+'">' : ''}
                        <div>\${d.article.content}</div>
                      \`;
                    } else document.body.innerHTML = 'Not found';
                  });
              </script>
            </body>
          </html>
        `);
      }}
      className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 rounded border border-blue-400/30 hover:bg-blue-400/10 transition"
    >
      👁️ View
    </button>
    </>
  )}
  {article.status === 'submitted' && (
    <>
      <span className="text-gray-500 text-sm px-3 py-1">⏳ Pending...</span>
      <a
        href={ssrBlogUrl ? `${ssrBlogUrl}/${article.slug}` : `/blog/${article.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 rounded border border-blue-400/30 hover:bg-blue-400/10 transition"
      >
        👁️ View
      </a>
    </>
  )}
  {article.status === 'published' && (
    <a
      href={ssrBlogUrl ? `${ssrBlogUrl}/${article.slug}` : `/blog/${article.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-400 hover:text-cyan-300 text-sm px-3 py-1 rounded border border-cyan-400/30 hover:bg-cyan-400/10 transition"
    >
      👁️ View
    </a>
  )}
</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Pagination */}
                      {articlesTotalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-6">
                          <button
                            onClick={() => fetchArticles(articlesPage - 1, statusFilter)}
                            disabled={articlesPage === 1}
                            className="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            ← Previous
                          </button>
                          <span className="text-gray-400">
                            Page {articlesPage} of {articlesTotalPages}
                          </span>
                          <button
                            onClick={() => fetchArticles(articlesPage + 1, statusFilter)}
                            disabled={articlesPage === articlesTotalPages}
                            className="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Next →
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* ========== WIDGETS TAB ========== */}
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

      {/* Article Edit Modal */}
      {showEditModal && editingArticle && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Article</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingArticle(null);
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <div className="border border-gray-600 rounded-lg bg-gray-800 overflow-hidden">
                  <div className="border-b border-gray-600 p-2 flex gap-2 flex-wrap bg-gray-800">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`px-2 py-1 rounded text-sm ${editor?.isActive('bold') ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`px-2 py-1 rounded text-sm ${editor?.isActive('italic') ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      Italic
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`px-2 py-1 rounded text-sm ${editor?.isActive('heading', { level: 2 }) ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={`px-2 py-1 rounded text-sm ${editor?.isActive('heading', { level: 3 }) ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={`px-2 py-1 rounded text-sm ${editor?.isActive('bulletList') ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      Bullet List
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={`px-2 py-1 rounded text-sm ${editor?.isActive('orderedList') ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      Numbered List
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const url = window.prompt('Enter image URL:');
                        if (url) editor?.chain().focus().setImage({ src: url }).run();
                      }}
                      className="px-2 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600"
                    >
                      Add Image
                    </button>
                  </div>
                  <EditorContent editor={editor} className="prose prose-invert max-w-none p-4 min-h-[300px] text-white focus:outline-none" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Use the toolbar to format your content. Images can be added via URL.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
                <textarea
                  value={editFormData.excerpt}
                  onChange={(e) => setEditFormData({ ...editFormData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="Short summary of the article..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Featured Image URL</label>
                <input
                  type="text"
                  value={editFormData.featuredImage}
                  onChange={(e) => setEditFormData({ ...editFormData, featuredImage: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="https://example.com/image.jpg"
                />
                {editFormData.featuredImage && (
                  <img
                    src={editFormData.featuredImage}
                    alt="Preview"
                    className="mt-2 h-32 w-auto object-cover rounded-lg"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>
            </div>
            
            <div className="flex gap-3 pt-6 mt-4 border-t border-gray-700">
              <button
                onClick={() => updateDraftArticle(editingArticle._id, {
                  title: editFormData.title,
                  content: editFormData.content,
                  excerpt: editFormData.excerpt,
                  featuredImage: editFormData.featuredImage
                })}
                disabled={savingArticle}
                className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-white font-semibold transition disabled:opacity-50"
              >
                {savingArticle ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingArticle(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="Enter your current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="At least 6 characters"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
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