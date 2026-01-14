"use client";

import { useState, useRef, useEffect } from "react";
import { SupertonicTTS, Voice, Language } from "@/lib/supertonic";

const voices: Voice[] = ["M1", "M2", "M3", "M4", "M5", "F1", "F2", "F3", "F4", "F5"];
const languages: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어 (Korean)" },
  { code: "es", name: "Español (Spanish)" },
  { code: "pt", name: "Português (Portuguese)" },
  { code: "fr", name: "Français (French)" },
];

export default function TTSInterface() {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<Voice>("F1");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState("");
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const ttsRef = useRef<SupertonicTTS | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize TTS engine
    const initTTS = async () => {
      try {
        setLoadingProgress("Initializing TTS engine...");
        const tts = new SupertonicTTS();

        setLoadingProgress("Loading model (this may take a moment)...");
        await tts.initialize((progress) => {
          setLoadingProgress(`Loading: ${Math.round(progress * 100)}%`);
        });

        ttsRef.current = tts;
        setIsModelLoaded(true);
        setLoadingProgress("");
      } catch (err) {
        setError(
          `Failed to initialize TTS: ${err instanceof Error ? err.message : String(err)}`
        );
        setLoadingProgress("");
      }
    };

    initTTS();

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    if (!text.trim() || !ttsRef.current) return;

    setIsGenerating(true);
    setError("");

    // Clean up previous audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const audioData = await ttsRef.current.synthesize(
        text,
        selectedVoice,
        selectedLanguage
      );

      const blob = new Blob([audioData], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError(
        `Failed to generate speech: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `supertonic-${selectedVoice}-${selectedLanguage}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exampleTexts: Record<Language, string> = {
    en: "Hello! This is Supertonic, a lightning-fast text-to-speech system.",
    ko: "안녕하세요! 슈퍼토닉입니다. 빠른 음성 합성을 경험해보세요.",
    es: "¡Hola! Este es Supertonic, un sistema de texto a voz ultrarrápido.",
    pt: "Olá! Este é o Supertonic, um sistema de conversão de texto em fala super rápido.",
    fr: "Bonjour! Ceci est Supertonic, un système de synthèse vocale ultra-rapide.",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      {!isModelLoaded ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{loadingProgress}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Loading ONNX models... This is a one-time initialization.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setText(exampleTexts[lang.code]);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedLanguage === lang.code
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voice Style
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {voices.map((voice) => (
                  <button
                    key={voice}
                    onClick={() => setSelectedVoice(voice)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedVoice === voice
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {voice}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                M = Male voices, F = Female voices
              </p>
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text to Synthesize
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert to speech..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {text.length} characters
              </p>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!text.trim() || isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  <span>Generate Speech</span>
                </>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Audio Player */}
            {audioUrl && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Generated Audio
                </h3>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  className="w-full"
                />
                <button
                  onClick={handleDownload}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download WAV</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
