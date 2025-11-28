"use client"

import * as React from "react"
import {ThemeProvider as NextThemesProvider, ThemeProviderProps} from "next-themes"
import {OnboardingDialog} from "@/components/dialogs/onboarding_dialog";
import {setShowOnboarding} from "@/store/slices/authSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    const { loading, error, isAuthenticated, showOnboarding} = useAppSelector((state: { auth: any; }) => state.auth);
    const dispatch = useAppDispatch();
    return( <>
        <NextThemesProvider {...props}>{children}</NextThemesProvider>
            <OnboardingDialog
                open={showOnboarding}
                onOpenChange={(open) => dispatch(setShowOnboarding(open))}
            />
    </>
    )
}
