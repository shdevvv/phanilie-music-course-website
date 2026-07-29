import { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { sheets } from './sheetsData';

function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const particles = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }>>([]);
  const lastSpawn = useRef(0);
  const animFrameRef = useRef<number>(0);

  const animate = useCallback(() => {
    // Ring follows cursor with slight smooth delay
    const ringLerp = 0.25;
    ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ringLerp;
    ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ringLerp;

    const ring = ringRef.current;
    const glow = glowRef.current;

    if (ring) {
      const ringSize = isHovering.current ? 48 : 32;
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;
      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      ring.style.opacity = isHovering.current ? '0.85' : '0.45';
    }

    if (glow) {
      glow.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      glow.style.opacity = isHovering.current ? '0.45' : '0.2';
    }

    // Trail particles on canvas
    const canvas = trailCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn sparkles based on movement speed
        const now = Date.now();
        const dx = mousePos.current.x - ringPos.current.x;
        const dy = mousePos.current.y - ringPos.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 2 && now - lastSpawn.current > 35) {
          const count = Math.min(Math.floor(speed / 5), 3);
          for (let i = 0; i < count; i++) {
            particles.current.push({
              x: ringPos.current.x + (Math.random() - 0.5) * 10,
              y: ringPos.current.y + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 1 - 0.4,
              life: 1,
              maxLife: 0.5 + Math.random() * 0.5,
              size: 1.2 + Math.random() * 2,
            });
          }
          lastSpawn.current = now;
        }

        // Update and draw particles (white/shining)
        particles.current = particles.current.filter(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy -= 0.01;
          p.life -= 0.025 / p.maxLife;

          if (p.life <= 0) return false;

          const alpha = p.life * 0.6;

          // Bright white core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();

          // Soft white glow halo
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.15})`;
          ctx.fill();

          return true;
        });
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .cursor-pointer, .hover-move, input, select, textarea, [onclick]')) {
        isHovering.current = true;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .cursor-pointer, .hover-move, input, select, textarea, [onclick]')) {
        isHovering.current = false;
      }
    };

    const onMouseLeave = () => {
      mousePos.current = { x: -100, y: -100 };
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [animate]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Text selection highlight */
        ::selection {
          background-color: #ffffff !important;
          color: #3d251c !important;
        }
        ::-moz-selection {
          background-color: #ffffff !important;
          color: #3d251c !important;
        }

        /* Ring shimmer */
        @keyframes ringShimmer {
          0%, 100% { opacity: 0.35; border-color: rgba(255,255,255,0.35); }
          50% { opacity: 0.7; border-color: rgba(255,255,255,0.6); }
        }
      `}} />

      {/* Sparkle trail canvas */}
      <canvas
        ref={trailCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99997,
        }}
      />

      {/* Soft white glow blob */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 99997,
          transition: 'opacity 0.3s ease',
          willChange: 'transform',
        }}
      />

      {/* White shining ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
          animation: 'ringShimmer 2.5s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </>
  );
}

interface LayoutProps {
  children: ReactNode;
  view:
    | "home"
    | "dashboard"
    | "library"
    | "courses"
    | "sessions"
    | "forums"
    | "faq"
    | "privacy"
    | "terms"
    | "signup"
    | "signin"
    | "forgotpassword"
    | "cart"
    | "checkout"
    | "my-library"
    | "download-page"
    | "invoice";
  onNavigate: (
    view:
      | "home"
      | "dashboard"
      | "library"
      | "courses"
      | "sessions"
      | "forums"
      | "faq"
      | "privacy"
      | "terms"
      | "signup"
      | "signin"
      | "forgotpassword"
      | "cart"
      | "checkout"
      | "my-library"
      | "download-page"
      | "invoice",
  ) => void;
}

function Layout({ children, view, onNavigate }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") !== "false",
  );
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("guest_name") || localStorage.getItem("user_name") || "Student";
  });
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const saved = localStorage.getItem('phanilie_cart');
      if (saved) {
        const cartArr = JSON.parse(saved);
        const count = cartArr.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (e) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const [isSlideCartOpen, setIsSlideCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const refreshCart = () => {
    try {
      const saved = localStorage.getItem('phanilie_cart');
      setCartItems(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setCartItems([]);
    }
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener('storage', refreshCart);
    return () => window.removeEventListener('storage', refreshCart);
  }, []);

  useEffect(() => {
    const handleOpenSlideCart = () => {
      refreshCart();
      setIsSlideCartOpen(true);
    };

    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      setToastMessage(customEvent.detail?.message || 'Item added to cart');
      setShowToast(true);
    };

    window.addEventListener('open-slide-cart', handleOpenSlideCart);
    window.addEventListener('show-toast', handleShowToast);

    return () => {
      window.removeEventListener('open-slide-cart', handleOpenSlideCart);
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Modals for Footer links
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isNewsletterSent, setIsNewsletterSent] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen to cross-component contact triggers
  useEffect(() => {
    const handleOpenContact = () => setShowContactModal(true);
    window.addEventListener("open-contact-modal", handleOpenContact);
    return () =>
      window.removeEventListener("open-contact-modal", handleOpenContact);
  }, []);

  // Listen to storage events to sync login state across tabs/actions
  useEffect(() => {
    const syncLoginState = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") !== "false");
      const currentName = localStorage.getItem("guest_name") || localStorage.getItem("user_name") || "Student";
      setUserName(currentName);
    };
    syncLoginState();
    window.addEventListener("storage", syncLoginState);
    return () => window.removeEventListener("storage", syncLoginState);
  }, []);

  // Dynamically set HTML/Body background colors to prevent gaps when zoomed out
  useEffect(() => {
    if (view === "dashboard") {
      document.body.style.backgroundColor = "#eae3e0";
      document.documentElement.style.backgroundColor = "#eae3e0";
    } else {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    }
    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, [view]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("guest_name");
    localStorage.removeItem("guest_email");
    localStorage.removeItem("guest_country");
    window.dispatchEvent(new Event("storage")); // Trigger sync in current window
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    window.dispatchEvent(new Event("storage")); // Trigger sync in current window
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsNewsletterSent(true);
    }
  };

  // Satisfy TS compiler for unused variables while preserving sync logic
  if (isLoggedIn && false) {
    handleLogout();
    handleLogin();
  }

  return (
    <div className={`w-full ${view === "dashboard" ? "h-auto bg-[#eae3e0]" : "min-h-screen bg-[#eae3e0]"} text-[#1d1b1a] font-body-md antialiased`}>
      <CustomCursor />
      <div className={`max-w-[1440px] mx-auto w-full ${view === "dashboard" ? "h-auto bg-[#fff8f6]" : (view === "my-library" || view === "download-page" || view === "invoice" ? "min-h-screen bg-transparent" : "min-h-screen bg-[#fff8f6]")} flex flex-col shadow-[0_0_80px_rgba(45,41,38,0.08)] relative`}>
        {/* Top Navigation Bar */}
        <nav
          className={`sticky top-0 w-full z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-white/85 backdrop-blur-xl border-b border-[#e8cdc1]/30 shadow-[0px_40px_80px_rgba(45,41,38,0.05)]"
              : "bg-white/60 backdrop-blur-md border-b border-[#e8cdc1]/10"
          }`}
        >
          <div className="flex justify-between items-center h-24 px-6 md:px-12 w-full">
            {/* Left side: Logo + Search Bar */}
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => onNavigate("home")}
                className="flex items-center bg-transparent border-none cursor-pointer focus:outline-none"
              >
                <img
                  src="/logo.png"
                  alt="Phanilie Music"
                  className="h-16 md:h-20 object-contain"
                />
              </button>
              <div className="relative hidden md:block">
                <input
                  className="bg-[#f3ecea] border-none rounded-full py-2 pl-4 pr-10 text-sans text-xs focus:ring-2 focus:ring-[#e8cdc1] w-72 focus:outline-none"
                  placeholder="Search..."
                  type="text"
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  search
                </span>
              </div>
            </div>

            {/* Right side: Nav Links + My Account Dropdown */}
            <div className="flex items-center gap-2 md:gap-4 lg:gap-6 2xl:gap-8">
              <div className="hidden lg:flex items-center gap-1 xl:gap-2.5 2xl:gap-4">
                {/* 1. HOME */}
                <button
                  onClick={() => onNavigate("home")}
                  className={`relative font-sans text-[11px] uppercase tracking-[0.08em] font-semibold py-2 px-3 transition-all duration-300 cursor-pointer bg-transparent border-none focus:outline-none ${
                    view === "home" ? "text-[#6e5a51] font-bold" : "text-[#81756f] hover:text-[#6e5a51]"
                  }`}
                >
                  Home
                  {view === "home" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#dfa38f] shadow-[0_0_8px_rgba(223,163,143,0.8)]"></span>
                  )}
                </button>

                {/* 2. LEARNING BOARD */}
                <button
                  onClick={() => onNavigate("dashboard")}
                  className={`relative font-sans text-[11px] uppercase tracking-[0.08em] font-semibold py-2 px-3 transition-all duration-300 cursor-pointer bg-transparent border-none focus:outline-none ${
                    view === "dashboard" ? "text-[#6e5a51] font-bold" : "text-[#81756f] hover:text-[#6e5a51]"
                  }`}
                >
                  Learning Board
                  {view === "dashboard" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#dfa38f] shadow-[0_0_8px_rgba(223,163,143,0.8)]"></span>
                  )}
                </button>

                {/* 3. COURSES */}
                <button
                  onClick={() => onNavigate("courses")}
                  className={`relative font-sans text-[11px] uppercase tracking-[0.08em] font-semibold py-2 px-3 transition-all duration-300 cursor-pointer bg-transparent border-none focus:outline-none ${
                    view === "courses" ? "text-[#6e5a51] font-bold" : "text-[#81756f] hover:text-[#6e5a51]"
                  }`}
                >
                  Courses
                  {view === "courses" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#dfa38f] shadow-[0_0_8px_rgba(223,163,143,0.8)]"></span>
                  )}
                </button>

                {/* 4. COVERS AND SHEETS */}
                <button
                  onClick={() => onNavigate("library")}
                  className={`relative font-sans text-[11px] uppercase tracking-[0.08em] font-semibold py-2 px-3 transition-all duration-300 cursor-pointer bg-transparent border-none focus:outline-none ${
                    view === "library" ? "text-[#6e5a51] font-bold" : "text-[#81756f] hover:text-[#6e5a51]"
                  }`}
                >
                  Covers & Sheets
                  {view === "library" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#dfa38f] shadow-[0_0_8px_rgba(223,163,143,0.8)]"></span>
                  )}
                </button>

                {/* 5. MY LIBRARY */}
                <button
                  onClick={() => onNavigate("my-library")}
                  className={`relative font-sans text-[11px] uppercase tracking-[0.08em] font-semibold py-2 px-3 transition-all duration-300 cursor-pointer bg-transparent border-none focus:outline-none ${
                    view === "my-library" ? "text-[#6e5a51] font-bold" : "text-[#81756f] hover:text-[#6e5a51]"
                  }`}
                >
                  My Library
                  {view === "my-library" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#dfa38f] shadow-[0_0_8px_rgba(223,163,143,0.8)]"></span>
                  )}
                </button>

                {/* 6. LIVE SESSIONS */}
                <button
                  onClick={() => onNavigate("sessions")}
                  className={`relative font-sans text-[11px] uppercase tracking-[0.08em] font-semibold py-2 px-3 transition-all duration-300 cursor-pointer bg-transparent border-none focus:outline-none ${
                    view === "sessions" ? "text-[#6e5a51] font-bold" : "text-[#81756f] hover:text-[#6e5a51]"
                  }`}
                >
                  Live Sessions
                  {view === "sessions" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#dfa38f] shadow-[0_0_8px_rgba(223,163,143,0.8)]"></span>
                  )}
                </button>
              </div>

              {/* Princess Royal Luxury Shopping Cart Header Badge */}
              <button 
                onClick={() => setIsSlideCartOpen(true)}
                style={{
                  backgroundImage: "linear-gradient(135deg, #fffcf9 0%, #f7eae1 50%, #ead3c6 100%)",
                  border: "1.5px solid #dfa38f",
                  boxShadow: "inset 0 1.5px 3px rgba(255, 255, 255, 0.95), 0 4px 14px rgba(184, 134, 115, 0.22)",
                }}
                className="relative h-10 px-3.5 rounded-full cursor-pointer transition-all duration-300 focus:outline-none flex items-center gap-1.5 hover:scale-105 active:scale-95 group"
                aria-label="View Shopping Cart"
              >
                {/* Real Treble Clef Musical Symbol */}
                <span 
                  className="text-lg leading-none select-none text-[#7c5c4e] font-serif font-normal group-hover:scale-110 transition-transform duration-300 shrink-0"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  𝄞
                </span>
                <span 
                  className="text-[10px] font-extrabold uppercase tracking-wider text-[#5a3e36]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Cart
                </span>
                {cartCount > 0 && (
                  <span 
                    className="text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-[0_2px_6px_rgba(124,92,78,0.35)] animate-bounce ml-0.5"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #b88673 50%, #7a5446 100%)",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="relative group">
                <button className="text-[#6e5a51] font-sans text-[11px] uppercase tracking-[0.08em] font-bold hover:text-[#3d251c] border border-[#8a6858]/20 bg-white/60 hover:bg-[#faf6f4] px-4.5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 focus:outline-none flex items-center gap-1.5 shadow-xs">
                  {isLoggedIn ? `Welcome, ${userName}` : "Account"}
                  <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:rotate-180">
                    keyboard_arrow_down
                  </span>
                </button>
                {/* Bridge wrapper to prevent flickering */}
                <div className="absolute right-0 top-full pt-2 w-52 hidden group-hover:block transition-all duration-300 z-50">
                  <div className="bg-white/95 backdrop-blur-md border border-[#e8cdc1]/40 rounded-2xl shadow-[0_12px_32px_rgba(89,60,48,0.15)] overflow-hidden flex flex-col p-1.5">
                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        className="w-full text-left px-4 py-3 text-xs text-[#6e4f42] hover:text-[#4a3227] hover:bg-gradient-to-r hover:from-[#faf4f0] hover:to-[#f3e6df] font-semibold tracking-wider rounded-xl bg-transparent border-none cursor-pointer transition-all duration-200 flex items-center gap-2.5 shadow-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#7c5c4e] shadow-[0_0_8px_rgba(124,92,78,0.6)]"></span>
                        Sign Out
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onNavigate("signin")}
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          className="w-full text-left px-4 py-3 text-xs text-[#6e4f42] hover:text-[#4a3227] hover:bg-gradient-to-r hover:from-[#faf4f0] hover:to-[#f3e6df] font-semibold tracking-wider rounded-xl bg-transparent border-none cursor-pointer transition-all duration-200 flex items-center gap-2.5"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#a48274] shadow-[0_0_6px_rgba(164,130,116,0.5)]"></span>
                          Sign In
                        </button>
                        <div className="h-px bg-[#e8cdc1]/30 w-full my-1" />
                        <button
                          onClick={() => onNavigate("signup")}
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          className="w-full text-left px-4 py-3 text-xs text-[#6e4f42] hover:text-[#4a3227] hover:bg-gradient-to-r hover:from-[#faf4f0] hover:to-[#f3e6df] font-semibold tracking-wider rounded-xl bg-transparent border-none cursor-pointer transition-all duration-200 flex items-center gap-2.5"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#7c5c4e] shadow-[0_0_6px_rgba(124,92,78,0.5)]"></span>
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div 
          className={`flex flex-col ${view === "dashboard" ? "h-auto flex-grow-0 pb-10" : "flex-grow"}`}
          style={
            view === "dashboard" ? {
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('/sonata.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#ffffff'
            } : (view === "privacy" || view === "terms" ? {
              backgroundImage: `url('/white-peach-marble.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#faf0ed'
            } : (view === "my-library" || view === "download-page" || view === "invoice" ? {
              backgroundImage: `linear-gradient(rgba(255, 248, 246, 0.50), rgba(255, 248, 246, 0.50)), url('/library-sheet3.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#fff8f6'
            } : undefined))
          }
        >{children}</div>

        {/* Footer */}
        {true && (
          <>
            <footer className={`w-full py-16 ${view === "dashboard" ? "mt-0 bg-[#fffdfb] border-t border-[#dfa38f]/30" : "mt-auto bg-[#fffdfb] border-[#dfa38f]/30"} relative`}>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-start gap-x-8 gap-y-10 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
                {/* Column 1: Brand Info */}
                <div className="flex flex-col gap-4 w-full">
                  <div className="w-fit flex flex-col gap-1.5">
                    <div className="font-display-lg text-lg md:text-xl font-bold tracking-wide bg-gradient-to-r from-[#805c51] via-[#ab7e66] to-[#5a3e36] bg-clip-text text-transparent">
                      Phanilie Music
                    </div>
                    <div
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, #dfa38f 0%, #ab7e66 30%, #ffd0ab 60%, #f5b8c9 100%)",
                      }}
                      className="h-[3px] w-full rounded-full"
                    />
                  </div>
                  <p className="font-sans text-xs md:text-sm leading-relaxed font-semibold text-[#5a4740]">
                    Premium Gospel and Jazz Piano Lessons. Elevating your full-piano potential.
                  </p>
                </div>

                {/* Thick Rose Gold Vertical Divider */}
                <div className="hidden lg:block w-[2.5px] bg-gradient-to-b from-[#dfa38f]/10 via-[#dfa38f]/40 to-[#dfa38f]/10 self-stretch my-1" />
                <div className="block lg:hidden h-[1.5px] w-full bg-[#dfa38f]/20" />

                {/* Column 2: Connect */}
                <div className="flex flex-col gap-4 w-full">
                  <div className="w-fit flex flex-col gap-1.5">
                    <h5 className="font-sans text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#805c51] via-[#ab7e66] to-[#5a3e36] bg-clip-text text-transparent">
                      Connect with the Phanilie Network
                    </h5>
                    <div
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, #dfa38f 0%, #ab7e66 30%, #ffd0ab 60%, #f5b8c9 100%)",
                      }}
                      className="h-[3px] w-full rounded-full"
                    />
                  </div>
                  {/* SVG Gradient definitions for premium rose gold icon fills */}
                  <svg className="w-0 h-0 absolute">
                    <defs>
                      <linearGradient
                        id="glossy-rosegold-grad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#ab7e66" />
                        <stop offset="50%" stopColor="#dfa38f" />
                        <stop offset="100%" stopColor="#f5b8c9" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex flex-row items-center gap-3.5 mt-2">
                    <a
                      href="https://www.youtube.com/@phanilie"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-[#dfa38f]/30 bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-105 hover:bg-[#dfa38f]/10 hover:border-[#dfa38f]/60 group flex-shrink-0"
                      aria-label="YouTube"
                    >
                      <svg
                        className="w-4 h-4 group-hover:fill-[#ab7e66] transition-colors duration-200 block flex-shrink-0"
                        fill="url(#glossy-rosegold-grad)"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/phanilie_?igsh=c2hzOWJpZ3lyN2l6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-[#dfa38f]/30 bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-105 hover:bg-[#dfa38f]/10 hover:border-[#dfa38f]/60 group flex-shrink-0"
                      aria-label="Instagram"
                    >
                      <svg
                        className="w-4 h-4 group-hover:fill-[#ab7e66] transition-colors duration-200 block flex-shrink-0"
                        fill="url(#glossy-rosegold-grad)"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.tiktok.com/@phanilie_?is_from_webapp=1&sender_device=pc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-[#dfa38f]/30 bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-105 hover:bg-[#dfa38f]/10 hover:border-[#dfa38f]/60 group flex-shrink-0"
                      aria-label="TikTok"
                    >
                      <svg
                        className="w-4 h-4 group-hover:fill-[#ab7e66] transition-colors duration-200 block flex-shrink-0"
                        fill="url(#glossy-rosegold-grad)"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.43 6.1a8.18 8.18 0 0 1-5.1-1.77v9.4a7.73 7.73 0 1 1-7.73-7.73 7.6 7.6 0 0 1 1.72.2V10a3.68 3.68 0 0 0-1.72-.4 3.73 3.73 0 1 0 3.73 3.73V0h4a8.14 8.14 0 0 0 5.1 1.77z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Thick Rose Gold Vertical Divider */}
                <div className="hidden lg:block w-[2.5px] bg-gradient-to-b from-[#dfa38f]/10 via-[#dfa38f]/40 to-[#dfa38f]/10 self-stretch my-2" />
                <div className="block lg:hidden h-[1.5px] w-full bg-[#dfa38f]/20" />

                {/* Column 3: Legal & Support */}
                <div className="flex flex-col gap-4 w-full">
                  <div className="w-fit flex flex-col gap-1.5">
                    <h5 className="font-sans text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#805c51] via-[#ab7e66] to-[#5a3e36] bg-clip-text text-transparent">
                      Legal &amp; Support
                    </h5>
                    <div
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, #dfa38f 0%, #ab7e66 30%, #ffd0ab 60%, #f5b8c9 100%)",
                      }}
                      className="h-[3px] w-full rounded-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2.5 mt-1">
                    <button
                      onClick={() => onNavigate("faq")}
                      className="text-sm text-left bg-transparent border-none cursor-pointer p-0 font-semibold text-[#5a4740] hover:text-[#3d251c] hover:underline underline-offset-4 decoration-[#dfa38f]/50 transition-colors"
                    >
                      FAQ
                    </button>
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="text-sm text-left bg-transparent border-none cursor-pointer p-0 font-semibold text-[#5a4740] hover:text-[#3d251c] hover:underline underline-offset-4 decoration-[#dfa38f]/50 transition-colors"
                    >
                      Contact Phanilie
                    </button>
                  </div>
                </div>

                {/* Thick Rose Gold Vertical Divider */}
                <div className="hidden lg:block w-[2.5px] bg-gradient-to-b from-[#dfa38f]/10 via-[#dfa38f]/40 to-[#dfa38f]/10 self-stretch my-2" />
                <div className="block lg:hidden h-[1.5px] w-full bg-[#dfa38f]/20" />

                {/* Column 4: Newsletter */}
                <div className="flex flex-col gap-4 w-full">
                  <div className="w-fit flex flex-col gap-1.5">
                    <h5 className="font-sans text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#805c51] via-[#ab7e66] to-[#5a3e36] bg-clip-text text-transparent">
                      Newsletter
                    </h5>
                    <div
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, #dfa38f 0%, #ab7e66 30%, #ffd0ab 60%, #f5b8c9 100%)",
                      }}
                      className="h-[3px] w-full rounded-full"
                    />
                  </div>
                  <p className="font-sans text-xs md:text-sm leading-relaxed font-semibold text-[#5a4740]">
                    <span>Practical Piano Tips every week.</span>
                    <span className="block mt-0.5">
                      Have them delivered into your inbox.
                    </span>
                  </p>
                  {isNewsletterSent ? (
                    <div className="flex items-center gap-1.5 mt-2.5 text-xs font-bold text-emerald-700 bg-emerald-100/60 border border-emerald-200/50 py-2 px-4 rounded-full w-fit animate-in fade-in duration-300">
                      <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                      Subscribed! Thank you.
                    </div>
                  ) : (
                    <form
                      className="flex gap-2.5 mt-1"
                      onSubmit={handleNewsletterSubmit}
                    >
                      <input
                        className="bg-white border border-[#dfa38f]/30 rounded-full px-5 py-2.5 text-xs w-48 text-[#5a4740] placeholder-[#ab7e66]/50 shadow-[inset_0_1px_3px_rgba(223,163,143,0.03)] focus:outline-none focus:ring-1 focus:ring-[#dfa38f]/40 focus:border-[#dfa38f]/40 transition-all"
                        placeholder="Email"
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                      />
                      <button
                        type="submit"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #f5b8c9 100%)",
                        }}
                        className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[0_3px_8px_rgba(223,163,143,0.25)] flex-shrink-0 text-[#fbf7f0]"
                      >
                        <span className="material-symbols-outlined text-sm font-bold block">
                          send
                        </span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </footer>

            {/* Sub-footer Section */}
            <div
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #f6d8cc 0%, #dfa38f 100%)",
              }}
              className="border-t border-[#dfa38f]/30 py-6 px-6 md:px-12 w-full text-xs text-[#3d251c]"
            >
              <div className="max-w-[1200px] mx-auto w-full">
                <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2 justify-between">
                  <p className="whitespace-nowrap font-bold text-[#3d251c]">
                    © 2026 Phanilie Music. All rights reserved.
                  </p>

                  <div className="flex flex-row items-center gap-4 flex-wrap">
                    <button
                      onClick={() => onNavigate("privacy")}
                      className="text-[#3d251c]/80 hover:text-[#3d251c] transition-colors bg-transparent border-none cursor-pointer p-0 text-xs whitespace-nowrap font-bold focus:outline-none"
                    >
                      Privacy Policy
                    </button>

                    <span className="text-[#3d251c]/40">|</span>

                    <button
                      onClick={() => onNavigate("terms")}
                      className="text-[#3d251c]/80 hover:text-[#3d251c] transition-colors bg-transparent border-none cursor-pointer p-0 text-xs whitespace-nowrap font-bold focus:outline-none"
                    >
                      Terms of Use
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white/95 border border-[#e8cdc1]/40 rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setContactSubmitted(false);
                }}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#f3ecea] hover:bg-[#e8cdc1] transition-colors border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              {!contactSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                    setContactForm({ name: "", email: "", message: "" });
                  }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-xl font-bold text-[#6e5a51] font-display-lg">
                      Secure Contact Form
                    </h3>
                    <p className="text-xs text-[#81756f] mt-1">
                      Get in touch directly with our administration.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4f4540] uppercase tracking-wider mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full bg-[#f3ecea] border-none rounded-xl py-3 px-4 text-sm text-[#4f4540] focus:ring-2 focus:ring-[#e8cdc1] outline-none"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4f4540] uppercase tracking-wider mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-[#f3ecea] border-none rounded-xl py-3 px-4 text-sm text-[#4f4540] focus:ring-2 focus:ring-[#e8cdc1] outline-none"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4f4540] uppercase tracking-wider mb-1.5">
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            message: e.target.value,
                          })
                        }
                        className="w-full bg-[#f3ecea] border-none rounded-xl py-3 px-4 text-sm text-[#4f4540] focus:ring-2 focus:ring-[#e8cdc1] outline-none resize-none"
                        placeholder="write your questions"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-br from-[#e8cdc1] to-[#f9ddd1] text-[#6a564d] py-3.5 rounded-xl font-bold hover:shadow-lg active:scale-95 transition-all border-none cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <span
                    className="material-symbols-outlined text-5xl text-emerald-600"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#6e5a51]">
                      Message Sent!
                    </h3>
                    <p className="text-xs text-[#81756f] mt-1">
                      Thank you for reaching out. We will get back to you
                      shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowContactModal(false);
                      setContactSubmitted(false);
                    }}
                    className="px-6 py-2.5 bg-[#6e5a51] text-white rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all border-none cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-28 right-6 z-[120] bg-white border border-[#dfa38f]/40 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-3 animate-in slide-in-from-top-6 duration-300">
            <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base font-bold">check</span>
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-[#4a372e] uppercase tracking-wider">Success</p>
              <p className="text-xs text-[#8b7368] mt-0.5">{toastMessage}</p>
            </div>
          </div>
        )}

        {/* Slide Cart / Mini Cart (Samping) */}
        {isSlideCartOpen && (
          <div 
            className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex justify-end"
            onClick={() => setIsSlideCartOpen(false)}
          >
            <div 
              className="w-full max-w-md bg-white border-l border-[#dfa38f]/20 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-[#e8cdc1]/20">
                <h3 className="font-display-lg text-lg text-[#4a372e] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Shopping Cart
                </h3>
                <button 
                  onClick={() => setIsSlideCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#f3ecea] hover:bg-[#e8cdc1] text-[#6e5a51] flex items-center justify-center cursor-pointer border-none transition-colors"
                >
                  <span className="material-symbols-outlined text-sm select-none">close</span>
                </button>
              </div>

              {/* Item list */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.sheet.title} className="flex gap-4 items-center bg-[#fbf5f1]/60 p-3.5 rounded-xl border border-[#e8cdc1]/10 text-left">
                      <img 
                        src={item.sheet.image} 
                        alt={item.sheet.title} 
                        className="w-16 h-16 object-cover rounded-lg border border-[#e8cdc1]/25"
                      />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-bold text-[#4a372e] truncate">{item.sheet.title}</h4>
                        <p className="text-[10px] text-[#8b7368] mt-0.5">{item.sheet.genres.join(', ')}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-bold text-[#856758]">{item.sheet.price}</span>
                          <span className="text-[10px] bg-[#e8cdc1]/20 text-[#856758] font-bold px-1.5 py-0.5 rounded">Qty: 1</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const updated = cartItems.filter(i => i.sheet.title !== item.sheet.title);
                          localStorage.setItem('phanilie_cart', JSON.stringify(updated));
                          window.dispatchEvent(new Event('storage'));
                          refreshCart();
                        }}
                        className="w-7 h-7 rounded-full bg-[#f3ecea] hover:bg-[#e8cdc1]/40 text-[#ab7e66] hover:text-[#5a3d31] flex items-center justify-center transition-all border border-[#e8cdc1]/30 cursor-pointer shadow-2xs shrink-0"
                        title="Remove from Cart"
                      >
                        <span className="material-symbols-outlined text-xs font-bold">close</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-[#8b7368]/60 space-y-3">
                    <span className="material-symbols-outlined text-4xl font-light">shopping_basket</span>
                    <span className="text-xs font-semibold">Your cart is empty.</span>
                  </div>
                )}
              </div>

              {/* Bottom Panel */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-[#e8cdc1]/20 bg-[#fcfaf9] space-y-4">
                  <div className="flex justify-between text-xs text-[#5a4740] font-semibold">
                    <span>Items: <strong className="text-[#4a372e]">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</strong></span>
                    <span>Subtotal: <strong className="text-[#856758]">{
                      (() => {
                        const subtotal = cartItems.reduce((acc, item) => {
                          const freshSheet = sheets.find(s => s.title === item.sheet.title);
                          const priceStr = freshSheet ? freshSheet.price : item.sheet.price;
                          const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
                          return acc + price * item.quantity;
                        }, 0);
                        return `$${subtotal.toFixed(2)}`;
                      })()
                    }</strong></span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <button 
                      onClick={() => {
                        setIsSlideCartOpen(false);
                        onNavigate('cart');
                      }}
                      className="w-full py-3 bg-[#856758] hover:bg-[#785b4c] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer border-none shadow-md hover:shadow-lg"
                    >
                      View Shopping Cart
                    </button>
                    <button 
                      onClick={() => {
                        setIsSlideCartOpen(false);
                        onNavigate('checkout');
                      }}
                      style={{
                        backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                      }}
                      className="w-full text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl border border-white/20 cursor-pointer shadow-md hover:scale-[1.01] transition-all"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
