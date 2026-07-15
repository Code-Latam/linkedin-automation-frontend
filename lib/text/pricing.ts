// lib/text/pricing.ts

export const pricingText = {
    header: {
        title: "Simple, Transparent Pricing",
        subtitle: "One account. Unlimited potential. Choose the plan that fits your needs."
    },
    plans: {
        postboost: {
            name: "Post Boost",
            price: 49,
            description: "Boost your LinkedIn posts through our network",
            features: [
                "Boost one LinkedIn post per day",
                "Get a minimum of 30 Likes and comments per boost. Usually more",
                "Network of engaged accounts",
                "AI-powered engagement",
                "Post status tracking"
               ],
            cta: "Get Started",
            badge: null,
            popular: false
        },
        marketing: {
            name: "Marketing Team",
            price: 149,
            description: "Full marketing suite with AI Marketing Team",
            features: [
                "Everything in Post Boost",
                "AI marketing team",
                "Follow hundreds of influencers, competitors, prospects, clients and friends",
                "Like and comment automatically on each of their LinkedIn post",
                "Like and comment automatically on every LinkedIn post that has selected keywords",
                "Like and Answer any comment on you own post automatically",
                "SEO AI Employee handles articles on website and linkedIn posting",
                "Unlimited AI marketing team members per LinkedIn account"
            ],
            cta: "Get Started",
            badge: "BEST VALUE",
            popular: false
        },
        premium: {
            name: "Marketing + Sales Teams",
            price: 350,
            description: "Full platform access with AI Sales Team",
            features: [
                "Everything in Post Boost",
                "Everything in Marketing",
                "AI Sales Team - Handles outreach",
                "AI Customer Service Team - handles inbound",
                "Full CRM access",
                "Deals board & pipeline management",
                "Important contacts management",
                "AI-powered automatic lead selection campaigns",
                "6,000 emails per month",
                "Priority 24 hours max SLA through email",
                "✅ Optional: One-time onboarding setup (+$450) - checkbox below"
            ],
            cta: "Get Started",
            badge: "MOST POPULAR",
            popular: true
        }
    },
    sharedFeatures: [
        "No contracts, cancel anytime",
        "Secure and private",
        "Regular feature updates"
    ],
    disclaimer: "*Respects LinkedIn's daily limits and terms of service"
} as const;
