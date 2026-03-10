import { motion } from "framer-motion";
import {
    ShoppingBag,
    CreditCard,
    Slack,
    MessageSquare,
    BookOpen,
    CheckCircle2,
    Plus,
    ArrowRight,
    ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const integrations = [
    { id: "shopify", name: "Shopify", icon: ShoppingBag, color: "text-emerald-400", status: "Connected", desc: "Real-time inventory & sales sync" },
    { id: "stripe", name: "Stripe", icon: CreditCard, color: "text-blue-400", status: "Connected", desc: "Revenue velocity & churn tracking" },
    { id: "slack", name: "Slack", icon: Slack, color: "text-purple-400", status: "Connected", desc: "War Room notifications & alerts" },
    { id: "zendesk", name: "Zendesk", icon: MessageSquare, color: "text-amber-400", status: "Connected", desc: "Customer sentiment & ticket flow" },
    { id: "quickbooks", name: "QuickBooks", icon: BookOpen, color: "text-green-400", status: "Available", desc: "Runway & burn rate analysis" },
];

export default function Integrations() {
    const [slackEnabled, setSlackEnabled] = useState(true);
    const { toast } = useToast();

    const handleSlackToggle = (checked: boolean) => {
        setSlackEnabled(checked);
        toast({
            title: checked ? "Slack Webhook Active" : "Slack Webhook Disabled",
            description: checked ? "System will now notify #war-room when Stress > 70." : "Alert notifications paused.",
        });
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-8 py-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight text-white">Ecosystem Hub</h1>
                <p className="text-white/40 max-w-2xl text-lg">
                    OpsPulse acts as the central nervous system for your entire commerce stack.
                    Manage your bi-directional syncs and automated workflow triggers.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((app, i) => (
                    <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`glass-panel p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden`}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${app.color}`}>
                                <app.icon className="w-8 h-8" />
                            </div>
                            {app.status === "Connected" ? (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Connected</span>
                                </div>
                            ) : (
                                <button className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <Plus className="w-3 h-3 text-white/40" />
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Connect</span>
                                </button>
                            )}
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
                            <p className="text-sm text-white/40 leading-relaxed">{app.desc}</p>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <button className="text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center gap-2">
                                Configure <ArrowRight className="w-3 h-3" />
                            </button>
                            {app.id === "slack" && (
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-white/20 uppercase">Auto-Alerts</span>
                                    <Switch checked={slackEnabled} onCheckedChange={handleSlackToggle} />
                                </div>
                            )}
                        </div>

                        {/* Background glow effect on hover */}
                        <div className={`absolute -bottom-12 -right-12 w-32 h-32 blur-[80px] rounded-full transition-opacity opacity-0 group-hover:opacity-20 ${app.color.replace('text-', 'bg-')}`} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-8 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6"
            >
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-primary/20 rounded-2xl">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white">Security & Encryption</h4>
                        <p className="text-sm text-white/40 max-w-md">All integration data is encrypted using AES-256 at rest and TLS 1.3 in transit. Your credentials never touch our database.</p>
                    </div>
                </div>
                <button className="px-6 py-3 bg-white text-black font-black rounded-2xl hover:bg-white/90 transition-all text-sm uppercase tracking-tighter">
                    View Security Audit
                </button>
            </motion.div>
        </div>
    );
}
