'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setConnectionSuccess } from '@/store/slices/linkedInSlice';
import { CheckCircle2 } from 'lucide-react';

export default function LinkedInSuccess() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accountId = params.get('account_id');

        console.log('LinkedIn Success Params:', Object.fromEntries(params.entries()));

        /*if (accountId) {
            // persist in Redux
            dispatch(setConnectionSuccess({ accountId }));
            // optional: also trigger status check with this id
            // dispatch(checkLinkedInConnection({ accountId }));
        }*/

        if (window.opener) {
            window.opener.postMessage(
                {
                    type: 'LINKEDIN_SUCCESS',
                    accountId,
                },
                window.location.origin,
            );
            setTimeout(() => window.close(), 2000);
        } else {
            setTimeout(() => router.push('/dashboard'), 2000);
        }
    }, [router, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center text-sm text-white">
            <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-400" />
            Redirecting...
        </div>
    );
}
