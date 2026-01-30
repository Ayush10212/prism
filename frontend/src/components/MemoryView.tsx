"use client"

import { useEffect, useState } from "react"

export default function MemoryView() {
    const [history, setHistory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch("/api/history")
                if (!response.ok) throw new Error("Network response was not ok")
                const data = await response.json()
                if (Array.isArray(data)) {
                    setHistory(data)
                } else {
                    console.warn("Received non-array history data:", data)
                    setHistory([])
                }
            } catch (e) {
                console.error("Failed to fetch history", e)
                setHistory([])
            } finally {
                setIsLoading(false)
            }
        }
        fetchHistory()
    }, [])

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight uppercase font-mono">Decision Memory</h1>
                <p className="text-slate-500 italic">Retrieved {history.length} historical interaction layers.</p>
            </section>

            {isLoading ? (
                <div className="premium-card p-20 text-center animate-pulse">
                    <p className="font-mono text-sm text-slate-500 uppercase">Indexing_Neural_Threads...</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {(history || []).map((item, idx) => (
                        <div key={idx} className="premium-card p-6 rounded-lg flex justify-between items-center border-l-4 border-l-white/20 hover:border-l-white transition-all">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-black px-2 py-0.5 rounded ${item.action === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                        {item.action}
                                    </span>
                                    <h3 className="text-lg font-bold">{item.asset}</h3>
                                </div>
                                <p className="text-sm text-slate-400 line-clamp-1 max-w-2xl">{item.reasoning}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-mono text-slate-500 block">{new Date(item.created_at).toLocaleDateString()}</span>
                                <span className="text-xs font-mono font-bold text-white">CONVICTION: {item.conviction_level}/10</span>
                            </div>
                        </div>
                    ))}
                    {history.length === 0 && (
                        <div className="p-20 text-center border border-dashed border-white/10 rounded-lg text-slate-600 italic">
                            No historical decisions found. Interaction memory is vacuum.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
