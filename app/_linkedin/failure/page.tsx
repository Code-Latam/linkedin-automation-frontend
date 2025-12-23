"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LinkedInFailure() {
    const router = useRouter()

    const handleRetry = () => {
        if (window.opener) {
            window.opener.postMessage({ type: 'LINKEDIN_RETRY' }, window.location.origin)
            window.close()
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                <h1 className="text-2xl font-bold">Connection Failed</h1>
                <p className="text-muted-foreground">
                    We couldn't connect your LinkedIn account. Please try again.
                </p>
                <Button onClick={handleRetry}>Try Again</Button>
            </div>
        </div>
    )
}
