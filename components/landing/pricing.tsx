"use client";

import { Check } from "lucide-react";

const plans = [
    {
        name: "Free Trial",
        price: "$0",
        period: "3 Days",
        features: [
            "Search up to 50 leads",
            "Send 20 connection requests",
            "AI conversations limited",
        ],
    },
    {
        name: "Basic",
        price: "$49",
        period: "per month",
        features: [
            "Search up to 500 leads",
            "Send unlimited connection requests",
            "AI conversations active",
            "CRM export",
        ],
    },
    {
        name: "Premium",
        price: "$99",
        period: "per month",
        features: [
            "Search unlimited leads",
            "AI connection strategy optimization",
            "Advanced AI conversations",
            "Priority support",
            "Analytics dashboard",
        ],
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-28 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                    Pricing Plans
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
                    Choose a plan that fits your outreach goals. Start with a free trial and upgrade as you grow.
                </p>

                <div className="grid md:grid-cols-3 gap-10">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className="rounded-2xl p-8 border border-border bg-card shadow-lg flex flex-col transition hover:shadow-2xl"
                        >
                            <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
                            <p className="text-3xl font-bold mb-2">
                                {plan.price} <span className="text-sm font-normal">{plan.period}</span>
                            </p>
                            <ul className="space-y-3 mt-6 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                                        <Check className="w-5 h-5 text-primary" /> {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className="mt-6 w-full py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition">
                                Choose Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
