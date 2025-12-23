'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLinkedInProfile } from '@/store/slices/linkedInSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Calendar, Globe2, Mail, Phone, Upload, X, ExternalLink } from 'lucide-react';
import {store} from "@/store";


interface ConfigureAgentStepProps {
    onNext: () => void;
    onBack?: () => void;
}

interface KnowledgeItem {
    id: string;
    title: string;
    url: string;
}

export default function ConfigureAgentStep({ onNext, onBack }: ConfigureAgentStepProps) {
    const dispatch = useAppDispatch();
    const { accountId, profile, hasProfile, isLoadingProfile } = useAppSelector(
        (state) => state.linkedIn,
    );

    // Prefill knowledge base from profile websites
    const initialKbItems = useMemo(() => {
        if (!hasProfile || !profile?.websites?.length) return [];
        return profile.websites.map((url: string | URL, idx: any) => ({
            id: `kb-${idx}`,
            title: profile.firstName && profile.lastName
                ? `${profile.firstName} ${profile.lastName} (${new URL(url).hostname})`
                : new URL(url).hostname,
            url,
        }));
    }, [hasProfile, profile]);

    const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(initialKbItems);
    const [kbUrl, setKbUrl] = useState('');
    const [eventName, setEventName] = useState('Book a Call');
    const [eventUrl, setEventUrl] = useState('https://calendly.com/yourname');
    const [selectedAction, setSelectedAction] = useState<'call' | 'email' | 'visit' | 'custom'>(
        'visit',
    );

    // When profile loads later, merge new KB items once
    useEffect(() => {
        if (!initialKbItems.length) return;
        setKnowledgeItems((prev) => {
            if (prev.length) return prev; // avoid overriding manual edits
            return initialKbItems;
        });
    }, [initialKbItems]);

    // Fetch profile when accountId is available
    useEffect(() => {
        const state = store.getState(); // You'll need to import store
        const currentAccountId = state.linkedIn.accountId;
        console.log('ConfigureAgentStep - accountId from store:', currentAccountId);
        if (currentAccountId) {
            dispatch(fetchLinkedInProfile({ accountId }));
        }
    }, [ dispatch]);


    const addKnowledgeUrl = () => {
        if (!kbUrl.trim()) return;
        setKnowledgeItems((prev) => [
            ...prev,
            { id: crypto.randomUUID(), title: kbUrl, url: kbUrl },
        ]);
        setKbUrl('');
    };

    const removeKnowledgeItem = (id: string) => {
        setKnowledgeItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleContinue = () => {
        // TODO: persist to backend / redux
        onNext();
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-10 space-y-6">
            {/* Heading */}
            <div className="text-center mb-4">
                <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                    Configure Your Agent
                </h2>
                <p className="text-sm text-muted-foreground">
                    Set up your AI agent&apos;s personality and conversion events.
                </p>
            </div>

            {/* Agent summary card */}
            <section className="rounded-3xl bg-[#050608] border border-[#111827] px-5 py-4 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#020617]">
                    {profile?.profilePictureUrlLarge ? (
                        <Image
                            src={profile.profilePictureUrlLarge}
                            alt={profile.firstName || 'Agent avatar'}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-slate-300">
                            {(profile?.firstName ?? 'A').charAt(0)}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white">
                            {hasProfile
                                ? `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim() ||
                                'Your AI Agent'
                                : 'Your AI Agent'}
                        </p>
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-200">
          Consulting Agent
        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {hasProfile && profile?.headline
                            ? profile.headline
                            : `This agent communicates from your LinkedIn profile and uses your knowledge base
             to talk like you and book more qualified meetings.`}
                    </p>
                </div>
            </section>

            {isLoadingProfile && (
                <p className="text-[11px] text-muted-foreground mb-1">
                    Syncing your LinkedIn profile…
                </p>
            )}


            {/* Knowledge Base */}
            <section className="rounded-3xl bg-[#050608] border border-[#111827] px-5 py-5 space-y-4">
                <div>
                    <h3 className="text-sm font-semibold mb-1">Knowledge Base</h3>
                    <p className="text-xs text-muted-foreground">
                        Add your website or upload files so your agent knows about your business.
                    </p>
                </div>

                <div className="space-y-2">
                    {knowledgeItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between rounded-2xl bg-[#111827] px-3 py-2 text-xs"
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Globe2 className="h-4 w-4 text-slate-300 flex-shrink-0" />
                                <div className="flex flex-col truncate">
                  <span className="font-medium text-white truncate">
                    {item.title}
                  </span>
                                    <span className="text-[11px] text-muted-foreground truncate">
                    {item.url}
                  </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeKnowledgeItem(item.id)}
                                className="ml-2 text-slate-400 hover:text-slate-200"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 justify-center border-[#111827] bg-black/40 hover:bg-white"
                        onClick={addKnowledgeUrl}
                    >
                        <Globe2 className="mr-2 h-4 w-4" />
                        Add URL
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 justify-center border-[#111827] bg-black/40 hover:bg-white"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Add File
                    </Button>
                </div>

                {/* Hidden field for URL entry (you might turn this into a modal/inline input) */}
                <div className="space-y-1">
                    <Label htmlFor="kb-url" className="text-[11px] text-muted-foreground">
                        Knowledge base URL
                    </Label>
                    <Input
                        id="kb-url"
                        placeholder="https://your-website.com"
                        value={kbUrl}
                        onChange={(e) => setKbUrl(e.target.value)}
                        className="h-8 bg-black/40 border-[#111827] text-xs"
                    />
                </div>
            </section>

            {/* Conversion Events */}
            <section className="rounded-3xl bg-[#050608] border border-[#111827] px-5 py-5 space-y-3">
                <div>
                    <h3 className="text-sm font-semibold mb-1">Conversion Events</h3>
                    <p className="text-xs text-muted-foreground">
                        What should prospects do when interested?
                    </p>
                </div>
                {/*#0e131f*/}
                <div className="rounded-2xl bg-[#111827] px-4 py-3 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>Event 1</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_minmax(0,1.3fr)] gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="event-name" className="text-[11px] text-muted-foreground">
                                Event title
                            </Label>
                            <Input
                                id="event-name"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                className="h-8 bg-black/40 border-[#111827] text-xs"
                                placeholder="Book a Call"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="event-url" className="text-[11px] text-muted-foreground">
                                Destination URL
                            </Label>
                            <div className="relative">
                                <Input
                                    id="event-url"
                                    value={eventUrl}
                                    onChange={(e) => setEventUrl(e.target.value)}
                                    className="h-8 bg-black/40 border-[#111827] text-xs pr-8"
                                    placeholder="https://calendly.com/yourname"
                                />
                                <ExternalLink className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                            </div>
                        </div>
                    </div>

                    {/* Event type buttons */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        <EventTypeButton
                            icon={<Phone className="h-3.5 w-3.5" />}
                            label="Call me"
                            active={selectedAction === 'call'}
                            onClick={() => setSelectedAction('call')}
                        />
                        <EventTypeButton
                            icon={<Mail className="h-3.5 w-3.5" />}
                            label="Email me"
                            active={selectedAction === 'email'}
                            onClick={() => setSelectedAction('email')}
                        />
                        <EventTypeButton
                            icon={<Globe2 className="h-3.5 w-3.5" />}
                            label="Visit Website"
                            active={selectedAction === 'visit'}
                            onClick={() => setSelectedAction('visit')}
                        />
                        <EventTypeButton
                            icon={null}
                            label="+ Custom"
                            active={selectedAction === 'custom'}
                            onClick={() => setSelectedAction('custom')}
                        />
                    </div>
                </div>
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

interface EventTypeButtonProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

function EventTypeButton({ icon, label, active, onClick }: EventTypeButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] border',
                'bg-black/40 border-[#111827] text-slate-100',
                'hover:bg-[#020617]',
                active && 'border-cyan-500 bg-[#020617]',
            )}
        >
            {icon}
            {label}
        </button>
    );
}
