'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ONBOARDING_STEPS,
    DEFAULT_ONBOARDING_STEP,
    OnboardingStepId,
} from '@/lib/onboardingsteps';
import LinkedinAuthStep from '@/components/onboarding/linkedin-auth-step';
import MainGoalStep from "@/components/onboarding/main-goal-step";
import ConfigureAgentStep from "@/components/onboarding/configure-agent-step";
import ReviewLeadsStep from "@/components/onboarding/review-leads-step";
import AgentPreferencesStep from "@/components/onboarding/agent-preferences-step";
// import other steps...

export default function OnboardingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const stepParam = (searchParams.get('step') as OnboardingStepId) ?? DEFAULT_ONBOARDING_STEP;
    const currentIndex = Math.max(
        0,
        ONBOARDING_STEPS.findIndex((s) => s.id === stepParam),
    );
    const currentStep = ONBOARDING_STEPS[currentIndex] ?? ONBOARDING_STEPS[0];

    const updateStep = (step: OnboardingStepId) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('step', step);
        router.push(`/onboarding?${params.toString()}`);
    };

    const goNext = () => {
        if (currentIndex < ONBOARDING_STEPS.length - 1) {
            updateStep(ONBOARDING_STEPS[currentIndex + 1].id);
        } else {
            router.push('/dashboard');
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            updateStep(ONBOARDING_STEPS[currentIndex - 1].id);
        }
    };

    const renderStep = () => {
        switch (currentStep.id) {
            case 'linkedin-auth':
                return <LinkedinAuthStep onNext={goNext} />;
             case 'main-goal':
               return <MainGoalStep onNext={goNext} onBack={goPrev}  />;
            case 'configure-agent':
               return <ConfigureAgentStep onNext={goNext} onBack={goPrev} />;
            case 'review-leads':
               return <ReviewLeadsStep onNext={goNext} onBack={goPrev} />;
             case 'agent-preferences':
               return <AgentPreferencesStep onNext={goNext} onBack={goPrev} />;
            default:
                return null;
        }
    };

    const progress = ((currentIndex + 1) / ONBOARDING_STEPS.length) * 100;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header + progress */}
            <header className="w-full bg-[#050608]/90 backdrop-blur shadow-md ">
                <div className="mx-auto flex h-40 max-w-5xl flex-col items-center justify-center">
                    {/* Logo + title row */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 blur-md opacity-75" />
                            <div className="relative rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-1.5">
                                <Sparkles className="h-5 w-5 text-black" strokeWidth={2.5} />
                            </div>
                        </div>

                        <span className="text-sm font-semibold text-white tracking-wide">
        LeadGenAI
      </span>

                        <span className="text-sm font-semibold text-white/70">
        Onboarding - {currentStep.label}
      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full max-w-3xl mt-8 px-20">
                        <div className="h-1.5 w-full rounded-full bg-[#111827] overflow-hidden">
                            <div
                                className="h-full rounded-full bg-white transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                </div>
            </header>


            {/* Step content */}
            <main className=" flex items-center justify-center">
                {renderStep()}
            </main>
        </div>
    );
}
