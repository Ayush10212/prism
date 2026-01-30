"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Upload, FileImage, ShieldAlert, Cpu } from "lucide-react";

export default function ResearchView() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [analysis, setAnalysis] = useState<any>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const handleFile = (selectedFile: File) => {
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile)
            setPreview(URL.createObjectURL(selectedFile))
            setAnalysis(null)
        }
    }

    const onDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
        else if (e.type === "dragleave") setDragActive(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const analyzeChart = async () => {
        if (!file) return
        setIsAnalyzing(true)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch("/api/research/upload", {
                method: "POST",
                body: formData
            })
            const result = await response.json()
            setAnalysis(result.analysis)
        } catch (e) {
            console.error("Analysis failed", e)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight uppercase font-mono">Vision Research</h1>
                <p className="text-slate-500 italic">Deconstructing chart market structure via visual intelligence.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                    <div
                        onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop}
                        className={`premium-card p-10 rounded-2xl border-dashed border-2 flex flex-col items-center justify-center min-h-[400px] transition-all duration-300 ${dragActive ? 'border-white bg-white/5' : 'border-white/10'}`}
                    >
                        {preview ? (
                            <div className="relative w-full h-full group">
                                <img src={preview} alt="Preview" className="w-full h-64 object-contain rounded-lg" />
                                <button
                                    onClick={() => { setPreview(null); setFile(null); setAnalysis(null) }}
                                    className="absolute top-2 right-2 bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    &times;
                                </button>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-1 ring-white/10">
                                    <Upload className="text-slate-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold uppercase font-mono">Drag & Drop Chart Image</p>
                                    <p className="text-[10px] text-slate-500 font-mono mt-1">PNG, JPG, WEBP accepted</p>
                                </div>
                                <label className="cursor-pointer bg-white text-black px-6 py-2 text-xs font-bold uppercase hover:bg-slate-200 transition-colors inline-block">
                                    Browse Files
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                                </label>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={analyzeChart}
                        disabled={!file || isAnalyzing}
                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                SCANN_IN_PROGRESS
                            </>
                        ) : "Execute Vision Analysis"}
                    </button>
                </div>

                {/* Results Section */}
                <div className="space-y-8">
                    {!analysis && !isAnalyzing ? (
                        <div className="premium-card p-20 rounded-2xl border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center opacity-40">
                            <FileImage size={48} className="text-slate-600 mb-6" />
                            <p className="text-sm font-mono text-slate-500 uppercase tracking-widest italic">// WAITING_FOR_INPUT_FEED</p>
                        </div>
                    ) : isAnalyzing ? (
                        <div className="premium-card p-20 rounded-2xl border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center">
                            <div className="relative w-20 h-20 mb-8">
                                <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
                                <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin"></div>
                                <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" size={24} />
                            </div>
                            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">Deconstruction_Pixels...</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                            <div className="premium-card p-8 rounded-2xl space-y-6">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Probability_Map</label>
                                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-white italic">Vision_Confidence: {analysis.confidence_score}%</span>
                                </div>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analysis.scenarios} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" tick={{ fill: '#666', fontSize: 10 }} width={40} />
                                            <Tooltip
                                                cursor={{ fill: 'white', fillOpacity: 0.05 }}
                                                contentStyle={{ backgroundColor: '#111', border: '1px solid #222', fontSize: '10px' }}
                                            />
                                            <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
                                                {analysis.scenarios.map((entry: any, index: number) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.name === 'BULL' ? '#22c55e' : entry.name === 'BEAR' ? '#ef4444' : '#64748b'}
                                                        fillOpacity={0.6}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {analysis.scenarios.map((s: any, i: number) => (
                                    <div key={i} className={`premium-card p-5 rounded-xl space-y-2 border-l-4 ${s.name === 'BULL' ? 'border-l-green-500' : s.name === 'BEAR' ? 'border-l-red-500' : 'border-l-slate-500'}`}>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black uppercase font-mono tracking-tighter">{s.name}_CASE</span>
                                            <span className="text-xs font-bold font-mono">{s.probability}%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 italic leading-relaxed">{s.logic}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="premium-card p-6 rounded-xl border-dashed border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-2 mb-4 text-xs font-mono text-slate-500 uppercase">
                                    <ShieldAlert size={12} />
                                    <span>Structural_Observations</span>
                                </div>
                                <div className="space-y-4">
                                    {(analysis.structural_logic || []).map((logic: any, idx: number) => (
                                        <div key={idx} className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{logic.title}</p>
                                            <p className="text-xs text-slate-400 leading-relaxed font-mono">{logic.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
