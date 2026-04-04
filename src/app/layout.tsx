import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackgroundFixed';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ResumeAI | Architecting Careers',
  description: 'Build high-fidelity professional resumes with AI precision and premium design aesthetics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen flex flex-col bg-[#0a0a0f] text-zinc-200 selection:bg-indigo-500/30 overflow-x-hidden relative`}>
        <div className="print-hidden">
          <AnimatedBackground />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <div className="print-hidden">
            <Navbar />
          </div>
          <main className="flex-1">
            {children}
          </main>
          <div className="print-hidden">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}

