import React from 'react';
import Image from 'next/image';
import { featuresText } from '@/lib/text/features';

export default function Features() {
    return (
        <section id="features" className="relative overflow-hidden py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
                        {featuresText.header.title}
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                        {featuresText.header.subtitle}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {featuresText.items.map((feature) => {
                        return (
                            <div
                                key={feature.slug}
                                className="group relative"
                            >
                                {/* Image */}
                                <div className="relative h-64 mb-8 rounded-2xl overflow-hidden transition-all duration-500">
                                    <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                                        <Image
                                            src={feature.image}
                                            alt={`Astrolab Meeting Maker - ${feature.title}. ${feature.description.substring(0, 100)}`}
                                            fill
                                            className="object-cover"
                                        />
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

                {/* ========================= */}
                {/* Instructional Videos Section */}
                {/* ========================= */}
                <div className="mt-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
                            Instructional Videos
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Learn how to get the most out of Meeting Maker with step-by-step walkthroughs.
                        </p>
                    </div>

                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                        
                        {/* Video 1 */}
                        <div className="space-y-4">
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/tULXwkF7lg0"
                                    title="General Overview of The meeting Maker"
                                    frameBorder="0"
                                    allowFullScreen
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-white">General Overview of The meeting Maker</h3>
                        </div>

                        {/* Video 2 */}
                        <div className="space-y-4">
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/8_jUnitPapE"
                                    title="How to create your own SDR or BDR agent"
                                    frameBorder="0"
                                    allowFullScreen
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-white">How to create your own SDR or BDR agent</h3>
                        </div>

                        {/* Video 3 */}
                        <div className="space-y-4">
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/IBkWXUWJjY4"
                                    title="How to Assign people to your agents"
                                    frameBorder="0"
                                    allowFullScreen
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-white">How to Assign people to your agents</h3>
                        </div>

                        {/* Video 4 */}
                        <div className="space-y-4">
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/j0-gaiLTDTM"
                                    title="Agents People List and Dashboard"
                                    frameBorder="0"
                                    allowFullScreen
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Agents People List and Dashboard</h3>
                        </div>

                        {/* Video 5 */}
                        <div className="space-y-4">
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/kDjPJnVVgGA"
                                    title="How to setup an SEO Manager Agent"
                                    frameBorder="0"
                                    allowFullScreen
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-white">How to setup an SEO Manager Agent</h3>
                        </div>

                        {/* Video 6 */}
                        <div className="space-y-4">
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/4INUvAtm4Vs"
                                    title="How to Set Up Your Astrolab Meeting Maker Account"
                                    frameBorder="0"
                                    allowFullScreen
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-white">How to Set Up Your Astrolab Meeting Maker Account</h3>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}