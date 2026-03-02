import {
    Magnet,
    Upload,
    Lightbulb,
    Target,
    Mail,
    Filter,
    LineChart,
    BookOpen,
    CalendarCheck,
} from "lucide-react"
export const moreFeaturesText = {
    header: {
        title: "Optimize and scale your \n LinkedIn outreach",
        subtitle: "Your all-in-one AI companion for smarter, faster LinkedIn growth from first touch to booked meeting.",
        sidebarBadge: "Avg. users book meetings in week one",
        ctaText: "Book a discovery call",
        meetingLink: "https://calendly.com/steven-apiastrolab",
        calloutTime: "20–30 minutes",
        calloutDescription: "Live walkthrough of your LinkedIn workflow"
    },
    footer: {
        description: "These features snap together into one coherent system so every invite, reply and follow-up moves prospects toward a meeting instead of getting lost."
    },
    features: [
        {
            id: "CRM-Integration",
            icon: Magnet,
            title: "CRM Integration",
            description:
                "At any moment in the funnel, send your prospect with one click to Hubspot or Zoho",
            badge: "Top of Funnel",
        },
        {
            id: "lead-search",
            icon: Upload,
            title: "Lead Search",
            description:
                "Use linkedIn search to select all your prospects and send them to the meeting maker.",
            badge: "Prospecting",
        },
        {
            id: "ai-learning",
            icon: Lightbulb,
            title: "AI Learning & Optimization",
            description:
                "Learns your tone and experience, adapting each message for credibility and impact. Uses our database to optimize best outreach strategy given your industry",
            badge: "AI Engine",
        },
        {
            id: "custom-goals",
            icon: Target,
            title: "Custom Goals",
            description:
                "Set outcomes like calls, sign-ups or demos and let agents drive them to completion.",
            badge: "Outcomes",
        },
        {
            id: "inbound-interactions",
            icon: Mail,
            title: "Inbound Interactions",
            description:
                "Automatically handles invites and replies, turning interest into qualified conversations.",
            badge: "Inbound",
        },
        {
            id: "inclusion-exclusion-rules",
            icon: Filter,
            title: "Dos / Dont's",
            description:
                "Bulk-add leads, then auto-filter anyone who doesn’t fit your ICP criteria.",
            badge: "ICP Guardrails",
        },
        {
            id: "lead-journey-analytics",
            icon: LineChart,
            title: "Lead Journey Analytics",
            description:
                "Track how many leads you’ve added, connection requests sent, acceptance rates, active conversations, reply rates, and meetings booked - all in one place.",
            badge: "Analytics",
        },
        {
            id: "knowledge-base-builder",
            icon: BookOpen,
            title: "Knowledge-base Builder",
            description:
                "Feed Astro Lab with your wins, playbooks and FAQs so every interaction stays on-message.",
            badge: "Coaching",
        },
        {        id: "automated-meeting-scheduler",
            icon: CalendarCheck,
            title: "Automated Meeting Scheduler",
            description:"Seamlessly schedule meetings based on your availability, reducing back-and-forth.",
            badge: "Scheduling",
        }
    ]
} as const;
