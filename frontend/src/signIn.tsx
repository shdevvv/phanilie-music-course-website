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
    <main className="w-full flex-grow relative overflow-hidden bg-[#fffaf7] py-20 px-6 flex items-center justify-center min-h-[85vh]">
      {/* Background Silk Texture */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-40"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(255,250,247,0.92) 0%, rgba(252,238,233,0.85) 100%), url('/floral.png')",
        }}
      />

      {/* Clean Sign In Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-[#e8cdc1]/40 shadow-[0_12px_40px_rgba(45,41,38,0.08)] p-8 md:p-10 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2">
            <div className="h-px w-8 bg-[#e8cdc1]" />
            <span 
              className="text-xl text-[#805c51] font-serif select-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              𝄞
            </span>
            <div className="h-px w-8 bg-[#e8cdc1]" />
          </div>
          
          <h1 
            className="text-2xl md:text-3xl text-[#3d2f28] font-bold tracking-tight leading-snug"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Sign In
          </h1>
          <p className="text-[#81756f] text-xs max-w-xs mx-auto font-medium leading-relaxed">
            Enter your credentials to access your piano lessons & personal dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-[#fff0ed] border border-[#f5b4a4] text-[#a83b2a] rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-base select-none">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label 
              className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-1"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="yourname@example.com"
                className="w-full bg-[#fffcfa] border border-[#e8cdc1] focus:border-[#ab7e66] rounded-xl px-4 py-3 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label 
                className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446]"
              >
                Password
              </label>
              <button 
                type="button" 
                onClick={() => onNavigate("forgotpassword")}
                className="text-[10px] font-bold text-[#805c51] hover:text-[#5c3a2e] hover:underline bg-transparent border-none cursor-pointer transition-colors"
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
              className="w-full bg-[#fffcfa] border border-[#e8cdc1] focus:border-[#ab7e66] rounded-xl px-4 py-3 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#6e5a51] hover:bg-[#58473f] text-white text-xs font-bold uppercase tracking-[0.12em] py-3.5 px-6 rounded-xl border-none cursor-pointer active:scale-[0.98] transition-all shadow-sm"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-[#e8cdc1]/30">
          <p className="text-[11px] text-[#81756f]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate("signup")}
              className="text-[#805c51] font-bold hover:underline bg-transparent border-none cursor-pointer p-0 ml-1"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
