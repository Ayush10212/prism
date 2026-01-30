"use client"

import { useState } from "react"

export default function DecisionForm({ onSubmit }: { onSubmit: (data: any) => void }) {
    const [formData, setFormData] = useState({
        asset: "",
        action: "BUY",
        reasoning: "",
        timeframe: "MID_TERM",
        conviction: 5
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 premium-card p-10 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500">ASSET_IDENTIFIER</label>
                    <input 
                        required
                        type="text" 
                        placeholder="e.g. BTC/USD, NVDA, Project X"
                        className="w-full p-4 text-lg font-bold"
                        value={formData.asset}
                        onChange={(e) => setFormData({...formData, asset: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500">INTENDED_ACTION</label>
                    <select 
                        className="w-full p-4 bg-[#0a0a0a] border border-[#222222] text-lg font-bold"
                        value={formData.action}
                        onChange={(e) => setFormData({...formData, action: e.target.value})}
                    >
                        <option value="BUY">BUY / ACCUMULATE</option>
                        <option value="SELL">SELL / REDUCE</option>
                        <option value="EXIT">FULL EXIT</option>
                        <option value="HOLD">HOLD / MONITOR</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500">LOGICAL_REASONING (FORCED_ARTICULATION)</label>
                <textarea 
                    required
                    rows={6}
                    placeholder="Decompose your assumptions. Why now? What is the invalidation trigger?"
                    className="w-full p-4 text-sm leading-relaxed"
                    value={formData.reasoning}
                    onChange={(e) => setFormData({...formData, reasoning: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500">TIME_HORIZON</label>
                    <select 
                        className="w-full p-4 bg-[#0a0a0a] border border-[#222222]"
                        value={formData.timeframe}
                        onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                    >
                        <option value="SCALP">SCALP (MINUTES/HOURS)</option>
                        <option value="SWING">SWING (DAYS/WEEKS)</option>
                        <option value="MID_TERM">MID-TERM (MONTHS)</option>
                        <option value="LONG_TERM">LONG-TERM (YEARS)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500">CONVICTION_LEVEL ({formData.conviction}/10)</label>
                    <input 
                        type="range" min="1" max="10" 
                        className="w-full accent-white"
                        value={formData.conviction}
                        onChange={(e) => setFormData({...formData, conviction: parseInt(e.target.value)})}
                    />
                </div>
            </div>

            <button type="submit" className="w-full py-6 bg-white text-black font-black text-xl hover:bg-slate-200 transition-all uppercase tracking-widest">
                EXECUTE CRITICAL ANALYSIS
            </button>
        </form>
    )
}
