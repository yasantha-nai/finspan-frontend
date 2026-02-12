import { motion, useScroll, useInView } from "framer-motion";
import { useRef } from "react";
import { Icon } from '@iconify/react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingSolution = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const navigate = useNavigate();

    const features = [
        {
            icon: "solar:eye-bold-duotone",
            title: "See your complete financial life on one scrolling timeline.",
        },
        {
            icon: "solar:bolt-bold-duotone",
            title: "Watch how your future changes as you adjust income, goals, and decisions.",
        },
        {
            icon: "solar:branching-paths-bold-duotone",
            title: "Turn 'Should I do this?' into clear, visual trade-offs.",
        },
    ];

    return (
        <section className="py-20 md:py-32" ref={ref}>
            <div className="container-wide">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
                            <span className="text-sm font-medium text-success uppercase tracking-wider">The Solution</span>
                        </div>

                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                            FinSpan Turns Your Entire Life Into a{" "}
                            <span className="text-gradient">Living Simulation</span>
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8">
                            Not just retirement. Your 70-year financial journey — visualized, interactive, and always up to date.
                        </p>

                        <div className="space-y-4 mb-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors group"
                                >
                                    <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                                        <Icon icon={feature.icon} className="w-6 h-6 text-success" />
                                    </div>
                                    <p className="text-foreground font-semibold leading-snug">{feature.title}</p>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-muted-foreground italic mb-8 border-l-4 border-success/20 pl-4 py-2">
                            "FinSpan is designed to feel like a map of your life, not a spreadsheet."
                        </p>

                        <Button
                            className="btn-hero group"
                            onClick={() => navigate('/simulator')}
                        >
                            Start My Life Plan
                            <Icon icon="solar:arrow-right-bold" className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>

                    {/* Right - Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Decorative gradient */}
                        <div className="absolute -inset-8 bg-gradient-to-br from-success/5 via-transparent to-accent/5 rounded-3xl blur-3xl opacity-50" />

                        {/* Main Visual Card */}
                        <div className="relative bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden p-1">
                            <div className="bg-foreground rounded-[2.25rem] overflow-hidden">
                                {/* Header */}
                                <div className="px-8 py-5 flex items-center justify-between border-b border-background/10">
                                    <span className="font-bold text-background">Your Life Timeline</span>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-background/10 rounded-full text-[10px] font-bold text-background/60 uppercase tracking-widest">Ages 25-95</span>
                                    </div>
                                </div>

                                {/* Timeline Content */}
                                <div className="p-8 space-y-8 bg-card rounded-t-[2rem]">
                                    {/* Timeline Visualization */}
                                    <div className="relative pt-4 px-4 overflow-hidden">
                                        <div className="h-4 bg-muted/30 rounded-full overflow-hidden shadow-inner relative">
                                            <motion.div
                                                style={{ scaleX: scrollYProgress }}
                                                className="absolute inset-0 bg-gradient-to-r from-success to-secondary origin-left rounded-full"
                                            />
                                            <div className="absolute inset-0 flex">
                                                {[...Array(20)].map((_, i) => (
                                                    <div key={i} className="h-full w-px bg-card/20 mx-auto" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="absolute top-0 left-[35%] w-0.5 h-12 bg-success/40 -translate-y-4 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                                        <div className="absolute -top-10 left-[35%] -translate-x-1/2 bg-success text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-[0_5px_15px_rgba(34,197,94,0.4)] whitespace-nowrap">YOU ARE HERE</div>
                                    </div>

                                    {/* Milestone Cards */}
                                    <div className="grid grid-cols-4 gap-4">
                                        {[
                                            { age: 25, label: "Now", status: "active", icon: "solar:user-bold" },
                                            { age: 40, label: "House", status: "upcoming", icon: "solar:home-bold" },
                                            { age: 65, label: "Retire", status: "upcoming", icon: "solar:chart-bold" },
                                            { age: 95, label: "Legacy", status: "upcoming", icon: "solar:stars-bold" },
                                        ].map((milestone, idx) => (
                                            <motion.div
                                                key={milestone.age}
                                                whileHover={{ y: -5, scale: 1.05 }}
                                                className={`text-center p-4 rounded-3xl transition-all cursor-default ${milestone.status === "active"
                                                    ? "bg-success text-white shadow-xl shadow-success/20 border-2 border-white/20"
                                                    : "bg-muted/30 border border-border/50 hover:bg-muted/50"
                                                    }`}
                                            >
                                                <Icon icon={milestone.icon} className={`w-6 h-6 mx-auto mb-3 ${milestone.status === "active" ? "text-white" : "text-muted-foreground"}`} />
                                                <div className={`text-2xl font-black ${milestone.status === "active" ? "text-white" : "text-foreground"}`}>
                                                    {milestone.age}
                                                </div>
                                                <div className={`text-[10px] font-bold uppercase tracking-wider ${milestone.status === "active" ? "text-white/60" : "text-muted-foreground"}`}>{milestone.label}</div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Bottom Stats */}
                                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-foreground">$1.9M</div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Net Worth</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-success">94%</div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Confidence</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-foreground">$6.8K</div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Income</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LandingSolution;
