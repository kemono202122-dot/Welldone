import React, { useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../constants';

export const LoginPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) return null;
  const { currentUser, login } = context;

  useEffect(() => {
    if (currentUser) navigate(currentUser.role === 'admin' ? '/admin' : '/');
  }, [currentUser, navigate]);

  const handleAdminDemoLogin = () => {
      const admin = mockUsers.find(u => u.role === 'admin') || mockUsers[0];
      login({...admin, role: 'admin'});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2] font-outfit select-none relative overflow-hidden">
        {/* Editorial Blurs */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

        <div className="w-full max-w-4xl bg-white border border-[#4C3322]/10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm overflow-hidden flex flex-col md:flex-row relative z-10">
            
            {/* Left Cover Panel - Editorial Brand Intro */}
            <div className="md:w-1/2 bg-[#4C3322] text-[#FAF7F2] p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-[250px] h-[250px] rounded-full bg-[#8BAB70]/10 blur-2xl" />
                
                {/* Brand Logo/Badge */}
                <div className="z-10">
                    <span className="text-[10px] font-bold bg-[#FAF7F2]/10 text-[#FAF7F2] px-4 py-2 rounded-full uppercase tracking-widest border border-[#FAF7F2]/15">
                        Sanctuary Club
                    </span>
                </div>

                {/* Cover Main Headline */}
                <div className="my-12 md:my-0 z-10 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight leading-none text-[#FAF7F2]">
                        Cereen.
                    </h1>
                    <p className="text-xl md:text-2xl font-serif italic text-[#FAF7F2]/80 font-light leading-relaxed max-w-sm">
                        "Connecting through stillness, sharing the path."
                    </p>
                </div>

                {/* Issue Indicator */}
                <div className="z-10 text-[9px] uppercase tracking-widest text-[#FAF7F2]/40 font-bold">
                    <span>Summer Edition &copy; 2026</span>
                </div>
            </div>

            {/* Right Panel - Action Center */}
            <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-3xl font-serif font-black text-[#4C3322] leading-tight">Welcome Back</h2>
                    <p className="text-xs text-[#4C3322]/50 font-light mt-1.5 leading-relaxed">
                        Step back into your editorial space for mindful connections and travel journals.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Member Login Option */}
                    <button 
                        onClick={() => login(mockUsers[0])} 
                        className="w-full py-4.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
                    >
                        Login as Sanctuary Member
                    </button>

                    {/* Admin Access Option */}
                    <button 
                        onClick={handleAdminDemoLogin} 
                        className="w-full py-4.5 border border-[#4C3322]/20 hover:bg-[#4C3322]/5 text-[#4C3322] rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3"
                    >
                        <i className="fas fa-shield-alt text-[#8BAB70]"></i> Demo Administrative Access
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] text-[#4C3322]/40 font-bold uppercase tracking-widest">
                        mindful travel &middot; serene retreats &middot; journal shares
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};
