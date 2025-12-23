// lib/onboardingSteps.ts
export type OnboardingStepId =
    | 'linkedin-auth'
    | 'main-goal'
    | 'configure-agent'
    | 'review-leads'
    | 'agent-preferences';

export const ONBOARDING_STEPS: { id: OnboardingStepId; label: string }[] = [
    { id: 'linkedin-auth',       label: 'Connect LinkedIn' },
    { id: 'main-goal',           label: 'Define Main Goal' },
    { id: 'configure-agent',     label: 'Configure Your Agent' },
    { id: 'review-leads',        label: 'Review Your Leads' },
    { id: 'agent-preferences',   label: 'Agent Preferences' },
];

export const DEFAULT_ONBOARDING_STEP: OnboardingStepId = 'linkedin-auth';
