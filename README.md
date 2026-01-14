# Supertonic TTS Web App

A lightning-fast, on-device text-to-speech web application powered by [Supertonic](https://github.com/supertone-inc/supertonic). Built with Next.js and optimized for deployment on Vercel.

## Features

- **Lightning-Fast TTS**: On-device speech synthesis with no cloud dependency
- **Multilingual Support**: 5 languages (English, Korean, Spanish, Portuguese, French)
- **10 Voice Styles**: 5 male and 5 female voice options
- **Browser-Based**: Runs entirely in your browser using ONNX Runtime Web
- **Privacy-First**: No data sent to servers - all processing happens locally
- **Responsive Design**: Beautiful UI that works on desktop and mobile
- **Easy Deployment**: Optimized for one-click deployment to Vercel

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **TTS Engine**: Supertonic (ONNX Runtime Web)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Supertonic_TTS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: One-Click Deploy

Click the button below to deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

### Option 2: Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 3: GitHub Integration

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build
4. Click "Deploy"

## Project Structure

```
Supertonic_TTS/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── TTSInterface.tsx   # Main TTS interface
├── lib/                   # Utilities
│   └── supertonic.ts      # TTS engine wrapper
├── public/                # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vercel.json           # Vercel deployment configuration
```

## Usage

1. **Select a Language**: Choose from English, Korean, Spanish, Portuguese, or French
2. **Choose a Voice**: Select from 10 different voice styles (M1-M5 for male, F1-F5 for female)
3. **Enter Text**: Type or paste the text you want to convert to speech
4. **Generate**: Click "Generate Speech" to synthesize audio
5. **Listen & Download**: Play the audio in your browser or download as WAV

## Features in Detail

### On-Device Processing
All speech synthesis happens directly in your browser using WebAssembly and ONNX Runtime. No data is sent to external servers, ensuring complete privacy.

### Multiple Languages
- 🇺🇸 English
- 🇰🇷 Korean (한국어)
- 🇪🇸 Spanish (Español)
- 🇵🇹 Portuguese (Português)
- 🇫🇷 French (Français)

### Voice Variety
10 distinct voice styles to choose from, each with unique characteristics:
- M1-M5: Male voices with different tones and styles
- F1-F5: Female voices with different tones and styles

## Performance

- Generates speech up to 167× faster than real-time on modern hardware
- Minimal computational overhead with only 66M parameters
- Real-time inference in the browser

## Limitations & Notes

- **First Load**: Initial model loading may take a few moments
- **Browser Compatibility**: Works best on modern browsers (Chrome, Edge, Firefox, Safari)
- **Model Size**: ONNX models are loaded on first use (cached afterwards)
- **Demo Mode**: Current implementation uses a simplified placeholder. For production use with actual Supertonic models, download the ONNX models from [Hugging Face](https://huggingface.co/Supertone/supertonic-2) and update the model paths

## Upgrading to Full Supertonic Models

To use the actual Supertonic TTS models:

1. Download models from [Hugging Face](https://huggingface.co/Supertone/supertonic-2)
2. Place ONNX models in `public/models/` directory
3. Update model paths in `lib/supertonic.ts`
4. Uncomment the ONNX session loading code

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Supertonic](https://github.com/supertone-inc/supertonic) by Supertone Inc.
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)
- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [Supertonic documentation](https://github.com/supertone-inc/supertonic)

---

Built with ❤️ using Supertonic TTS