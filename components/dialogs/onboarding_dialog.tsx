"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
    Linkedin,
    Target,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        linkedinUrl: '',
        dailyConnectionLimit: '50',
        targetAudience: '',
        messageTemplate: '',
        goals: [] as string[],
    })
    const router = useRouter()

    const totalSteps = 3
    const progress = (step / totalSteps) * 100

    const goals = [
        { id: 'leads', label: 'Generate Leads', icon: Target },
        { id: 'network', label: 'Grow Network', icon: Linkedin },
        { id: 'engagement', label: 'Increase Engagement', icon: Sparkles },
    ]

    const handleGoalToggle = (goalId: string) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.includes(goalId)
                ? prev.goals.filter(g => g !== goalId)
                : [...prev.goals, goalId]
        }))
    }

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1)
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const handleFinish = async () => {
        // TODO: Save onboarding data to backend
        console.log('Onboarding data:', formData)

        // Close dialog and redirect to dashboard
        onOpenChange(false)
        router.push('/dashboard')
    }

    const handleSkip = () => {
        onOpenChange(false)
        router.push('/dashboard')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>

            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Step {step} of {totalSteps}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSkip}
                            className="h-auto p-0 text-xs"
                        >
                            Skip for now
                        </Button>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Step 1: Connect LinkedIn */}
                {step === 1 && (
                    <>
                        <DialogHeader>
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                <Linkedin className="h-8 w-8 text-blue-600" />
                            </div>
                            <DialogTitle className="text-center text-2xl">
                                Connect Your LinkedIn Account
                            </DialogTitle>
                            <DialogDescription className="text-center">
                                Link your LinkedIn profile to start automating your outreach and grow your network
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                                <Input
                                    id="linkedinUrl"
                                    placeholder="https://www.linkedin.com/in/your-profile"
                                    value={formData.linkedinUrl}
                                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    We'll use this to personalize your outreach campaigns
                                </p>
                            </div>

                            <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900 p-4">
                                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-blue-600" />
                                    Quick Connect (Recommended)
                                </h4>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Authorize with LinkedIn OAuth for seamless integration
                                </p>
                                <Button variant="outline" className="w-full" size="sm">
                                    <Linkedin className="h-4 w-4 mr-2" />
                                    Connect with LinkedIn
                                </Button>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleNext} className="w-full" disabled={!formData.linkedinUrl}>
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {/* Step 2: Set Goals */}
                {step === 2 && (
                    <>
                        <DialogHeader>
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                                <Target className="h-8 w-8 text-orange-600" />
                            </div>
                            <DialogTitle className="text-center text-2xl">
                                What Are Your Goals?
                            </DialogTitle>
                            <DialogDescription className="text-center">
                                Select your primary objectives to help us tailor your AI outreach strategy
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="grid gap-3">
                                {goals.map((goal) => {
                                    const Icon = goal.icon
                                    const isSelected = formData.goals.includes(goal.id)

                                    return (
                                        <button
                                            key={goal.id}
                                            onClick={() => handleGoalToggle(goal.id)}
                                            className={cn(
                                                "flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50",
                                                isSelected
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-full",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                            )}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{goal.label}</p>
                                            </div>
                                            {isSelected && (
                                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
                                <Input
                                    id="targetAudience"
                                    placeholder="e.g., SaaS founders, Marketing managers"
                                    value={formData.targetAudience}
                                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex-col gap-2 sm:flex-row">
                            <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <Button onClick={handleNext} className="w-full sm:w-auto" disabled={formData.goals.length === 0}>
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {/* Step 3: Campaign Settings */}
                {step === 3 && (
                    <>
                        <DialogHeader>
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <DialogTitle className="text-center text-2xl">
                                Configure Your Campaign
                            </DialogTitle>
                            <DialogDescription className="text-center">
                                Set up your initial outreach parameters
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="dailyLimit">Daily Connection Requests</Label>
                                <Input
                                    id="dailyLimit"
                                    type="number"
                                    min="10"
                                    max="100"
                                    value={formData.dailyConnectionLimit}
                                    onChange={(e) => setFormData({ ...formData, dailyConnectionLimit: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    LinkedIn recommends 50-100 requests per day to stay safe
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="messageTemplate">Initial Message Template</Label>
                                <Textarea
                                    id="messageTemplate"
                                    rows={4}
                                    placeholder="Hi {firstName}, I noticed your work at {company}..."
                                    value={formData.messageTemplate}
                                    onChange={(e) => setFormData({ ...formData, messageTemplate: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Use variables: {'{firstName}'}, {'{lastName}'}, {'{company}'}, {'{position}'}
                                </p>
                            </div>

                            <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900 p-4">
                                <h4 className="font-medium text-sm mb-2">🎉 You're All Set!</h4>
                                <p className="text-xs text-muted-foreground">
                                    Click finish to start your AI-powered LinkedIn automation journey
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="flex-col gap-2 sm:flex-row">
                            <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <Button onClick={handleFinish} className="w-full sm:w-auto">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Finish Setup
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
