"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Shield, Cpu, ArrowRight, GitBranch } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 uppercase-none">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-xl tracking-tight">DevPulse</span>
        </div>
        <Link href="/dashboard" className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all font-bold uppercase tracking-widest text-[10px]">
          Enter Dashboard
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-32 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]"
        >
          Automate your code reviews <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 font-black">with AI Intelligence.</span>
        </motion.h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
          DevPulse uses Llama 3.3 to provide high-quality technical reviews for every Pull Request. Ship cleaner and more secure code.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/dashboard" className="group bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2">
            Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  )
}