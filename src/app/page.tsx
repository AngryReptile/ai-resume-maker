import { FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Using a placeholder graphic for the resume card since we haven't built an image export yet
const ResumePreview = () => (
  <div className="relative mt-24 mb-[-150px] flex w-full max-w-4xl flex-col items-center justify-start rounded-t-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-md shadow-2xl">
    <div className="w-full rounded-t-2xl bg-white p-8 pb-32 shadow-inner h-[400px] overflow-hidden">
      <div className="flex items-center gap-6 border-b border-gray-200 pb-6">
        <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden shrink-0 relative">
          <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" fill className="object-cover" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900">John Shan</h2>
          <p className="text-gray-500 font-medium">Ateroport Dollater</p>
        </div>
        <div className="text-right text-sm text-gray-500 space-y-1">
          <p>contact@johnshan.com</p>
          <p>+1 432-355-7780</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-12 pt-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-200 pb-2">Experience</h3>
          <div className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-gray-900">Product Manager</h4>
              <span className="text-xs text-gray-500">2020 - Present</span>
            </div>
            <p className="text-sm text-gray-600">Tech Innovators Inc.</p>
            <ul className="mt-2 text-xs text-gray-500 list-disc pl-4 space-y-1">
              <li>Led cross-functional teams to launch 3 major products.</li>
              <li>Increased user retention by 25% through UX improvements.</li>
            </ul>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-200 pb-2">Education</h3>
          <div>
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-gray-900">BS Computer Science</h4>
              <span className="text-xs text-gray-500">2016 - 2020</span>
            </div>
            <p className="text-sm text-gray-600">Stanford University</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden">

      {/* Main Content */}
      <div className="container relative z-10 px-4 flex flex-col items-center mt-32 w-full max-w-6xl mx-auto">

        {/* Headline */}
        <h1 className="max-w-4xl text-center text-[3.5rem] leading-[1.05] sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase" style={{ textShadow: '0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(99,102,241,0.5)' }}>
          Build your dream
          <br />
          resume in seconds
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl text-center text-lg text-zinc-300 sm:text-xl font-normal mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Stand out with an AI-powered, ATS-optimized resume. Start building for free.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 w-full relative z-20">
          <Link
            href="/templates"
            className="group relative flex h-14 w-full max-w-[240px] items-center justify-center rounded-xl bg-indigo-600/80 px-8 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_40px_-5px_rgba(99,102,241,0.8)] transition-all hover:scale-105 hover:bg-indigo-500 hover:shadow-[0_0_60px_-5px_rgba(99,102,241,1)] backdrop-blur-md overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80 shadow-[0_-5px_20px_rgba(255,255,255,1)]" />
            <div className="absolute inset-0 rounded-xl border border-white/50" />
            <span className="relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Start Building</span>
          </Link>

          <a
            href="/dashboard"
            className="group relative flex h-14 w-full max-w-[240px] items-center justify-center rounded-xl bg-white/10 px-8 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-white/20 hover:scale-105 backdrop-blur-md border border-white/30 shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)]"
          >
            {/* Soft inner top light */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <span className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">View My Resumes</span>
          </a>
        </div>

        {/* Features Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16 text-xs font-semibold tracking-widest text-[#9CA3AF] uppercase mb-16">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-indigo-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            Lightning Fast
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-indigo-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v4l3 3" /></svg>
            ATS-Optimized
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-indigo-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            AI-Powered Writing
          </div>
        </div>

      </div>

      <ResumePreview />

      {/* Decorative Star in bottom right */}
      <div className="absolute bottom-8 right-8 text-white/20 hidden md:block z-0">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
        </svg>
      </div>

    </div>
  );
}
