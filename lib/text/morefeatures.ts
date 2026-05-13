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
                "Use LinkedIn search tools to select your prospects and send them to one of your agents in Meeting Maker. With the Premium version, our platform automatically finds leads for you through Campaigns",
            badge: "Prospecting",
        },
         {
            id: "outbound-interactions",
            icon: Filter,
            title: "Outbound-Interactions",
            description:
                "Depending on your selected outbound channel, LinkedIn or Email, the Meeting Maker will reach our automatically through the assigned AI agent, connecting holding conversations and achieving your goal.  ",
            badge: "Outbound",
        },
        {
            id: "inbound-interactions",
            icon: Filter,
            title: "Inbound Interactions",
            description:
                "Automatically handles invites on LinkedIn and inbound email, turning interest into qualified conversations and meetings.",
            badge: "Inbound",
        },
        {
            id: "custom-goals",
            icon: Magnet,
            title: "Custom Goals",
            description:
                "Define your desired outcomes—calls, demos, sign-ups, partnerships, or deals—and let agents drive conversations until they’re achieved",
            badge: "Outcomes",
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
            icon: BookOpen,
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
                "Track how many leads you’ve added, connection requests sent, acceptance rates, active conversations, reply rates, and meetings booked - all on your personal dashboard",
            badge: "Analytics",
        },
        {
            id: "DEAL-Tracking",
            icon: Target,
            title: "Deals Tracking",
            description:
                "Track your potential deals through all relevant stages righ here in the Meeting Maker. Optionally Integrate into Hubspot, Zoho or Salesforce",
            badge: "CRM",
        }
    ]
} as const;
