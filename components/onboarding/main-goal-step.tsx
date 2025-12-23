'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {Loader2, Target, Users, Briefcase, Sparkles, Linkedin} from 'lucide-react';

export type MainGoalId = 'sales' | 'talent' | 'business-dev' | 'custom' | string;

export interface MainGoal {
    id: MainGoalId;
    title: string;
    description: string;
    icon?: 'target' | 'users' | 'briefcase' | 'sparkles';
    recommended?: boolean;
}

interface MainGoalStepProps {
    onNext: () => void;
    onBack?: () => void;
    /**
     * Optional dynamic goals from API / Redux.
     * If not provided, falls back to sensible defaults.
     */
    goals?: MainGoal[];
    /** Optional initial selection (e.g. from stored profile). */
    initialGoalId?: MainGoalId;
    /** Persist selection upwards if you want to save in Redux/backend. */
    onChangeGoal?: (goal: MainGoal) => void;
}

const DEFAULT_GOALS: MainGoal[] = [
    {
        id: 'sales',
        title: 'Sales & Lead Generation',
        description: 'Find and engage potential customers for your business.',
        icon: 'target',
        recommended: true,
    },
    {
        id: 'talent',
        title: 'Talent Acquisition',
        description: 'Find and engage top talent for your organization.',
        icon: 'users',
    },
    {
        id: 'business-dev',
        title: 'Business Development',
        description: 'Build strategic partnerships and business relationships.',
        icon: 'briefcase',
    },
    {
        id: 'custom',
        title: 'Something else',
        description: 'Describe your specific goal.',
        icon: 'sparkles',
    },
];

function GoalIcon({ type }: { type?: MainGoal['icon'] }) {
    switch (type) {
        case 'target':
            return <Target className="h-5 w-5" />;
        case 'users':
            return <Users className="h-5 w-5" />;
        case 'briefcase':
            return <Briefcase className="h-5 w-5" />;
        case 'sparkles':
        default:
            return <Sparkles className="h-5 w-5" />;
    }
}

export default function MainGoalStep({
                                         onNext,
                                         onBack,
                                         goals,
                                         initialGoalId,
                                         onChangeGoal,
                                     }: MainGoalStepProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [selectedId, setSelectedId] = useState<MainGoalId | null>(
        initialGoalId ?? null,
    );

    const goalList = goals && goals.length > 0 ? goals : DEFAULT_GOALS;

    useEffect(() => {
        // Fake “Analyzing your profile…” for UX polish
        const timer = setTimeout(() => setIsAnalyzing(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleSelect = (goal: MainGoal) => {
        setSelectedId(goal.id);
        onChangeGoal?.(goal);
    };

    const handleContinue = () => {
        if (!selectedId) return;
        onNext();
    };

    const selectedGoal = goalList.find((g) => g.id === selectedId);

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                    What&apos;s your main goal?
                </h2>
                <p className="text-sm text-muted-foreground">
                    Choose what you want your AI agent to help you with.
                </p>
            </div>

            {/* Analyzing banner */}
            <div className="mb-6 rounded-xl border border-[#1d4ed8] bg-[#020617] px-4 py-3 flex items-center gap-4">
                <div className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-600/40">
                    <Loader2 className={cn('h-3.5 w-3.5 text-blue-300', isAnalyzing && 'animate-spin')} />
                </div>
                <p className="text-sm text-blue-100">
                    {isAnalyzing
                        ? 'Analyzing your profile for personalized suggestions...'
                        : 'Suggestions updated based on your profile and settings.'}
                </p>
            </div>

            {/* Goal options */}
            <div className="space-y-3 mb-8">
                {goalList.map((goal) => {
                    const isSelected = goal.id === selectedId;
                    return (
                        <button
                            key={goal.id}
                            type="button"
                            onClick={() => handleSelect(goal)}
                            className={cn(
                                'w-full rounded-2xl border px-4 py-4 text-left transition-all',
                                'bg-[#050608] border-[#111827] hover:border-cyan-500/70 hover:bg-[#020617]',
                                'flex items-center justify-between gap-4',
                                isSelected &&
                                'border-cyan-500 bg-[#020617] shadow-[0_0_0_1px_rgba(34,211,238,0.7)]',
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-[#020617] border border-[#111827] text-slate-100">
                                    <GoalIcon type={goal.icon} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">
                                        {goal.title}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        {goal.description}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {goal.recommended && (
                                    <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-black">
                    Recommended
                  </span>
                                )}
                                {isSelected && (
                                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between">
                {onBack ? (
                    <Button variant="ghost"
                            className={ "min-w-[100px] font-medium text-muted-foreground hover:bg-white" }
                            size="sm" onClick={onBack}>
                        Back
                    </Button>
                ) : (
                    <span />
                )}

                <Button
                    size="lg"
                    className="min-w-[220px] font-medium bg-white text-primary-foreground hover:bg-gray-300"
                    disabled={!selectedGoal}
                    onClick={handleContinue}
                >
                    Continue
                </Button>

            </div>
        </div>
    );
}
