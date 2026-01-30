"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useAuth()
    const [error, setError] = useState("")

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register"
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json()
            if (response.ok) {
                login(data.user, data.access_token)
                onClose()
            } else {
                setError(data.detail || "Authentication failed")
            }
        } catch (err) {
            setError("Network error. Is the backend running?")
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="premium-card w-full max-w-md p-10 rounded-2xl space-y-8 animate-in zoom-in-95 duration-200 relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white">&times;</button>
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black tracking-widest uppercase font-mono">
                        {isLogin ? "System Access" : "Identity Registry"}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono italic">// SECURE_PROTOCOL_V.4.2</p>
                </div>

                {error && <p className="bg-red-500/10 border border-red-500/20 p-3 rounded text-red-500 text-xs text-center italic">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Input_Email</label>
                        <input
                            required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 bg-black border border-white/10 rounded font-mono text-sm focus:border-white transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Input_Password</label>
                        <input
                            required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-black border border-white/10 rounded font-mono text-sm focus:border-white transition-all"
                        />
                    </div>
                    <button type="submit" className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                        {isLogin ? "Initialize Session" : "Create Profile"}
                    </button>
                </form>

                <p className="text-center text-[10px] font-mono text-slate-500">
                    {isLogin ? "New analyst?" : "Existing profile?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-white underline hover:no-underline">
                        {isLogin ? "REGISTER_NOW" : "LOGIN_NOW"}
                    </button>
                </p>
            </div>
        </div>
    )
}
