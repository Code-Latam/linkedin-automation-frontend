import React from 'react';
import Image from 'next/image';
import { featuresText } from '@/lib/text/features';

export default function Features() {
    return (
        <section id="features" className="relative overflow-hidden py-24">

            {/* Header */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
                        {featuresText.header.title}
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                        {featuresText.header.subtitle}
                    </p>
                </div>
            </div>

            {/* Platform Overview Image */}
            <div className="flex justify-center mb-24 px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl">
                    <Image
                        src="/images/features/platform-overview.png"
                        alt="Meeting Maker Platform Overview"
                        width={1800}
                        height={2200}
                        priority
                        className="w-full h-auto md:w-auto md:h-[850px] lg:h-[950px] xl:h-[1100px]"
                    />
                </div>
            </div>
            {/* Features Grid */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {featuresText.items.map((feature) => (
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
                    ))}
                </div>
            </div>

        </section>
    );
}