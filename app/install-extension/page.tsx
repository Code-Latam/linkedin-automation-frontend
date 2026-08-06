"use client";

import Link from "next/link";
import { Chrome, CheckCircle, Download } from "lucide-react";

export default function InstallExtensionPage() {
  const extensionId = process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID;
  const isConfigured = !!extensionId;

  // Path to your hosted .crx file
  const downloadUrl = "/extensions/meeting-maker-extension.crx";

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

        {/* Installation Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* Method 1: Chrome Web Store */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">📦 From Chrome Web Store</h3>
            <p className="text-gray-400 text-sm mb-4">
              Install directly from the Chrome Web Store (recommended for automatic updates).
            </p>
            <a
              href={extensionId ? `https://chrome.google.com/webstore/detail/${extensionId}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 ${
                isConfigured
                  ? "hover:shadow-lg hover:scale-105"
                  : "opacity-50 pointer-events-none"
              }`}
            >
              <Chrome className="w-5 h-5" />
              Install from Web Store
            </a>
          </div>

          {/* Method 2: Direct Download */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">📥 Direct Download</h3>
            <p className="text-gray-400 text-sm mb-4">
              Download the .crx file and install manually (good for testing or if Web Store is blocked).
            </p>
            <a
              href={downloadUrl}
              download="meeting-maker-extension.crx"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20"
            >
              <Download className="w-5 h-5" />
              Download Extension (.crx)
            </a>
          </div>

        </div>

        {/* Installation Instructions */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">📖 How to Install from .crx</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">1.</span>
              <p className="text-gray-300 text-sm">
                Download the .crx file using the button above
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">2.</span>
              <p className="text-gray-300 text-sm">
                Open Chrome and go to <span className="text-white">chrome://extensions/</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">3.</span>
              <p className="text-gray-300 text-sm">
                Turn on <span className="text-white">"Developer mode"</span> (top-right)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">4.</span>
              <p className="text-gray-300 text-sm">
                Drag and drop the downloaded <span className="text-white">.crx</span> file onto the extensions page
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">5.</span>
              <p className="text-gray-300 text-sm">
                Click <span className="text-white">"Add extension"</span> when prompted
              </p>
            </div>
          </div>
        </div>

        {/* Quick Steps */}
        <div className="space-y-6 mb-10">
          <h3 className="text-lg font-semibold text-white">After Installation:</h3>
          
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-cyan-400 mt-1" />
            <p className="text-gray-300">
              Pin the extension to your toolbar by clicking the puzzle piece icon and selecting the pin icon.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-cyan-400 mt-1" />
            <p className="text-gray-300">
              Open the extension and log in to connect your account.
            </p>
          </div>
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