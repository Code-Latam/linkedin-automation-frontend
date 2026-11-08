// app/components/landing/pricing.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { pricingText } from "@/lib/text/pricing";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Whop checkout URLs (public links — safe to expose)
const WHOP_URLS: Record<string, Record<string, string | undefined>> = {
  intentRadar: {
    month: process.env.NEXT_PUBLIC_WHOP_LEADGEN_MONTHLY,
    year: process.env.NEXT_PUBLIC_WHOP_LEADGEN_YEARLY,
  },
  meetingMaker: {
    month: process.env.NEXT_PUBLIC_WHOP_PREMIUM_MONTHLY,
    year: process.env.NEXT_PUBLIC_WHOP_PREMIUM_YEARLY,
  },
  meetingMakerManaged: {
    month: process.env.NEXT_PUBLIC_WHOP_PREMIUM_MANAGEMENT_MONTHLY,
    year: process.env.NEXT_PUBLIC_WHOP_PREMIUM_MANAGEMENT_YEARLY,
  },
  agency: {
    month: process.env.NEXT_PUBLIC_WHOP_AGENCY_MONTHLY,
    year: process.env.NEXT_PUBLIC_WHOP_AGENCY_YEARLY,
  },
};

type Plan = "intentRadar" | "meetingMaker" | "agency";
type UrlPlanKey = Plan | "meetingMakerManaged";
type Interval = "month" | "year";

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("meetingMaker");
  const [selectedInterval, setSelectedInterval] = useState<Interval>("month");
  const [managedCheckbox, setManagedCheckbox] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const getPriceDisplay = (plan: Plan, interval: Interval) => {
    const p = pricingText.plans[plan];
    return interval === "year" ? `$${p.yearlyPrice}/yr` : `$${p.price}/mo`;
  };

  const getMonthlyEquivalent = (plan: Plan) => {
    const p = pricingText.plans[plan];
    return (p.yearlyPrice / 12).toFixed(2);
  };

  const handleUpgrade = (plan: Plan) => {
    const token = localStorage.getItem("token");

    const finalPlan: UrlPlanKey =
      plan === "meetingMaker" && managedCheckbox
        ? "meetingMakerManaged"
        : plan;

    if (!token) {
      router.push(`/onboarding?plan=${finalPlan}&interval=${selectedInterval}`);
      return;
    }

    const checkoutBase = WHOP_URLS[finalPlan]?.[selectedInterval];
    if (!checkoutBase) {
      alert("Checkout is not configured for this plan yet.");
      console.error(
        `Missing Whop URL for plan=${finalPlan}, interval=${selectedInterval}`
      );
      return;
    }

    const url = new URL(checkoutBase);
    const email = localStorage.getItem("email");
    if (email) url.searchParams.set("email", email);

    window.location.href = url.toString();
  };

  const planKeys: Plan[] = ["intentRadar", "meetingMaker", "agency"];

  return (
    <section className="relative py-16" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white flex items-center justify-center gap-2">
            {pricingText.header.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400">
            {pricingText.header.subtitle}
          </p>
        </div>

        {/* Interval Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 border border-gray-800 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setSelectedInterval("month")}
              className={`px-6 py-2 rounded-lg transition ${
                selectedInterval === "month"
                  ? "bg-cyan-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedInterval("year")}
              className={`px-6 py-2 rounded-lg transition ${
                selectedInterval === "year"
                  ? "bg-cyan-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-400">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {planKeys.map((planKey: Plan) => {
            const plan = pricingText.plans[planKey];
            const isSelected = selectedPlan === planKey;
            const isYearly = selectedInterval === "year";
            const isMeetingMaker = planKey === "meetingMaker";

            const effectiveMonthly =
              isMeetingMaker && managedCheckbox
                ? pricingText.plans.meetingMaker.managedPrice ?? plan.price
                : plan.price;

            const effectiveYearly =
              isMeetingMaker && managedCheckbox
                ? pricingText.plans.meetingMaker.managedYearlyPrice ??
                  plan.yearlyPrice
                : plan.yearlyPrice;

            const effectiveMonthlyEq = (effectiveYearly / 12).toFixed(2);

            return (
              <div
                key={planKey}
                className={`relative rounded-3xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-cyan-500/30 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent shadow-2xl z-10"
                    : "border-gray-800 bg-white/[0.03] backdrop-blur-sm opacity-75 hover:opacity-100"
                }`}
                onClick={() => setSelectedPlan(planKey)}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div
                      className={`text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg whitespace-nowrap ${
                        plan.badge === "BEST VALUE"
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                          : "bg-gradient-to-r from-purple-500 to-pink-500"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      {isYearly
                        ? `$${effectiveYearly.toLocaleString()}/yr`
                        : `$${effectiveMonthly}/mo`}
                    </span>
                    {isYearly && (
                      <span className="text-sm text-gray-400 ml-2">
                        (${effectiveMonthlyEq}/mo)
                      </span>
                    )}
                    {isYearly && (
                      <div className="text-sm text-green-400 mt-1">
                        Save 20% vs monthly
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 rounded-full bg-cyan-500/20 p-1 mt-0.5">
                          <Check className="h-3 w-3 text-cyan-400" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Managed service option — after features, before CTA */}
                  {isMeetingMaker && (
                    <label
                      className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 cursor-pointer select-none hover:bg-amber-500/10 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={managedCheckbox}
                        onChange={(e) => setManagedCheckbox(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-amber-500 flex-shrink-0"
                      />
                      <span className="text-xs text-gray-300 leading-relaxed">
                        <strong className="text-white block mb-1">
                          Add managed service
                        </strong>
                        We run the platform for you.{" "}
                        <span className="text-amber-400 font-semibold">
                          +$
                          {pricingText.plans.meetingMaker.managedAddonPrice ??
                            200}
                          /mo
                        </span>
                        {isYearly && (
                          <span className="text-gray-400">
                            {" "}
                            (+$
                            {(
                              pricingText.plans.meetingMaker
                                .managedAddonYearlyPrice ?? 1920
                            ).toLocaleString()}
                            /yr)
                          </span>
                        )}
                        <span className="block mt-1.5 text-[11px] text-gray-400 leading-relaxed">
                          Our team checks your campaigns, monitors replies,
                          tunes agent settings, and adjusts your outreach
                          strategy — typically a couple of hours of hands-on
                          work per month.
                        </span>
                      </span>
                    </label>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpgrade(planKey);
                    }}
                    className={`w-full inline-flex items-center justify-center text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {plan.cta}
                  </button>

                  {!isLoggedIn && isSelected && planKey !== "agency" && (
                    <p className="text-xs text-gray-400 text-center mt-2">
                      You&apos;ll be prompted to sign up first
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Shared features */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {pricingText.sharedFeatures.map((feature: string, index: number) => (
            <div
              key={index}
              className="text-center p-4 rounded-lg bg-white/5 border border-gray-800"
            >
              <span className="text-sm text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Already have an account? */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-8 text-xs text-gray-500 italic text-center">
          {pricingText.disclaimer}
        </p>
      </div>
    </section>
  );
}