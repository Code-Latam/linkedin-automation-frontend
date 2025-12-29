"use client"
import { CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { moreFeaturesText } from '@/lib/text/morefeatures';


export function MoreFeatures() {
    return (
        <section
            id="more-features"
            className="relative py-16 overflow-hidden"
        >

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 lg:mb-16">
                    <div className="max-w-xl">
                        <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                            {moreFeaturesText.header.title}
                        </h2>
                        <p className="mt-4 text-base sm:text-lg text-gray-400 leading-relaxed">
                            {moreFeaturesText.header.subtitle}
                        </p>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-3">
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200">
                            <CalendarCheck className="h-3.5 w-3.5" />
                            <span>{moreFeaturesText.header.sidebarBadge}</span>
                        </div>
                        <a
                            href={moreFeaturesText.header.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 px-5 py-3"
                        >
                            {moreFeaturesText.header.ctaText}
                        </a>
                        <p className="text-xs text-gray-500">
                            {moreFeaturesText.header.calloutTime} {moreFeaturesText.header.calloutDescription}
                        </p>
                    </div>
                </div>

                {/* Features grid */}
                <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {moreFeaturesText.features.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={feature.id}
                                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/60 hover:bg-white/[0.05] hover:shadow-cyan-500/20"
                            >
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="mt-0.5 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-sky-500/20 to-purple-500/20 border border-white/10 text-cyan-300 group-hover:text-cyan-200 group-hover:border-cyan-400/40 transition-colors">
                                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="flex-1 space-y-1 ">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm sm:text-base font-semibold text-white">
                                                {feature.title}
                                            </h3>
                                            {feature.badge && (
                                                <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-300 border border-white/10">
                          {feature.badge}
                        </span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>

                                {/* subtle bottom accent line */}
                                <div className="mt-3 h-px w-full rounded-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )
                    })}
                </div>

                {/* Bottom micro-copy */}
                <p className="mt-8 sm:mt-10 text-center text-xs sm:text-sm text-gray-500">
                    {moreFeaturesText.footer.description}
                </p>
            </div>
        </section>
    )
}
