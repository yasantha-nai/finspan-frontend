import { Icon } from '@iconify/react';
import { Shield, Lock } from "lucide-react";

const LandingFooter = () => {
    const footerLinks = {
        Product: [
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Pricing", href: "#" },
            { label: "FAQ", href: "#faq" },
        ],
        Company: [
            { label: "About Us", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Contact", href: "#" },
        ],
        Legal: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Cookie Policy", href: "#" },
            { label: "GDPR", href: "#" },
        ],
    };

    return (
        <footer className="bg-muted/50 border-t border-border">
            <div className="container-wide py-16">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <a href="#" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-success flex items-center justify-center">
                                <Icon icon="solar:chart-bold-duotone" width={20} color="white" />
                            </div>
                            <span className="font-display font-bold text-xl text-foreground">FinSpan</span>
                        </a>
                        <p className="text-muted-foreground text-sm mb-6">
                            See your complete life path in 2 minutes – and test every decision before you make it.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Shield className="w-4 h-4" />
                                <span>SSL Secured</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Lock className="w-4 h-4" />
                                <span>GDPR</span>
                            </div>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-semibold text-foreground mb-4">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2026 FinSpan. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Developed by rmjp kumara. Made with ❤️ for people who want clarity about their future.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
