"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Linkedin,
    Target,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Loader2,
    AlertCircle,
    XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { setShowOnboarding } from '@/store/slices/authSlice'
import {checkLinkedInConnection, createLinkedInAuthLink} from "@/store/slices/linkedInSlice";

interface OnboardingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        dailyConnectionLimit: '50',
        targetAudience: '',
        messageTemplate: '',
        goals: [] as string[],
    })

    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const { connectionStatus, authUrl, isConnecting, error } = useSelector(
        (state: RootState) => state.linkedIn
    )

    const totalSteps = 3
    const progress = (step / totalSteps) * 100

    const goals = [
        { id: 'leads', label: 'Generate Leads', icon: Target },
        { id: 'network', label: 'Grow Network', icon: Linkedin },
        { id: 'engagement', label: 'Increase Engagement', icon: Sparkles },
    ]

    // Check connection status when dialog opens
    useEffect(() => {
        if (open && step === 1) {
            dispatch(checkLinkedInConnection())
        }
    }, [open, step, dispatch])

    // Handle LinkedIn connection
    const handleConnectLinkedIn = async () => {
        const result = await dispatch(createLinkedInAuthLink())

        if (createLinkedInAuthLink.fulfilled.match(result)) {
            /*// Open LinkedIn auth in new window
            const authWindow = window.open(
                result.payload.authUrl,
                'LinkedIn Authentication',
                'width=600,height=700,left=200,top=100'
            )*/
            const authWindow = window.open(
                result.payload.authUrl,
                '_blank'
            );

            // Poll for window close or success
            const pollTimer = setInterval(() => {
                if (authWindow?.closed) {
                    clearInterval(pollTimer)
                    // Check connection status after window closes
                    dispatch(checkLinkedInConnection())
                }
            }, 1000)
        }
    }

    const handleGoalToggle = (goalId: string) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.includes(goalId)
                ? prev.goals.filter(g => g !== goalId)
                : [...prev.goals, goalId]
        }))
    }

    const handleNext = () => {
        if (step === 1 && connectionStatus !== 'success') {
            // Don't allow proceeding without LinkedIn connection
            return
        }
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
        dispatch(setShowOnboarding(false))
        onOpenChange(false)
        router.push('/dashboard')
    }

    const canClose = connectionStatus === 'success' && step === totalSteps

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                // Only allow closing if onboarding is complete
                if (!isOpen && canClose) {
                    onOpenChange(false)
                }
            }}
        >
            <DialogContent
                className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
                onInteractOutside={(e) => {
                    // Prevent closing by clicking outside
                    if (!canClose) {
                        e.preventDefault()
                    }
                }}
                onEscapeKeyDown={(e) => {
                    // Prevent closing with Escape key
                    if (!canClose) {
                        e.preventDefault()
                    }
                }}
            >
                {/* Backdrop blur effect */}
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" />

                <DialogHeader>
                    <DialogTitle className="text-2xl">Welcome to LinkedIn Outreach AI</DialogTitle>
                    <DialogDescription>
                        Let&#39;s set up your account in 3 simple steps
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Step 1: Connect LinkedIn */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Connect Your LinkedIn Account</h3>
                            <p className="text-sm text-muted-foreground">
                                Securely connect your LinkedIn to start automating your outreach
                            </p>
                        </div>

                        {/* Connection Status */}
                        {connectionStatus === 'idle' && (
                            <Alert>
                                <Linkedin className="h-4 w-4" />
                                <AlertDescription>
                                    Click below to securely connect your LinkedIn account
                                </AlertDescription>
                            </Alert>
                        )}

                        {connectionStatus === 'connecting' && (
                            <Alert>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <AlertDescription>
                                    Opening LinkedIn authentication window...
                                </AlertDescription>
                            </Alert>
                        )}

                        {connectionStatus === 'success' && (
                            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-600 dark:text-green-400">
                                    ✨ LinkedIn account connected successfully!
                                </AlertDescription>
                            </Alert>
                        )}

                        {connectionStatus === 'failed' && (
                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {error || 'Failed to connect LinkedIn account. Please try again.'}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Connect Button */}
                        {connectionStatus !== 'success' && (
                            <Button
                                onClick={handleConnectLinkedIn}
                                disabled={isConnecting}
                                className="w-full h-12"
                                size="lg"
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Linkedin className="mr-2 h-5 w-5" />
                                        Connect with LinkedIn
                                    </>
                                )}
                            </Button>
                        )}

                        <DialogFooter>
                            <Button
                                onClick={handleNext}
                                disabled={connectionStatus !== 'success'}
                                className="w-full"
                            >
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {/* Step 2: Set Goals */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">What Are Your Goals?</h3>
                            <p className="text-sm text-muted-foreground">
                                Select your primary objectives to tailor your AI outreach strategy
                            </p>
                        </div>

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
                                        <Icon className={cn(
                                            "h-6 w-6",
                                            isSelected ? "text-primary" : "text-muted-foreground"
                                        )} />
                                        <span className="flex-1 font-medium">{goal.label}</span>
                                        {isSelected && (
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
                            <Textarea
                                id="targetAudience"
                                placeholder="e.g., Software Engineers, Marketing Managers in Tech Startups"
                                value={formData.targetAudience}
                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <Button onClick={handleNext}>
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {/* Step 3: Campaign Settings */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Configure Your Campaign</h3>
                            <p className="text-sm text-muted-foreground">
                                Set up your initial outreach parameters
                            </p>
                        </div>

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
                                placeholder="Hi {firstName}, I noticed we both work in {industry}..."
                                value={formData.messageTemplate}
                                onChange={(e) => setFormData({ ...formData, messageTemplate: e.target.value })}
                                rows={4}
                            />
                            <p className="text-xs text-muted-foreground">
                                Use variables: {'{firstName}'}, {'{lastName}'}, {'{company}'}, {'{position}'}
                            </p>
                        </div>

                        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-600 dark:text-blue-400">
                                🎉 You&#39;re All Set! Click finish to start your AI-powered LinkedIn automation journey
                            </AlertDescription>
                        </Alert>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Finish Setup
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
