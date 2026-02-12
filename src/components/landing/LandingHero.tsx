import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const LandingHero = () => {
    const navigate = useNavigate();

    const bentoMetrics = [
        {
            label: "Retire At",
            value: "65",
            icon: "solar:calendar-bold-duotone",
            description: "Estimated retirement age",
            size: "md",
        },
        {
            label: "Net Worth At 65",
            value: "$1.9M",
            icon: "solar:graph-up-bold-duotone",
            description: "Projected total wealth",
            size: "lg",
        },
        {
            label: "Monthly Income",
            value: "$6,800",
            icon: "solar:wallet-bold-duotone",
            description: "Safe spending in retirement",
            size: "md",
        },
        {
            label: "Confidence",
            value: "94%",
            icon: "solar:target-bold-duotone",
            description: "Probability your money lasts",
            size: "md",
            highlight: true,
        },
    ];

    const secondaryMetrics = [
        { label: "Next Milestone", value: "House at 40", subtext: "37% funded", icon: "solar:home-bold-duotone" },
        { label: "Tax Savings", value: "$15K/yr", subtext: "Potential savings", icon: "solar:bill-list-bold-duotone" },
        { label: "Your Path", value: "On Track", status: "success", icon: "solar:check-circle-bold-duotone" },
    ];

    const socialProof = [
        { value: "15,000+", label: "Life Plans Created" },
        { value: "4.9/5", label: "Average Rating" },
        { value: "347", label: "Plans This Week" },
    ];

    return (
        <section className="pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-background">
            <div className="container-wide">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column - Hero Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        {/* Announcement Banner */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6"
                        >
                            <Icon icon="solar:stars-bold-duotone" className="w-4 h-4 text-success" />
                            <span className="text-sm font-medium text-success">Free life simulation · No credit card</span>
                            <Icon icon="solar:alt-arrow-right-bold" className="w-4 h-4 text-success" />
                        </motion.div>

                        {/* Main Headline */}
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                            Stop Guessing.{" "}
                            <span className="text-gradient">See Your Complete Life Plan</span> in 2 Minutes.
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                            Know when you can retire, how much you'll have, and whether you're on the right path – then simulate every major decision.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                            <Button
                                className="btn-hero group"
                                onClick={() => navigate('/simulator')}
                            >
                                See My Life Plan
                                <Icon icon="solar:arrow-right-bold" className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="outline" className="btn-hero-outline">
                                Watch Demo
                            </Button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Icon icon="solar:shield-check-bold-duotone" className="w-4 h-4 text-success" />
                                <span>100% Private</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Icon icon="solar:clock-circle-bold-duotone" className="w-4 h-4 text-success" />
                                <span>2 Min Setup</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Icon icon="solar:star-bold" className="w-4 h-4 text-amber-500" />
                                <span>4.9/5 Rating</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Bento Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Decorative Background */}
                        <div className="absolute -inset-4 bg-gradient-to-br from-success/5 via-transparent to-accent/5 rounded-3xl blur-3xl" />

                        {/* Bento Grid */}
                        <div className="relative grid grid-cols-2 gap-4">
                            {/* Main Metrics */}
                            {bentoMetrics.map((metric, index) => (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className={`${metric.highlight
                                        ? "bento-card-highlight"
                                        : "bento-card"
                                        } ${metric.size === "lg" ? "col-span-2 sm:col-span-1" : ""}`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`p-2 rounded-lg ${metric.highlight ? "bg-success/20" : "bg-muted"}`}>
                                            <Icon icon={metric.icon} className={`w-5 h-5 ${metric.highlight ? "text-success" : "text-muted-foreground"}`} />
                                        </div>
                                        {metric.highlight && (
                                            <span className="badge-success text-xs">
                                                <Icon icon="solar:check-circle-bold" className="w-3 h-3" />
                                                Excellent
                                            </span>
                                        )}
                                    </div>
                                    <div className="metric-value mb-1">{metric.value}</div>
                                    <div className="metric-label">{metric.label}</div>
                                    <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                                </motion.div>
                            ))}

                            {/* Timeline Card - Full Width */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="col-span-2 bento-card"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-foreground">Your Life Timeline</span>
                                    <span className="text-xs text-muted-foreground">Age 25 → 95</span>
                                </div>
                                <div className="relative">
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full w-1/4 bg-gradient-to-r from-success to-secondary rounded-full" />
                                    </div>
                                    <div className="flex justify-between mt-3">
                                        {["25 Now", "40 House", "65 Retire", "95 Legacy"].map((milestone, i) => (
                                            <div key={milestone} className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-success" : "bg-muted-foreground/30"}`} />
                                                <span className="text-xs text-muted-foreground mt-1">{milestone}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Secondary Metrics Row */}
                            {secondaryMetrics.map((metric, index) => (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className={`bento-card ${index === 2 ? "col-span-2 sm:col-span-1" : ""}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-muted">
                                            <Icon icon={metric.icon} className={`w-4 h-4 ${metric.status === "success" ? "text-success" : "text-muted-foreground"}`} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground">{metric.value}</div>
                                            <div className="text-xs text-muted-foreground">{metric.subtext || metric.label}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* CTA Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1 }}
                                onClick={() => navigate('/simulator')}
                                className="col-span-2 bg-foreground rounded-2xl p-5 cursor-pointer hover:bg-foreground/90 transition-colors group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-background font-semibold mb-1">Ready to see your future?</div>
                                        <div className="text-background/70 text-sm">Get your complete life plan in 2 minutes</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Icon icon="solar:alt-arrow-right-bold" className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Social Proof Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="mt-16 pt-12 border-t border-border"
                >
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        {socialProof.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default LandingHero;
