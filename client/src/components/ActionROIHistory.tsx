import { motion, AnimatePresence } from "framer-motion";
import { History, TrendingDown, ShieldCheck, ArrowUpRight, IndianRupee } from "lucide-react";

interface ActionLog {
    id: string;
    title: string;
    timestamp: string;
    impact: string;
    roi: string;
    stressReduced: number;
}

interface ActionROIHistoryProps {
    logs: ActionLog[];
}

export default function ActionROIHistory({ logs }: ActionROIHistoryProps) {
    if (logs.length === 0) return null;

    return (
        <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <History className="w-5 h-5 text-white/40" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Action History & ROI Tracker</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">{log.title}</h4>
                                        <p className="text-[10px] text-white/40">{log.timestamp}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold">
                                    <TrendingDown className="w-3 h-3" />
                                    -{log.stressReduced}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Savings/ROI</span>
                                    <span className="text-sm font-black text-emerald-400 flex items-center gap-0.5">
                                        <IndianRupee className="w-3 h-3" />
                                        {log.roi}
                                    </span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Impact</span>
                                    <span className="text-[10px] font-bold text-white/80">{log.impact}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
