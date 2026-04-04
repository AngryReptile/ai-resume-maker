'use client';

import { FileText, Sparkles, Zap, Shield, Target, MousePointer2, ChevronRight, Plus, LayoutGrid, ArrowRight, Bot, Cpu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useResumeStore } from '@/store/useResumeStore';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
    className="group relative p-6 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.03] transition-all duration-500 hover:border-white/10 hover:translate-y-[-8px] overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl ring-1 ring-white/5">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2 font-display">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed font-medium group-hover:text-zinc-400 transition-colors">{description}</p>
  </motion.div>
);

const ResumePreview = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95, y: 40 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    viewport={{ once: true }}
    className="relative mt-8 mb-12 flex w-full max-w-4xl flex-col items-center justify-start rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-[40px] shadow-[0_0_100px_-20px_rgba(99,102,241,0.2)] group"
  >
    {/* Refraction effect background */}
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 rounded-3xl pointer-events-none" />
    
    {/* Floating HUD elements */}
    <motion.div 
      animate={{ y: [0, -10, 0], rotate: [0, -1, 0] }} 
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-10 -left-10 p-6 rounded-2xl bg-[#0a0a0f]/90 border border-white/10 backdrop-blur-xl shadow-2xl hidden xl:block z-20"
    >
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="text-indigo-400 h-4 w-4 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">AI Engine</span>
      </div>
      <div className="space-y-2">
        <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: '0%' }} 
            animate={{ width: '100%' }} 
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
            className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" 
          />
        </div>
        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-zinc-600">
           <span>Status</span>
           <span className="text-emerald-500">Active</span>
        </div>
      </div>
    </motion.div>

    <div className="w-full rounded-2xl bg-white p-6 pb-20 shadow-2xl h-[350px] overflow-hidden relative group-hover:scale-[1.005] transition-transform duration-1000">
      {/* High-fidelity Resume Mockup */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-8 mb-10 border-b border-zinc-100 pb-10">
          <div className="h-20 w-20 rounded-2xl bg-zinc-50 overflow-hidden shrink-0 border border-zinc-200 shadow-inner group-hover:rotate-6 transition-transform duration-700">
            <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" width={80} height={80} className="object-cover" />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase mb-2 font-display">Alex Sterling</h2>
            <div className="flex items-center gap-3">
               <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[9px]">Product Manager</p>
               <div className="h-1 w-1 rounded-full bg-zinc-300" />
               <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[8px]">New York, NY</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">
            <section>
                <div className="flex items-center gap-4 mb-6">
                   <div className="h-px w-8 bg-indigo-500" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 font-display">Executive Summary</h3>
                </div>
                <div className="space-y-4">
                  <div className="h-3.5 w-full bg-zinc-50 rounded-full" />
                  <div className="h-3.5 w-[95%] bg-zinc-50 rounded-full" />
                  <div className="h-3.5 w-[90%] bg-zinc-50 rounded-full" />
                </div>
            </section>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white/95 to-transparent z-10" />
    </div>
  </motion.div>
);

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-x-hidden">
      
      {/* High-Fidelity Background Architecture */}
      <div className="fixed inset-0 bg-[#0a0a0f] -z-10">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40 pointer-events-none" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none animate-warp" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[150px] rounded-full pointer-events-none animate-warp-reverse" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none z-0" />
      </div>

      <Navbar />

      <div className="container relative z-10 px-6 flex flex-col items-center py-10 w-full max-w-7xl mx-auto">
        
        {/* Floating Identity Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'anticipate' }}
          className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.02] border border-white/10 backdrop-blur-2xl mb-8 group cursor-default shadow-2xl"
        >
          <div className="relative flex h-2 w-2">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <div className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400/90 group-hover:text-white transition-colors">Beta Version 1.0</span>
        </motion.div>

        {/* Hero Headline with Sophisticated Typography */}
        <div className="relative mb-12 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl text-3xl leading-tight sm:text-5xl md:text-6xl font-black tracking-[-0.05em] text-white uppercase mb-4 font-display"
            >
              Build Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">Resume</span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 h-px w-64 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"
            />
        </div>

        {/* Description / Subheader */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-xl text-center text-zinc-500 text-sm font-medium mb-8 leading-relaxed uppercase tracking-widest opacity-80"
        >
          Create a professional, modern resume in minutes with our AI assistant.
        </motion.p>

        {/* Action Node Deployment */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full relative z-20"
        >
          <Link
            href="/templates"
            className="group relative flex h-14 w-full max-w-[240px] items-center justify-between rounded-2xl bg-white text-black px-8 text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.05] active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-white/40 overflow-hidden font-display"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 via-transparent to-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <span className="relative z-10">Create Resume</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
          </Link>


          <Link
            href="/dashboard"
            className="group relative flex h-14 w-full max-w-[200px] items-center justify-center rounded-2xl bg-white/5 px-8 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10 hover:scale-[1.05] backdrop-blur-[30px] border border-white/10 shadow-2xl font-display"
          >
            <span className="relative z-10 group-hover:text-amber-400 transition-colors">Dashboard</span>
          </Link>
        </motion.div>

        {/* Feature Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-20 px-4">
          <FeatureCard 
            icon={Bot} 
            title="AI Assistant" 
            description="Intelligent writing assistant helps you craft perfect bullet points and summaries."
            delay={0.9}
          />
          <FeatureCard 
            icon={Cpu} 
            title="ATS Calibration" 
            description="Built-in optimization ensures your resume passes through applicant tracking systems."
            delay={1.0}
          />
          <FeatureCard 
            icon={Shield} 
            title="Data Sovereignty" 
            description="Enterprise-grade encryption protecting your legacy across a secure, distributed private cloud."
            delay={1.1}
          />
        </div>

        {/* Template Selection Node */}
        <div className="w-full mb-24 px-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 mb-20"
          >
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">
              <LayoutGrid className="h-3 w-3 text-indigo-400" />
              Aesthetic Blueprints
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter text-center font-display">Select Your <br /> Functional Base.</h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] max-w-md text-center leading-relaxed">
              Choose from our high-fidelity layout engine. <br /> Synthesized for maximum impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { id: 'modern-clean', name: 'Clean', desc: 'Standard Corporate' },
              { id: 'creative', name: 'Studio', desc: 'Marketing & Design' },
              { id: 'tech-minimal', name: 'Minimal', desc: 'Engineering' },
              { id: 'executive', name: 'Executive', desc: 'Leadership' }
            ].map((tpl, i) => (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                onClick={() => {
                  useResumeStore.getState().setTemplateId(tpl.id);
                  window.location.href = '/builder';
                }}
                className="group relative flex flex-col rounded-3xl bg-white/[0.01] border border-white/5 p-6 hover:bg-white/[0.03] hover:border-indigo-500/30 transition-all cursor-pointer overflow-hidden"
              >
                <div className="aspect-[1/1.414] rounded-2xl bg-white/5 border border-white/5 mb-6 overflow-hidden relative shadow-2xl">
                   {/* Simplified visual representation */}
                   <div className="absolute inset-0 p-4 flex flex-col gap-2 scale-90 group-hover:scale-100 transition-transform duration-700">
                      <div className="h-6 w-full bg-white/10 rounded-md" />
                      <div className="h-1.5 w-1/2 bg-white/5 rounded-full" />
                      <div className="h-1.5 w-full bg-white/5 rounded-full mt-4" />
                      <div className="h-1.5 w-full bg-white/5 rounded-full" />
                      <div className="h-32 w-full bg-white/5 rounded-xl mt-4" />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Select Blueprint</span>
                   </div>
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">{tpl.name}</h3>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">{tpl.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-16"
          >
            <Link href="/templates" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-indigo-400 transition-colors">
              View All 11 Modules
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Immersive Preview Section */}
        <div className="w-full flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center gap-6 mb-16"
          >
            <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.6em] text-indigo-500/40">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-indigo-500/30" />
                Live Preview Node
                <div className="h-px w-24 bg-gradient-to-l from-transparent to-indigo-500/30" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter text-center font-display">The High-Fidelity <br /> Standard.</h2>
          </motion.div>
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}
