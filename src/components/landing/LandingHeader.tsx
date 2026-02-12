import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LandingHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Features", href: "/#features" },
        { label: "How It Works", href: "/#how-it-works" },
        { label: "FAQ", href: "/#faq" },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/50 py-4" : "bg-transparent py-6"
            }`}>
            <div className="container-wide">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center shadow-lg shadow-success/20">
                            <Icon icon="solar:chart-bold-duotone" width={24} color="white" />
                        </div>
                        <span className="font-display font-bold text-xl text-foreground">FinSpan</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-muted-foreground hover:text-success transition-colors font-medium"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <Button
                            variant="ghost"
                            className="font-medium text-muted-foreground hover:text-success hover:bg-success/10"
                            onClick={() => navigate('/login')}
                        >
                            Log In
                        </Button>
                        <Button
                            className="bg-success hover:bg-success/90 text-white font-semibold px-6 rounded-xl shadow-lg shadow-success/20"
                            onClick={() => navigate('/simulator')}
                        >
                            Launch App
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-border overflow-hidden"
                    >
                        <div className="container-wide py-6 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="block py-2 text-muted-foreground hover:text-success transition-colors font-medium text-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="pt-4 space-y-4">
                                <Button
                                    variant="outline"
                                    className="w-full h-12 rounded-xl border-success text-success hover:bg-success/10 hover:text-success"
                                    onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                                >
                                    Log In
                                </Button>
                                <Button
                                    className="w-full h-12 rounded-xl bg-success hover:bg-success/90 text-white font-semibold"
                                    onClick={() => { navigate('/simulator'); setIsMenuOpen(false); }}
                                >
                                    Launch App
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default LandingHeader;
