import * as ort from "onnxruntime-web";
import {
  loadTextToSpeech,
  loadVoiceStyle,
  writeWavFile,
  Style,
  TextToSpeech as TTSEngine,
  type Voice,
  type Language,
} from "./supertonic-helper";

export type { Voice, Language };

export class SupertonicTTS {
  private ttsEngine: TTSEngine | null = null;
  private currentStyle: Style | null = null;
  private initialized = false;

  // Hugging Face model URLs - using the main branch
  private readonly baseModelUrl =
    "https://huggingface.co/Supertone/supertonic-2/resolve/main/onnx";
  private readonly baseVoiceUrl =
    "https://huggingface.co/Supertone/supertonic-2/resolve/main/voice_styles";

  constructor() {
    // Configure ONNX Runtime for WebAssembly
    ort.env.wasm.wasmPaths =
      "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
    ort.env.wasm.numThreads = 1;
  }

  async initialize(
    onProgress?: (status: string) => void
  ): Promise<void> {
    if (this.initialized) return;

    try {
      onProgress?.("Configuring ONNX Runtime...");

      // Set up session options for better compatibility
      const sessionOptions: ort.InferenceSession.SessionOptions = {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      };

      onProgress?.("Loading TTS models from Hugging Face...");

      // Load all ONNX models
      const { textToSpeech } = await loadTextToSpeech(
        this.baseModelUrl,
        sessionOptions,
        (modelName, current, total) => {
          onProgress?.(`Loading ${modelName} (${current}/${total})...`);
        }
      );

      this.ttsEngine = textToSpeech;

      onProgress?.("Loading default voice style (F1)...");

      // Load default voice style
      this.currentStyle = await loadVoiceStyle(`${this.baseVoiceUrl}/F1.json`);

      this.initialized = true;
      onProgress?.("✓ Initialization complete!");

      console.log("Supertonic TTS initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Supertonic TTS:", error);
      throw new Error(
        `Initialization failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async loadVoice(voice: Voice): Promise<void> {
    if (!this.initialized || !this.ttsEngine) {
      throw new Error("TTS engine not initialized");
    }

    try {
      console.log(`Loading voice style: ${voice}`);
      this.currentStyle = await loadVoiceStyle(
        `${this.baseVoiceUrl}/${voice}.json`
      );
    } catch (error) {
      console.error(`Failed to load voice ${voice}:`, error);
      throw new Error(
        `Failed to load voice: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async synthesize(
    text: string,
    voice: Voice,
    language: Language
  ): Promise<ArrayBuffer> {
    if (!this.initialized || !this.ttsEngine) {
      throw new Error("TTS engine not initialized. Call initialize() first.");
    }

    try {
      // Load voice if different from current
      if (!this.currentStyle || voice !== this.getCurrentVoice()) {
        await this.loadVoice(voice);
      }

      console.log(
        `Synthesizing: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}" with voice ${voice} in ${language}`
      );

      // Synthesize speech using 2 denoising steps (fast mode)
      const { wav } = await this.ttsEngine.call(
        text,
        language,
        this.currentStyle!,
        2, // totalStep: 2 for fast generation
        1.0, // speed: 1.0 for normal speed
        0.3, // silenceDuration: 0.3s between chunks
        null // no progress callback for now
      );

      // Convert Float32Array audio to WAV format
      const wavBuffer = writeWavFile(wav, this.ttsEngine.sampleRate);

      return wavBuffer;
    } catch (error) {
      console.error("Synthesis failed:", error);
      throw new Error(
        `Synthesis failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private getCurrentVoice(): Voice | null {
    // This is a simplified version - in reality we'd track which voice is loaded
    return null;
  }

  dispose(): void {
    // ONNX sessions are managed by the helper library
    this.ttsEngine = null;
    this.currentStyle = null;
    this.initialized = false;
  }
}
