"use client";

import {ArrowRight, Users, TrendingUp} from "lucide-react";
import { Calendar } from "lucide-react";
import React from "react";
import { heroText } from '@/lib/text/hero';
import Link from "next/link";


export default function Hero() {

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-24 overflow-hidden"
        >
            <div className="max-w-6xl mx-auto text-center relative z-10">

                {/* Content */}
                <div className="space-y-9 animate-fadeIn">
                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight mt-19 text-white">
                        {heroText.headline}
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        {heroText.subheadline}
                    </p>


                    {/* Feature highlights */}
                    <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
                        {
                            heroText.features && heroText.features.map((feature, index) => {
                                let IconComponent;
                                switch (feature.icon) {
                                    case "Users":
                                        IconComponent = Users;
                                        break;
                                    case "Calendar":
                                        IconComponent = Calendar;
                                        break;
                                    case "TrendingUp":
                                        IconComponent = TrendingUp;
                                        break;
                                    default:
                                        return null;
                                }
                                return (
                                    <div key={index} className="flex items-center gap-2 text-gray-300">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                            <IconComponent className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <span className="text-sm md:text-base">{feature.text}</span>
                                    </div>
                                );
                            })
                        }
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
                        <Link
                            href="/onboarding"
                            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                            >
                            <span className="relative flex items-center gap-2">
                                {heroText.cta.primary}
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                            </Link>

                        <a
                            href="https://youtu.be/lh3yfHXk3OA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group px-8 py-4 border-2 border-cyan-500/30 text-cyan-300 font-semibold rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/50 backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
                        >
                            {heroText.cta.secondary}
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                                <div className="w-0 h-0 border-l-8 border-l-cyan-400 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1" />
                            </div>
                        </a>
                    </div>

                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-cyan-500/30 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-pulse" />
                </div>
            </div>
        </section>
    );
}
