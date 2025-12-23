'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Loader2, Linkedin } from 'lucide-react';
import {
    checkLinkedInConnection,
    createLinkedInAuthLink, setConnectionSuccess,
} from '@/store/slices/linkedInSlice';
import {store} from "@/store";

interface LinkedinAuthStepProps {
    onNext: () => void;
}

export default function LinkedinAuthStep({ onNext }: LinkedinAuthStepProps) {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const { connectionStatus, isConnected, accountId } = useAppSelector(
        (state) => state.linkedIn,
    );
    //const [currentAccountId, setCurrentAccountId] = useState<string>('');

    const handleConnectLinkedin = async () => {
        try {
            setLoading(true);
            const result = await dispatch(createLinkedInAuthLink());

            if (createLinkedInAuthLink.fulfilled.match(result)) {
                const authWindow = window.open(result.payload.authUrl, '_blank');

                // Listen for postMessage from the popup
                const messageHandler = (event: MessageEvent) => {
                    // Security check: verify origin
                    if (event.origin !== window.location.origin) return;

                    if (event.data.type === 'LINKEDIN_SUCCESS') {
                        const receivedAccountId = event.data.accountId;
                        console.log('Received accountId from popup:', receivedAccountId);
                        //setCurrentAccountId(receivedAccountId);
                        // Clean up listener
                        const pollTimer = setInterval(() => {
                            if (authWindow?.closed) {
                                clearInterval(pollTimer);

                                // Wait 5 seconds after window closes, then check connection
                                setTimeout(() => {
                                    console.log('currentAccountId state:', receivedAccountId);
                                    if (receivedAccountId) {
                                        console.log('Checking connection with accountId:', receivedAccountId);
                                        dispatch(checkLinkedInConnection({ accountId: receivedAccountId }));
                                    } else {
                                        console.warn('No accountId available after popup closed');
                                    }

                                    setLoading(false);
                                }, 5000);

                                // Clean up message listener if still active
                                window.removeEventListener('message', messageHandler);
                            }
                        }, 1000);
                        window.removeEventListener('message', messageHandler);
                    }
                };

                window.addEventListener('message', messageHandler);

                // Poll until popup closed

            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleContinue = () => {
        onNext();
    };

    // React when Redux state says success
    useEffect(() => {
        if (connectionStatus === 'success' && isConnected) {
           onNext();
        }
    }, [connectionStatus, isConnected]);


    return (
        <div className="flex flex-col items-center justify-center w-full px-4 py-10">

            {/* Center card */}
            <Card
                className={cn(
                    'w-full max-w-xl  bg-[#050608]/90 backdrop-blur',
                    'shadow-2xl glow-cyan animate-fadeIn'
                )}
            >
                <CardHeader className="flex flex-col items-center space-y-4 pt-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/40">
                        <Linkedin className="h-9 w-9 text-blue-500" />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-center">
                        Connect Your LinkedIn
                    </CardTitle>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                        Connect your LinkedIn account so your AI agent can send
                        personalized messages to your ideal prospects.
                    </p>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-6 pb-8">
                    {!isConnected ? (
                        <Button
                            size="lg"
                            className="min-w-[220px] font-medium bg-white text-primary-foreground hover:bg-gray-300"
                            onClick={handleConnectLinkedin}
                            disabled={loading}
                        >
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                            )}
                            <Linkedin className="mr-2 h-4 w-4" />
                            {loading ? 'Connectingâ€¦' : 'Connect LinkedIn'}
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            variant="outline"
                            className="min-w-[220px] border-cyan-500/60 bg-white text-primary-foreground hover:bg-gray-300"
                            onClick={handleContinue}
                        >
                            Continue â€“ LinkedIn Connected
                        </Button>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                        Secure connection â€¢ Your LinkedIn credentials are never stored on our servers.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
