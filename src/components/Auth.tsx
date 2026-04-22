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
    
    setTimeout(() => {
      if (view === 'forgot') {
        alert('Shard recovery pattern sent to ' + formData.email);
        setView('login');
      } else if (view === 'signup') {
        setView('otp');
      } else {
        const user = {
          name: formData.name || 'Architect User',
          email: formData.email,
          plan: 'Standard Tier'
        };
        localStorage.setItem('cloudvault_user', JSON.stringify(user));
        localStorage.setItem('cloudvault_auth_email', user.email);
        onLogin(user);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      setIsLoading(false);
      setView('success');
      setIsGenerating(true);
      const avatar = await generateSecureAvatar(`Neural ID fingerprint for ${formData.name}`);
      setGeneratedAvatar(avatar);
      setIsGenerating(false);
    }, 1500);
  };

  const handleFinalize = () => {
    const user = {
      name: formData.name || 'Vault User',
      email: formData.email,
      plan: 'Neural Pro',
      avatar: generatedAvatar
    };
    localStorage.setItem('cloudvault_user', JSON.stringify(user));
    localStorage.setItem('cloudvault_auth_email', user.email);
    onLogin(user);
  };

  const isLogin = view === 'login';
  const isForgot = view === 'forgot';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden font-['Outfit'] selection:bg-blue-500/30 selection:text-white pb-10">
      {/* Neural Background Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-blue-600/10 rounded-full blur-[120px] animate-neural-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      <div className="w-full max-w-xl px-1 relative z-10 animate-slide-up">
        {/* Superior Brand Identity Header */}
        <div className="text-center mb-12 relative px-4">
           <div className="flex justify-center mb-10">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_30px_60px_rgba(37,99,235,0.4)] animate-float-slow ring-8 ring-white/5 backdrop-blur-3xl overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
                 <svg className="w-12 h-12 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                 </svg>
              </div>
           </div>
           
           <div className="flex flex-col items-center">
              <div className="flex items-center gap-4 mb-4">
                 <span className="w-10 h-[2px] bg-blue-500/50 rounded-full"></span>
                 <span className="Vault-badge bg-blue-600/20 text-blue-400 border-blue-500/20 uppercase">Core Access v4.2</span>
                 <span className="w-10 h-[2px] bg-blue-500/50 rounded-full"></span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-[-0.05em] uppercase leading-[0.85]">
                {isForgot ? 'Shard Recovery' : isLogin ? 'Neural Access' : view === 'otp' ? 'Verification' : view === 'success' ? 'Vault Ready' : 'Vault Hub'}
              </h1>
              <p className="text-slate-400 font-black text-xs md:text-sm uppercase tracking-[0.5em] mt-6 opacity-60 uppercase">
                 {isForgot ? 'Locate Decentralized Shard' : isLogin ? 'Authorized Node Deployment' : view === 'otp' ? 'Validate Biometric Key' : view === 'success' ? 'Synchronizing Cluster' : 'Initialize Mesh Encryption'}
              </p>
           </div>
        </div>

        {/* High-Fidelity AUTH Container */}
        <div className="glass-dark rounded-[3.5rem] p-10 md:p-14 border border-white/5 shadow-2xl relative overflow-hidden mx-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -mr-32 -mt-32"></div>
          
          {(view === 'signup' || view === 'login' || view === 'forgot') ? (
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10 transition-all">
              {!isLogin && !isForgot && (
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">ARCHITECT IDENTITY</label>
                  <input
                    type="text"
                    required
                    placeholder="ENTER FULL NAME..."
                    className="w-full bg-white/5 border border-white/5 px-8 py-6 rounded-3xl text-white font-black text-lg placeholder:text-slate-600 focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all uppercase tracking-tight"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">UPLINK TERMINAL</label>
                <input
                  type="email"
                  required
                  placeholder="MAIL@Vault.SH..."
                  className="w-full bg-white/5 border border-white/5 px-8 py-6 rounded-3xl text-white font-black text-lg placeholder:text-slate-600 focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all uppercase tracking-tight"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {!isForgot && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center ml-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">ACCESS CIPHER</label>
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] font-black text-blue-400 uppercase tracking-widest"
                    >
                      {showPassword ? '[ HIDE ]' : '[ SHOW ]'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/5 px-8 py-6 rounded-3xl text-white font-black text-lg placeholder:text-slate-600 focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all tracking-[0.5em]"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}

              {isLogin && (
                <div className="text-right">
                  <button 
                    type="button" 
                    onClick={() => setView('forgot')}
                    className="text-[10px] font-black text-blue-400/60 uppercase tracking-widest hover:text-blue-400 transition-colors uppercase"
                  >
                    Shard Recovery Protocols
                  </button>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || (!isLogin && !isForgot && !formData.agreeToTerms)}
                  className="btn-neural btn-neural-primary !py-7 !text-[13px] w-full shadow-[0_20px_50px_rgba(37,99,235,0.3)] uppercase"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-5">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span className="tracking-[0.2em]">SYNCHRONIZING...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <span className="tracking-[0.2em]">{isForgot ? 'BEGIN RECOVERY' : isLogin ? 'DEPLOY CORE' : 'INITIALIZE HUB'}</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  )}
                </button>
              </div>

              {!isForgot && !isLogin && (
                 <div className="flex items-start gap-4 px-4 pt-4">
                    <div 
                      onClick={() => setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}
                      className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 mt-0.5 ${
                        formData.agreeToTerms ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white/5 border-white/10 text-transparent'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed cursor-pointer select-none" onClick={() => setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}>
                       ACKNOWLEDGE <span className="text-white">Vault-X</span> ARCHITECTURAL COMPLIANCE & SHARDING ENCRYPTION PROTOCOLS.
                    </p>
                 </div>
              )}
            </form>
          ) : view === 'otp' ? (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 relative z-10">
              <div className="flex justify-between gap-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    className="w-full h-20 bg-white/5 border border-white/10 text-center text-3xl font-black text-white rounded-[1.5rem] focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all uppercase"
                    value={digit}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v && isNaN(parseInt(v))) return;
                      const newOtp = [...otp];
                      newOtp[idx] = v;
                      setOtp(newOtp);
                      if (v && idx < 5) {
                        const next = e.target.nextElementSibling as HTMLInputElement;
                        next?.focus();
                      }
                    }}
                  />
                ))}
              </div>
              
              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.some(d => !d)}
                className="btn-neural btn-neural-primary !py-7 w-full uppercase text-[13px]"
              >
                {isLoading ? 'VERIFYING KEY...' : 'VALIDATE NODE ACCESS'}
              </button>
            </div>
          ) : (
            <div className="space-y-12 text-center animate-in fade-in zoom-in-95 duration-500 relative z-10">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-blue-500 rounded-[3.5rem] blur-[60px] opacity-20 animate-neural-pulse"></div>
                {isGenerating ? (
                  <div className="w-56 h-56 bg-white/5 rounded-[3.5rem] flex flex-col items-center justify-center gap-6 border border-white/10 relative z-10 backdrop-blur-xl">
                     <div className="w-16 h-16 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin"></div>
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">DECODING NEURAL ID</p>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <img 
                      src={generatedAvatar || ""} 
                      className="w-56 h-56 rounded-[3.5rem] object-cover border-4 border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-600 rounded-[1.75rem] flex items-center justify-center text-white shadow-2xl ring-8 ring-[#1A2333] animate-bounce">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white tracking-tighter uppercase uppercase">Neural ID Verified</h3>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] max-w-xs mx-auto uppercase">Security Cluster fully synchronized with biometric fingerprint.</p>
              </div>

              <button
                onClick={handleFinalize}
                className="btn-neural btn-neural-primary !py-7 w-full uppercase text-[13px] shadow-2xl shadow-blue-600/20"
              >
                DEPLOY VAULT PROTOCOLS
              </button>
            </div>
          )}
        </div>

        {/* Global Switch & Legal Relay */}
        <div className="mt-12 text-center relative z-10">
           <button 
             onClick={() => setView(isLogin ? 'signup' : 'login')}
             className="px-12 py-5 bg-white/5 hover:bg-white/10 text-[11px] font-black text-slate-400 hover:text-white uppercase tracking-[0.4em] transition-all rounded-3xl border border-white/5 backdrop-blur-md uppercase"
           >
             {isLogin ? "TERMINATE NODES • INITIALIZE NEW" : "EXISTING NODE? AUTHENTICATE"}
           </button>
        </div>

        <div className="mt-20 flex items-center justify-center gap-6 opacity-30">
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
           <p className="text-[10px] font-black text-white uppercase tracking-[0.8em]">VAULT OS v4.2 STABLE</p>
        </div>
      </div>
    </div>
  );
}
