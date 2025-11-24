import { Facebook, Linkedin, Twitter, Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border py-14 px-6">
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
                        <li><a href="#features" className="hover:text-primary transition">Features</a></li>
                        <li><a href="#how-it-works" className="hover:text-primary transition">How It Works</a></li>
                        <li><a href="#ai" className="hover:text-primary transition">AI Capabilities</a></li>
                        <li><a href="#pricing" className="hover:text-primary transition">Pricing</a></li>
                        <li><a href="#faq" className="hover:text-primary transition">FAQs</a></li>
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
