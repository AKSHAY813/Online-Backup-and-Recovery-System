import React, { useState } from 'react';
import { generateSecureAvatar } from '../services/huggingFace';


interface AuthProps {
  onLogin: (user: any) => void;
}

type AuthView = 'login' | 'signup' | 'forgot' | 'otp' | 'success';


export function Auth({ onLogin }: AuthProps) {
  const [view, setView] = useState<AuthView>('signup');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (view === 'forgot') {
        alert('Recovery link sent to ' + formData.email);
        setView('login');
      } else if (view === 'signup') {
        // Transition to OTP for signup
        setView('otp');
      } else {
        const user = {
          name: formData.name || 'John Doe',
          email: formData.email,
          plan: 'Standard Cloud Plan'
        };
        // Persist in localStorage for "after uninstall" simulation (standard persistence)
        localStorage.setItem('cloudvault_user', JSON.stringify(user));
        localStorage.setItem('cloudvault_auth_email', user.email);
        onLogin(user);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    // Simulate verification
    setTimeout(async () => {
      setIsLoading(false);
      setView('success');
      setIsGenerating(true);
      
      // Generate AI Avatar
      const avatar = await generateSecureAvatar(`Security vault access key for ${formData.name}`);
      setGeneratedAvatar(avatar);
      setIsGenerating(false);
    }, 1500);
  };

  const handleFinalize = () => {
    const user = {
      name: formData.name || 'John Doe',
      email: formData.email,
      plan: 'Standard Cloud Plan',
      avatar: generatedAvatar
    };
    localStorage.setItem('cloudvault_user', JSON.stringify(user));
    localStorage.setItem('cloudvault_auth_email', user.email);
    onLogin(user);
  };


  const isLogin = view === 'login';
  const isForgot = view === 'forgot';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-8 items-center justify-center relative overflow-hidden font-['Outfit']">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-12">
          {isForgot || view === 'otp' ? (
            <button 
              onClick={() => setView('login')}
              className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-2xl shadow-sm border border-slate-100 transition-all active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          ) : <div className="w-11"></div>}
          
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 rotate-3">
             <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
             </svg>
          </div>
          
          <div className="w-11"></div>
        </div>

        {/* Content Box */}
        <div className="sentinel-card p-10 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">
              {isForgot ? 'Recovery' : isLogin ? 'Authenticate' : view === 'otp' ? 'Validate' : view === 'success' ? 'Synchronized' : 'Initiate'}
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
               {isForgot ? 'Secure Shard Retrieval' : isLogin ? 'Accessing Global Node' : view === 'otp' ? 'Biometric verification' : view === 'success' ? 'Vault access granted' : 'Creating decentralized shard'}
            </p>
          </div>

          {(view === 'signup' || view === 'login' || view === 'forgot') ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && !isForgot && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terminal</label>
                <input
                  type="email"
                  required
                  placeholder="name@cloudvault.sh"
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest ml-1 mt-1">
                  1-to-1 Map: Only one mail terminal is supported per active session. To change vaults, re-login is required.
                </p>
              </div>

              {!isForgot && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key</label>
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}

              {isLogin && (
                <button 
                  type="button" 
                  onClick={() => setView('forgot')}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest w-full text-right hover:text-blue-800"
                >
                  Retrieve Access Key
                </button>
              )}

              {!isForgot && !isLogin && (
                <div className="flex items-center gap-4 px-2 mt-4">
                  <div 
                    onClick={() => setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                      formData.agreeToTerms ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 border-slate-100 text-transparent'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <label 
                    onClick={() => setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}
                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer select-none leading-tight"
                  >
                    Acknowledge Sentinel Sharding Compliance
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || (!isLogin && !isForgot && !formData.agreeToTerms)}
                className="w-full bg-[#0052A1] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span>{isForgot ? 'Request Shard' : isLogin ? 'Decrypt & Open' : 'Initialize Vault'}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </button>
            </form>
          ) : view === 'otp' ? (
            <div className="space-y-10">
              <div className="flex justify-between gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    className="w-full h-16 bg-slate-50 border border-slate-100 text-center text-2xl font-black text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                      if (e.target.value && idx < 5) {
                        const next = e.target.nextElementSibling as HTMLInputElement;
                        next?.focus();
                      }
                    }}
                  />
                ))}
              </div>
              
              <button
                onClick={handleVerifyOTP}
                className="w-full bg-[#0052A1] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-800 transition-all active:scale-[0.98]"
              >
                Validate Shard Entry
              </button>
            </div>
          ) : (
            <div className="space-y-10 text-center">
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-blue-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                {isGenerating ? (
                  <div className="w-48 h-48 bg-slate-50 rounded-[3rem] flex flex-col items-center justify-center gap-4 border border-slate-100 relative z-10">
                     <div className="w-12 h-12 border-[5px] border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decoding Neural ID</p>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <img 
                      src={generatedAvatar || ""} 
                      className="w-48 h-48 rounded-[3rem] object-cover border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl ring-4 ring-white animate-bounce">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Identity Verified</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">Your neural fingerprint is encrypted.</p>
              </div>

              <button
                onClick={handleFinalize}
                className="w-full bg-[#0052A1] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-800 transition-all active:scale-[1.02]"
              >
                Uplink to Vault
              </button>
            </div>
          )}
        </div>

        {/* Bottom Switch */}
        <div className="mt-10 text-center">
           <button 
             onClick={() => setView(isLogin ? 'signup' : 'login')}
             className="px-8 py-4 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all"
           >
             {isLogin ? "Terminate & Create New Node" : "Existing Node? Authenticate"}
           </button>
        </div>

        {/* Global Security Disclaimer */}
        <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] opacity-50">
           <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
           <p>End-to-End Encrypted Node • Sentinel OS v4</p>
        </div>
      </div>
    </div>
  );
}
