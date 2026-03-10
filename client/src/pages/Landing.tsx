import { motion } from "framer-motion";
import { ArrowRight, ShieldAlert, Sparkles, Activity, Layers, Bot, Zap, Globe } from "lucide-react";
import { Link } from "wouter";
import Lottie from "lottie-react";

const glowAnimation = {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    nm: "Glow",
    ddd: 0,
    assets: [],
    layers: [
        {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Circle",
            sr: 1,
            ks: {
                o: { a: 1, k: [{ t: 0, s: [0] }, { t: 30, s: [50] }, { t: 60, s: [0] }] },
                r: { a: 0, k: 0 },
                p: { a: 0, k: [50, 50] },
                a: { a: 0, k: [0, 0] },
                s: { a: 1, k: [{ t: 0, s: [50, 50] }, { t: 60, s: [150, 150] }] }
            },
            shapes: [
                {
                    ty: "gr",
                    it: [
                        { ty: "el", s: { a: 0, k: [100, 100] }, p: { a: 0, k: [0, 0] }, nm: "Ellipse Path" },
                        { ty: "st", c: { a: 0, k: [0.23, 0.51, 0.96, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2 }, nm: "Stroke" }
                    ]
                }
            ]
        }
    ]
};

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-primary/30">

            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 py-6 md:px-12 relative z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <div className="w-4 h-4 rounded-sm bg-primary" />
                    </div>
                    <span className="font-bold text-xl tracking-tighter">OpsPulse</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
                    <a href="#features" className="hover:text-white transition-colors">Platform</a>
                    <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/signin" className="hidden md:block text-sm font-medium text-white/80 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link href="/signup">
                        <button className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center gap-2">
                            Launch Platform <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col relative">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 backdrop-blur-md"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-primary/90 tracking-widest uppercase">OpsPulse Core Engine 4.0 Live</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter mb-6 max-w-5xl leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40"
                    >
                        The Nervous System for Modern Operations.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg md:text-2xl text-white/50 max-w-3xl mb-12 font-medium leading-relaxed"
                    >
                        Anticipate bottlenecks before they happen. OpsPulse uses predictive AI to turn operational chaos into orchestrated symphony.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <Link href="/signin">
                            <button className="px-8 py-4 rounded-full bg-white text-black text-lg font-bold hover:bg-white/90 transition-all flex items-center gap-3">
                                <Activity className="w-5 h-5" /> Enter War Room
                            </button>
                        </Link>
                        <Link href="/signup">
                            <button className="px-8 py-4 rounded-full border border-white/10 bg-white/5 text-white text-lg font-bold hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-md">
                                <Bot className="w-5 h-5" /> Ask AI Analyst
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Dash Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative max-w-6xl mx-auto w-full px-6 z-20 pb-20"
                >
                    <div className="rounded-2xl border border-white/10 bg-[#0a0a0c]/80 backdrop-blur-xl shadow-2xl overflow-hidden p-2">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none z-10" />
                        <div className="h-[400px] w-full rounded-xl border border-white/5 bg-[#050505] relative overflow-hidden flex flex-col">
                            {/* Mock Dashboard Header */}
                            <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/[0.02]">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                </div>
                                <div className="text-xs font-mono text-white/40">opspulse &gt; dashboard</div>
                            </div>
                            <div className="flex-1 p-6 flex gap-6">
                                <div className="w-1/4 flex flex-col gap-4">
                                    <div className="h-24 rounded-lg bg-white/5 border border-white/5" />
                                    <div className="h-24 rounded-lg bg-white/5 border border-white/5" />
                                    <div className="flex-1 rounded-lg bg-primary/10 border border-primary/20" />
                                </div>
                                <div className="flex-1 flex flex-col gap-4">
                                    <div className="h-32 rounded-lg bg-white/5 border border-white/5 flex items-center p-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-full mr-4" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-2 bg-white/20 w-1/3 rounded" />
                                            <div className="h-2 bg-white/10 w-2/3 rounded" />
                                        </div>
                                    </div>
                                    <div className="flex-1 rounded-lg bg-white/5 border border-white/5 relative overflow-hidden flex items-center justify-center">
                                        <Lottie
                                            animationData={glowAnimation}
                                            loop={true}
                                            className="w-64 h-64 opacity-20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div id="features" className="max-w-7xl mx-auto px-6 py-24 w-full border-t border-white/5">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Enterprise-grade capabilities</h2>
                        <p className="text-white/50 max-w-2xl mx-auto text-lg">Everything you need to scale operations beautifully.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                            <Layers className="w-10 h-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold mb-3">Predictive Engine</h3>
                            <p className="text-white/50 leading-relaxed">Forecast supply chain disruptions before they cascade across your channels.</p>
                        </div>
                        <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                            <Zap className="w-10 h-10 text-amber-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3">War Room Mode</h3>
                            <p className="text-white/50 leading-relaxed">Instantly enter a focused state with high-contrast tactical data when stress spikes.</p>
                        </div>
                        <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                            <Bot className="w-10 h-10 text-emerald-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Autonomous AI</h3>
                            <p className="text-white/50 leading-relaxed">Turn passive metrics into actionable playbooks triggered by dynamic thresholds.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-white/5 py-12 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
                                <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                            </div>
                            <span className="font-bold tracking-tighter text-white/80">OpsPulse</span>
                        </div>
                        <div className="text-sm text-white/30">
                            © 2026 OpsPulse Systems. All rights reserved.
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
