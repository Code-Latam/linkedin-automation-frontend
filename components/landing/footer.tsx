import { Facebook, Linkedin, Twitter, Mail, Phone } from "lucide-react";

const navItems = [
    {name: "Features", href: "#features"},
    {name: "How It Works", href: "#how-it-works"},
    {name: "Real Chats", href: "#real-chats"},
    {name: "Pricing", href: "#pricing"},
    {name: "Contact", href: "#contact"},
    {name: "FAQ", href: "#faq"},
];
export default function Footer() {
    return (
        <footer className="py-8 px-6 border border-gray-900/50 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm  ">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Brand */}
                <div>
                    <h3 className="text-2xl font-bold text-primary">LinkedOutreach AI</h3>
                    <p className="text-muted-foreground mt-3 max-w-xs">
                        AI-powered LinkedIn automation platform to find leads, send
                        personalized outreach, and grow your business automatically.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Quick Links</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <a href={item.href} className="text-sm font-medium text-neutral-200/80 hover:text-white relative after:absolute
                                after:bottom-0 py-1 after:left-0 after:h-[1px] after:w-0 after:bg-gradient-to-r after:from-cyan-500
                                after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Contact</h4>
                    <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-primary" />
                            <span>support@linkedoutreach.ai</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary" />
                            <span>+123 456 7890</span>
                        </li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Follow Us</h4>
                    <div className="flex items-center gap-4">
                        <a href="#" className="p-2 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition">
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition">
                            <Facebook className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="text-center text-muted-foreground text-sm mt-12 border-t border-border pt-6">
                © {new Date().getFullYear()} LinkedOutreach AI. All rights reserved.
            </div>
        </footer>
    );
}
