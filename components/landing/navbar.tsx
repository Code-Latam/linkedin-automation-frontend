/*
"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const navItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "AI Capabilities", href: "#ai" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
    { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                    : "bg-transparent"
            }`}
        >
            <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
                {/!* LOGO *!/}
                <Link
                    href="/"
                    className="group flex items-center gap-2 font-bold text-xl tracking-tight"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-1.5 rounded-lg">
                            <Sparkles className="w-5 h-5 text-black" strokeWidth={2.5} />
                        </div>
                    </div>
                    <span className="text-gradient">LeadGenAI</span>
                </Link>

                {/!* DESKTOP NAV *!/}
                <div className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group"
                        >
                            {item.name}
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-3/4 transition-all duration-300" />
                        </a>
                    ))}
                </div>

                {/!* CTA BUTTONS - DESKTOP *!/}
                <div className="hidden lg:flex items-center gap-3">
                    <Link
                        href="/login"
                        className="group relative px-6 py-2.5 text-sm font-semibold text-black rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600  transition-transform duration-300 group-hover:scale-110" />
                        <span className="relative flex items-center gap-2">
                            Start Free Trial
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                </div>

                {/!* MOBILE MENU BUTTON *!/}
                <button
                    className="lg:hidden relative p-2 text-gray-300 hover:text-white transition-colors"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    <div className="relative w-6 h-6">
                        <span
                            className={`absolute inset-0 transition-all duration-300 ${
                                open ? "rotate-0 opacity-0" : "rotate-0 opacity-100"
                            }`}
                        >
                            <Menu size={24} />
                        </span>
                        <span
                            className={`absolute inset-0 transition-all duration-300 ${
                                open ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
                            }`}
                        >
                            <X size={24} />
                        </span>
                    </div>
                </button>
            </nav>

            {/!* MOBILE NAV MENU *!/}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="bg-black/95 backdrop-blur-xl border-t border-cyan-500/20 px-6 py-6">
                    <div className="flex flex-col gap-1">
                        {navItems.map((item, index) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-cyan-500/10 rounded-lg transition-all animate-slideDown"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {item.name}
                            </a>
                        ))}

                        <div className="mt-4 pt-4 border-t border-cyan-500/20 flex flex-col gap-3">
                            <Link
                                href="/login"
                                onClick={() => setOpen(false)}
                                className="group relative px-6 py-3 text-sm font-semibold text-black rounded-lg overflow-hidden transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
                                <span className="relative flex items-center justify-center gap-2">
                                    Start Free Trial
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}*/

"use client";

import {useState} from "react";
import {Menu, X} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
    {name: "Features", href: "#features"},
    {name: "How It Works", href: "#how-it-works"},
    {name: "Real Chats", href: "#real-chats"},
    {name: "Pricing", href: "#pricing"},
    {name: "Contact", href: "#contact"},
    {name: "FAQ", href: "#faq"},
];

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

                        <Image src="/logo/logo.jpeg" alt="LeadGenAI Logo"
                               className="rounded-full"
                               width={52} height={52}/>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
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
                            href="/login"
                            className="
                            inline-flex items-center justify-center
                            rounded-[5px]
                            bg-black
                            text-white text-sm font-semibold
                            px-7 py-2.5
                            shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_16px_28px_rgba(0,0,0,0.85)]
                            hover:bg-neutral-900
                            transition-colors">Log In
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
                            {navItems.map((item) => (
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
                                href="/login"
                                className="px-5 py-3 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 rounded-b-3xl"
                                onClick={() => setOpen(false)}
                            >
                                Log In
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
