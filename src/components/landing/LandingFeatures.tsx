import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Icon } from '@iconify/react';

const LandingFeatures = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Subtle parallax
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -20]);

    const benefits = [
        {
            icon: "solar:calendar-bold-duotone",
            title: "Your Exact Retirement Age",
            description: "Based on real life data, not guesses. See the finish line clearly.",
            metric: "65",
            metricLabel: "years old",
            gridClass: "md:col-span-2 lg:col-span-2 lg:row-span-2",
            y: y2,
            iconBg: "bg-success",
            iconColor: "text-white",
            extra: "visual-progress"
        },
        {
            icon: "solar:target-bold-duotone",
            title: "Confidence Score",
            description: "Will your money last? Know your probability of success.",
            metric: "94%",
            metricLabel: "success rate",
            gridClass: "md:col-span-1 lg:col-span-1",
            y: y1,
            highlight: true
        },
        {
            icon: "solar:wallet-bold-duotone",
            title: "Monthly Income",
            description: "Your safe spending limit in retirement.",
            metric: "$6.8K",
            metricLabel: "per month",
            gridClass: "md:col-span-1 lg:col-span-1",
            y: y3
        },
        {
            icon: "solar:graph-up-bold-duotone",
            title: "70-Year Financial Timeline",
            description: "Every major moment—house, kids, career—mapped to age 95.",
            metric: "70",
            metricLabel: "years mapped",
            gridClass: "md:col-span-2 lg:col-span-2",
            y: y1,
            extra: "mini-chart"
        },
        {
            icon: "solar:branching-paths-bold-duotone",
            title: "Scenario Testing",
            description: "Test any life decision in seconds.",
            metric: "∞",
            metricLabel: "what-ifs",
            gridClass: "md:col-span-1 lg:col-span-1",
            y: y2
        },
        {
            icon: "solar:bill-list-bold-duotone",
            title: "Tax Savings",
            description: "Strategies that could save you thousands.",
            metric: "$15K",
            metricLabel: "avg savings/yr",
            gridClass: "md:col-span-1 lg:col-span-1",
            y: y3
        },
        {
            icon: "solar:pie-chart-bold-duotone",
            title: "Portfolio Guidance",
            description: "High-level allocation suggestions.",
            metric: "60/40",
            metricLabel: "stocks/bonds",
            gridClass: "md:col-span-1 lg:col-span-1",
            y: y1
        },
        {
            icon: "solar:document-bold-duotone",
            title: "Shareable Plan",
            description: "Download a PDF or share with anyone.",
            metric: "PDF",
            metricLabel: "export ready",
            gridClass: "md:col-span-1 lg:col-span-1",
            y: y2
        },
    ];

    return (
        <section id="features" className="py-20 md:py-32 bg-background relative overflow-hidden" ref={containerRef}>
            {/* Background elements */}
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-success/5 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-60" />

            <div className="container-wide relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6 font-display font-medium text-success text-sm tracking-wide uppercase">
                        FinSpan Capability
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-5xl font-bold text-foreground mb-6">
                        Everything You Need To Feel{" "}
                        <span className="text-gradient">In Control</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Your complete financial life, visualized and interactive.
                    </p>
                </motion.div>

                {/* Grid Container - Adjusted for better responsiveness */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[240px] lg:auto-rows-[280px]">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                            className={`group relative rounded-[2rem] p-6 lg:p-8 border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-success/30 flex flex-col justify-between ${benefit.gridClass} ${benefit.highlight
                                ? "bg-[#0A192F] text-white border-white/5"
                                : "bg-card border-border/50 shadow-sm"
                                }`}
                        >
                            {/* Inner Glow */}
                            <div className="absolute -inset-px bg-gradient-to-br from-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className={`p-3 rounded-xl inline-flex mb-4 ${benefit.iconBg ? `${benefit.iconBg} ${benefit.iconColor}` :
                                        benefit.highlight ? "bg-success/20 text-success" :
                                            "bg-muted text-muted-foreground group-hover:bg-success/10 group-hover:text-success"
                                        } transition-colors`}>
                                        <Icon icon={benefit.icon} className="w-6 h-6" />
                                    </div>

                                    <h3 className={`font-display text-xl font-bold mb-2 leading-tight ${benefit.highlight ? "text-white" : "text-foreground group-hover:text-success transition-colors"}`}>
                                        {benefit.title}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${benefit.highlight ? "text-white/60" : "text-muted-foreground"}`}>
                                        {benefit.description}
                                    </p>

                                    {/* Visual enhancements for larger cards */}
                                    {(benefit as any).extra === "visual-progress" && (
                                        <div className="mt-8 flex gap-2">
                                            {[...Array(6)].map((_, i) => (
                                                <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 4 ? "bg-success" : "bg-muted/30"}`} />
                                            ))}
                                        </div>
                                    )}

                                    {(benefit as any).extra === "mini-chart" && (
                                        <div className="mt-6 flex items-end gap-1.5 h-10">
                                            {[40, 60, 45, 80, 70, 95, 85, 100].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-success/20 rounded-t-sm group-hover:bg-success/40 transition-colors"
                                                    style={{ height: `${h}%` }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex items-baseline gap-2">
                                    <div className={`text-4xl md:text-5xl font-black tracking-tight ${benefit.highlight ? "text-success" : "text-foreground group-hover:text-success transition-colors"}`}>
                                        {benefit.metric}
                                    </div>
                                    <div className={`text-[10px] font-bold uppercase tracking-widest ${benefit.highlight ? "text-white/30" : "text-muted-foreground"}`}>
                                        {benefit.metricLabel}
                                    </div>
                                </div>
                            </div>

                            {/* Background Icon Decoration */}
                            <div className={`absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 ${benefit.gridClass?.includes("row-span-2") ? "text-[16rem] opacity-[0.04] -mr-24" : "text-9xl opacity-[0.03] -mr-12"
                                }`}>
                                <Icon icon={benefit.icon} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LandingFeatures;
