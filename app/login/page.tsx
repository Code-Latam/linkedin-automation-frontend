'use client';
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex overflow-hidden bg-black">
            {/* Left Side - Background with Radial Gradient */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000'
            }}>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center text-center px-20 text-white">
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold leading-tight max-w-xl mx-auto">
                            Workflows are for machines,
                            <br />
                            conversations are for humans.
                        </h1>

                        <p className="text-xl text-gray-300 max-w-lg mx-auto">
                            And LeadGenAI can do the talking for you.
                        </p>
                    </div>
                </div>


            </div>

            <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo for mobile */}
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">LeadGenAI</span>
                    </div>

                    <div className="space-y-6 animate-fadeIn">
                        {/* Header */}
                        <div className={'bg-card border border-gray-800 rounded-lg p-6 space-y-6 shadow-lg shadow-black/20'}>
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-bold text-white">
                                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                                </h2>
                                <p className="text-gray-400">
                                    {isSignUp
                                        ? 'Start your journey with us today'
                                        : 'Sign in to continue to your dashboard'}
                                </p>
                            </div>

                            {/* Form */}
                            <div className="space-y-5">
                                {/* Full Name - Only for Sign Up */}
                                {isSignUp && (
                                    <div className="space-y-2 animate-slideDown">
                                        <label htmlFor="fullName" className="text-sm font-medium text-gray-300 block">
                                            Full Name
                                        </label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full px-2 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                )}

                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@company.com"
                                        className="w-full px-2 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-sm font-medium text-gray-300">
                                            Password
                                        </label>
                                        {!isSignUp && (
                                            <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                                Forgot password?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full px-2 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password - Only for Sign Up */}
                                {isSignUp && (
                                    <div className="space-y-2 animate-slideDown">
                                        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 block">
                                            Confirm Password
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full px-2 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    className="group w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    {isSignUp ? 'Create Account' : 'Sign In'}
                                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                                </button>

                                {/* Divider */}
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-800"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm font-medium">
                  <span className='px-2 bg-gray-900 '>
                    or continue with
                  </span>
                                    </div>
                                </div>

                                {/* Social Login Buttons */}
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        className="px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-800/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                        </svg>
                                        Google
                                    </button>
                                </div>
                            </div>

                            {/* Toggle Sign Up/Sign In */}
                            <div className="text-center">
                                <div
                                    className="text-sm text-gray-400 "
                                >
                                    {isSignUp ? (
                                        <p>Already have an account? <a onClick={() => setIsSignUp(false)} className="font-semibold text-cyan-400 cursor-pointer">Sign In</a></p>
                                    ) : (
                                        <p>Don't have an account? <a onClick={() => setIsSignUp(true)} className="font-semibold text-cyan-400 cursor-pointer">Sign Up</a></p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Back to Website */}
                        <div className="text-center">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors group"
                            >
                                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                                Back to website
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}