import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center p-16 relative overflow-hidden border-r border-white/5">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#c8f542 1px, transparent 1px), linear-gradient(90deg, #c8f542 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glows */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c8f542]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-[#c8f542]/3 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 bg-[#c8f542] rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="#080808" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-black text-xl tracking-tighter">Noted.</span>
        </div>

        {/* Main content */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-1 h-1 rounded-full bg-[#c8f542]" />
            <p className="text-[#c8f542] text-[10px] font-mono uppercase tracking-[0.3em]">Your thoughts, organized</p>
          </div>
          <h2 className="text-white text-6xl font-black leading-[1.05] tracking-tighter mb-10">
            Every great<br />idea starts<br />with a{" "}
            <span className="relative inline-block">
              <span className="text-[#c8f542]">single note.</span>
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#c8f542]/30" />
            </span>
          </h2>

          {/* Stats */}
          <div className="flex gap-8 pt-8 border-t border-white/5">
            <div>
              <p className="text-white text-2xl font-black tracking-tighter">∞</p>
              <p className="text-[#444] text-xs font-mono mt-1">Notes</p>
            </div>
            <div className="w-px bg-white/5" />
            <div>
              <p className="text-white text-2xl font-black tracking-tighter">256</p>
              <p className="text-[#444] text-xs font-mono mt-1">Bit encrypted</p>
            </div>
            <div className="w-px bg-white/5" />
            <div>
              <p className="text-white text-2xl font-black tracking-tighter">24/7</p>
              <p className="text-[#444] text-xs font-mono mt-1">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8f542]/3 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm relative">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-14 lg:hidden">
            <div className="w-9 h-9 bg-[#c8f542] rounded flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="#080808" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white font-black text-xl tracking-tighter">Noted.</span>
          </div>

          <div className="mb-10">
            <p className="text-[#c8f542] text-[10px] font-mono uppercase tracking-[0.3em] mb-3">Welcome back</p>
            <h1 className="text-white text-4xl font-black tracking-tighter mb-2">Sign in</h1>
            <p className="text-[#555] text-sm leading-relaxed">Access your workspace and pick up right where you left off.</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <div className="w-1 h-8 bg-red-500 rounded-full shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[#555] text-[10px] font-mono uppercase tracking-[0.2em]">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white/[0.03] border border-white/8 text-white placeholder-[#2e2e2e] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#c8f542]/50 focus:bg-white/[0.05] transition-all duration-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#555] text-[10px] font-mono uppercase tracking-[0.2em]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/[0.03] border border-white/8 text-white placeholder-[#2e2e2e] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#c8f542]/50 focus:bg-white/[0.05] transition-all duration-300"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c8f542] text-[#080808] font-black py-3.5 rounded-xl text-sm tracking-tight hover:bg-[#d4f95e] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M8 3l5 5-5 5" stroke="#080808" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/5" />
            <p className="text-[#333] text-xs font-mono">or</p>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <p className="text-[#444] text-sm text-center">
            New to Noted?{" "}
            <Link to="/signup" className="text-[#c8f542] hover:text-white font-bold transition-colors duration-200">
              Create an account →
            </Link>
          </p>

          
         
        </div>
      </div>
    </div>
  );
};

export default Login;