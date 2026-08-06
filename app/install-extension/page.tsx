"use client";

import Link from "next/link";
import { CheckCircle, Download, ExternalLink, Chrome } from "lucide-react";
import { useState } from "react";

export default function InstallExtensionPage() {
  const [showInstructions, setShowInstructions] = useState(false);

  // The zip file location on your backend
  const downloadUrl = "https://api.meetingmaker.tech/meetingmaker.zip";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-24 overflow-hidden">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl p-10 shadow-2xl">

        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <Chrome className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Install the Meeting Maker Extension
          </h1>

          <p className="text-gray-400 max-w-xl mx-auto">
            Download and install our Chrome extension to activate your workspace and start using the platform.
          </p>
        </div>

        {/* Download Button */}
        <div className="bg-white/5 rounded-xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all mb-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">📦 Download Extension</h3>
            <p className="text-gray-400 text-sm mb-6">
              Download the extension package and follow the installation steps below.
            </p>
            <a
              href={downloadUrl}
              download="meetingmaker.zip"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download meetingmaker.zip
            </a>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="bg-white/5 rounded-xl p-6 border border-cyan-500/30 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">📖 Installation Instructions</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">1.</span>
              <p className="text-gray-300">
                Download the <span className="text-white font-medium">meetingmaker.zip</span> file using the button above
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">2.</span>
              <p className="text-gray-300">
                Extract the ZIP file to a folder on your computer
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">3.</span>
              <p className="text-gray-300">
                Open Chrome and go to <span className="text-white font-medium">chrome://extensions/</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">4.</span>
              <p className="text-gray-300">
                Turn on <span className="text-white font-medium">"Developer mode"</span> (toggle in the top-right corner)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">5.</span>
              <p className="text-gray-300">
                Click <span className="text-white font-medium">"Load unpacked"</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">6.</span>
              <p className="text-gray-300">
                Select the extracted folder (the one containing <span className="text-white font-medium">manifest.json</span>)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">7.</span>
              <p className="text-gray-300">
                The extension is now installed! 🎉
              </p>
            </div>
          </div>
        </div>

        {/* After Installation */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-white">After Installation:</h3>
          
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-cyan-400 mt-1" />
            <p className="text-gray-300">
              Pin the extension to your toolbar (click the puzzle icon, then the pin icon).
            </p>
          </div>

          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-cyan-400 mt-1" />
            <p className="text-gray-300">
              Open the extension and log in to connect your account.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          💡 You'll only need to do this once. After installation, the extension will work automatically.
        </p>

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