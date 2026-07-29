import { useState } from 'react';

interface ForgotPasswordProps {
  onNavigate: (view: any) => void;
}

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Simulate sending reset link
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <main className="w-full flex-grow relative overflow-hidden bg-gradient-to-br from-[#ffe5db] to-[#cbb2a6] py-24 px-6 flex items-center justify-center min-h-[70vh]">
        {/* Symmetrical Ambient Warm Rose Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-36 bg-[#dfa38f]/10 rounded-full blur-[80px] pointer-events-none z-0" />
        
        {/* Frosted Success Card */}
        <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-md border border-[#dfa38f]/30 rounded-lg p-8 md:p-10 text-center space-y-6 shadow-xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-[#e8cdc1] to-[#dfa38f] text-white rounded-full mx-auto flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-3xl font-light">
              mail
            </span>
          </div>
          <div className="space-y-2">
            <h2 className="font-display-lg text-2xl font-bold text-[#4a372e]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Reset Link Sent!
            </h2>
            <p className="text-xs text-[#8b7368] leading-relaxed">
              We have sent a password reset link to <span className="font-bold text-[#4a372e]">{email}</span>. Please check your email inbox and spam folder.
            </p>
          </div>

          <div className="h-px bg-[#dfa38f]/20 w-full" />

          <button
            onClick={() => onNavigate("signin")}
            style={{
              backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #f5b8c9 100%)",
            }}
            className="w-full text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl border border-white/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(223,163,143,0.3)]"
          >
            Back to Sign In
          </button>
        </div>
      </main>
    );
  }

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
            Forgot Password
          </span>
          <h1 className="font-display-lg text-2xl md:text-3xl text-[#4a372e] font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Reset Your Password
          </h1>
          <p className="text-[#8b7368] text-xs max-w-xs mx-auto leading-relaxed">
            Enter your account's email address and we will send you a link to reset your password.
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

          <button
            type="submit"
            style={{
              backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #f5b8c9 100%)",
            }}
            className="w-full text-white text-xs font-bold uppercase tracking-widest py-4 px-6 rounded-xl border border-white/20 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_4px_12px_rgba(223,163,143,0.3)] mt-4"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onNavigate("signin")}
            className="text-[#6a564d] font-bold text-xs hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </main>
  );
}
