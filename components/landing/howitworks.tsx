'use client';
import React, { useEffect, useRef, useState } from 'react';

const STEPS = [
    {
        id: 1,
        title: "Configure your agent to align with your outreach objectives",
        image: "/images/how-it-works/step-1-configure.png",
    },
    {
        id: 2,
        title: "Connect your LinkedIn account with our platform",
        image: "/images/how-it-works/step-2-connect.png",
    },
    {
        id: 3,
        title: "Add leads to your pipeline and wait for the conversions to start",
        image: "/images/how-it-works/step-3-leads.png",
    },
];

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
    const sectionRef = useRef<HTMLDivElement | null>(null)
    const isScrollingRef = useRef(false)

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const handleWheel = (e: WheelEvent) => {
            const rect = section.getBoundingClientRect()
            const isInView =
                rect.top <= 100 && rect.bottom >= window.innerHeight - 100

            if (!isInView) return

            const scrollingDown = e.deltaY > 0
            const scrollingUp = e.deltaY < 0

            if (scrollingUp && activeStep === 0) return
            if (scrollingDown && activeStep === STEPS.length - 1) return

            e.preventDefault()
            if (isScrollingRef.current) return

            isScrollingRef.current = true
            setTimeout(() => {
                isScrollingRef.current = false
            }, 800)

            if (scrollingDown && activeStep < STEPS.length - 1) {
                setActiveStep((prev) => prev + 1)
            } else if (scrollingUp && activeStep > 0) {
                setActiveStep((prev) => prev - 1)
            }
        }

        section.addEventListener("wheel", handleWheel, { passive: false })
        return () => {
            section.removeEventListener("wheel", handleWheel)
        }
    }, [activeStep])


    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center py-20 bg-black"
            id="how-it-works"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                {/* Header */}
                <div className="mb-16">
                    <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold text-white">
                        How it Works
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                    {/* Left Side - All Titles Shown */}
                    <div className="lg:w-1/2 space-y-8">
                        {STEPS.map((step, index) => (
                            <div
                                key={step.id}
                                style={{
                                    opacity: activeStep === index ? 1 : 0.3,
                                    transform: `scale(${activeStep === index ? 1 : 0.98})`,
                                    transition: 'all 0.5s ease-in-out',
                                }}
                                className="cursor-pointer"
                                onClick={() => setActiveStep(index)}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Step Number */}
                                    <div
                                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500"
                                        /*style={{
                                            backgroundColor: activeStep === index ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                            color: activeStep === index ? 'rgb(251, 146, 60)' : 'rgb(156, 163, 175)',
                                            borderWidth: '2px',
                                            borderStyle: 'solid',
                                            borderColor: activeStep === index ? 'rgba(249, 115, 22, 0.6)' : 'rgba(75, 85, 99, 0.4)',
                                        }}*/
                                        //change color to cyan-500
                                        style={{
                                            backgroundColor: activeStep === index ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                            color: activeStep === index ? 'rgb(14, 165, 233)' : 'rgb(156, 163, 175)',
                                            borderWidth: '2px',
                                            borderStyle: 'solid',
                                            borderColor: activeStep === index ? 'rgba(14, 165, 233, 0.6)' : 'rgba(75, 85, 99, 0.4)',
                                        }}
                                    >
                                        {index + 1}
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight transition-colors duration-500"
                                        style={{
                                            color: activeStep === index ? 'rgb(255, 255, 255)' : 'rgb(156, 163, 175)',
                                        }}
                                    >
                                        {step.title}
                                    </h3>
                                </div>
                            </div>
                        ))}

                        {/* Scroll Indicator */}
                        <div
                            className="flex items-center gap-2 text-sm text-gray-400 mt-8"
                        >
                            <svg
                                className="w-5 h-5"
                                style={{
                                    animation: 'bounce 1s infinite',
                                }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                            <span>Scroll to navigate steps</span>
                        </div>
                    </div>

                    {/* Right Side - Image Container */}
                    <div className="lg:w-1/2">
                        <div className="relative aspect-[4/3] rounded-2xl border border-gray-800 bg-black/40 backdrop-blur-xl overflow-hidden">
                            <div
                                key={activeStep}
                                style={{
                                    opacity: 1,
                                    transform: 'scale(1)',
                                    transition: 'all 0.5s ease-in-out',
                                }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={STEPS[activeStep].image}
                                    alt={STEPS[activeStep].title}
                                    className="w-full h-full object-contain p-4"
                                />
                            </div>

                            {/* Progress Indicator */}
                            {/*<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {STEPS.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveStep(index)}
                                        className="h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: activeStep === index ? '32px' : '8px',
                                            backgroundColor: activeStep === index ? 'rgb(251, 146, 60)' : 'rgba(255, 255, 255, 0.3)',
                                        }}
                                        aria-label={`Go to step ${index + 1}`}
                                    />
                                ))}
                            </div>*/}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(-25%);
                        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
                    }
                    50% {
                        transform: translateY(0);
                        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
                    }
                }
            `}</style>
        </section>
    );
}