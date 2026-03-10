import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, MessageSquare, Send, Zap, Lightbulb, TrendingUp, AlertTriangle, ArrowRight, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AiAnalyticsProps {
    isWarRoom: boolean;
    rawState: any;
    data: any;
}

interface Message {
    id: string;
    sender: 'ai' | 'user';
    text: string;
    type?: 'insight' | 'action' | 'learning' | 'normal';
}

export default function AiAnalytics({ isWarRoom, rawState, data }: AiAnalyticsProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "ai",
            text: "Hello. I'm your AI Analyst. I continuously monitor OpsPulse data. How can I help you today? Would you like a breakdown of current anomalies or to explore strategic expansions?",
            type: "normal"
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateAIResponse = (input: string) => {
        // Context-aware simulated responses
        const stress = data?.stressScore || 0;
        const lowerInput = input.toLowerCase();

        setTimeout(() => {
            let responseText = "";
            let responseType: "insight" | "action" | "learning" | "normal" = "normal";

            if (lowerInput.includes("learn") || lowerInput.includes("how") || lowerInput.includes("why")) {
                responseText = "Learning Mode activated: Based on our historical data, when stress levels approach " + stress + "%, it usually indicates a bottleneck in logistics or an unexpected surge in support tickets. To learn more, consider running a simulation on 'Inventory Velocity'.";
                responseType = "learning";
            } else if (lowerInput.includes("issue") || lowerInput.includes("problem") || lowerInput.includes("error")) {
                responseText = "Currently, your stress score is " + stress + "%. The most pressing issue detected is a projected inventory stockout in 3 SKUs within the next 48 hours. I recommend rerouting shipments immediately.";
                responseType = "action";
            } else if (lowerInput.includes("next") || lowerInput.includes("action") || lowerInput.includes("what should i do")) {
                responseText = "Next Best Action: 1. Approve dynamic pricing for high-velocity items to maximize margin. 2. Pre-allocate support staff for the evening shift to handle the expected query influx. Shall I execute these playbooks?";
                responseType = "action";
            } else {
                responseText = "Analyzing your request against real-time data flow... I see a 12% uptick in engagement. Keep monitoring the Ecosystem Hub for integration anomalies. Is there a specific metric you'd like me to dive into?";
                responseType = "insight";
            }

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                sender: "ai",
                text: responseText,
                type: responseType
            }]);
        }, 1000);
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: inputValue,
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        generateAIResponse(inputValue);
    };

    // Generate actionable insights based on real data
    const insights = [
        {
            title: "Immediate Action Required",
            description: data?.stressScore > 50
                ? "System stress is high. Consider enabling load balancing for logistics."
                : "Operations are stable, but optimizing SKU distribution could increase margin by 4%.",
            icon: data?.stressScore > 50 ? AlertTriangle : TrendingUp,
            color: data?.stressScore > 50 ? "text-amber-500" : "text-emerald-500",
            bgColor: data?.stressScore > 50 ? "bg-amber-500/10" : "bg-emerald-500/10",
            borderColor: data?.stressScore > 50 ? "border-amber-500/20" : "border-emerald-500/20",
        },
        {
            title: "Next Strategic Move",
            description: "Expand Ecosystem Hub integrations. Your API usage shows high demand for external CRM synchronization.",
            icon: Zap,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
        },
        {
            title: "Learning Opportunity",
            description: "Ask the AI about 'Correlation between support wait times and sales conversion' to uncover hidden friction points.",
            icon: Lightbulb,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20",
        }
    ];

    return (
        <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-8rem)]">

            {/* AI Next Move & Actionable Insights Panel */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full xl:w-1/3 flex flex-col gap-6"
            >
                <div className="glass-panel p-6 rounded-2xl border-primary/20 bg-primary/5 relative overflow-hidden flex-1 relative flex flex-col">
                    <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none" />

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <BrainCircuit className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white/90">Autonomous Analyst</h2>
                            <p className="text-xs text-white/50 uppercase tracking-widest">Actionable Intelligence</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 relative z-10">
                        {insights.map((insight, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-4 rounded-xl border ${insight.bgColor} ${insight.borderColor} backdrop-blur-sm hover:bg-white/5 transition-colors cursor-pointer group`}
                                onClick={() => {
                                    setInputValue(`Tell me more about: ${insight.title}`);
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <insight.icon className={`w-4 h-4 ${insight.color}`} />
                                        <h3 className="text-sm font-semibold text-white/80">{insight.title}</h3>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    {insight.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-white/40">Confidence Score</span>
                            <span className="text-xs font-bold text-primary">94.2%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "94.2%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-primary rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Interactive AI Chatbot */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 glass-panel rounded-2xl border-primary/20 bg-[#0a0a0c]/80 flex flex-col relative overflow-hidden"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Bot className="w-6 h-6 text-primary" />
                            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0c]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white/90">OpsPulse Core AI</h3>
                            <p className="text-[10px] text-white/50">Ready to learn and analyze</p>
                        </div>
                    </div>
                    <div className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                        Interactive Mode
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-6">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[80%] md:max-w-[70%] flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>

                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.sender === "user" ? "bg-white/10" : "bg-primary/20"
                                        }`}>
                                        {msg.sender === "user" ? (
                                            <div className="w-4 h-4 rounded-sm bg-white/40" />
                                        ) : (
                                            <Bot className="w-4 h-4 text-primary" />
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`p-4 rounded-2xl border ${msg.sender === "user"
                                            ? "bg-white/5 border-white/10 rounded-tr-sm"
                                            : msg.type === "action"
                                                ? "bg-amber-500/10 border-amber-500/20 text-amber-50 rounded-tl-sm"
                                                : msg.type === "learning"
                                                    ? "bg-purple-500/10 border-purple-500/20 text-purple-50 rounded-tl-sm"
                                                    : "bg-primary/5 border-primary/20 text-blue-50 rounded-tl-sm"
                                        }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        {msg.sender === "ai" && (
                                            <div className="mt-2 text-[10px] font-mono text-white/30 uppercase tracking-wider flex items-center gap-1">
                                                <Zap className="w-3 h-3" /> Processed via Core Data Stream
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a question, query data, or explore next moves..."
                            className="w-full bg-black/50 border-white/10 text-white rounded-xl pl-4 pr-12 py-6 focus-visible:ring-primary/50"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputValue.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-white rounded-lg w-10 h-10 transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                    <div className="mt-2 text-center flex justify-center gap-4">
                        <span className="text-[10px] text-white/30 cursor-pointer hover:text-white/60 transition-colors">Try: "What should I do next?"</span>
                        <span className="text-[10px] text-white/30 cursor-pointer hover:text-white/60 transition-colors">Try: "How do I optimize support?"</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
