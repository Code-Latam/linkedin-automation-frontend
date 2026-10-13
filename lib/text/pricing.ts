export const pricingText = {
    header: {
        title: "Simple, Transparent Pricing",
        subtitle: "One account. Unlimited potential. Choose the plan that fits your needs."
    },
    plans: {
        premium: {
            name: "Performance Plan",
            price: 1500,
            description: "$1,500 setup + $300/mo billed at end of month — only if we deliver at least 4 qualified meetings. Otherwise that month is free. The 4-meeting minimum is a floor, not a cap — most clients receive 17 meetings or more",
            features: [
                "$1,500 one-time setup & onboarding billed upfront",
                "$300/month, billed at end of month — only if we deliver",
                "Minimum : 4 qualified meetings per month or that month is free",
                "$150 per extra qualified meeting beyond the 4 included",
                "AI Marketing Team - handles social engagement",
                "AI Sales Team - handles outreach",
                "AI Customer Service Team - handles inbound",
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
            cta: "Book a Meeting",
            badge: "PAY ONLY WHEN WE DELIVER",
            popular: true
        },
        agency: {
            name: "Agency & Enterprise Edition",
            price: 799,
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
    disclaimer: "*Respects Your Business or Social network daily limits and terms of service. Agency yearly plans include 20% discount. Performance Plan billed separately after a discovery call."
} as const;