"use client";
import React, { useState, useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { pricingText } from '@/lib/text/pricing';
import Link from "next/link";
import { useRouter } from 'next/navigation';

const PRO_PRICE = 150;
const PREMIUM_PRICE = 350;

export default function Pricing() {
    const [selectedPlan, setSelectedPlan] = useState<"pro" | "premium">("pro");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleUpgrade = async (plan: "pro" | "premium") => {
        setIsLoading(true);
        
        const token = localStorage.getItem("token");
        
        if (!token) {
            // Not logged in - redirect to signup with plan
            router.push(`/login?plan=${plan}`);
            return;
        }

        try {
            // Logged in - create checkout session
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
                // Redirect to Stripe Checkout
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

    return (
        <section className="relative py-16" id="pricing">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white flex items-center justify-center gap-2">
                        {pricingText.header.title}
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-gray-400">
                        {pricingText.header.subtitle}
                    </p>
                </div>

                {/* Plan Toggle */}
                <div className="mb-10 flex items-center justify-center">
                    <div className="inline-flex items-center rounded-full bg-black/60 p-1.5 border border-gray-800">
                        <button
                            onClick={() => setSelectedPlan("pro")}
                            className="relative rounded-full px-8 py-3 text-sm font-medium transition-all duration-300"
                            style={{
                                backgroundColor: selectedPlan === "pro" ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                                color: selectedPlan === "pro" ? 'rgb(103, 232, 249)' : 'rgb(156, 163, 175)',
                            }}
                        >
                            Pro
                        </button>
                        <button
                            onClick={() => setSelectedPlan("premium")}
                            className="relative flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition-all duration-300"
                            style={{
                                backgroundColor: selectedPlan === "premium" ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                                color: selectedPlan === "premium" ? 'rgb(103, 232, 249)' : 'rgb(156, 163, 175)',
                            }}
                        >
                            <Sparkles className="h-4 w-4" />
                            Premium
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pro Card */}
                    <div
                        className={`relative rounded-3xl border transition-all duration-300 ${
                            selectedPlan === "pro" 
                                ? 'border-cyan-500/30 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent shadow-2xl scale-105' 
                                : 'border-gray-800 bg-white/[0.03] backdrop-blur-sm opacity-75 hover:opacity-100'
                        }`}
                    >
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                            <p className="text-gray-400 text-sm mb-6">For individuals and small teams</p>
                            
                            <div className="mb-6">
                                <span className="text-5xl font-bold text-white">${PRO_PRICE}</span>
                                <span className="text-gray-400 text-lg ml-2">/mo</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                {pricingText.features.pro.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 rounded-full bg-cyan-500/20 p-1 mt-0.5">
                                            <Check className="h-4 w-4 text-cyan-400" />
                                        </div>
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUpgrade("pro")}
                                disabled={isLoading}
                                className={`w-full inline-flex items-center justify-center text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
                                    selectedPlan === "pro"
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25'
                                        : 'bg-white/10 hover:bg-white/20'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isLoading ? "Processing..." : "Get Started"}
                            </button>
                            
                            {!isLoggedIn && selectedPlan === "pro" && (
                                <p className="text-xs text-gray-400 text-center mt-2">
                                    You'll be prompted to sign up first
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Premium Card */}
                    <div
                        className={`relative rounded-3xl border transition-all duration-300 ${
                            selectedPlan === "premium" 
                                ? 'border-cyan-500/30 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent shadow-2xl scale-105' 
                                : 'border-gray-800 bg-white/[0.03] backdrop-blur-sm opacity-75 hover:opacity-100'
                        }`}
                    >
                        {selectedPlan === "premium" && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                                    MOST POPULAR
                                </div>
                            </div>
                        )}
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                Premium
                                <Sparkles className="h-5 w-5 text-cyan-400" />
                            </h3>
                            <p className="text-gray-400 text-sm mb-6">For power users and teams</p>
                            
                            <div className="mb-6">
                                <span className="text-5xl font-bold text-white">${PREMIUM_PRICE}</span>
                                <span className="text-gray-400 text-lg ml-2">/mo</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                {pricingText.features.premium.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 rounded-full bg-cyan-500/20 p-1 mt-0.5">
                                            <Check className="h-4 w-4 text-cyan-400" />
                                        </div>
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUpgrade("premium")}
                                disabled={isLoading}
                                className={`w-full inline-flex items-center justify-center text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
                                    selectedPlan === "premium"
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25'
                                        : 'bg-white/10 hover:bg-white/20'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isLoading ? "Processing..." : "Get Started"}
                            </button>
                            
                            {!isLoggedIn && selectedPlan === "premium" && (
                                <p className="text-xs text-gray-400 text-center mt-2">
                                    You'll be prompted to sign up first
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Features shared across both plans */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
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

                {/* Disclaimer */}
                <p className="mt-8 text-xs text-gray-500 italic text-center">
                    {pricingText.disclaimer}
                </p>
            </div>
        </section>
    );
}