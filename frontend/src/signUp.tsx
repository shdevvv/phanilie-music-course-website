import { useState } from 'react';
import SearchableCountryDropdown from './SearchableCountryDropdown';

interface SignUpProps {
  onNavigate: (view: any) => void;
}

export default function SignUp({ onNavigate }: SignUpProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'Indonesia',
    agree: false
  });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agree) {
      setError('You must agree to the Terms of Service & Privacy Policy');
      return;
    }

    // Simulate successful account creation
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
              check_circle
            </span>
          </div>
          <div className="space-y-2">
            <h2 className="font-display-lg text-2xl font-bold text-[#4a372e]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome to Phanilie Music!
            </h2>
            <p className="text-xs text-[#8b7368] leading-relaxed">
              Your account for <span className="font-bold text-[#4a372e]">{formData.email}</span> has been successfully created. Get ready to elevate your piano playing.
            </p>
          </div>

          <div className="h-px bg-[#dfa38f]/20 w-full" />

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => {
                // Simulate login
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("guest_name", formData.name);
                localStorage.setItem("guest_email", formData.email);
                localStorage.setItem("guest_country", formData.country);
                window.dispatchEvent(new Event("storage"));
                onNavigate("dashboard");
              }}
              style={{
                backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #f5b8c9 100%)",
              }}
              className="w-full text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl border border-white/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(223,163,143,0.3)]"
            >
              Go to Student Dashboard
            </button>
            
            <button
              onClick={() => onNavigate("home")}
              className="w-full bg-transparent hover:bg-[#dfa38f]/10 text-[#6a564d] text-xs font-bold uppercase tracking-widest py-3 rounded-xl border border-[#dfa38f]/30 cursor-pointer active:scale-[0.98] transition-all"
            >
              Return to Homepage
            </button>
          </div>
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

      <div className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-md border border-[#dfa38f]/30 rounded-lg p-8 md:p-10 shadow-2xl flex flex-col gap-6">
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#dfa38f]/15 text-[#8a6858] text-[9px] font-bold uppercase tracking-widest border border-[#dfa38f]/20">
            Join the Academy
          </span>
          <h1 className="font-display-lg text-2xl md:text-3xl text-[#4a372e] font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Create Your Account
          </h1>
          <p className="text-[#8b7368] text-xs max-w-xs mx-auto leading-relaxed">
            Start your journey into advanced Gospel & Jazz piano playing.
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
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Stephanie Halim"
              className="w-full bg-white/80 border border-[#dfa38f]/30 rounded-xl px-4 py-3 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] transition-all shadow-[inset_0_1px_3px_rgba(223,163,143,0.03)]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="yourname@example.com"
              className="w-full bg-white/80 border border-[#dfa38f]/30 rounded-xl px-4 py-3 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] transition-all shadow-[inset_0_1px_3px_rgba(223,163,143,0.03)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full bg-white/80 border border-[#dfa38f]/30 rounded-xl px-4 py-3 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] transition-all shadow-[inset_0_1px_3px_rgba(223,163,143,0.03)]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className="w-full bg-white/80 border border-[#dfa38f]/30 rounded-xl px-4 py-3 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f] focus:border-[#dfa38f] transition-all shadow-[inset_0_1px_3px_rgba(223,163,143,0.03)]"
              />
            </div>
          </div>

          <SearchableCountryDropdown
            value={formData.country}
            onChange={(country) => {
              setFormData(prev => ({ ...prev, country }));
              setError('');
            }}
          />

          <div className="flex items-start gap-2.5 pt-2 ml-1">
            <input
              type="checkbox"
              name="agree"
              id="agree-checkbox"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-0.5 rounded border-[#dfa38f]/40 text-[#dfa38f] focus:ring-[#dfa38f] cursor-pointer"
            />
            <label htmlFor="agree-checkbox" className="text-[10px] text-[#8b7368] leading-tight select-none cursor-pointer">
              I agree to the <button type="button" onClick={() => onNavigate("terms")} className="text-[#6a564d] font-bold hover:underline bg-transparent border-none cursor-pointer p-0">Terms of Service</button> and <button type="button" onClick={() => onNavigate("privacy")} className="text-[#6a564d] font-bold hover:underline bg-transparent border-none cursor-pointer p-0">Privacy Policy</button>.
            </label>
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
            Create Account
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[10px] text-[#8b7368]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate("signin")}
              className="text-[#6a564d] font-bold hover:underline bg-transparent border-none cursor-pointer p-0"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
