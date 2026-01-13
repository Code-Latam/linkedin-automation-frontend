"use client";
import React, { useState, useMemo } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { pricingText } from '@/lib/text/pricing';

const BASE_PRICE_PER_AGENT = 150; // Original price
//const DISCOUNTED_PRICE_PER_AGENT = 106; // 50% off price
//const YEARLY_DISCOUNT = 0.17; // 17% discount for yearly
const MIN_AGENTS = 1;
const MAX_AGENTS = 50;

export default function Pricing() {
    const [billingPeriod, setBillingPeriod] = useState("monthly");
    const [numAgents, setNumAgents] = useState(1);
    const [isSliding, setIsSliding] = useState(false);

    const pricing = useMemo(() => {

        let totalPrice;
        if (billingPeriod === "yearly") {
            totalPrice = BASE_PRICE_PER_AGENT * numAgents * 12 ;
        }
        else {
            totalPrice = BASE_PRICE_PER_AGENT * numAgents;
        }
        return {
            pricePerAgent: BASE_PRICE_PER_AGENT,
            totalPrice
        };
    }, [billingPeriod, numAgents]);

    const sliderPercentage = ((numAgents - MIN_AGENTS) / (MAX_AGENTS - MIN_AGENTS)) * 100;

    return (
        <section className="relative py-16" id="pricing">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white flex items-center justify-center gap-2">
                        {pricingText.header.title}
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-gray-400">
                        {pricingText.header.subtitle}
                    </p>
                </div>
                {/* Glassmorphic Card */}
                <div
                    style={{
                        opacity: 1,
                        transform: 'translateY(0)',
                        transition: 'all 0.6s ease-out',
                    }}
                    className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent backdrop-blur-2xl p-1 sm:p-8 shadow-2xl"
                >

                    {/* Billing Toggle */}
                    <div className="mb-2 flex items-center justify-center">
                        <div className="inline-flex items-center rounded-full bg-black/60 p-1.5 border border-gray-800">
                            <button
                                onClick={() => setBillingPeriod("monthly")}
                                className="relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300"
                                style={{
                                    backgroundColor: billingPeriod === "monthly" ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                                    color: billingPeriod === "monthly" ? 'rgb(103, 232, 249)' : 'rgb(156, 163, 175)',
                                }}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingPeriod("yearly")}
                                className="relative flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300"
                                style={{
                                    backgroundColor: billingPeriod === "yearly" ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                                    color: billingPeriod === "yearly" ? 'rgb(103, 232, 249)' : 'rgb(156, 163, 175)',
                                }}
                            >
                                Yearly
                            </button>
                        </div>
                    </div>

                    {/* Number of Agents Slider */}
                    <div className="mb-2">
                        <div className="mb-4 flex items-center justify-between">
                            <label className="text-lg font-semibold text-white">
                                {pricingText.slider.label}
                            </label>
                            <div
                                className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 px-6 py-3 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                                style={{
                                    transform: isSliding ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'transform 0.2s ease-out',
                                }}
                            >
                                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    {numAgents}
                                </span>
                            </div>
                        </div>

                        {/* Custom Slider */}
                        <div className="relative pt-2 pb-6">
                            <input
                                type="range"
                                min={MIN_AGENTS}
                                max={MAX_AGENTS}
                                value={numAgents}
                                onChange={(e) => setNumAgents(Number(e.target.value))}
                                onMouseDown={() => setIsSliding(true)}
                                onMouseUp={() => setIsSliding(false)}
                                onTouchStart={() => setIsSliding(true)}
                                onTouchEnd={() => setIsSliding(false)}
                                className="slider-custom w-full"
                                style={{['--slider-percentage' as any]: `${sliderPercentage}%`,
                                }}
                            />
                            {/* Slider Labels */}
                            <div className="mt-2 flex justify-between text-xs text-gray-500">
                                <span>{MIN_AGENTS} agent</span>
                                <span>{MAX_AGENTS} agents</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Display */}
                    <div className="mb-6 space-y-4">
                        {/* Price per Agent */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-gray-800">
                            <span className="text-base text-gray-400">{pricingText.pricing.pricePerAgent}</span>
                            <div className="flex items-baseline gap-3">
                                {/*<span className="text-lg text-gray-600 line-through">
                                    ${pricing.originalPricePerAgent}
                                </span>*/}
                                <span
                                    key={`per-${pricing.pricePerAgent}-${billingPeriod}`}
                                    className="text-2xl font-bold text-white"
                                    style={{
                                        animation: 'priceChange 0.3s ease-out',
                                    }}
                                >
                                    ${pricing.pricePerAgent}
                                    <span className="text-lg text-gray-400 font-normal">{
                                        pricingText.pricing.perMonth
                                    }</span>
                                </span>
                            </div>
                        </div>

                        {/* Total Price */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                            <span className="text-base text-gray-300 font-medium">{
                                pricingText.pricing.totalPrice
                            }</span>
                            <div className="flex items-baseline gap-3">
                                {/*<span className="text-lg text-gray-600 line-through">
                                    ${pricing.originalTotalPrice.toLocaleString()}
                                </span>*/}
                                <span
                                    key={`total-${pricing.totalPrice}-${billingPeriod}-${numAgents}`}
                                    className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                                    style={{
                                        animation: 'priceChange 0.3s ease-out',
                                    }}
                                >
                                    ${pricing.totalPrice.toLocaleString()}
                                    <span className="text-lg text-gray-400 font-normal">{
                                        pricingText.pricing.perMonth
                                    }</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6 grid grid-cols-2 gap-2">
                        {pricingText.features.map((feature, index) => (
                            <div
                                key={feature.label}
                                className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-gray-800/50 hover:border-cyan-500/30 transition-colors duration-300"
                                style={{
                                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s backwards`,
                                }}
                            >
                                <div className="flex-shrink-0 rounded-full bg-cyan-500/20 p-1 border border-cyan-500/30">
                                    <Check className="h-3.5 w-3.5 text-cyan-400" />
                                </div>
                                <span className="text-xs text-white">{feature.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Disclaimer */}
                    <p className="mb-8 text-xs text-gray-500 italic text-center">
                        {pricingText.disclaimer}
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={() => {
                            alert("You can't subscribe at this moment. Please send us an email or fill in the form to get early access!");
                        }}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-lg font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {pricingText.cta.button}
                    </button>

                </div>
            </div>

            {/* Custom Slider Styles */}
            <style jsx>{`
                @keyframes priceChange {
                    0% {
                        transform: scale(1.1);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .slider-custom::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 25px rgba(6, 182, 212, 0.8), 0 0 50px rgba(6, 182, 212, 0.4);
                }

                .slider-custom::-webkit-slider-thumb:active {
                    transform: scale(1.3);
                    box-shadow: 0 0 30px rgba(6, 182, 212, 1), 0 0 60px rgba(6, 182, 212, 0.6);
                }

                .slider-custom::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    cursor: pointer;
                    border: 2px solid rgba(6, 182, 212, 0.5);
                    box-shadow: 0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.3);
                    transition: all 0.2s ease;
                }

                .slider-custom::-moz-range-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 25px rgba(6, 182, 212, 0.8), 0 0 50px rgba(6, 182, 212, 0.4);
                }

                .slider-custom::-moz-range-thumb:active {
                    transform: scale(1.3);
                    box-shadow: 0 0 30px rgba(6, 182, 212, 1), 0 0 60px rgba(6, 182, 212, 0.6);
                }

                .slider-custom::-moz-range-track {
                    height: 8px;
                    border-radius: 4px;
                    background: transparent;
                }
            `}</style>
        </section>
    );
}