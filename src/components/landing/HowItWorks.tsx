import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Icon } from '@iconify/react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const navigate = useNavigate();

    const steps = [
        {
            step: 1,
            icon: "solar:chat-line-bold-duotone",
            title: "Tell Us About Your Life",
            description:
                "Answer a few simple questions about your age, income, savings, and the big goals you're considering.",
            emotionalCaption: "Takes about as long as sending a text.",
        },
        {
            step: 2,
            icon: "solar:eye-bold-duotone",
            title: "See Your Life Plan Instantly",
            description:
                "In seconds, we show your retirement age, projected net worth, and a clear 70-year timeline visualization.",
            emotionalCaption: "For the first time, your future is one picture.",
        },
        {
            step: 3,
            icon: "solar:branching-paths-bold-duotone",
            title: "Test Decisions Before You Decide",
            description:
                "Test things like buying a house, having kids, or early retirement. Watch the impact in real-time.",
            emotionalCaption: 'No more "What if I regret this?"',
        },
    ];

    return (
        <section id="how-it-works" className="py-20 md:py-32" ref={ref}>
            <div className="container-wide">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                        From "I Don't Know" to{" "}
                        <span className="text-gradient">"I Have a Plan"</span> in 3 Steps
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Simplify your financial journey with our intuitive process. Get clarity and confidence in minutes, not weeks.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection Line - Desktop */}
                    <div className="hidden lg:block absolute top-[40%] left-[10%] right-[10%] h-0.5 bg-border -translate-y-1/2" />

                    <div className="grid md:grid-cols-3 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="relative"
                            >
                                {/* Step Card */}
                                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all h-full text-center lg:text-left">
                                    {/* Step Number & Icon */}
                                    <div className="relative mb-8 inline-block lg:block">
                                        <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto lg:mx-0 group-hover:bg-success/20 transition-colors">
                                            <Icon icon={step.icon} className="w-10 h-10 text-success" />
                                        </div>
                                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-lg border-4 border-background">
                                            {step.step}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-6 leading-relaxed">
                                        {step.description}
                                    </p>
                                    <p className="text-sm text-success font-medium italic">
                                        — {step.emotionalCaption}
                                    </p>
                                </div>

                                {/* Arrow - Mobile */}
                                {index < steps.length - 1 && (
                                    <div className="flex justify-center py-6 md:hidden">
                                        <Icon icon="solar:alt-arrow-down-bold" className="w-6 h-6 text-muted-foreground animate-bounce" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center mt-16"
                >
                    <Button
                        className="btn-hero group"
                        onClick={() => navigate('/simulator')}
                    >
                        Get Started Now – It's Free
                        <Icon icon="solar:arrow-right-bold" className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">
                        No credit card required · 2 minutes to complete
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
