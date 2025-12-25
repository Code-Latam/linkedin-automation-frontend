"use client";

import React, { useState } from 'react';
import {ArrowRight} from 'lucide-react';
import { faqsText } from '@/lib/text/faqs';



export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleIndex = (index:any) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="relative py-20 sm:py-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Left Side - Header */}
                    <div className="lg:sticky ">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
                            {faqsText.header.title}
                        </h2>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            {faqsText.header.subtitle}
                        </p>
                    </div>

                    {/* Right Side - FAQ Items */}
                    <div className="space-y-4">
                        {faqsText.items.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-gray-900/50 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm transition-all duration-300  hover:bg-gray-900/50  "
                            >
                                <button
                                    onClick={() => toggleIndex(index)}
                                    className="w-full px-6 py-5 flex justify-between items-center text-left group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                }}
                                            >
                                                <ArrowRight
                                                    className="w-4 h-4 transition-transform duration-300 flex-shrink-0 text-white"
                                                    style={{
                                                        transform: openIndex === index ? 'rotate(90deg)' : 'rotate(0deg)',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <span
                                            className="text-lg font-semibold transition-colors duration-300"
                                            style={{ color: openIndex === index ? 'rgb(255, 255, 255)' : 'rgb(209, 213, 219)' }}
                                        >
                                            {faq.question}
                                        </span>
                                    </div>
                                </button>

                                <div
                                    style={{
                                        maxHeight: openIndex === index ? '500px' : '0',
                                        opacity: openIndex === index ? 1 : 0,
                                        transition: 'all 0.4s ease-in-out',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div className="px-6 pb-5 pl-[72px]">
                                        <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
}