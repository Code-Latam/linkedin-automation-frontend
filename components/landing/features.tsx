/*
import React from 'react';
import Image from 'next/image';
*/

/*const FEATURES = [
    {
        slug: "autonomous-outreach",
        title: "Autonomous Outreach",
        description: "Once a lead enters your pipeline the AI manages every conversation end-to-end.",
        image: "/images/features/autonomous-outreach.png",
    },
    {
        slug: "human-like-communicator",
        title: "Human-like Communicator",
        description: "We've trained our agent to conduct fluid, realistic dialogues with deep understanding.",
        image: "/images/features/human-like-communicator.png",
    },
    {
        slug: "deep-lead-research",
        title: "Deep Lead Research",
        description: "The agent gathers company info, external data, and profile insights to personalize every message.",
        image: "/images/features/deep-lead-research.png",
    },
    {
        slug: "multi-purpose-agents",
        title: "Multi-Purpose Agents",
        description: "Our AI pivots topics naturally, reads prospect cues, and never over-pushes your product.",
        image: "/images/features/multi-purpose-agents.png",
    },
    {
        slug: "intent-signals-monitoring",
        title: "Intent Signals Monitoring",
        description: "Detects engaged prospects across your network, flags warm leads instantly, auto-adding them to pipeline.",
        image: "/images/features/intent-signals-monitoring.png",
    },
    {
        slug: "frictionless-scalability",
        title: "Frictionless Scalability",
        description: "Easily scale thousands of concurrent conversations across multiple accounts without adding headcount.",
        image: "/images/features/frictionless-scalability.png",
    },
];

export default function Features() {
    return (
        <section id="features" className="relative overflow-hidden ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/!* Header *!/}
                <div className="text-center mb-24 pt-20">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
                        Your New AI Employee
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                        The next billion-dollar company has a swarm of AI agents, not a sales team
                    </p>
                </div>

                <div className="grid gap-16 lg:gap-0 md:grid-cols-2 lg:grid-cols-3 relative">
                    {FEATURES.map((feature, index) => (
                        <React.Fragment key={feature.slug}>
                            <div className="group relative px-6 lg:px-10 mb-16">
                                <div className="relative h-full flex flex-col">
                                    <div className="mb-8">
                                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                                            {feature.title}
                                        </h3>
                                        <p className="text-base text-gray-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>

                                    <div className="relative flex-1 min-h-[250px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-2xl group-hover:border-gray-700 transition-all duration-300">
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}

                                            layout="fill"
                                            objectFit="cover"
                                            className="absolute inset-0 w-full h-full"
                                        />

                                    </div>
                                </div>
                            </div>

                            {(index + 1) % 3 !== 0 && index !== FEATURES.length - 1 && (
                                <div className="hidden lg:block absolute top-0 bottom-0 w-px h-[calc(100%_-_4rem)] mx-auto"
                                     style={{
                                         left: `${((index + 1) * 100) / 3}%`,
                                         backgroundImage: 'repeating-linear-gradient(to bottom, rgb(75, 85, 99) 0px, rgb(75, 85, 99) 8px, transparent 8px, transparent 16px)',
                                     }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>


            </div>

        </section>
    );
}*/
import React from 'react';
import Image from 'next/image';
import { MessageSquare, Brain, Search, Zap, Target, TrendingUp } from 'lucide-react';

const FEATURES = [
    {
        slug: "autonomous-outreach",
        title: "Autonomous Outreach",
        description: "Once a lead enters your pipeline, the AI manages every conversation end-to-end—from first message to meeting booked.",
        image: "/images/features/autonomous-outreach.png",
        icon: MessageSquare,
    },
    {
        slug: "human-like-communicator",
        title: "Human-like Communicator",
        description: "We've trained our agent to conduct fluid, realistic LinkedIn dialogues with deep understanding and natural responses.",
        image: "/images/features/human-like-communicator.png",
        icon: Brain,
    },
    {
        slug: "deep-lead-research",
        title: "Deep Lead Research",
        description: "The agent gathers company info, external data, and LinkedIn profile insights to personalize every outreach message.",
        image: "/images/features/deep-lead-research.png",
        icon: Search,
    },
    {
        slug: "multi-purpose-agents",
        title: "Multi-Purpose Agents",
        description: "Our AI pivots topics naturally, reads prospect cues, and never over-pushes—building genuine connections.",
        image: "/images/features/multi-purpose-agents.png",
        icon: Zap,
    },
    {
        slug: "intent-signals-monitoring",
        title: "Intent Signals Monitoring",
        description: "Detects engaged prospects across your network, flags warm leads instantly, and auto-adds them to your pipeline.",
        image: "/images/features/intent-signals-monitoring.png",
        icon: Target,
    },
    {
        slug: "frictionless-scalability",
        title: "Frictionless Scalability",
        description: "Easily scale thousands of concurrent LinkedIn conversations across multiple accounts without adding headcount.",
        image: "/images/features/frictionless-scalability.png",
        icon: TrendingUp,
    },
];

export default function Features() {
    return (
        <section id="features" className="relative overflow-hidden py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
                        Your New AI Employee
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                        The next billion-dollar company has a swarm of AI agents, not a sales team
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.slug}
                                className="group relative"
                            >
                                {/* Image container with unique perspective effect */}
                                <div className="relative h-64 mb-8 rounded-2xl overflow-hidden transition-all duration-500">
                                    {/* Gradient overlay */}
                                    {/*<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />*/}

                                    {/* Image */}
                                    <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Floating icon badge */}
                                    <div className="absolute top-4 start-4 z-20 w-12 h-12 rounded-xl bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="w-6 h-6 text-cyan-400" />
                                    </div>

                                </div>

                                {/* Content */}
                                <div className="space-y-3 mb-10">
                                    <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-base text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}