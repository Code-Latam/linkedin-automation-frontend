'use client';
import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { contactText } from '@/lib/text/contact';
import {contactConfig } from '@/lib/constants';

export default function Contact() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const [result, setResult] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setResult("Sending....");

        const formDataToSend = new FormData(event.currentTarget);
        formDataToSend.append("access_key", contactConfig.web3formsAccessKey);

        const response = await fetch(contactConfig.apiEndpoint, {
            method: "POST",
            body: formDataToSend
        });

        const data = await response.json();

        if (data.success) {
            setResult("Form Submitted Successfully");
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: ''
            });
            event.currentTarget.reset();
        } else {
            setResult("Error submitting form. Please try again.");
        }
    };

    return (
        <section id="contact" className="relative py-16 overflow-hidden">

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground">
                        {contactText.header.title}
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                        {contactText.header.subtitle}
                        <br />
                        {contactText.header.callToAction}
                    </p>
                </div>

                {/* Form Container */}
                <div className="relative">

                    {/* Form Card */}
                    <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl border border-gray-800 p-8 sm:p-10">
                        <form onSubmit={handleSubmit}  className="space-y-6">
                            {/* Name Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Daniel"
                                        className="w-full px-4 py-3 bg-black/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="West"
                                        className="w-full px-4 py-3 bg-black/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Email and Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="hello@gmail.com"
                                        className="w-full px-4 py-3 bg-black/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (855) 811-5581"
                                        className="w-full px-4 py-3 bg-black/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                                    Message
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Hi AstroLab Meeting Team, I would like to..."
                                        rows={5}
                                        className="w-full px-4 py-3 bg-black/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                                    />

                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                            >
                                <span>Submit</span>
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                            {result && (
                                <p className={`text-center text-sm font-medium ${
                                    result.includes("Success")
                                        ? "text-green-400"
                                        : result.includes("Error")
                                            ? "text-red-400"
                                            : "text-neutral-300"
                                }`}>
                                    {result}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}