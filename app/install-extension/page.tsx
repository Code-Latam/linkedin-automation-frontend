"use client";

import Link from "next/link";
import { Chrome, CheckCircle } from "lucide-react";

export default function InstallExtensionPage() {
  const extensionId = process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID;

  const extensionUrl = extensionId
    ? `https://chrome.google.com/webstore/detail/${extensionId}`
    : "#";

  const isConfigured = !!extensionId;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-24 overflow-hidden">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl p-10 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <Chrome className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Install the Chrome Extension
          </h1>

          <p className="text-gray-400 max-w-xl mx-auto">
            Once you've subscribed to your plan, your account will be activated immediately. Install our Chrome extension to activate
            your workspace and start using the platform.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-10">

          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-cyan-400 mt-1" />
            <p className="text-gray-300">
              Click the button below to open the Chrome Web Store.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-cyan-400 mt-1" />
            <p className="text-gray-300">
              Click <span className="text-white font-medium">"Add to Chrome"</span>.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-cyan-400 mt-1" />
            <p className="text-gray-300">
              Pin the extension to your toolbar.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-cyan-400 mt-1" />
            <p className="text-gray-300">
              Open the extension and log in to connect your account.
            </p>
          </div>

        </div>

        {/* Install Button */}
        <div className="flex justify-center mb-8">
          <a
            href={extensionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 ${
              isConfigured
                ? "hover:shadow-cyan-500/50 hover:scale-105"
                : "opacity-50 pointer-events-none"
            }`}
          >
            <Chrome className="w-5 h-5" />
            Install from Chrome Web Store
          </a>
        </div>

        {!isConfigured && (
          <p className="text-center text-sm text-red-400">
            Chrome extension ID is not configured.
          </p>
        )}

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          After installation, the extension will automatically detect your
          account if you're logged in.
        </p>

        {/* Optional dashboard link */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-cyan-400 hover:text-cyan-300 text-sm"
          >
            Go to Dashboard →
          </Link>
        </div>

      </div>
    </div>
  );
}