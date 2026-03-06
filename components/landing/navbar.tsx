
"use client";

import {useState} from "react";
import {Menu, X} from "lucide-react";
import Link from "next/link";
import { navbarText } from '@/lib/text/navbar';


export default function Navbar() {
    const [open, setOpen] = useState(false);


    return (
        <header
            className={`
        fixed top-0 left-0 right-0 z-50
        flex justify-center
        px-4 sm:px-6 lg:px-8
        transition-all duration-300
        mt-6`}
        >
            <div className="w-full max-w-6xl rounded-[5px]  p-[2px]">
                {/* Inner glass / pill navbar */}
                <div
                    className={`
            relative flex items-center justify-between
            rounded-[5px] px-4 sm:px-6
            h-16 sm:h-[4.25rem]
            bg-black/60 backdrop-blur-xl
            border border-white/5
          `}
                >
                    {/* Logo / Brand */}
                    <Link href="/" className="flex items-center gap-2">

                        <img src="/logo/logo.jpeg" alt={navbarText.brand.logoAlt}
                               className="rounded-full"
                               width={52} height={52}/>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navbarText.navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-neutral-200/80 hover:text-white relative after:absolute after:bottom-0 py-1 after:left-0 after:h-[1px] after:w-0 after:bg-gradient-to-r after:from-cyan-500 after:to-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right actions */}
                  <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="
                        inline-flex items-center justify-center
                        rounded-[5px]
                        bg-black
                        text-white text-sm font-semibold
                        px-7 py-2.5
                        shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_16px_28px_rgba(0,0,0,0.85)]
                        hover:bg-neutral-900
                        transition-colors"
                    >
                        {navbarText.cta.login}
                    </Link>
                   </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden inline-flex items-center justify-center rounded-xl border border-white/10 bg-black/50 p-2 text-white"
                        onClick={() => setOpen((o) => !o)}
                        aria-label="Toggle navigation"
                    >
                        {open ? <X size={18}/> : <Menu size={18}/>}
                    </button>
                </div>
            </div>

            {/* Mobile menu overlay */}
            {open && (
                <div className="fixed inset-x-0 top-[4.5rem] z-40 px-4 sm:px-6">
                    <div
                        className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-black/90 backdrop-blur-2xl shadow-2xl">
                        <nav className="flex flex-col divide-y divide-white/5">
                            {navbarText.navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-5 py-3 text-sm font-medium text-neutral-200 hover:bg-white/5"
                                    onClick={() => setOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                            href="/dashboard"
                            className="px-5 py-3 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 rounded-b-3xl"
                            onClick={() => setOpen(false)}
                            >
                            {navbarText.cta.login}
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
