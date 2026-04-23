import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f0f0f] border-r border-[#1e1e1e] flex-col justify-center p-16">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c8f542] rounded-sm flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Noted.</span>
          </div>
        </div>

        <div>
          <p className="text-[#c8f542] text-xs font-mono uppercase tracking-widest mb-6">Join today</p>
          <h2 className="text-white text-5xl font-bold leading-tight mb-8">
            Capture ideas<br />before they<br />
            <span className="text-[#c8f542]">disappear.</span>
          </h2>
          <div className="flex gap-2">
            <div className="w-2 h-1 bg-[#2e2e2e] rounded-full" />
            <div className="w-8 h-1 bg-[#c8f542] rounded-full" />
            <div className="w-2 h-1 bg-[#2e2e2e] rounded-full" />
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-12 lg:hidden">
            <div className="w-8 h-8 bg-[#c8f542] rounded-sm flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Noted.</span>
          </div>

          <div className="mb-10">
            <h1 className="text-white text-3xl font-bold mb-2">Create account</h1>
            <p className="text-[#666] text-sm">Start capturing your ideas today</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#888] text-xs font-mono uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                className="w-full bg-[#1a1a1a] border border-[#2e2e2e] text-white placeholder-[#444] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#c8f542] transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-[#888] text-xs font-mono uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#1a1a1a] border border-[#2e2e2e] text-white placeholder-[#444] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#c8f542] transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-[#888] text-xs font-mono uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#1a1a1a] border border-[#2e2e2e] text-white placeholder-[#444] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#c8f542] transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-[#888] text-xs font-mono uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#1a1a1a] border border-[#2e2e2e] text-white placeholder-[#444] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#c8f542] transition-colors duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8f542] text-[#0f0f0f] font-bold py-3 rounded-lg text-sm hover:bg-[#b8e032] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0f0f0f] border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-[#666] text-sm text-center mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-[#c8f542] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;