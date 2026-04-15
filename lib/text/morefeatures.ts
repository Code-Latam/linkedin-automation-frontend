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
        title: "AI agents that run and scale your LinkedIn outreach",
        subtitle: "Your all-in-one AI companion for smarter, faster LinkedIn growth from first touch to booked meeting.",
        sidebarBadge: "Avg. users book meetings in week one",
        ctaText: "Book a discovery call",
        meetingLink: "https://www.saasential.tech/book-meeting",
        calloutTime: "20–30 minutes",
        calloutDescription: "Live walkthrough of your LinkedIn workflow"
    },
    footer: {
        description: "These features snap together into one coherent system so every invite, reply and follow-up moves prospects toward a meeting instead of getting lost."
    },
    features: [
        
        {
            id: "lead-search",
            icon: Upload,
            title: "Lead Search",
            description:
                "Use LinkedIn search tools to select your prospects and send them to one of your agents in Meeting Maker. With the Premium version, our platform automatically finds leads for you",
            badge: "Prospecting",
        },
         {
            id: "automated-lead-selection",
            icon: BookOpen,
            title: "Automated Lead Selection",
            description:
                "With Premium, Meeting Maker automatically finds and selects prospects that match your targeting criteria",
            badge: "Coaching",
        },
        {
            id: "custom-goals",
            icon: Target,
            title: "Custom Goals",
            description:
                "Define your desired outcomes—calls, demos, sign-ups, partnerships, or deals—and let agents drive conversations until they’re achieved",
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
        {        id: "automated-meeting-scheduler",
            icon: CalendarCheck,
            title: "Automated Meeting Scheduler",
            description:"Seamlessly schedule meetings based on your availability, reducing back-and-forth",
            badge: "Scheduling",
        },
        {
            id: "ai-learning",
            icon: Lightbulb,
            title: "AI Learning & Optimization",
            description:
                "Learns your tone and experience, adapting each message for credibility and impact. Uses platform insights to optimize the most effective outreach strategy for your industry.",
            badge: "AI Engine",
        },
        {
            id: "governance",
            icon: Filter,
            title: "Governance",
            description:
                "Define rules and criteria so agents only engage prospects that match your ideal customer profile",
            badge: "ICP Guardrails",
        },
        {
            id: "lead-journey-analytics",
            icon: LineChart,
            title: "Lead Journey Analytics",
            description:
                "Track how many leads you’ve added, connection requests sent, acceptance rates, active conversations, reply rates, and meetings booked - all your personal dashboard",
            badge: "Analytics",
        },
        {
            id: "CRM-Integration",
            icon: Magnet,
            title: "CRM Integration",
            description:
                "Send prospects to your CRM with one click whenever they’re ready for the next step",
            badge: "Top of Funnel",
        }
    ]
} as const;
