import Link from 'next/link';
import { ArrowRight, Bot, Sparkles, FileCheck2, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -z-10 h-[50rem] w-[90rem] -translate-x-1/2 opacity-20 [mask-image:radial-gradient(closest-side,white,transparent)]">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 from-10% via-purple-500 via-30% to-pink-500 to-90% blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 flex flex-col items-center text-center mt-20 mb-32">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-zinc-300 backdrop-blur-md mb-8">
          <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
          <span>Powered by Advanced AI</span>
        </div>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Craft your perfect resume with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI precision.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-zinc-400 sm:text-xl">
          Stand out from the crowd. Our AI analyzes your experience and generates highly-converting, ATS-optimized resumes in minutes.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/builder"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-black transition-all hover:bg-zinc-200 hover:scale-105"
          >
            Start Building for Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/10"
          >
            How it works
          </Link>
        </div>

        {/* Features Preview */}
        <div id="features" className="mt-32 grid w-full max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
          <FeatureCard
            icon={<Bot className="h-6 w-6 text-indigo-400" />}
            title="Smart Generation"
            description="Our AI understands your career history and writes impactful bullet points that highlight your achievements."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-purple-400" />}
            title="Lightning Fast"
            description="Create multiple tailored versions of your resume in seconds for different job applications."
          />
          <FeatureCard
            icon={<FileCheck2 className="h-6 w-6 text-pink-400" />}
            title="ATS Optimized"
            description="Templates designed to pass through Applicant Tracking Systems with perfect parsing scores."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/50 border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mt-2">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
