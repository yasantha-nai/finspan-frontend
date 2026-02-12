import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const faqs = [
        {
            question: "Is FinSpan really free?",
            answer:
                "Yes. The core life plan—retirement age, net worth projection, and confidence score—is completely free. We offer premium features for deep scenario testing or advisor collaboration, but most users find the free version more than enough.",
        },
        {
            question: "Is my data safe?",
            answer:
                "Your data is 100% encrypted and never sold. We don't share your personal information with third parties. You can delete your account and all associated data at any time with one click.",
        },
        {
            question: "How is this different from a regular calculator?",
            answer:
                "Most calculators give you one number based on one simple formula. FinSpan shows your entire year-by-year financial journey, accounts for taxes/real estate, and lets you test decisions in real-time.",
        },
        {
            question: "What information do I need to get started?",
            answer:
                "Just five basic things: age, approximate annual income, rough savings total, major goals (house, kids), and your target retirement age. It takes less than 2 minutes.",
        },
        {
            question: "Does this replace a financial advisor?",
            answer:
                "No. FinSpan is a simulation tool to help you understand your situation and test trade-offs. It's like a map; an advisor is the guide who helps you navigate the actual terrain.",
        },
        {
            question: "What about taxes and Social Security?",
            answer:
                "We factor in estimated tax rates and Social Security projections based on your income level. While these are estimates, they provide a much more realistic picture than tools that ignore them.",
        },
    ];

    return (
        <section id="faq" className="py-20 md:py-32" ref={ref}>
            <div className="container-wide max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                        Frequently Asked{" "}
                        <span className="text-gradient">Questions</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        Everything you need to know to start planning with confidence.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="bg-card rounded-2xl border border-border px-8 data-[state=open]:shadow-md data-[state=open]:border-success/30 transition-all"
                            >
                                <AccordionTrigger className="text-left font-bold text-lg md:text-xl text-foreground hover:text-success py-6 decoration-transparent">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-8 pr-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;
