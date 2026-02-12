import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Icon } from '@iconify/react';

const SocialProof = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const stats = [
        { value: "15,000+", label: "Life plans created" },
        { value: "94%", label: "Would recommend" },
        { value: "4.9/5", label: "Average rating" },
        { value: "347+", label: "Plans this week" },
    ];

    const testimonials = [
        {
            name: "Sarah & Mike",
            role: "Married couple, 38 & 40",
            location: "Denver, CO",
            avatar: "SM",
            quote:
                "We'd been arguing about when to buy a house for two years. LifePlan showed us we could afford it at 42 instead of waiting till 45. We both saw the same numbers and stopped fighting.",
            keyInsight: "Aligned on house purchase 3 years earlier",
            rating: 5,
        },
        {
            name: "David L.",
            role: "Software Engineer, 34",
            location: "Austin, TX",
            avatar: "DL",
            quote:
                "I was considering leaving my corporate job for a startup. LifePlan showed that if I did it at 35 instead of now, my retirement age would move by just 1 year. That clarity gave me the courage to jump.",
            keyInsight: "Confidently changed careers",
            rating: 5,
        },
        {
            name: "Jennifer M.",
            role: "Marketing Director, 45",
            location: "Chicago, IL",
            avatar: "JM",
            quote:
                "I thought I had to work until 67. LifePlan showed me that with a few adjustments, I could retire comfortably at 62. That's 5 years of my life I just got back.",
            keyInsight: "Discovered 5-year earlier retirement",
            rating: 5,
        },
    ];

    return (
        <section className="py-20 md:py-32 bg-secondary/30" ref={ref}>
            <div className="container-wide">
                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-12">
                        Trusted by People Who{" "}
                        <span className="text-gradient">Take Their Future Seriously</span>
                    </h2>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto bg-card rounded-3xl p-10 shadow-sm border border-border/50">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Testimonials */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                            className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                            {/* Quote Icon */}
                            <div className="mb-6">
                                <Icon icon="solar:quotes-bold-duotone" className="w-10 h-10 text-success/20" />
                            </div>

                            {/* Quote */}
                            <p className="text-foreground text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>

                            {/* Key Insight Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-bold mb-8 uppercase tracking-wide">
                                <Icon icon="solar:check-circle-bold" className="w-4 h-4" />
                                {testimonial.keyInsight}
                            </div>

                            {/* Footer */}
                            <div className="mt-auto pt-6 border-t border-border flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center border-2 border-success/20">
                                    <span className="text-success font-bold">{testimonial.avatar}</span>
                                </div>
                                <div>
                                    <div className="font-bold text-foreground">{testimonial.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {testimonial.role} · {testimonial.location}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Advisor Quote */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-16 max-w-3xl mx-auto group"
                >
                    <div className="relative bg-foreground rounded-3xl p-10 md:p-12 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-success/20 transition-colors" />
                        <p className="text-xl md:text-2xl text-background/90 italic mb-8 relative z-10 font-light leading-relaxed">
                            "I recommend this to clients who feel overwhelmed. It turns abstract money talk into something they can actually see, understand, and act upon."
                        </p>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-1 h-12 bg-success rounded-full" />
                            <div>
                                <div className="text-background font-bold text-lg">Robert K.</div>
                                <div className="text-background/60 text-sm uppercase tracking-widest font-medium">Certified Financial Planner (CFP)</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SocialProof;
