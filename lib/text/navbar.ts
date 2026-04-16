export const navbarText = {
    brand: {
        name: "Astro Lab Meeting Maker",
        logoAlt: "Astro Lab Logo"
    },
    navigation: [
        { name: "Features", href: "/#features" },
        { name: "How It Works", href: "/#how-it-works" },
        { name: "More Features", href: "/#more-features" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Blog", href: "/blog" },  // ← ADD THIS
        { name: "Contact", href: "/#contact" },
        { name: "Book Meeting", href: "/book-meeting" },
        { name: "FAQ", href: "/#faq" }
    ],
    cta: {
        login: "Log In"
    },
} as const;

