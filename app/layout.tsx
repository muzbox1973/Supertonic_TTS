import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supertonic TTS - Lightning-Fast Text-to-Speech",
  description: "On-device multilingual text-to-speech powered by Supertonic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
