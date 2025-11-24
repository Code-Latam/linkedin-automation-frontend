"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "How does the AI find leads?",
        answer:
            "Our AI scans LinkedIn based on your defined target audience, filters, and goals to find ideal prospects automatically.",
    },
    {
        question: "Is my LinkedIn account safe?",
        answer:
            "Yes! The platform respects LinkedIn compliance limits and uses safe automation practices to prevent restrictions.",
    },
    {
        question: "Can I customize messages?",
        answer:
            "Absolutely! You can customize connection requests and conversation messages. AI will optimize them based on engagement patterns.",
    },
    {
        question: "Do you offer a free trial?",
        answer:
            "Yes! We offer a 3-day free trial where you can explore lead search, connections, and AI conversations.",
    },
    {
        question: "What subscription plans are available?",
        answer:
            "We offer Free Trial, Basic, and Premium plans, each designed to scale your outreach based on your goals.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleIndex = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-28 px-6">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-foreground mb-4">FAQs</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
                    Have questions? We have answers! Learn more about our AI-powered LinkedIn outreach platform.
                </p>

                <div className="space-y-4 text-left">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-border rounded-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => toggleIndex(index)}
                                className="w-full px-6 py-4 flex justify-between items-center bg-card hover:bg-card/90 transition"
                            >
                                <span className="text-foreground font-medium">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-primary transition-transform ${
                                        openIndex === index ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="px-6 py-4 bg-card text-muted-foreground animate-slideDown">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
