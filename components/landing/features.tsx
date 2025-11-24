"use client";

import { Search, Users, MessageCircle, Cpu } from "lucide-react";

const features = [
    {
        title: "Smart Lead Search",
        description:
            "Automatically find ideal LinkedIn leads based on your target audience and goals.",
        icon: Search,
    },
    {
        title: "Automated Connections",
        description:
            "Send personalized connection requests and follow-ups without lifting a finger.",
        icon: Users,
    },
    {
        title: "AI Conversations",
        description:
            "Start and manage intelligent conversations with your connections using AI agents.",
        icon: MessageCircle,
    },
    {
        title: "AI Decision Engine",
        description:
            "Our AI decides the best strategy to reach your goals, optimizing engagement automatically.",
        icon: Cpu,
    },
];

export default function Features() {
    return (
        <section id="features" className="py-28 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                    Key Features
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
                    Everything you need to automate LinkedIn outreach and maximize
                    engagement. Built to save time and increase your lead conversion.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 ">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-card border border-border rounded-2xl p-6 text-left hover:shadow-xl transition"
                        >
                            <feature.icon className="text-primary w-10 h-10 mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
