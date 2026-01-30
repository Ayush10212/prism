"use client"

import React, { useState } from "react";
import MemoryView from "@/components/MemoryView";
import ResearchView from "@/components/ResearchView";
import PricingView from "@/components/PricingView";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

import LandingPage from "@/components/LandingPage";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState("DASHBOARD");
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const { user, logout, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
    }

    if (!isAuthenticated) {
        return (
            <>
                <LandingPage onStart={() => setIsAuthOpen(true)} />
                <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            </>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
            case "DASHBOARD": return children;
            case "MEMORY": return <MemoryView />;
            case "RESEARCH": return <ResearchView />;
            case "UPGRADE": return <PricingView />;
            default: return children;
        }
    };

    return (
        <>
            <header className="h-16 border-b border-border flex items-center px-8 glass sticky top-0 z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("DASHBOARD")}>
                    <div className="w-6 h-6 bg-white rounded-sm rotate-45"></div>
                    <span className="text-xl font-bold tracking-tighter uppercase font-mono">PRISM</span>
                </div>
                <nav className="ml-auto flex gap-6 text-sm font-medium items-center text-slate-500">
                    <button
                        onClick={() => setActiveTab("DASHBOARD")}
                        className={`${activeTab === 'DASHBOARD' ? 'text-white font-bold' : ''} hover:text-white transition-colors uppercase font-mono`}
                    >
                        DASHBOARD
                    </button>
                    <button
                        onClick={() => setActiveTab("MEMORY")}
                        className={`${activeTab === 'MEMORY' ? 'text-white font-bold' : ''} hover:text-white transition-colors uppercase font-mono`}
                    >
                        MEMORY
                    </button>
                    <button
                        onClick={() => setActiveTab("RESEARCH")}
                        className={`${activeTab === 'RESEARCH' ? 'text-white font-bold' : ''} hover:text-white transition-colors uppercase font-mono`}
                    >
                        RESEARCH
                    </button>
                    <button
                        onClick={() => setActiveTab("UPGRADE")}
                        className={`${activeTab === 'UPGRADE' ? 'text-yellow-500 font-bold' : ''} hover:text-yellow-400 transition-colors uppercase font-mono`}
                    >
                        UPGRADE
                    </button>

                    <div className="h-4 w-[1px] bg-white/10 mx-2"></div>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{user?.subscription_status}</span>
                            <button onClick={logout} className="text-xs font-mono text-white hover:underline uppercase">LOGOUT</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsAuthOpen(true)} className="bg-white text-black px-4 py-1 text-xs font-bold uppercase hover:bg-slate-200 transition-colors">LOGIN</button>
                    )}
                </nav>
            </header>
            <main className="flex-1 overflow-auto p-8">
                {renderContent()}
            </main>
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}
