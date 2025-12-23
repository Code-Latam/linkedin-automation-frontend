'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    MessageCircle,
    MessageSquare,
    UserPlus2,
    Inbox,
    MessagesSquare, RefreshCw,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type PreferenceId =
    | 'learn-style'
    | 'comments'
    | 'connection-notes'
    | 'handle-invites'
    | 'handle-inbound';

interface AgentPreference {
    id: PreferenceId;
    title: string;
    description: string;
    icon: React.ReactNode;
    recommended?: boolean;
    defaultEnabled?: boolean;
}

interface AgentPreferencesStepProps {
    onNext: (prefs: Record<PreferenceId, boolean>) => void;
    onBack?: () => void;
}

const PREFERENCES: AgentPreference[] = [
    {
        id: 'learn-style',
        title: 'Learn Your Conversation Style',
        description:
            'Your AI agent will analyze your existing conversations to match your communication style.',
        icon: <MessageCircle className="h-4 w-4" />,
        recommended: true,
        defaultEnabled: true,
    },
    {
        id: 'comments',
        title: 'Enable Comments on Posts',
        description:
            'Your agent can comment on LinkedIn posts to engage with prospects naturally.',
        icon: <MessageSquare className="h-4 w-4" />,
        recommended: true,
    },
    {
        id: 'connection-notes',
        title: 'Send Connection Invites with Notes',
        description:
            'Include personalized messages when sending connection requests to prospects.',
        icon: <UserPlus2 className="h-4 w-4" />,
        recommended: true,
        defaultEnabled: true,
    },
    {
        id: 'handle-invites',
        title: 'Handle Received Connection Invites',
        description:
            'Automatically accept and respond to connection requests from potential leads.',
        icon: <Inbox className="h-4 w-4" />,
        recommended: true,
    },
    {
        id: 'handle-inbound',
        title: 'Handle All Inbound Messages',
        description:
            'Respond to all incoming messages, not just from leads in your pipeline.',
        icon: <MessagesSquare className="h-4 w-4" />,
    },
];

export default function AgentPreferencesStep({
                                                 onNext,
                                                 onBack,
                                             }: AgentPreferencesStepProps) {
    const [values, setValues] = useState<Record<PreferenceId, boolean>>(() => {
        const initial: Record<PreferenceId, boolean> = {
            'learn-style': false,
            comments: false,
            'connection-notes': false,
            'handle-invites': false,
            'handle-inbound': false,
        };
        PREFERENCES.forEach((p) => {
            initial[p.id] = Boolean(p.defaultEnabled);
        });
        return initial;
    });

    const toggle = (id: PreferenceId, value: boolean) => {
        setValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleContinue = () => {
        onNext(values);
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-10 space-y-6">
            {/* Heading */}
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                    Agent Preferences
                </h2>
                <p className="text-sm text-muted-foreground">
                    Configure how your agent should behave.
                </p>
            </div>

            {/* Preferences list */}
            <section className="rounded-3xl bg-[#050608] border border-[#111827] px-5 py-5 space-y-3">
                {PREFERENCES.map((pref) => (
                    <div
                        key={pref.id}
                        className="rounded-2xl bg-[#111827] border border-[#111827] px-4 py-3 flex items-center gap-4"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/50 text-slate-100 flex-shrink-0">
                            {pref.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-white">
                                    {pref.title}
                                </p>
                                {pref.recommended && (
                                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-black">
                    Recommended
                  </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {pref.description}
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <Switch
                                checked={values[pref.id]}
                                onCheckedChange={(val) => toggle(pref.id, val)}
                                className={ cn(
                            'data-[state=checked]:bg-white data-[state=unchecked]:bg-gray-600',
                            'data-[state=checked]:focus:ring-offset-gray-900',
                            'relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                                ) }
                            />
                        </div>
                    </div>
                ))}
            </section>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
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
                    onClick={handleContinue}
                >
                    Continue
                </Button>
            </div>





            </div>
    );
}
