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
            id: "lead-magnet-posts",
            icon: Magnet,
            title: "Lead Magnet Posts",
            description:
                "Craft and schedule monitored posts with lead magnets to attract new inbound leads.",
            badge: "Top of Funnel",
        },
        {
            id: "lead-import-search",
            icon: Upload,
            title: "Lead Import & Search",
            description:
                "Upload CSVs or pull new prospects via LinkedIn filters in seconds.",
            badge: "Prospecting",
        },
        {
            id: "ai-learning",
            icon: Lightbulb,
            title: "AI Learning & Optimization",
            description:
                "Learns your tone and experience, adapting each message for credibility and impact.",
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
            title: "Inclusion / Exclusion Rules",
            description:
                "Bulk-add leads, then auto-filter anyone who doesn’t fit your ICP criteria.",
            badge: "ICP Guardrails",
        },
        {
            id: "lead-journey-analytics",
            icon: LineChart,
            title: "Lead Journey Analytics",
            description:
                "See every prospect’s status and engagement across the entire outreach lifecycle.",
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
