'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Users ,RefreshCw} from 'lucide-react';

export interface ReviewLead {
    id: string;
    name: string;
    title: string;
    company: string;
    avatarUrl?: string;
}

interface ReviewLeadsStepProps {
    onNext: (selected: ReviewLead[]) => void;
    onBack?: () => void;
    //leads: ReviewLead[];
    onRefetchLeads?: () => void;
}
// Temporary static leads data for demonstration purposes
const leads: ReviewLead[] = [
    {
        id: '1',
        name: 'Alice Johnson',
        title: 'Marketing Manager',
        company: 'Tech Solutions',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
        id: '2',
        name: 'Bob Smith',
        title: 'Sales Executive',
        company: 'Business Corp',
        avatarUrl: 'https://randomuser.me/api/portraits/men/34.jpg',
    },
    {
        id: '3',
        name: 'Catherine Lee',
        title: 'Product Designer',
        company: 'Creative Studio',
        avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
        id: '4',
        name: 'David Kim',
        title: 'Software Engineer',
        company: 'Innovatech',
        avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    {
        id: '5',
        name: 'Eva Martinez',
        title: 'Data Analyst',
        company: 'Analytics Pro',
        avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
];

export default function ReviewLeadsStep({
                                            onNext,
                                            onBack,
                                            onRefetchLeads,
                                        }: ReviewLeadsStepProps) {

    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        () => new Set(leads.map((l) => l.id)),
    );

    const allSelected = useMemo(
        () => selectedIds.size === leads.length && leads.length > 0,
        [selectedIds, leads.length],
    );

    const toggleLead = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleToggleAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(leads.map((l) => l.id)));
        }
    };

    const handleContinue = () => {
        const selected = leads.filter((l) => selectedIds.has(l.id));
        onNext(selected);
    };

    const selectedCount = selectedIds.size;
    const totalCount = leads.length;

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-10 space-y-6">
            {/* Title */}
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                    Review Your Leads
                </h2>
                <p className="text-sm text-muted-foreground">
                    We found {totalCount} potential prospects for you.
                </p>
            </div>

            {/* Leads container */}
            <section className="rounded-3xl bg-[#050608] border border-[#111827] px-5 py-4 space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between rounded-2xl bg-[#111827] px-4 py-2.5">
                    <div className="flex items-center gap-2 text-xs text-white">
                        <Users className="h-4 w-4" />
                        <span>
              {selectedCount} of {totalCount} selected
            </span>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 rounded-full px-3 text-xs hover:bg-white border-transparent"
                        onClick={handleToggleAll}
                    >
                        {allSelected ? 'Deselect All' : 'Select All'}
                    </Button>
                </div>

                {/* Scrollable leads list */}
                <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
                    {leads.map((lead) => {
                        const isSelected = selectedIds.has(lead.id);
                        return (
                            <button
                                key={lead.id}
                                type="button"
                                onClick={() => toggleLead(lead.id)}
                                className={cn(
                                    'w-full rounded-2xl border px-4 py-1 flex items-center justify-between gap-3 text-left transition-all',
                                    'bg-[#050608]  hover:bg-[#111827]',
                                    isSelected &&
                                    'bg-[#111827]',
                                )}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative h-9 w-9 rounded-full overflow-hidden bg-[#020617] flex-shrink-0">
                                        {lead.avatarUrl ? (
                                            <Image
                                                src={lead.avatarUrl}
                                                alt={lead.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-xs text-slate-300">
                                                {lead.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">
                      {lead.name}
                    </span>
                                        <span className="text-[11px] text-slate-200 truncate">
                      {lead.title}
                    </span>
                                        <span className="text-[11px] text-muted-foreground truncate">
                      {lead.company || 'Unknown Company'}
                    </span>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 text-cyan-400">
                                    {isSelected ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <Circle className="h-4 w-4" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-2">
                <div className="flex gap-3">
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
                        type="button"
                        variant="outline"
                        className="rounded-full text-sm px-4 py-4 border-white hover:bg-white"
                        onClick={onRefetchLeads}
                    >
                        <RefreshCw className="h-4 w-4 mr-2 inline-block" />
                        Find Different Leads
                    </Button>
                </div>




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
