"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

export default function PricingView() {
    const [currency, setCurrency] = useState<"USD" | "INR">("USD")
    const { user, login } = useAuth()
    const [isProcessing, setIsProcessing] = useState(false)

    const handleSubscribe = async () => {
        if (!user) return alert("System identity required. Please login first.")
        setIsProcessing(true)

        try {
            const response = await fetch("/api/payments/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    amount: currency === "USD" ? 49.00 : 3999.00,
                    currency: currency,
                    method: currency === "USD" ? "STRIPE" : "RAZORPAY"
                })
            })
            const data = await response.json()
            if (response.ok) {
                // Update local user state
                const updatedUser = { ...user, subscription_status: "PREMIUM", currency_pref: currency }
                login(updatedUser, localStorage.getItem("prism_token") || "")
                alert("Subscription successful. Premium intelligence unlocked.")
            }
        } catch (err) {
            console.error("Payment failed", err)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter uppercase font-mono italic">Expand Intelligence</h1>
                <p className="text-slate-500 max-w-xl mx-auto">
                    Choose your capital region to unlock high-fidelity behavioral analysis and multi-layered market logic.
                </p>
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => setCurrency("USD")}
                        className={`px-4 py-1 text-xs font-mono rounded ${currency === 'USD' ? 'bg-white text-black' : 'border border-white/20 text-slate-500'}`}
                    >
                        USD_GLOBAL
                    </button>
                    <button
                        onClick={() => setCurrency("INR")}
                        className={`px-4 py-1 text-xs font-mono rounded ${currency === 'INR' ? 'bg-white text-black' : 'border border-white/20 text-slate-500'}`}
                    >
                        INR_INDIA
                    </button>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="premium-card p-10 rounded-2xl space-y-6 opacity-50 relative pointer-events-none">
                    <div className="absolute inset-0 flex items-center justify-center rotate-[-10deg]">
                        <span className="bg-slate-500 text-black px-4 py-1 font-black uppercase tracking-widest text-xs">Standard</span>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold font-mono">FREEMIUM</h3>
                        <p className="text-3xl font-black">$0 / ₹0</p>
                    </div>
                    <ul className="space-y-3 text-xs text-slate-400 font-mono">
                        <li>- Basic Decision Analysis</li>
                        <li>- 5 Saved Memories</li>
                        <li>- Standard UI</li>
                    </ul>
                </div>

                <div className="premium-card p-10 rounded-2xl space-y-6 border-white/40 ring-2 ring-white/10 relative">
                    <div className="absolute top-4 right-4 animate-pulse">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold font-mono">PREMIUM_LAYER</h3>
                        <p className="text-3xl font-black">
                            {currency === 'USD' ? '$49' : '₹3,999'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">PER_YEAR_ACCESS</p>
                    </div>
                    <ul className="space-y-3 text-xs text-slate-300 font-mono">
                        <li className="flex gap-2"><span>&#10003;</span> Deep Behavioral Profiling</li>
                        <li className="flex gap-2"><span>&#10003;</span> Infinite Decision Memory</li>
                        <li className="flex gap-2"><span>&#10003;</span> Market Research Insights</li>
                        <li className="flex gap-2"><span>&#10003;</span> Multi-currency Logic</li>
                    </ul>
                    <button
                        onClick={handleSubscribe}
                        disabled={isProcessing || user?.subscription_status === 'PREMIUM'}
                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50"
                    >
                        {isProcessing ? "PROCESSING..." : user?.subscription_status === 'PREMIUM' ? "ALREADY_ACTIVE" : "INITIALIZE_PAYMENT"}
                    </button>
                    <p className="text-[9px] text-center text-slate-600 font-mono uppercase">Secure Checkout via {currency === 'USD' ? 'Stripe' : 'Razorpay'}</p>
                </div>
            </div>
        </div>
    )
}
