"use client";

import TTSInterface from "@/components/TTSInterface";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Supertonic TTS
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Lightning-fast on-device text-to-speech
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Supports English, Korean, Spanish, Portuguese, and French
          </p>
        </div>

        <TTSInterface />

        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Powered by{" "}
            <a
              href="https://github.com/supertone-inc/supertonic"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Supertonic
            </a>
          </p>
          <p className="mt-2">
            All processing happens in your browser - no data is sent to servers
          </p>
        </footer>
      </div>
    </main>
  );
}
