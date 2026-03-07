export const footerText = {
    brand: {
        name: "Astro Lab Meeting Maker",
        description: "AI-powered LinkedIn automation platform to find leads, send personalized outreach, and grow your business automatically."
    },
    sections: {
        quickLinks: {
            title: "Quick Links",
            items: [
                { name: "Features", href: "/#features" },
                { name: "How It Works", href: "/#how-it-works" },
                {name: 'More Features', href: '/#more-features' },
                { name: "Pricing", href: "/#pricing" },
                { name: "Contact", href: "/#contact" },
                { name: "FAQ", href: "/#faq" }
            ]
        },
        contact: {
            title: "Contact",
            email: "info@meetingmaker.tech",
            phone: "+1 307 3945087"
        },
        social: {
            title: "Follow Us",
            links: [
                { platform: "linkedin", href: "https://www.linkedin.com/showcase/astrolab-meeting-maker", label: "LinkedIn" },
                /*{ platform: "twitter", href: "#", label: "Twitter" },
                { platform: "facebook", href: "#", label: "Facebook" }*/
            ]
        }
    },
    copyright: {
        text: "Astrolab Meeting Maker. All rights reserved."
    }
} as const;
