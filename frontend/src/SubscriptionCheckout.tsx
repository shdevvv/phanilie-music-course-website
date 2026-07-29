import { useState, useEffect } from 'react';
import SearchableCountryDropdown from './SearchableCountryDropdown';

interface SubscriptionCheckoutProps {
  plan: {
    name: string;
    price: string;
    period: string;
    desc: string;
  };
  onBack: () => void;
  onSuccessRedirect: () => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$ ' },
  { code: 'IDR', symbol: 'Rp ' }
];

export default function SubscriptionCheckout({ plan, onBack, onSuccessRedirect }: SubscriptionCheckoutProps) {
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'awaiting' | 'success'>('form');
  const [customerInfo, setCustomerInfo] = useState({
    fullName: localStorage.getItem('guest_name') || '',
    email: localStorage.getItem('guest_email') || '',
    country: localStorage.getItem('guest_country') || 'Indonesia'
  });

  const [selectedCurrency, setSelectedCurrency] = useState('IDR');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // CC fields
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvv, setCcCvv] = useState('');

  // Awaiting Payment instructions info
  const [orderId, setOrderId] = useState('');
  const [vaNumber, setVaNumber] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes timer

  // Auto currency based on country
  useEffect(() => {
    if (customerInfo.country === 'Indonesia') {
      setSelectedCurrency('IDR');
    } else {
      setSelectedCurrency('USD');
    }
  }, [customerInfo.country]);

  // Keep payment method valid when currency changes
  useEffect(() => {
    const isLocal = selectedCurrency === 'IDR' || customerInfo.country === 'Indonesia';
    if (!isLocal && paymentMethod !== 'Credit Card' && paymentMethod !== 'PayPal') {
      setPaymentMethod('Credit Card');
    }
  }, [selectedCurrency, customerInfo.country, paymentMethod]);

  // Countdown timer for awaiting payment
  useEffect(() => {
    if (checkoutStep !== 'awaiting' || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [checkoutStep, timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const basePriceUSD = parseFloat(plan.price.replace('$', ''));
  const conversionRate = 15500;
  
  // Calculate price based on currency
  const getPlanPrice = () => {
    if (selectedCurrency === 'IDR') {
      return basePriceUSD * conversionRate;
    }
    return basePriceUSD;
  };

  const getTax = () => getPlanPrice() * 0.1;
  const getTotal = () => getPlanPrice() + getTax();

  const formatPrice = (val: number) => {
    if (selectedCurrency === 'IDR') {
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
    return `$${val.toFixed(2)}`;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.fullName.trim() || !customerInfo.email.trim()) {
      setPaymentError('Full Name and Email Address are required.');
      return;
    }
    setPaymentError('');
    setIsProcessing(true);

    try {
      const payload = {
        amount: getTotal(),
        currency: selectedCurrency,
        paymentMethod: paymentMethod,
        customerName: customerInfo.fullName,
        customerEmail: customerInfo.email
      };

      const response = await fetch('http://localhost:5064/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with Midtrans gateway.');
      }

      const result = await response.json();
      setOrderId(result.orderId || ('SUB-' + Math.floor(Math.random() * 1000000)));
      setVaNumber(result.vaNumber || '');
      setQrCodeUrl(result.qrCodeUrl || '');
      setRedirectUrl(result.redirectUrl || '');

      setIsProcessing(false);
      if (paymentMethod === 'Credit Card') {
        // Cards succeed immediately in mock mode
        setCheckoutStep('success');
      } else {
        setTimeLeft(900);
        setCheckoutStep('awaiting');
      }
    } catch (err: any) {
      // Simulation mode fallback if backend is offline
      console.warn("Backend offline, triggering subscription simulation mode.");
      const mockOrderId = 'SUB-' + Math.floor(Math.random() * 1000000);
      setOrderId(mockOrderId);
      setVaNumber(paymentMethod.toLowerCase().includes('va') ? '88012' + Math.floor(10000000 + Math.random() * 90000000) : '');
      setQrCodeUrl(paymentMethod === 'QRIS' || paymentMethod === 'GoPay' || paymentMethod === 'DANA' || paymentMethod === 'ShopeePay' ? 'https://docs.midtrans.com/asset/image/showcase/qris-gopay.png' : '');
      setRedirectUrl(paymentMethod === 'PayPal' ? 'https://www.sandbox.paypal.com/checkoutnow?token=mock-sub-123' : '');

      setTimeout(() => {
        setIsProcessing(false);
        if (paymentMethod === 'Credit Card') {
          setCheckoutStep('success');
        } else {
          setTimeLeft(900);
          setCheckoutStep('awaiting');
        }
      }, 1500);
    }
  };

  const handleSimulatePaymentCompletion = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep('success');
    }, 1500);
  };

  const isLocal = selectedCurrency === 'IDR' || customerInfo.country === 'Indonesia';

  return (
    <div className="relative text-[#5a4740]">
      {/* 1. CHECKOUT FORM STEP */}
      {checkoutStep === 'form' && (
        <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/25 shadow-xl rounded-[24px] p-6 md:p-10 max-w-2xl mx-auto animate-in fade-in duration-300 relative text-left">
          {isProcessing && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[24px] gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-[#dfa38f]/20 border-t-[#dfa38f] animate-spin" />
              <span className="text-xs font-bold text-[#4a372e] tracking-widest uppercase animate-pulse">Contacting Midtrans Secure Gateway...</span>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-[#e8cdc1]/20 mb-6">
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab7e66]">Subscription Checkout</span>
              <h2 className="font-display-lg text-xl text-[#4a372e] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Subscribe to {plan.name} Plan
              </h2>
            </div>
            <button 
              onClick={onBack}
              className="py-1.5 px-3 hover:bg-[#e8cdc1]/20 text-[#6e5a51] font-bold text-xs rounded-lg transition-colors cursor-pointer border-none bg-transparent flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Plans
            </button>
          </div>

          {paymentError && (
            <div className="bg-red-50 border border-red-200/50 text-red-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 mb-5 text-left">
              <span className="material-symbols-outlined text-sm">error</span>
              {paymentError}
            </div>
          )}

          <form onSubmit={handleCheckout} className="space-y-6">
            {/* Step A: Billing details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#4a372e] uppercase tracking-wider border-b border-[#e8cdc1]/10 pb-1.5">1. Billing Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Full Name</label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    placeholder="e.g. Stephanie Halim"
                    className="w-full bg-white border border-[#dfa38f]/30 rounded-xl px-4 py-3 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Email Address</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="yourname@example.com"
                    className="w-full bg-white border border-[#dfa38f]/30 rounded-xl px-4 py-3 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SearchableCountryDropdown
                  value={customerInfo.country}
                  onChange={(country) => setCustomerInfo({ ...customerInfo, country })}
                />
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Currency</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full bg-white border border-[#dfa38f]/30 rounded-xl px-4 py-3 text-xs text-[#5a4740] focus:outline-none focus:ring-1 focus:ring-[#dfa38f] font-bold"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol.trim()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step B: Payment method splitting */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#4a372e] uppercase tracking-wider border-b border-[#e8cdc1]/10 pb-1.5">2. Payment Method</h3>
              
              {isLocal ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-4">
                  {[
                    { name: 'Credit Card', icon: 'credit_card', desc: 'Visa, Mastercard, JCB' },
                    { name: 'Virtual Account BCA', icon: 'account_balance', desc: 'BCA Bank Transfer' },
                    { name: 'Virtual Account Mandiri', icon: 'account_balance', desc: 'Mandiri Transfer' },
                    { name: 'Virtual Account BNI', icon: 'account_balance', desc: 'BNI Transfer' },
                    { name: 'Virtual Account BRI', icon: 'account_balance', desc: 'BRI Transfer' },
                    { name: 'GoPay', icon: 'account_balance_wallet', desc: 'Gojek E-Wallet' },
                    { name: 'DANA', icon: 'wallet', desc: 'Dana E-Wallet' },
                    { name: 'ShopeePay', icon: 'shopping_bag', desc: 'Shopee E-Wallet' },
                    { name: 'QRIS', icon: 'qr_code_2', desc: 'GPN Unified QR' }
                  ].map((method) => {
                    const isSelected = paymentMethod === method.name;
                    return (
                      <button
                        key={method.name}
                        type="button"
                        onClick={() => setPaymentMethod(method.name)}
                        className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-[#dfa38f] bg-[#dfa38f]/10 shadow-[0_4px_12px_rgba(223,163,143,0.15)] ring-1 ring-[#dfa38f]' 
                            : 'border-[#e8cdc1]/40 bg-white hover:bg-[#fcf8f6] hover:border-[#dfa38f]/30'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-xl ${isSelected ? 'text-[#856758]' : 'text-[#8b7368]/60'}`}>
                          {method.icon}
                        </span>
                        <div>
                          <div className="text-[11px] font-bold text-[#4a372e]">{method.name}</div>
                          <div className="text-[8px] text-[#8b7368] mt-0.5 leading-snug">{method.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { name: 'Credit Card', icon: 'credit_card', desc: 'Visa, Mastercard, AMEX' },
                    { name: 'PayPal', icon: 'payments', desc: 'PayPal Checkout' }
                  ].map((method) => {
                    const isSelected = paymentMethod === method.name;
                    return (
                      <button
                        key={method.name}
                        type="button"
                        onClick={() => setPaymentMethod(method.name)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-[#dfa38f] bg-[#dfa38f]/10 shadow-[0_4px_12px_rgba(223,163,143,0.15)] ring-1 ring-[#dfa38f]' 
                            : 'border-[#e8cdc1]/40 bg-white hover:bg-[#fcf8f6] hover:border-[#dfa38f]/30'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-2xl ${isSelected ? 'text-[#856758]' : 'text-[#8b7368]/60'}`}>
                          {method.icon}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-[#4a372e]">{method.name}</div>
                          <div className="text-[9px] text-[#8b7368] mt-0.5 leading-snug">{method.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Credit Card Input Form */}
              {paymentMethod === 'Credit Card' && (
                <div className="bg-[#fcfaf9] border border-[#e8cdc1]/45 rounded-xl p-5 mb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between border-b border-[#e8cdc1]/20 pb-2">
                    <span className="text-[10px] font-bold uppercase text-[#856758] tracking-widest block">
                      Secure Credit Card details
                    </span>
                    <div className="flex gap-1.5">
                      <span className="text-[8px] bg-white border border-[#e8cdc1]/30 text-[#8b7368] font-bold px-1.5 py-0.5 rounded">VISA</span>
                      <span className="text-[8px] bg-white border border-[#e8cdc1]/30 text-[#8b7368] font-bold px-1.5 py-0.5 rounded">MASTERCARD</span>
                      <span className="text-[8px] bg-white border border-[#e8cdc1]/30 text-[#8b7368] font-bold px-1.5 py-0.5 rounded">JCB</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4111 1111 1111 1111"
                        value={ccNumber}
                        onChange={(e) => setCcNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19))}
                        className="w-full bg-white border border-[#dfa38f]/30 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                      />
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8b7368]/60 text-lg">credit_card</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={ccExpiry}
                        onChange={(e) => setCcExpiry(e.target.value.replace(/[^0-9/]/g, '').substring(0, 5))}
                        className="w-full bg-white border border-[#dfa38f]/30 rounded-lg px-4 py-2.5 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">CVV / CVN</label>
                      <input
                        type="password"
                        placeholder="123"
                        value={ccCvv}
                        onChange={(e) => setCcCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                        className="w-full bg-white border border-[#dfa38f]/30 rounded-lg px-4 py-2.5 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Sandbox Info */}
              {paymentMethod === 'PayPal' && (
                <div className="bg-[#fbf5f1] border border-[#e8cdc1]/35 rounded-xl p-5 mb-4 text-left animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">info</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#4a372e]">PayPal Redirection Sandbox</h4>
                      <p className="text-[10px] text-[#8b7368] mt-0.5">Upon clicking Subscribe, you will be securely redirected to the PayPal sandbox page to finalize your subscription payment.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step C: Order summary and final actions */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#4a372e] uppercase tracking-wider border-b border-[#e8cdc1]/10 pb-1.5">3. Order Summary</h3>
              
              <div className="bg-[#fcfaf9] border border-[#e8cdc1]/20 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <span>{plan.name} Subscription ({plan.period.replace('/', '').trim()}):</span>
                  <span className="font-bold text-[#4a372e]">{formatPrice(getPlanPrice())}</span>
                </div>
                <div className="flex justify-between border-b border-[#e8cdc1]/15 pb-2">
                  <span>Service Tax (10%):</span>
                  <span>{formatPrice(getTax())}</span>
                </div>
                <div className="flex justify-between font-bold text-[#856758] text-sm pt-1">
                  <span>Total Amount:</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>

              <div className="bg-[#fbf5f1] border border-[#e8cdc1]/30 rounded-xl p-4 flex items-center justify-between mb-2 text-xs">
                <div className="text-left">
                  <span className="font-semibold text-[#8b7368] block">Method Selected:</span>
                  <span className="font-bold text-[#4a372e] text-sm">{paymentMethod}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#8b7368] block">Amount to Pay:</span>
                  <span className="font-bold text-[#856758] text-base">{formatPrice(getTotal())}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={onBack}
                  className="py-3 px-5 bg-white border border-[#856758]/30 hover:bg-[#e8cdc1]/10 text-[#856758] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                  }}
                  className="flex-grow text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl border border-white/20 cursor-pointer shadow-md hover:scale-[1.01]"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 2. AWAITING PAYMENT INSTRUCTION PANEL */}
      {checkoutStep === 'awaiting' && (
        <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/25 shadow-xl rounded-[24px] p-6 md:p-10 max-w-xl mx-auto text-center animate-in fade-in duration-300">
          {isProcessing && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[24px] gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-[#dfa38f]/20 border-t-[#dfa38f] animate-spin" />
              <span className="text-xs font-bold text-[#4a372e] tracking-widest uppercase animate-pulse">Verifying Sandbox Payment...</span>
            </div>
          )}

          <div className="space-y-2 mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold uppercase tracking-widest border border-amber-200 animate-pulse">
              Awaiting Payment
            </span>
            <h2 className="font-display-lg text-2xl text-[#4a372e] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Complete Your Subscription
            </h2>
            <p className="text-[#8b7368] text-xs">Please follow the instructions below to complete your transaction.</p>
          </div>

          {/* Countdown Clock */}
          <div className="bg-red-50/60 border border-red-200/40 rounded-xl p-3 max-w-[200px] mx-auto mb-6 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-red-500 text-lg animate-pulse">schedule</span>
            <span className="text-red-700 font-mono text-sm font-bold">{formatTime(timeLeft)}</span>
          </div>

          {/* Dynamic Instructions Grid */}
          <div className="bg-[#fcfaf9] border border-[#e8cdc1]/30 rounded-xl p-5 mb-8 text-left space-y-4">
            <div className="flex justify-between text-xs pb-2 border-b border-[#e8cdc1]/20">
              <span className="text-[#8b7368]">Plan Selected:</span>
              <span className="font-bold text-[#4a372e]">{plan.name} Subscription</span>
            </div>
            <div className="flex justify-between text-xs pb-2 border-b border-[#e8cdc1]/20">
              <span className="text-[#8b7368]">Total Price:</span>
              <span className="font-bold text-[#856758]">{formatPrice(getTotal())}</span>
            </div>
            <div className="flex justify-between text-xs pb-2 border-b border-[#e8cdc1]/20">
              <span className="text-[#8b7368]">Order Reference ID:</span>
              <span className="font-mono font-bold text-[#4a372e]">{orderId}</span>
            </div>

            {/* QRIS / Wallet Instruction */}
            {qrCodeUrl && (
              <div className="flex flex-col items-center gap-4 py-3">
                <p className="text-[11px] text-[#8b7368] text-center">Scan the QR code below using your GoPay, DANA, ShopeePay, or bank application:</p>
                <div className="bg-white p-3 rounded-lg border border-[#dfa38f]/30 shadow-md">
                  <img src={qrCodeUrl} alt="Midtrans QRIS Code" className="w-48 h-48 object-contain" />
                </div>
              </div>
            )}

            {/* Virtual Account Instruction */}
            {vaNumber && (
              <div className="space-y-3.5 py-2">
                <div className="bg-[#fbf5f1] border border-[#dfa38f]/30 rounded-lg p-3 text-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#8b7368] block">Virtual Account Number</span>
                  <span className="font-mono text-lg font-extrabold text-[#4a372e] tracking-wider block mt-1">{vaNumber}</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      navigator.clipboard.writeText(vaNumber);
                      alert('VA Number copied to clipboard!');
                    }}
                    className="mt-2 text-[10px] text-[#856758] font-bold hover:underline cursor-pointer border-none bg-transparent"
                  >
                    Copy VA Number
                  </button>
                </div>
                <div className="text-[10px] text-[#8b7368] space-y-1 bg-white p-3.5 rounded-lg border border-[#e8cdc1]/20">
                  <span className="font-bold text-[#4a372e] block">Payment steps:</span>
                  <p>1. Open your Bank App or visit an ATM.</p>
                  <p>2. Select Transfer {`>`} Virtual Account.</p>
                  <p>3. Paste the copy number and check the billing name is correct.</p>
                  <p>4. Complete transfer.</p>
                </div>
              </div>
            )}

            {/* PayPal Redirect */}
            {redirectUrl && (
              <div className="flex flex-col items-center gap-4 py-3">
                <p className="text-[11px] text-[#8b7368] text-center">Click the link below to open PayPal checkout window securely:</p>
                <a 
                  href={redirectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="py-3 px-6 bg-[#ffc439] hover:bg-[#e2af30] text-[#003087] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 border-none shadow-md inline-block text-center"
                >
                  <span className="material-symbols-outlined text-base">payment</span>
                  Pay with PayPal
                </a>
              </div>
            )}
          </div>

          {/* Sandbox Mock Complete Action */}
          <div className="space-y-4">
            <button 
              onClick={handleSimulatePaymentCompletion}
              style={{
                backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
              }}
              className="w-full text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl border border-white/20 cursor-pointer shadow-md hover:scale-[1.01]"
            >
              Simulate Sandbox Payment Success
            </button>

            <button 
              onClick={() => setCheckoutStep('form')}
              className="py-2.5 px-4 bg-transparent text-[#8b7368] hover:underline font-bold text-xs border-none cursor-pointer"
            >
              Cancel Payment & Change Method
            </button>
          </div>
        </div>
      )}

      {/* 3. SUCCESS COMPLETED PAGE */}
      {checkoutStep === 'success' && (
        <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/25 shadow-xl rounded-[24px] p-8 md:p-12 max-w-md mx-auto text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-6 shadow-md border border-green-200">
            <span className="material-symbols-outlined text-3xl font-extrabold" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>

          <h2 className="font-display-lg text-2xl text-[#4a372e] font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Subscription Active!
          </h2>
          <p className="text-xs text-[#8b7368] leading-relaxed mb-6">
            Congratulations! You are now subscribed to the **{plan.name}** membership plan. 
            Your learning board is fully unlocked and ready to explore.
          </p>

          <div className="bg-[#fcfaf9] border border-[#e8cdc1]/20 rounded-xl p-4 text-xs space-y-2 text-left mb-8">
            <div className="flex justify-between">
              <span className="text-[#8b7368]">Account Holder:</span>
              <span className="font-bold text-[#4a372e]">{customerInfo.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8b7368]">Billing Cycle:</span>
              <span className="font-bold text-[#4a372e]">{plan.period.replace('/', '').trim()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8b7368]">Total Paid:</span>
              <span className="font-bold text-[#856758]">{formatPrice(getTotal())}</span>
            </div>
          </div>

          <button
            onClick={() => {
              // Simulate user logging in on subscription success
              localStorage.setItem("isLoggedIn", "true");
              localStorage.setItem("guest_name", customerInfo.fullName);
              localStorage.setItem("guest_email", customerInfo.email);
              localStorage.setItem("guest_country", customerInfo.country);
              window.dispatchEvent(new Event("storage"));
              onSuccessRedirect();
            }}
            style={{
              backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
            }}
            className="w-full text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl border border-white/20 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Go to My Learning Board
          </button>
        </div>
      )}
    </div>
  );
}
