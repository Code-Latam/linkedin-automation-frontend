"use client";

import { Cpu, Zap, Clock, Shield } from "lucide-react";

const capabilities = [
    {
        title: "Agentic AI",
        description:
            "Our AI acts autonomously to reach your goals, choosing the best strategies for connection and engagement.",
        icon: Cpu,
    },
    {
        title: "Automated Workflows",
        description:
            "Seamlessly manages lead searching, connection requests, and conversations without manual effort.",
        icon: Zap,
    },
    {
        title: "24/7 Operations",
        description:
            "AI works around the clock to ensure no lead is missed, boosting your outreach effectiveness.",
        icon: Clock,
    },
    {
        title: "Safe & Compliant",
        description:
            "Maintains LinkedIn compliance while scaling your outreach, protecting your account from restrictions.",
        icon: Shield,
    },
];

export default function AICapabilities() {
    return (
        <section id="ai-capabilities" className="py-28 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                    AI Capabilities
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
                    Our platform leverages advanced AI to automate and optimize your LinkedIn outreach.
                    See how our AI empowers your lead generation.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {capabilities.map((cap) => (
                        <div
                            key={cap.title}
                            className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition"
                        >
                            <cap.icon className="text-primary w-12 h-12 mb-6 mx-auto" />
                            <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
                                {cap.title}
                            </h3>
                            <p className="text-muted-foreground text-center">{cap.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
