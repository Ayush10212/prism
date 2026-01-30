"use client"

import Link from "next/link"
import React from "react"

export default function LandingPage({ onStart }: { onStart: () => void }) {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden cinematic-grid scanline">
            {/* Ambient Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-[0.02] blur-[120px] rounded-full pointing-events-none"></div>

            <div className="relative z-10 text-center space-y-8 p-4">
                {/* Animated Title */}
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                        PRISM
                    </h1>
                    <p className="text-xl md:text-2xl font-mono text-slate-400 tracking-widest uppercase">
                        Decision Intelligence
                    </p>
                </div>

                {/* Feature List */}
                <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-slate-500 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    <span className="bg-white/5 px-3 py-1 rounded border border-white/10">BEHAVIORAL_ANALYSIS</span>
                    <span className="bg-white/5 px-3 py-1 rounded border border-white/10">RISK_DETECTION</span>
                    <span className="bg-white/5 px-3 py-1 rounded border border-white/10">SCENARIO_SIMULATION</span>
                </div>

                {/* Call to Action */}
                <div className="pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                    <button
                        onClick={onStart}
                        className="group relative inline-flex items-center justify-center px-12 py-4 font-bold text-white transition-all duration-200 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50"
                    >
                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                        <span className="relative uppercase tracking-widest text-sm">Initialize System &rarr;</span>
                    </button>
                    <p className="mt-4 text-xs font-mono text-slate-600">
                        INCLUDES 5 FREE INTELLIGENCE REPORTS
                    </p>
                </div>
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-8 text-center w-full text-[10px] font-mono text-slate-700 uppercase tracking-widest animate-in fade-in duration-1000 delay-700">
                Prism System v1.0 • Secure Connection • Neural Engine Standby
            </div>
        </div>
    )
}
