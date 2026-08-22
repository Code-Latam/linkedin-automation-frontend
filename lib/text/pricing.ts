export const pricingText = {
    header: {
        title: "Simple, Transparent Pricing",
        subtitle: "One account. Unlimited potential. Choose the plan that fits your needs."
    },
    plans: {
        premium: {
            name: "Premium",
            price: 199,
            description: "Full platform access with AI Sales and Marketing Team. Great for Founders, Solopreneurs and Fractional Leaders",
            features: [
                "AI Marketing Team - handles social engagement",
                "AI Sales Team - Handles outreach",
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
            cta: "Get Started",
            badge: "MOST POPULAR",
            popular: true
        },
        enterprise: {
            name: "Agency & Enterprise Edition",
            price: 799,
            description: "Manage unlimited sales reps, fractional team members, and client accounts at scale",
            features: [
                "Everything in Marketing + Sales Teams",
                "5 Meeting Maker Premium accounts included",
                "Manage unlimited Meeting Maker Premium Accounts",
                "Scale your outreach to any volume",
                "Dedicated account manager",
                "Priority support (12 hours max SLA)"
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
    disclaimer: "*Respects Your Business or Social network daily limits and terms of service. Yearly plans include 20% discount."
} as const;