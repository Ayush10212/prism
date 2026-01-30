"use client"

import DecisionForm from "@/components/DecisionForm"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

export default function Home() {
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { user } = useAuth()

  const handleAnalysis = async (data: any) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          user_id: user?.id || null
        })
      })
      const result = await response.json()
      setAnalysis(result)
    } catch (e) {
      console.error("Analysis failed", e)
      setAnalysis({
        summary: `Failsafe analysis for ${data.asset}.`,
        biases: ["Backend connection required for full behavioral analysis."],
        risks: ["System running in standalone mode."],
        scenarios: { bull: "N/A", base: "N/A", bear: "N/A" },
        score: 50,
        prompt: "Why did the connection fail?"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">System Status: <span className="text-green-500">OPERATIONAL</span></h1>
        <p className="text-slate-400 max-w-2xl text-lg">
          {user ? `Analyzing behavioral patterns for ${user.email}.` : "Analyzing behavioral patterns across historical interactions."}
          Intelligence engine is primed for high-stakes decision analysis.
        </p>
      </section>

      {!analysis && !isAnalyzing ? (
        <DecisionForm onSubmit={handleAnalysis} />
      ) : (
        <div className="space-y-8 animate-in fade-in duration-700">
          {isAnalyzing ? (
            <div className="premium-card p-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-mono text-sm text-slate-500">DECOMPOSING_ASSUMPTIONS...</p>
            </div>
          ) : (
            <AnalysisResult analysis={analysis} onReset={() => setAnalysis(null)} />
          )}
        </div>
      )}
    </div>
  )
}

import { ScoreChart, ScenarioChart } from "@/components/AnalysisCharts"

function AnalysisResult({ analysis, onReset }: { analysis: any, onReset: () => void }) {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold uppercase tracking-widest font-mono">Analysis Report</h2>
        <button onClick={onReset} className="text-xs font-mono text-slate-500 hover:text-white underline">NEW_ANALYSIS</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="premium-card p-8 rounded-xl lg:col-span-1 space-y-6">
          <label className="text-xs font-mono text-slate-500 block">INTEL_OVERVIEW (VISUAL)</label>
          <ScoreChart score={analysis.score} />
          <div className="pt-4 border-t border-white/5">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-mono text-slate-500 uppercase italic">Decision Quality Score</span>
              <span className="text-3xl font-black font-mono">{analysis.score}</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-1000" style={{ width: `${analysis.score}%` }}></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="premium-card p-8 rounded-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-mono text-slate-500 block mb-2">DECISION_SUMMARY</label>
                  <p className="text-xl font-medium">{analysis.summary}</p>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-500 block mb-2">PSYCHOLOGICAL_ANALYSIS</label>
                  {analysis.score < 70 ? (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded text-red-400 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-black uppercase tracking-widest text-red-500">Bias Alert</span>
                      </div>
                      <p className="text-sm italic font-medium">{analysis?.biases?.[0] || "No critical bias detected."}</p>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 p-4 rounded text-slate-400 text-sm italic">
                      {analysis?.biases?.[0] || "No critical bias detected."}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-mono text-slate-500 block mb-2">SCENARIO_PROBABILITY (VISUAL)</label>
                  <ScenarioChart scenarios={analysis.scenarios} />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-500 block mb-2">HIDDEN_RISKS</label>
                  <ul className="list-disc list-inside text-slate-300 text-sm space-y-2">
                    {(analysis?.risks || []).map((r: string, i: number) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card p-8 rounded-xl bg-white/[0.02] border-white/10">
            <label className="text-xs font-mono text-slate-500 block mb-4">REFLECTION_PROMPT</label>
            <p className="text-2xl font-bold text-white italic leading-relaxed">"{analysis.prompt}"</p>
          </div>
        </div>
      </div>
    </div>
  )
}
