import { Check, ChevronRight } from "lucide-react";
import { USER_ROLE_META, type UserRole } from "@/types/roles";

export default function RoleSelector({
  value,
  onChange,
  onContinue,
}: {
  value: UserRole | null;
  onChange: (role: UserRole) => void;
  onContinue: () => void;
}) {
  const roleEntries = Object.entries(USER_ROLE_META) as Array<[UserRole, (typeof USER_ROLE_META)[UserRole]]>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_80%_75%,rgba(6,182,212,0.14),transparent_35%)] pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-primary/80 mb-2">Personalization</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Choose Your Role Experience</h1>
          <p className="text-white/50 mt-3 max-w-2xl">Each role gets a tailored interface. Beginners see guided essentials. Specialists unlock deeper analytics and controls.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleEntries.map(([role, meta]) => {
            const isSelected = role === value;
            return (
              <button
                key={role}
                onClick={() => onChange(role)}
                className={`text-left rounded-2xl border p-6 transition-all ${
                  isSelected
                    ? "border-primary/60 bg-primary/10 shadow-[0_0_35px_rgba(59,130,246,0.18)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h2 className="text-xl font-bold">{meta.label}</h2>
                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-primary text-primary" : "border-white/30 text-transparent"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-white/70 text-sm mb-2">{meta.description}</p>
                <p className="text-white/45 text-xs leading-relaxed">{meta.details}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onContinue}
            disabled={!value}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-primary text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue to Dashboard <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
