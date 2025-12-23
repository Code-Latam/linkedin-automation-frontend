/*
// components/landing/realchats.tsx
'use client'
import Link from "next/link"

const CONVERSATIONS = [
    {
        id: 1,
        name: "Shrenik S.",
        role: "Protean Gov Technologies",
        avatar: "from-purple-500 to-pink-500",
        preview:
            "Hey Shrenik. With your deep focus on Gen AI and NLP, I'm curious for your take: how do you account for the 'human data gap'—all the non-verbal signals that get lost when a high-stakes process goes...",
        link: "#",
    },
    {
        id: 2,
        name: "James W.",
        role: "Talent Acquisition Expert",
        avatar: "from-teal-500 to-emerald-500",
        preview:
            "Hi James, saw your extensive background in talent acquisition. As a founder, the challenge of ensuring candidate integrity is something I'm passionate about solving. Given your...",
        link: "#",
    },
    {
        id: 3,
        name: "John S.",
        role: "The Economic Truth",
        avatar: "from-green-500 to-teal-500",
        preview:
            "Hey John. In your work on economic systems and crypto, you're looking at entire systems of flaws. But how do you typically get a true sense of a founder's or leader's integrity, beyond just their...",
        link: "#",
    },
    {
        id: 4,
        name: "Mamoon I.",
        role: "FutureSight",
        avatar: "from-yellow-500 to-pink-500",
        preview:
            "Hey Mamoon. Given your deep background in both VC and AI, I'm curious. Beyond the pitch deck, what are the subtle, data-driven cues you look for to gauge a founder's authenticity and gr...",
        link: "#",
    },
    {
        id: 5,
        name: "Moksha R.",
        role: "IntelmAI",
        avatar: "from-purple-500 to-pink-500",
        preview:
            "Hi Mokshaa, your work in AI, analytics and strategy caught my eye. I'm wondering how we leverage AI to detect the intersection of trust signals—ensuring trust...",
        link: "#",
    },
]

export default function RealChats() {
    return (
        <section className="relative py-20 sm:py-24 overflow-hidden" id="real-chats">
            <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                {/!* Header *!/}
                <div className="text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
                        Real Conversations, Real Results
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                        See how our AI agents engage prospects with authentic, personalized dialogues that drive meaningful connections.
                    </p>
                </div>

                {/!* Horizontal Scroll Container *!/}
                <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-4 scrollbar-hide">
                        {CONVERSATIONS.map((conversation) => (
                            <div
                                key={conversation.id}
                                className="flex-none w-[340px] snap-start"
                            >
                                <div className="group relative h-full rounded-2xl border border-border/50 bg-white/[0.03] backdrop-blur-xl p-6 transition-all hover:border-cyan-400/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                                    {/!* Avatar + Name *!/}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className={`h-12 w-12 rounded-full bg-gradient-to-br ${conversation.avatar} flex-shrink-0`}
                                        />
                                        <div className="min-w-0">
                                            <h3 className="text-base font-semibold text-foreground truncate">
                                                {conversation.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {conversation.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/!* Message Preview *!/}
                                    <p className="text-sm text-muted-foreground/90 leading-relaxed mb-6 line-clamp-4">
                                        {conversation.preview}
                                    </p>

                                    {/!* View Link *!/}
                                    <Link
                                        href={conversation.link}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-orange-400 transition-colors hover:text-orange-300"
                                    >
                                        View Conversation
                                        <svg
                                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/!* Fade Overlay on Edges *!/}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" />
                </div>
            </div>

            {/!* Hide scrollbar *!/}
            <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </section>
    )
}
*/

// components/landing/realchats.tsx
'use client'
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

const CONVERSATIONS = [
    {
        id: 1,
        name: "Shrenik S.",
        role: "Protean Gov Technologies",
        avatar: "from-purple-500 to-pink-500",
        preview:
            "Hey Shrenik. With your deep focus on Gen AI and NLP, I'm curious for your take: how do you account for the 'human data gap'—all the non-verbal signals that get lost when a high-stakes process goes...",
        fullChat: "Hey Shrenik. With your deep focus on Gen AI and NLP, I'm curious for your take: how do you account for the 'human data gap'—all the non-verbal signals that get lost when a high-stakes process goes digital? What strategies do you use to bridge that gap in your AI systems?\n\nShrenik S.: Great question! We use multi-modal AI that analyzes voice patterns, response timing, and even typing cadence to infer emotional states. It's not perfect but gets us 85% closer to true intent detection.",
        link: "#",
    },
    {
        id: 2,
        name: "James W.",
        role: "Talent Acquisition Expert",
        avatar: "from-teal-500 to-emerald-500",
        preview:
            "Hi James, saw your extensive background in talent acquisition. As a founder, the challenge of ensuring candidate integrity is something I'm passionate about solving. Given your...",
        fullChat: "Hi James, saw your extensive background in talent acquisition. As a founder, the challenge of ensuring candidate integrity is something I'm passionate about solving. Given your experience, what's the biggest red flag you see in candidate interviews?\n\nJames W.: Consistency. When their LinkedIn doesn't match their resume or their story changes across interviews, that's instant disqualification. Astro Lab's approach to authentic conversations would catch that early.",
        link: "#",
    },
    {
        id: 3,
        name: "John S.",
        role: "The Economic Truth",
        avatar: "from-green-500 to-teal-500",
        preview:
            "Hey John. In your work on economic systems and crypto, you're looking at entire systems of flaws. But how do you typically get a true sense of a founder's or leader's integrity, beyond just their...",
        fullChat: "Hey John. In your work on economic systems and crypto, you're looking at entire systems of flaws. But how do you typically get a true sense of a founder's or leader's integrity, beyond just their public track record?\n\nJohn S.: I look at their network. Who they associate with reveals more than any pitch deck. Real operators don't need to sell themselves—their results and relationships speak.",
        link: "#",
    },
    {
        id: 4,
        name: "Mamoon I.",
        role: "FutureSight",
        avatar: "from-yellow-500 to-pink-500",
        preview:
            "Hey Mamoon. Given your deep background in both VC and AI, I'm curious. Beyond the pitch deck, what are the subtle, data-driven cues you look for to gauge a founder's authenticity and gr...",
        fullChat: "Hey Mamoon. Given your deep background in both VC and AI, I'm curious. Beyond the pitch deck, what are the subtle, data-driven cues you look for to gauge a founder's authenticity and grit?\n\nMamoon I.: Response patterns. How they handle pushback in conversations. Do they deflect or engage? AI can quantify this through sentiment analysis and conversational flow metrics.",
        link: "#",
    },
    {
        id: 5,
        name: "Moksha R.",
        role: "IntelmAI",
        avatar: "from-purple-500 to-pink-500",
        preview:
            "Hi Mokshaa, your work in AI, analytics and strategy caught my eye. I'm wondering how we leverage AI to detect the intersection of trust signals—ensuring trust...",
        fullChat: "Hi Mokshaa, your work in AI, analytics and strategy caught my eye. I'm wondering how we leverage AI to detect the intersection of trust signals—ensuring trust in high-stakes B2B conversations.\n\nMoksha R.: Multi-signal fusion. We combine profile data, engagement history, response authenticity scores, and network overlap. Astro Lab does this brilliantly at scale.",
        link: "#",
    },
]

export default function RealChats() {
    const [selectedChat, setSelectedChat] = useState<number | null>(null)

    const openModal = (id: number) => setSelectedChat(id)
    const closeModal = () => setSelectedChat(null)

    return (
        <>
            <section className="relative py-16 overflow-hidden" id="real-chats">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Enhanced Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16 lg:mb-20"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
                            Real Conversations,
                            <br className="hidden sm:inline" />
                            Real Results
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                            Astro Lab agents engage prospects with authentic LinkedIn conversations that convert.
                            <br className="sm:hidden" /> See them in action.
                        </p>
                    </motion.div>

                    {/* Horizontal Scrollable Grid - Fixed */}
                    <div className="scrollbar-hide relative -mx-4 sm:-mx-6 lg:-mx-8 scrollbar-hide">
                        <div className="flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory px-6 sm:px-8 lg:px-12 pb-8 lg:pb-12 scrollbar-hide">
                            {CONVERSATIONS.map((conversation, index) => (
                                <motion.div
                                    key={conversation.id}
                                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex-none w-[360px] lg:w-[400px] snap-start"
                                >
                                    <div
                                        onClick={() => openModal(conversation.id)}
                                        className="group relative h-[380px] lg:h-[420px] rounded-3xl border-2 border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-black/50 backdrop-blur-3xl p-8 lg:p-10 transition-all duration-500 hover:border-cyan-400/60 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/10 hover:scale-[1.02] hover:rotate-[0.5deg] cursor-pointer"
                                    >
                                        <div className="flex flex-col h-full">
                                            {/* Name + Role */}
                                            <div className="mb-6 space-y-1.5">
                                                <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                                                    {conversation.name}
                                                </h3>
                                                <p className="text-sm lg:text-base bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">
                                                    {conversation.role}
                                                </p>
                                            </div>

                                            {/* Enhanced Message Preview */}
                                            <div className="flex-1 mb-8 lg:mb-10">
                                                <p className="text-base lg:text-lg text-gray-200/90 leading-relaxed line-clamp-5 lg:line-clamp-6 group-hover:text-gray-100/95 transition-all duration-300 pr-2">
                                                    {conversation.preview}
                                                </p>
                                            </div>

                                            {/* Small CTA Button */}
                                            <div className="absolute bottom-8 lg:bottom-10 left-8 lg:left-10 right-8 lg:right-10">
                                                <div className="group/link inline-flex items-center gap-2 text-sm lg:text-base font-semibold bg-white/10 hover:bg-white/20 text-white/90 hover:text-white px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-white/10 hover:translate-y-[-1px]">
                                                    <span>View Chat</span>
                                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Fade Overlays - Fixed positioning */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 lg:w-32 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-20" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 lg:w-32 bg-gradient-to-l from-black/90 via-black/40 to-transparent z-20" />
                    </div>
                </div>
            </section>

            {selectedChat && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999]" />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative z-[1001] w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-white/20 via-white/10 to-black/30 backdrop-blur-3xl rounded-3xl border border-white/30 shadow-2xl shadow-black/50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-8 lg:p-10 border-b border-white/20 sticky top-0 bg-white/20 backdrop-blur-xl rounded-t-3xl z-10">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${CONVERSATIONS.find(c => c.id === selectedChat)?.avatar || ''} flex items-center justify-center shadow-xl shadow-black/30`}>
                                        <div className="w-7 h-7 bg-white/30 rounded-lg backdrop-blur-sm" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
                                            {CONVERSATIONS.find(c => c.id === selectedChat)?.name}
                                        </h3>
                                        <p className="text-sm text-gray-300">
                                            {CONVERSATIONS.find(c => c.id === selectedChat)?.role}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-200 hover:scale-110 hover:rotate-[-5deg]"
                                >
                                    <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Chat Content */}
                        <div className="p-8 lg:p-10 max-h-[60vh] overflow-y-auto scrollbar-hide">
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-white/30 rounded-2xl p-6">
                                    <p className="text-gray-100 leading-relaxed text-lg">{CONVERSATIONS.find(c => c.id === selectedChat)?.fullChat.split('\n')[0]}</p>
                                </div>
                                <div className="bg-gradient-to-r from-purple-500/15 to-pink-500/15 border border-white/30 rounded-2xl p-6 ml-12">
                                    <p className="text-emerald-200 leading-relaxed text-lg italic font-medium">{CONVERSATIONS.find(c => c.id === selectedChat)?.fullChat.split('\n').slice(1).join('\n')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 lg:p-10 border-t border-white/20 bg-white/20 backdrop-blur-xl rounded-b-3xl">
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="#" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/30 hover:scale-[1.02] transition-all duration-300 text-lg tracking-wide">
                                    Start Free Trial
                                </Link>
                                <button className="px-8 py-4 bg-white/30 hover:bg-white/40 text-white font-semibold rounded-2xl border-2 border-white/40 hover:border-white/60 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            {/* Fixed Scrollbar Hide */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none !important;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar-track {
                    background: transparent;
                }
            `}</style>
        </>
    )

}
