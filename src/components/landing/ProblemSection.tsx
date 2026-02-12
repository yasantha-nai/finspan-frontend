import { motion } from "framer-motion";
import { Icon } from '@iconify/react';
import { useRef } from "react";
import { useInView } from "framer-motion";

const ProblemSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const problems = [
        {
            icon: "solar:question-square-bold-duotone",
            title: "You don't know if you're on track.",
            stat: "71%",
            statLabel: "of people have no idea if they're saving enough",
            description: "Every year, that nagging feeling grows stronger. Am I actually saving enough for the life I want?",
        },
        {
            icon: "solar:danger-triangle-bold-duotone",
            title: "You avoid big decisions because you're scared to be wrong.",
            stat: "3.2 yrs",
            statLabel: "average delay on major financial decisions",
            description: "You stall on houses, career changes, or retirement dates because the stakes feel too high.",
        },
        {
            icon: "solar:document-bold-duotone",
            title: "Spreadsheets and calculators make it worse.",
            stat: "87%",
            statLabel: "abandon financial planning tools within a week",
            description: "Static tables are overwhelming. You want a picture of your future, not a spreadsheet.",
        },
    ];

    return (
        <section className="py-20 md:py-32 bg-secondary/30" ref={ref}>
            <div className="container-wide">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                        Right Now, You're Probably{" "}
                        <span className="text-gradient">Guessing About Your Future</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Most people don't have a clear life plan. They have scattered accounts, vague goals, and a constant background anxiety: "Am I actually going to be okay?"
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={problem.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow group"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:bg-rose-500/20 transition-colors">
                                <Icon icon={problem.icon} className="w-8 h-8 text-rose-500" />
                            </div>

                            {/* Title */}
                            <h3 className="font-display text-xl font-bold text-foreground mb-4">
                                {problem.title}
                            </h3>

                            {/* Stat Card */}
                            <div className="bg-muted rounded-xl p-4 mb-4">
                                <div className="text-3xl font-bold text-foreground mb-1">{problem.stat}</div>
                                <div className="text-sm text-muted-foreground">{problem.statLabel}</div>
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground">
                                {problem.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Anxiety Graph */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-16 bg-card rounded-2xl p-8 border border-border max-w-3xl mx-auto"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-display text-2xl font-bold text-foreground">Anxiety Over Time Without a Plan</h3>
                            <p className="text-sm text-muted-foreground mt-2">The longer you wait, the louder the "what if?" gets</p>
                        </div>
                    </div>

                    {/* Simple Line Graph Visualization */}
                    <div className="relative h-48 px-4">
                        <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="anxietyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            {[0, 25, 50, 75, 100].map((tick) => (
                                <line
                                    key={tick}
                                    x1="0" y1={tick} x2="400" y2={tick}
                                    stroke="currentColor"
                                    strokeWidth="0.5"
                                    className="text-border"
                                    strokeDasharray="4 4"
                                />
                            ))}

                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={isInView ? { pathLength: 1 } : {}}
                                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                                d="M 0 110 C 50 108, 100 100, 150 85 S 250 40, 400 10"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ duration: 1, delay: 1.5 }}
                                d="M 0 110 C 50 108, 100 100, 150 85 S 250 40, 400 10 L 400 120 L 0 120 Z"
                                fill="url(#anxietyGradient)"
                            />
                        </svg>

                        {/* Age Labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs font-bold text-muted-foreground pt-6 border-t border-border/50">
                            {["Age 25", "Age 30", "Age 35", "Age 40", "Age 45", "Age 50+"].map((age) => (
                                <span key={age} className="bg-background px-2">{age}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ProblemSection;
