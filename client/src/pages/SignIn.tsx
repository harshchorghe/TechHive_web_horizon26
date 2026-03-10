import { ArrowRight, LogIn } from "lucide-react";
import { Link } from "wouter";
import { FormEvent, useState } from "react";

export default function SignIn({
  onSubmit,
}: {
  onSubmit: (payload: { email: string; password: string }) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.12),transparent_40%)] pointer-events-none" />
      <div className="w-full max-w-md relative z-10 rounded-2xl border border-white/10 bg-[#0a0a0c]/80 backdrop-blur-xl p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary/80 mb-2">OpsPulse Access</p>
          <h1 className="text-3xl font-black tracking-tight">Sign In</h1>
          <p className="text-white/50 mt-2 text-sm">Enter your credentials to continue to the operational console.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-widest text-white/60">Work Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-white/60">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/50"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Continue <LogIn className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-sm text-white/50">
          New to OpsPulse?{" "}
          <Link href="/signup" className="text-primary font-semibold inline-flex items-center gap-1">
            Create account <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
