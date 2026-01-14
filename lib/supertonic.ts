import * as ort from "onnxruntime-web";

export type Voice = "M1" | "M2" | "M3" | "M4" | "M5" | "F1" | "F2" | "F3" | "F4" | "F5";
export type Language = "en" | "ko" | "es" | "pt" | "fr";

// Uncomment when using actual ONNX models
// interface ModelPaths {
//   encoder: string;
//   decoder: string;
//   vocoder: string;
// }

export class SupertonicTTS {
  private encoderSession: ort.InferenceSession | null = null;
  private decoderSession: ort.InferenceSession | null = null;
  private vocoderSession: ort.InferenceSession | null = null;
  private initialized = false;

  // Hugging Face model URLs
  private readonly baseModelUrl =
    "https://huggingface.co/Supertone/supertonic-2/resolve/main/onnx";

  constructor() {
    // Configure ONNX Runtime
    ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
  }

  async initialize(onProgress?: (progress: number) => void): Promise<void> {
    if (this.initialized) return;

    try {
      onProgress?.(0.1);

      // Use CPU for better compatibility across browsers
      // Uncomment when using actual ONNX models
      // const sessionOptions: ort.InferenceSession.SessionOptions = {
      //   executionProviders: ["wasm"],
      //   graphOptimizationLevel: "all",
      // };

      onProgress?.(0.3);

      // Load models - using simplified single-model approach
      // Note: In production, you would download the actual ONNX models from Hugging Face
      // For this demo, we'll create a mock implementation
      console.log("Loading Supertonic models...");

      onProgress?.(0.6);

      // In a real implementation, you would load these models:
      // this.encoderSession = await ort.InferenceSession.create(
      //   `${this.baseModelUrl}/encoder.onnx`,
      //   sessionOptions
      // );

      onProgress?.(1.0);

      this.initialized = true;
      console.log("Supertonic TTS initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Supertonic TTS:", error);
      throw new Error(
        `Initialization failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async synthesize(
    text: string,
    voice: Voice,
    language: Language
  ): Promise<ArrayBuffer> {
    if (!this.initialized) {
      throw new Error("TTS engine not initialized. Call initialize() first.");
    }

    try {
      console.log(`Synthesizing: "${text}" with voice ${voice} in ${language}`);

      // This is a simplified mock implementation
      // In production, you would:
      // 1. Tokenize the text
      // 2. Run through encoder model
      // 3. Run through decoder model with voice embeddings
      // 4. Run through vocoder to generate audio
      // 5. Convert to WAV format

      // For now, we'll generate a simple tone as a placeholder
      const audioData = this.generatePlaceholderAudio(text.length);
      return audioData;
    } catch (error) {
      console.error("Synthesis failed:", error);
      throw new Error(
        `Synthesis failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private generatePlaceholderAudio(textLength: number): ArrayBuffer {
    // Generate a simple sine wave audio as placeholder
    const sampleRate = 22050;
    const duration = Math.max(1, Math.min(textLength * 0.1, 10)); // 0.1s per character, max 10s
    const numSamples = Math.floor(sampleRate * duration);

    // Create WAV file
    const wavHeader = this.createWavHeader(numSamples, sampleRate);
    const audioData = new Int16Array(numSamples);

    // Generate a simple tone (440 Hz sine wave)
    const frequency = 440;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      audioData[i] = Math.floor(
        32767 * 0.3 * Math.sin(2 * Math.PI * frequency * t)
      );
    }

    // Combine header and data
    const buffer = new ArrayBuffer(wavHeader.length + audioData.byteLength);
    const view = new Uint8Array(buffer);
    view.set(wavHeader, 0);
    view.set(new Uint8Array(audioData.buffer), wavHeader.length);

    return buffer;
  }

  private createWavHeader(numSamples: number, sampleRate: number): Uint8Array {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const dataSize = numSamples * blockAlign;

    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    this.writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    this.writeString(view, 8, "WAVE");

    // fmt sub-chunk
    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat (PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    // data sub-chunk
    this.writeString(view, 36, "data");
    view.setUint32(40, dataSize, true);

    return new Uint8Array(buffer);
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  dispose(): void {
    this.encoderSession?.release();
    this.decoderSession?.release();
    this.vocoderSession?.release();
    this.initialized = false;
  }
}
