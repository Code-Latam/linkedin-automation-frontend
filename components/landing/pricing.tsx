"use client";
import React, { useState, useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { pricingText } from '@/lib/text/pricing';
import Link from "next/link";
import { useRouter } from 'next/navigation';

// Price constants
const POSTBOOST_PRICE = 49;
const MARKETING_PRICE = 149;
const PREMIUM_PRICE = 350;
const ONBOARDING_PRICE = 450;

type Plan = "postboost" | "marketing" | "premium";

export default function Pricing() {
    const [selectedPlan, setSelectedPlan] = useState<Plan>("marketing");
    const [includeOnboarding, setIncludeOnboarding] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const getPrice = (plan: Plan) => {
        switch(plan) {
            case "postboost": return POSTBOOST_PRICE;
            case "marketing": return MARKETING_PRICE;
            case "premium": return PREMIUM_PRICE;
        }
    };

    const getTotalPrice = () => {
        const basePrice = getPrice(selectedPlan);
        const onboardingPrice = (selectedPlan === "premium" && includeOnboarding) ? ONBOARDING_PRICE : 0;
        return basePrice + onboardingPrice;
    };

    const handleUpgrade = async (plan: Plan) => {
        setIsLoading(true);
        
        const token = localStorage.getItem("token");
        
        if (!token) {
            router.push(`/onboarding?plan=${plan}&onboarding=${includeOnboarding && plan === 'premium'}`);
            return;
        }

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
                        includeOnboarding: plan === "premium" ? includeOnboarding : false
                    }),
                }
            );

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Failed to start upgrade process. Please try again.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Upgrade error:", error);
            alert("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const plans = [
        { key: "postboost" as Plan, ...pricingText.plans.postboost },
        { key: "marketing" as Plan, ...pricingText.plans.marketing },
        { key: "premium" as Plan, ...pricingText.plans.premium }
    ];

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

                {/* Pricing Cards - 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const isSelected = selectedPlan === plan.key;
                        const price = getPrice(plan.key);
                        const showOnboarding = plan.key === "premium";
                        
                        return (
                            <div
                                key={plan.key}
                                className={`relative rounded-3xl border transition-all duration-300 cursor-pointer ${
                                    isSelected 
                                        ? 'border-cyan-500/30 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent shadow-2xl scale-105 z-10' 
                                        : 'border-gray-800 bg-white/[0.03] backdrop-blur-sm opacity-75 hover:opacity-100 hover:scale-102'
                                }`}
                                onClick={() => setSelectedPlan(plan.key)}
                            >
                                {plan.badge && isSelected && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                                            {plan.badge}
                                        </div>
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                                    
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold text-white">${price}</span>
                                        <span className="text-gray-400 text-lg ml-2">/mo</span>
                                        {showOnboarding && includeOnboarding && isSelected && (
                                            <div className="text-sm text-cyan-400 mt-1">
                                                + ${ONBOARDING_PRICE} one-time setup
                                            </div>
                                        )}
                                        {showOnboarding && includeOnboarding && isSelected && (
                                            <div className="text-sm text-gray-400 mt-1">
                                                Total today: ${getTotalPrice()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 rounded-full bg-cyan-500/20 p-1 mt-0.5">
                                                    <Check className="h-3 w-3 text-cyan-400" />
                                                </div>
                                                <span className="text-gray-300 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Onboarding option - only for Premium */}
                                    {showOnboarding && isSelected && (
                                        <div className="mb-4">
                                            <label className="flex items-center gap-2 cursor-pointer justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={includeOnboarding}
                                                    onChange={(e) => setIncludeOnboarding(e.target.checked)}
                                                    className="w-4 h-4 rounded border-gray-600 bg-white/10"
                                                />
                                                <span className="text-sm text-gray-300">
                                                    Add one-time onboarding setup (+${ONBOARDING_PRICE})
                                                </span>
                                            </label>
                                            <p className="text-xs text-gray-500 text-center mt-2">
                                                Get expert help configuring your agents and workflows
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpgrade(plan.key);
                                        }}
                                        disabled={isLoading}
                                        className={`w-full inline-flex items-center justify-center text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
                                            isSelected
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25'
                                                : 'bg-white/10 hover:bg-white/20'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isLoading ? "Processing..." : plan.cta}
                                    </button>
                                    
                                    {!isLoggedIn && isSelected && (
                                        <p className="text-xs text-gray-400 text-center mt-2">
                                            You'll be prompted to sign up first
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Features shared across all plans */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {pricingText.sharedFeatures.map((feature, index) => (
                        <div key={index} className="text-center p-4 rounded-lg bg-white/5 border border-gray-800">
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

            {/* Onboarding info - only show if relevant */}
            <div className="mt-10 rounded-2xl border border-gray-800 bg-white/[0.03] backdrop-blur-sm p-6 text-center max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-white mb-2">
                    What's included in Premium Onboarding?
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                    Our one-time onboarding service includes full configuration of your agents, 
                    workflows, and outreach setup tailored to your business.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-cyan-400" />
                        Agent configuration
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-cyan-400" />
                        Workflow setup
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-cyan-400" />
                        Outreach strategy
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-cyan-400" />
                        API integration help
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-cyan-400" />
                        1-hour training session
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-cyan-400" />
                        30 days email support
                    </div>
                </div>
            </div>
        </section>
    );
}