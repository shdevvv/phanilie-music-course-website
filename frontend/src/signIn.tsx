import { useState } from 'react';

interface SignInProps {
  onNavigate: (view: any) => void;
}

export default function SignIn({ onNavigate }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    // Simulate successful login
    const existingName = localStorage.getItem("guest_name");
    if (!existingName) {
      const derivedName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      localStorage.setItem("guest_name", derivedName);
    }
    localStorage.setItem("isLoggedIn", "true");
    window.dispatchEvent(new Event("storage"));
    onNavigate("dashboard");
  };

  return (
    <main className="w-full flex-grow relative overflow-hidden bg-gradient-to-br from-[#ffe5db] to-[#cbb2a6] py-16 px-6 flex items-center justify-center min-h-[80vh] animate-in fade-in duration-300">
      {/* Symmetrical Ambient Warm Rose Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-36 bg-[#dfa38f]/10 rounded-full blur-[80px] pointer-events-none z-0" />

      {/* Background Piano Grand Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none select-none opacity-5"
        style={{
          backgroundImage: "url('/pianogrand.jpg')",
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-md border border-[#dfa38f]/30 rounded-lg p-8 md:p-10 shadow-2xl flex flex-col gap-6">
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#dfa38f]/15 text-[#8a6858] text-[9px] font-bold uppercase tracking-widest border border-[#dfa38f]/20">
            Welcome Back
          </span>
          <h1 className="font-display-lg text-2xl md:text-3xl text-[#4a372e] font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Sign In to Phanilie
          </h1>
          <p className="text-[#8b7368] text-xs max-w-xs mx-auto leading-relaxed">
            Enter your credentials to access your piano lessons and dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200/50 text-red-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="yourname@example.com"
              className="w-full bg-white/80 border border-[#dfa38f]/30 rounded-xl px-4 py-3 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] transition-all shadow-[inset_0_1px_3px_rgba(223,163,143,0.03)]"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368]">Password</label>
              <button 
                type="button" 
                onClick={() => onNavigate("forgotpassword")}
                className="text-[9px] font-bold text-[#6a564d] hover:underline bg-transparent border-none cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              className="w-full bg-white/80 border border-[#dfa38f]/30 rounded-xl px-4 py-3 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] transition-all shadow-[inset_0_1px_3px_rgba(223,163,143,0.03)]"
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundImage: "linear-gradient(135deg, #a48274 0%, #7c5c4e 45%, #593c30 100%)",
              boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 6px 20px rgba(89, 60, 48, 0.25)",
              fontFamily: "'Playfair Display', Georgia, serif"
            }}
            className="w-full text-white text-xs font-semibold uppercase tracking-[0.14em] py-4 px-6 rounded-xl border border-white/25 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[10px] text-[#8b7368]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate("signup")}
              className="text-[#6a564d] font-bold hover:underline bg-transparent border-none cursor-pointer p-0"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
