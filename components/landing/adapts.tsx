/*"use client"

import { useState } from "react"
import {
    TrendingUp,
    Coins,
    Search,
    Heart,
    Zap,
    MessageSquare,
    Target,
    Users,
    Mail,
    Calendar,
    Database,
    BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORIES = [
    {
        id: "sales",
        label: "Sales",
        icon: TrendingUp,
        features: [
            {
                icon: Zap,
                title: "Pipeline Acceleration",
                description: "Our agent autonomously discovers and engages new prospects nonstop"
            },
            {
                icon: MessageSquare,
                title: "Personalized Pitch",
                description: "Leverage deep research and human-level messaging to boost response rates"
            },
            {
                icon: Target,
                title: "Follow-Up Management",
                description: "Behavior-driven reminders keep every lead on track until conversion"
            }
        ]
    },
    {
        id: "fundraising",
        label: "Fundraising",
        icon: Coins,
        features: [
            {
                icon: Users,
                title: "Investor Prospecting",
                description: "Drill down on VCs by focus, ticket size, or past investments"
            },
            {
                icon: Mail,
                title: "Contextual Messaging",
                description: "Tailor outreach using portfolio insights and recent funding announcements"
            },
            {
                icon: Calendar,
                title: "Automated Nurturing",
                description: "Schedule and send follow-ups until investors express clear interest"
            }
        ]
    },
    {
        id: "research",
        label: "Research",
        icon: Search,
        features: [
            {
                icon: Database,
                title: "Data Sourcing",
                description: "Compile company profiles, news, and market signals automatically"
            },
            {
                icon: Search,
                title: "Deep, Individualized Research",
                description: "Enrich each lead with tailored insights before outreach"
            },
            {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Visualize engagement trends and pipeline health in real time"
            }
        ]
    },
    {
        id: "recruiting",
        label: "Recruiting",
        icon: Heart,
        features: [
            {
                icon: MessageSquare,
                title: "Human-Level Conversations",
                description: "Conduct genuine, context-aware dialogues that feel authentic"
            },
            {
                icon: Mail,
                title: "Contextual Introductions",
                description: "Craft opening lines using shared interests and profile details"
            },
            {
                icon: Calendar,
                title: "Meeting Coordination",
                description: "Automatically propose, schedule, and confirm calls or meetups"
            }
        ]
    }
]

export function Adapts() {
    const [activeCategory, setActiveCategory] = useState("sales")

    const currentCategory = CATEGORIES.find(cat => cat.id === activeCategory) || CATEGORIES[0]

    return (
        <section className="relative py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/!* Header *!/}
                <div className="text-center mb-16">
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground">
                        Adapts To Your Needs
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                        Tailored AI agents for Sales, Fundraising, Research, and Recruiting
                    </p>
                </div>

                {/!* Category Tabs *!/}
                <div className="flex justify-center gap-4 mb-16 flex-wrap">
                    {CATEGORIES.map((category) => {
                        const Icon = category.icon
                        const isActive = activeCategory === category.id

                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={cn(
                                    "flex flex-col items-center gap-3 transition-all duration-300 px-4 py-2 rounded-2xl focus:outline-none",
                                    "group"
                                )}
                            >
                                {/!* Icon Button *!/}
                                <div
                                    className={cn(
                                        "flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all duration-300",
                                        isActive
                                            ? "border-cyan-400 bg-white/[0.05] hover:border-cyan-400/60 hover:bg-white/[0.06]"
                                            : "border-border/40 bg-white/[0.02] hover:border-border/60 hover:bg-white/[0.04]"
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "h-7 w-7 transition-colors duration-300",
                                            isActive ? "text-cyan-400" : "text-muted-foreground"
                                        )}
                                    />
                                </div>

                                {/!* Label *!/}
                                <span
                                    className={cn(
                                        "text-sm font-medium transition-colors duration-300",
                                        isActive ? "text-cyan-400" : "text-muted-foreground"
                                    )}
                                >
                  {category.label}
                </span>
                            </button>
                        )
                    })}
                </div>

                {/!* Feature Cards *!/}
                <div className="grid gap-6 md:grid-cols-3">
                    {currentCategory.features.map((feature, index) => {
                        const FeatureIcon = feature.icon

                        return (
                            <div
                                key={`${activeCategory}-${index}`}
                                className="group relative rounded-2xl border border-border/40 bg-white/[0.02] backdrop-blur-xl p-8 transition-all duration-300 hover:border-cyan-500/40 hover:bg-white/[0.04] animate-fadeIn "
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/!* Subtle gradient overlay *!/}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                {/!* Content *!/}
                                <div className="relative">
                                    <FeatureIcon className="h-8 w-8 text-muted-foreground mb-6" />

                                    <h3 className="text-xl font-semibold text-foreground mb-3">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/!* Bottom accent line *!/}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/0 to-transparent transition-all duration-300 group-hover:via-cyan-500/60" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}*/
"use client"

import { useState } from "react"
import {
    TrendingUp,
    Coins,
    Search,
    Heart,
    Zap,
    MessageSquare,
    Target,
    Users,
    Mail,
    Calendar,
    Database,
    BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORIES = [
    {
        id: "sales",
        label: "Sales",
        icon: TrendingUp,
        blurb: "Turn cold outbound into a warm, predictable pipeline.",
        features: [
            {
                icon: Zap,
                title: "Pipeline Acceleration",
                description:
                    "Agents autonomously discover and engage new prospects nonstop.",
            },
            {
                icon: MessageSquare,
                title: "Personalized Pitch",
                description:
                    "Deep research plus human-level messaging to lift reply rates.",
            },
            {
                icon: Target,
                title: "Follow-Up Management",
                description:
                    "Behavior-driven reminders keep every deal moving until close.",
            },
        ],
    },
    {
        id: "fundraising",
        label: "Fundraising",
        icon: Coins,
        blurb: "Systematize your investor outreach and warm intros.",
        features: [
            {
                icon: Users,
                title: "Investor Prospecting",
                description:
                    "Filter VCs by focus, ticket size, stage, and past investments.",
            },
            {
                icon: Mail,
                title: "Contextual Messaging",
                description:
                    "Use portfolio context and recent rounds to craft relevant opens.",
            },
            {
                icon: Calendar,
                title: "Automated Nurturing",
                description:
                    "Stay top-of-mind with timed nudges until interest is explicit.",
            },
        ],
    },
    {
        id: "research",
        label: "Research",
        icon: Search,
        blurb: "Let AI handle the research before your first outreach.",
        features: [
            {
                icon: Database,
                title: "Data Sourcing",
                description:
                    "Compile company profiles, news and market signals automatically.",
            },
            {
                icon: Search,
                title: "Deep Individual Research",
                description:
                    "Enrich each lead with tailored insights before you message.",
            },
            {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description:
                    "Visualize engagement trends and pipeline health in real time.",
            },
        ],
    },
    {
        id: "recruiting",
        label: "Recruiting",
        icon: Heart,
        blurb: "Run candidate conversations that feel human, at scale.",
        features: [
            {
                icon: MessageSquare,
                title: "Human-Level Conversations",
                description:
                    "Context-aware dialogues that mirror how your team speaks.",
            },
            {
                icon: Mail,
                title: "Contextual Introductions",
                description:
                    "Open with shared interests, mutuals and profile details.",
            },
            {
                icon: Calendar,
                title: "Meeting Coordination",
                description:
                    "Automatically propose, schedule and confirm interviews.",
            },
        ],
    },
]

export function Adapts() {
    const [activeCategory, setActiveCategory] = useState<string>("sales")
    const currentCategory =
        CATEGORIES.find((cat) => cat.id === activeCategory) ?? CATEGORIES[0]

    return (
        <section
            id="adapts"
            className="relative py-16 overflow-hidden"
        >

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 lg:mb-16">
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
                        Adapts to your{" "}go-to-market
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-gray-400 leading-relaxed">
                        Tailored AI agents for sales, fundraising, research and recruiting
                        all powered by the same orchestration engine.
                    </p>
                </div>

                {/* Category tabs */}
                <div className="mb-10 sm:mb-12">
                    <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-2 py-2 sm:px-3 sm:py-3 shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                            {CATEGORIES.map((category) => {
                                const Icon = category.icon
                                const isActive = activeCategory === category.id

                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => setActiveCategory(category.id)}
                                        className={cn(
                                            "relative flex items-center justify-center gap-2 rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200",
                                            "text-gray-300 hover:text-white",
                                            isActive
                                                ? "bg-white/5 border border-cyan-400 hover:border-cyan-400/60"
                                                : "border border-transparent hover:border-white/10"
                                        )}
                                    >
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/5">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span>{category.label}</span>
                    </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Category blurb */}
                    <p className="mt-3 text-center text-xs sm:text-sm text-gray-400">
                        {currentCategory.blurb}
                    </p>
                </div>

                {/* Feature cards for active category */}
                <div className="grid gap-5 sm:gap-6 md:grid-cols-3 ">
                    {currentCategory.features.map((feature, index) => {
                        const FeatureIcon = feature.icon
                        return (
                            <div
                                key={feature.title}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5 sm:py-5 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/60 hover:bg-white/[0.06] hover:shadow-cyan-500/25"
                            >
                                <div className="relative flex flex-col h-full ">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="mt-0.5 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-sky-500/20  border-white/15 text-cyan-300 group-hover:text-cyan-100 group-hover:border-cyan-400/40 transition-colors">
                                            <FeatureIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm sm:text-base font-semibold text-white">
                                                {feature.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* bottom accent */}
                                    <div className="mt-3 h-px w-full rounded-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* index pill */}
                                <div className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-gray-300 border border-white/10">
                                    Step {index + 1}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <p className="mt-9 sm:mt-10 text-center text-xs sm:text-sm text-gray-500">
                    Switch categories to see how the same AI engine adapts to different teams
                    without new tooling or playbooks.
                </p>
            </div>
        </section>
    )
}
