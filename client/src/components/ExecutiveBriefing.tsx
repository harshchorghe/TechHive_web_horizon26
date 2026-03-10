import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import Lottie from "lottie-react";

// Standard scanning/searching animation
const scannerAnimation = {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    nm: "Scanner",
    ddd: 0,
    assets: [],
    layers: [
        {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Line",
            sr: 1,
            ks: {
                o: { a: 1, k: [{ t: 0, s: [0] }, { t: 10, s: [100] }, { t: 50, s: [100] }, { t: 60, s: [0] }] },
                r: { a: 0, k: 0 },
                p: { a: 1, k: [{ t: 0, s: [50, 0] }, { t: 60, s: [50, 100] }] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] }
            },
            shapes: [
                {
                    ty: "gr",
                    it: [
                        { ty: "rc", s: { a: 0, k: [100, 2] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, nm: "Rect" },
                        { ty: "fl", c: { a: 0, k: [0.23, 0.51, 0.96, 1] }, o: { a: 0, k: 100 }, nm: "Fill" },
                        { ty: "tr", p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, s: { a: 0, k: [100, 100] }, a: { a: 0, k: [0, 0] } }
                    ]
                }
            ]
        }
    ]
};

interface ExecutiveBriefingProps {
    data: any;
    rawState: any;
}

export default function ExecutiveBriefing({ data, rawState }: ExecutiveBriefingProps) {
    const narrative = useMemo(() => {
        if (!rawState) return "Initializing system core...";

        const stress = data.stressScore;
        const stressStatus = stress < 30 ? "Low Stress" : stress < 60 ? "Moderate Pressure" : "High Alert";
        const revenue = rawState.sales?.revenue_per_hour?.toFixed(0) ?? 0;
        const runway = data.runwayDays;

        // Find a notable SKU or event
        const topSku = rawState.inventory?.skus?.sort((a: any, b: any) => b.velocity_per_hour - a.velocity_per_hour)[0];
        const topAlert = rawState.alerts?.[0];

        let story = `Good morning. Your business is at ${stressStatus} (${stress}). `;

        if (topSku && topSku.velocity_per_hour > 5) {
            story += `We've detected a significant surge in ${topSku.sku} sales (${topSku.velocity_per_hour} units/hr). `;
            if (topSku.stock < topSku.reorder_point * 2) {
                story += `At this rate, you will stock out within ${Math.round(topSku.stock / topSku.velocity_per_hour)} hours. `;
            }
        }

        if (topAlert) {
            story += `Top priority: ${topAlert.title}. ${topAlert.message} `;
        }

        if (stress > 50) {
            story += `I've prepared a mitigation playbook for your approval to protect your ${runway}-day runway.`;
        } else {
            story += `Operations are stable. Revenue velocity is holding at ₹${revenue}/hr.`;
        }

        return story;
    }, [data, rawState]);

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-panel p-6 rounded-2xl border-primary/20 bg-primary/5 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[100px] -mr-16 -mt-16" />
            <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80">AI Executive Summary</h2>
                    </div>

                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-white/90 max-w-4xl tracking-tight italic">
                        "{narrative}"
                    </p>

                    <div className="flex flex-wrap gap-4 mt-6 border-t border-white/5 pt-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-400">Growth Mode Active</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold text-blue-400">All Nodes Connected</span>
                        </div>
                        {data.stressScore > 40 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                                <AlertCircle className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-bold text-amber-400">Action Required</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-48 h-32 flex-shrink-0 relative">
                    <Lottie
                        animationData={scannerAnimation}
                        loop={true}
                        className="w-full h-full opacity-50 contrast-[200%] hue-rotate-180"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-[10px] font-mono text-primary/40 text-center leading-none mt-2">
                            SYSTEM<br />SCANNING
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
