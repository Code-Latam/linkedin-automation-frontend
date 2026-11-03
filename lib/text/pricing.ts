export const pricingText = {
    header: {
        title: "Simple, Transparent Pricing",
        subtitle: "One account. Unlimited potential. Choose the plan that fits your needs."
    },
    plans: {
        intentRadar: {
            name: "Intent Radar",
            price: 99,
            yearlyPrice: 950,
            description: "Find high-intent leads from across the web before your competitors do.",
            features: [
                "Every search surfaces people actively posting buying intent across the web — hiring, switching tools, or asking for recommendations",
                "Unlimited qualified leads per search — no per-lead pricing. Includes linkedIn profile URL",
                "Excel and CSV export",
                "Scheduled searches — set it and forget it",
                "Send leads directly to your Meeting Maker BDR agents (requires a Meeting Maker plan)",
                "No setup fee, no contract, cancel anytime"
            ],
            cta: "Subscribe",
            badge: null,
            popular: false
        },
        meetingMaker: {
            name: "Meeting Maker",
            price: 199,
            yearlyPrice: 1910,
            description: "The full AI sales platform — outreach, marketing, and customer service agents.",
            features: [
                "✅ Includes full Intent Radar access",
                "AI Marketing Team — handles social engagement",
                "AI Sales Team — handles outreach",
                "AI Customer Service Team — handles inbound",
                "Full CRM access",
                "Deals board & pipeline management",
                "Important contacts management",
                "AI-powered automatic lead selection campaigns",
                "6,000 emails per month",
                "Follow hundreds of influencers, competitors, prospects, clients and friends",
                "Like and comment automatically on each of their posts",
                "Like and comment automatically on every post that has selected keywords",
                "Like and Answer any comment on your own post automatically",
                "SEO AI Employee handles articles on website and posting",
                "Unlimited AI marketing team members per account",
                "Priority 24 hours max SLA through email"
            ],
            cta: "Subscribe",
            badge: "BEST VALUE",
            popular: true
        },
        agency: {
            name: "Agency & Enterprise Edition",
            price: 799,
            yearlyPrice: 7670,
            description: "Manage unlimited sales reps, fractional team members, and client accounts at scale",
            features: [
                "White Labeling",
                "Manage unlimited Meeting Maker accounts",
                "Switch seamlessly between accounts",
                "Scale your outreach to any volume",
                "One Premium Meeting Maker Account included",
                "Dedicated account manager",
                "Priority support (12 hours max SLA)",
                "Client management and App provisioning"
            ],
            cta: "Contact Sales",
            badge: "ENTERPRISE",
            popular: false
        }
    },
    sharedFeatures: [
        "No contracts, cancel anytime",
        "Secure and private",
        "Regular feature updates",
        "24/7 support"
    ],
    disclaimer: "*Respects Your Business or Social network daily limits and terms of service. Yearly plans include a 20% discount."
} as const;