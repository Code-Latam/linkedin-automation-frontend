"use client";

import { ArrowRight, Sparkles, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-24 overflow-hidden"
        >

            <div className="max-w-5xl mx-auto text-center relative z-10">
                {/* Content */}
                <div className="space-y-8 animate-fadeIn">
                    {/* Badge */}
                    {/*<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-cyan-300">AI-Powered Outreach Platform</span>
                    </div>*/}

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mt-8 text-white">
                        Transform Your LinkedIn Outreach with AI Agents
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Generate qualified leads, automate personalized messages, and close deals faster.
                        Let AI handle the outreach while you focus on closing.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                        <Link
                            href="/login"
                            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                        >
                            <span className="relative flex items-center gap-2">
                                Start Free Trial
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>

                        <a
                            href="#demo"
                            className="group px-8 py-4 border border-cyan-500/30 text-cyan-300 font-semibold rounded-xl hover:bg-cyan-500/10 backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
                        >
                            Book a Call
                            <CalendarCheck className="w-5 h-5 text-cyan-400 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>

                    {/* Social Proof */}

                </div>
            </div>

            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

            {/* Scroll indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce ">
                <div className="w-6 h-10 border-2 border-cyan-500/30 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-pulse" />
                </div>
            </div>

        </section>
    );
}