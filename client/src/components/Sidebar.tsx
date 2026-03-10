import { motion } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Headphones,
  BarChart3,
  ShieldAlert,
  ChevronRight,
  Blocks,
  Zap,
  BrainCircuit
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Slider } from "@/components/ui/slider";
import { ROLE_ALLOWED_PATHS, USER_ROLE_META, type UserRole } from "@/types/roles";

const menuItems = [
  { icon: LayoutDashboard, label: "Executive Summary", path: "/dashboard" },
  { icon: TrendingUp, label: "Sales Intelligence", path: "/sales" },
  { icon: Package, label: "Inventory & Logistics", path: "/inventory" },
  { icon: Headphones, label: "Customer Support", path: "/support" },
  { icon: BarChart3, label: "Predictive Reports", path: "/reports" },
  { icon: BrainCircuit, label: "AI Analytics", path: "/ai-analytics" },
  { icon: Blocks, label: "Ecosystem Hub", path: "/integrations" },
];

export default function Sidebar({
  isWarRoom,
  simValue,
  setSimValue,
  userRole,
  setUserRole,
  onOpenRoleSetup,
}: {
  isWarRoom: boolean;
  simValue: number;
  setSimValue: (v: number) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenRoleSetup: () => void;
}) {
  const [location] = useLocation();
  const allowedPaths = ROLE_ALLOWED_PATHS[userRole];
  const visibleMenuItems = menuItems.filter((item) => allowedPaths.includes(item.path));
  const roleMeta = USER_ROLE_META[userRole];

  if (isWarRoom) {
    return (
      <aside className="w-16 md:w-64 bg-[#050505] border-r border-red-500/20 flex flex-col transition-all duration-500 z-50">
        <div className="p-4 border-b border-red-500/10 flex items-center justify-center md:justify-start gap-3">
          <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
          <span className="hidden md:block font-black text-red-500 text-xs tracking-[0.2em] uppercase">Emergency Protocol</span>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-4">
          <div className="hidden md:block text-[10px] font-bold text-red-500/50 uppercase tracking-widest mb-2">Checklist</div>
          {[
            "Verify Logistics",
            "Approve Reroute",
            "Notify Stakeholders",
            "Engage Support"
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-200/60 text-xs cursor-pointer hover:bg-red-500/10 transition-colors"
            >
              <div className="w-4 h-4 rounded border border-red-500/30 flex-shrink-0" />
              <span className="hidden md:block truncate">{item}</span>
            </motion.div>
          ))}
        </div>
        <div className="hidden md:block p-3 border-t border-red-500/10">
          <p className="text-[9px] uppercase tracking-[0.2em] text-red-400/70">Role Context</p>
          <p className="text-xs text-red-100/70 mt-1">{roleMeta.shortLabel}</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-16 md:w-64 bg-[#0a0a0c] border-r border-white/5 flex flex-col transition-all duration-300 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <div className="w-4 h-4 rounded-sm bg-primary" />
        </div>
        <span className="hidden md:block font-bold text-lg tracking-tighter">OpsPulse</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {visibleMenuItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <a className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative
                ${isActive ? 'bg-primary/10 text-primary shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}
              `}>
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="hidden md:block text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"
                  />
                )}
                <ChevronRight className={`ml-auto w-4 h-4 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 flex flex-col gap-4">
        <div className="hidden md:block p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Workspace Role</div>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-2 py-2 text-xs text-white outline-none"
          >
            <option value="beginner">Beginner Operator</option>
            <option value="crm-expert">CRM Expert</option>
            <option value="analytics">Analytics Lead</option>
            <option value="data-analytics">Data Analytics Specialist</option>
          </select>
          <p className="text-[10px] text-white/45 mt-2 leading-relaxed">{roleMeta.description}</p>
          <button
            onClick={onOpenRoleSetup}
            className="mt-3 w-full rounded-lg border border-primary/30 bg-primary/10 px-2 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/15"
          >
            Open Role Selector
          </button>
        </div>

        <div className="hidden md:block p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3 h-3 text-primary animate-pulse" />
            <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Scenario Simulator</div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[9px] font-bold text-white/40 uppercase mb-2">
                <span>Traffic Spike</span>
                <span className="text-primary">{simValue}x</span>
              </div>
              <Slider
                defaultValue={[1]}
                max={10}
                step={0.5}
                value={[simValue]}
                onValueChange={(vals) => setSimValue(vals[0])}
                className="py-2"
              />
            </div>
            <p className="text-[9px] text-white/30 leading-tight">
              Adjusting this will trigger real-time predictive stress recalculation.
            </p>
          </div>
        </div>

        <div className="hidden md:block p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">System Status</div>
          <p className="text-xs text-white/60 leading-relaxed">v4.0.0-PRO<br />Neural links optimized</p>
        </div>
      </div>
    </aside>
  );
}