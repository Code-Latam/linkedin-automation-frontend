// /app/onboarding/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const WHOP_URLS: Record<string, Record<string, string | undefined>> = {
  intentRadar: {
    month: process.env.NEXT_PUBLIC_WHOP_LEADGEN_MONTHLY,
    year: process.env.NEXT_PUBLIC_WHOP_LEADGEN_YEARLY,
  },
  meetingMaker: {
    month: process.env.NEXT_PUBLIC_WHOP_PREMIUM_MONTHLY,
    year: process.env.NEXT_PUBLIC_WHOP_PREMIUM_YEARLY,
  },
  agency: {
    month: process.env.NEXT_PUBLIC_WHOP_AGENCY_MONTHLY,
    year: process.env.NEXT_PUBLIC_WHOP_AGENCY_YEARLY,
  },
};

type Plan = "intentRadar" | "meetingMaker" | "agency";
type Interval = "month" | "year";

type GoalType =
  | "book_meeting"
  | "email_reply"
  | "subscription"
  | "follow_me"
  | "send_dm";

const GOAL_OPTIONS: { value: GoalType; label: string }[] = [
  { value: "book_meeting", label: "Book a meeting / demo" },
  { value: "email_reply", label: "Get an email reply" },
  { value: "subscription", label: "Subscription signup" },
  { value: "follow_me", label: "LinkedIn follow" },
  { value: "send_dm", label: "Send a DM" },
];

const LINK_FIELDS: Record<
  GoalType,
  { show: boolean; label: string; placeholder: string }
> = {
  book_meeting: {
    show: true,
    label: "Booking link",
    placeholder: "https://cal.com/you/intro",
  },
  subscription: {
    show: true,
    label: "Checkout link",
    placeholder: "https://buy.stripe.com/...",
  },
  follow_me: {
    show: true,
    label: "LinkedIn profile",
    placeholder: "https://linkedin.com/in/you",
  },
  email_reply: { show: false, label: "", placeholder: "" },
  send_dm: { show: false, label: "", placeholder: "" },
};

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = (searchParams.get("plan") || "meetingMaker") as Plan;
  const interval = (searchParams.get("interval") || "month") as Interval;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [goalType, setGoalType] = useState<GoalType>("book_meeting");
  const [fulfillmentLink, setFulfillmentLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // intentRadar = no agents -> hide goal fields
  const supportsAgents = plan !== "intentRadar";
  const linkField = LINK_FIELDS[goalType];

  // Clear the link when switching to a goal that doesn't use it
  useEffect(() => {
    if (!linkField.show) setFulfillmentLink("");
  }, [goalType, linkField.show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const body: Record<string, unknown> = {
        email,
        password,
        name: companyName,
        timezone,
      };

      if (website.trim()) body.website = website.trim();

      if (supportsAgents) {
        body.goalType = goalType;
        if (linkField.show && fulfillmentLink.trim()) {
          body.fulfillmentLink = fulfillmentLink.trim();
        }
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);

      const checkoutBase = WHOP_URLS[plan]?.[interval];
      if (checkoutBase) {
        const url = new URL(checkoutBase);
        url.searchParams.set("email", email);
        window.location.href = url.toString();
        return;
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500";

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
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />

          <div>
            <input
              type="url"
              placeholder="Website URL (recommended)"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1">
              We&apos;ll scan your site to auto-fill your company profile and agents.
              Highly recommended.
            </p>
          </div>

          {supportsAgents && (
            <>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  What should your agents aim for?
                </label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value as GoalType)}
                  className={inputClass}
                >
                  {GOAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {linkField.show && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {linkField.label}
                  </label>
                  <input
                    type="url"
                    placeholder={linkField.placeholder}
                    value={fulfillmentLink}
                    onChange={(e) => setFulfillmentLink(e.target.value)}
                    className={inputClass}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional now — you can add it later in your agent settings.
                  </p>
                </div>
              )}
            </>
          )}

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

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          Loading...
        </div>
      }
    >
      <OnboardingForm />
    </Suspense>
  );
}