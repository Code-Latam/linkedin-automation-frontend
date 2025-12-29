import { Facebook, Linkedin, Twitter, Mail, Phone } from "lucide-react";
import { footerText } from '@/lib/text/footer';


export default function Footer() {
    return (
        <footer className="py-8 px-6 border border-gray-900/50 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm  ">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Brand */}
                <div>
                    <img src="/logo/logo.jpeg" alt="Brand Logo" className="w-28 h-28 mb-4 rounded-full" />
                    <h2 className="text-2xl font-bold mb-4 text-foreground">{
                        footerText.brand.name
                    }</h2>
                    <p className="text-sm text-muted-foreground">{
                        footerText.brand.description
                    }</p>
                </div>


                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">{
                        footerText.sections.quickLinks.title
                    }</h4>
                    <ul className="space-y-2 text-muted-foreground">
                        {footerText.sections.quickLinks.items.map((item, index) => (
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
                    <h4 className="text-lg font-semibold mb-3 text-foreground">
                        {footerText.sections.contact.title}
                    </h4>
                    <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-primary" />
                            <a
                                href={`mailto:${footerText.sections.contact.email}`}
                                className="hover:underline"
                            >{footerText.sections.contact.email}</a>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary" />
                            <a
                                href={`tel:${footerText.sections.contact.phone}`}
                                className="hover:underline"
                            >{
                                footerText.sections.contact.phone
                            }</a>
                        </li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">{
                        footerText.sections.social.title
                    }</h4>
                    <div className="flex items-center gap-4">
                        <a href={
                            footerText.sections.social.links.find(link => link.platform === "linkedin")?.href || "#"
                        }
                        target="_blank" rel="noopener noreferrer"
                           className="p-2 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition">
                            <Linkedin className="w-5 h-5" />
                        </a>
                       {/* <a href={
                            footerText.sections.social.links.find(link => link.platform === "twitter")?.href || "#"
                        } className="p-2 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href={
                            footerText.sections.social.links.find(link => link.platform === "facebook")?.href || "#"
                        } className="p-2 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition">
                            <Facebook className="w-5 h-5" />
                        </a>*/}
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="text-center text-muted-foreground text-sm mt-12 border-t border-border pt-6">
                <p>© {new Date().getFullYear()} {footerText.copyright.text}</p>
            </div>
        </footer>
    );
}
