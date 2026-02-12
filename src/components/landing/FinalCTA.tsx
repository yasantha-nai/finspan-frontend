import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Icon } from '@iconify/react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const navigate = useNavigate();

    const trustItems = [
        // { icon: "solar:clock-circle-bold-duotone", label: "2 Min Setup" },
        // { icon: "solar:shield-check-bold-duotone", label: "100% Private" },
        // { icon: "solar:lock-bold-duotone", label: "Data Encrypted" },
        // { icon: "solar:document-bold-duotone", label: "Downloadable PDF" },
    ];

    return (
        <section className="py-20 md:py-32 bg-foreground relative overflow-hidden" ref={ref}>
            {/* Decorative Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-success/10 rounded-full -mr-[250px] -mt-[250px] blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full -ml-[250px] -mb-[250px] blur-[120px]" />

            <div className="container-wide relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-8 leading-tight">
                        Ready to Stop Guessing <br className="hidden md:block" />
                        <span className="text-success">About Your Future?</span>
                    </h2>
                    <p className="text-xl text-background/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of people who have already discovered their path.
                        See your complete plan and test your decisions in under 2 minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                        <Button
                            size="lg"
                            className="bg-success hover:bg-success/90 text-white px-10 py-7 text-xl font-bold rounded-2xl group shadow-2xl shadow-success/20"
                            onClick={() => navigate('/simulator')}
                        >
                            Get Started Now – It's Free
                            <Icon icon="solar:arrow-right-bold" className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                    <p className="text-sm text-background/50 mt-4">
                        No credit card required · 2 minutes to complete
                    </p>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                        {trustItems.map((item) => (
                            <div key={item.label} className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-background/5 flex items-center justify-center border border-background/10">
                                    <Icon icon={item.icon} className="w-6 h-6 text-success" />
                                </div>
                                <span className="text-sm font-semibold text-background/60 tracking-wide uppercase">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
