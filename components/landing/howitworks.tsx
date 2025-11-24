"use client";

import { Search, UserPlus, MessageCircle } from "lucide-react";

const steps = [
    {
        title: "1. Find Leads",
        description:
            "AI automatically searches LinkedIn for your ideal prospects based on filters and goals.",
        icon: Search,
    },
    {
        title: "2. Connect Smartly",
        description:
            "Send personalized connection requests and follow-ups automatically to increase acceptance.",
        icon: UserPlus,
    },
    {
        title: "3. AI Conversations",
        description:
            "AI starts and maintains intelligent conversations to engage leads and move them toward your goals.",
        icon: MessageCircle,
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-28 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                    How It Works
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
                    Our automated AI workflow makes LinkedIn outreach effortless, saving
                    time and increasing engagement.
                </p>

                <div className="grid md:grid-cols-3 gap-10">
                    {steps.map((step) => (
                        <div
                            key={step.title}
                            className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition"
                        >
                            <step.icon className="text-primary w-12 h-12 mb-6 mx-auto" />
                            <h3 className="text-xl font-semibold text-foreground mb-3 text-center">
                                {step.title}
                            </h3>
                            <p className="text-muted-foreground text-center">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
