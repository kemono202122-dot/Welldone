import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { mockUsers } from '../constants';
import { HomepageChatbot } from './HomepageChatbot';

export const CereenLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  
  const context = useContext(AppContext);
  if (!context) return null;
  const { currentUser, login, logout } = context;

  // Custom Local Auth States
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Auto-dismiss toast
  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setToastMessage('Please enter both email and password.');
      return;
    }
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    
    // Attempt matching a mock user or create one dynamically
    const matchingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `user-${Date.now()}`,
      name: formattedName,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      bio: 'Finding balance, silence, and clarity through quarterly print columns.',
      interests: ['Mindfulness', 'Meditation'],
      friends: [],
      virtualBalance: 100,
      hasCompletedOnboarding: true,
      role: 'member',
      occupation: 'Collector'
    };

    login(matchingUser);
    setShowAuthModal(false);
    setEmail('');
    setPassword('');
    setToastMessage(`Welcome back, ${matchingUser.name}!`);
    navigate('/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setToastMessage('Please fill in all fields.');
      return;
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name: name,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      bio: 'Finding balance, silence, and clarity through quarterly print columns.',
      interests: ['Mindfulness', 'Meditation'],
      friends: [],
      virtualBalance: 100,
      hasCompletedOnboarding: true,
      role: 'member',
      occupation: 'Collector'
    };

    login(newUser);
    setShowAuthModal(false);
    setName('');
    setEmail('');
    setPassword('');
    setToastMessage(`Welcome, ${name}!`);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    setToastMessage('Successfully logged out.');
  };


  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 selection:bg-[#8BAB70] selection:text-white relative overflow-x-hidden">
      
      {/* 1. Header (Navbar) - Fixed height and spacing to perfectly match mockup */}
      <header className="max-w-7xl mx-auto flex items-center justify-between py-4 mb-8 border-b border-[#4C3322]/5">
        {/* Brand Logo - Standalone flower next to Cereen */}
        <div className="flex items-center gap-2.5 cursor-pointer select-none group" onClick={() => navigate('/')}>
          <svg className="w-8 h-8 text-[#4C3322] transform group-hover:rotate-45 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm-6-6a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm12 0a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
          </svg>
          <div>
            <h1 className="font-serif text-2xl font-black tracking-tight leading-none">Cereen</h1>
          </div>
        </div>

        {/* Navigation Links - Clean minimal magazine style */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#articles" className="hover:text-[#8BAB70] transition-colors flex items-center gap-1">
            Articles <span className="text-[11px] text-[#4C3322]/50 font-light">(121)</span>
          </a>
          <a href="#podcast" className="hover:text-[#8BAB70] transition-colors flex items-start">
            Podcast <sup className="text-[9px] text-[#4C3322]/60 font-light ml-0.5">[34]</sup>
          </a>
          <a href="#radio-shows" className="hover:text-[#8BAB70] transition-colors flex items-start">
            Radio Shows <sup className="text-[9px] text-[#4C3322]/60 font-light ml-0.5">[09]</sup>
          </a>
          <a href="#talk-to-us" className="text-[#4C3322] border-b border-[#4C3322] pb-0.5 hover:text-[#8BAB70] hover:border-[#8BAB70] transition-all">
            Talk to us
          </a>
        </nav>

        {/* Login / Register Buttons */}
        <div className="flex items-center bg-white/60 backdrop-blur-md border border-[#4C3322]/10 rounded-full p-1 shadow-sm">
          {currentUser ? (
            <div className="flex items-center gap-3 px-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-xs md:text-sm font-semibold text-[#8BAB70] hover:text-[#4C3322] transition-colors px-2 py-1.5"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-1.5 text-xs md:text-sm font-semibold bg-[#DE7A49]/15 text-[#DE7A49] hover:bg-[#DE7A49] hover:text-white rounded-full transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="px-5 py-2 text-xs md:text-sm font-medium hover:text-[#8BAB70] transition-colors rounded-full"
              >
                Login
              </button>
              <button 
                onClick={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
                className="px-5 py-2 text-xs md:text-sm font-semibold bg-[#FAF7F2] text-[#4C3322] rounded-full shadow-sm border border-[#4C3322]/5 hover:bg-white hover:shadow transition-all"
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* 2. Hero Section Layout Grid */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Headlines & Description */}
          <div className="lg:col-span-4 space-y-8 flex flex-col justify-center h-full">
            
            {/* Top custom badges with custom sunburst SVG icons */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#4C3322]/10 bg-white text-xs font-medium select-none shadow-sm">
                <svg className="w-3 h-3 text-[#8BAB70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                Mindfulness
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#4C3322]/10 bg-white text-xs font-medium select-none shadow-sm">
                <svg className="w-3 h-3 text-[#DE7A49]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                Meditation
              </span>
            </div>

            {/* Core Large Editorial Title */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif leading-[1.1] tracking-tight uppercase">
                <span className="block font-light text-[#4C3322]/80">WHERE YOUR</span>
                <span className="inline-block border border-[#4C3322]/30 px-6 py-2 my-2 rounded-full font-serif italic text-[#4C3322]/90 bg-white/20 shadow-inner">
                  MENTAL HEALTH
                </span>
                <span className="block font-black flex items-center flex-wrap gap-3">
                  FLOURISHES
                  <svg className="w-10 h-10 text-[#8BAB70] inline-block animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5V6h1a5.5 5.5 0 0 1 5.5 5.5v1.5a1.5 1.5 0 0 1-3 0v-1.5A2.5 2.5 0 0 0 14.5 10H13v10.5a1.5 1.5 0 0 1-3 0V10H8.5A2.5 2.5 0 0 0 6 12.5v1.5a1.5 1.5 0 0 1-3 0v-1.5A5.5 5.5 0 0 1 8.5 7h1V3.5A1.5 1.5 0 0 1 12 2z" />
                  </svg>
                </span>
              </h2>
              
              <p className="text-base text-[#4C3322]/70 leading-relaxed font-light max-w-sm">
                Dive into mindfulness practices, meditation techniques, and wellness tips to live a balanced, beautiful life.
              </p>
            </div>

            {/* CTAs & Bottom Icons */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-4">
                <button className="bg-[#8BAB70] hover:bg-[#77955e] text-white font-semibold px-8 py-3.5 rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                  Subscribe Now
                </button>
                <button className="border border-[#4C3322]/20 text-[#4C3322] hover:bg-[#4C3322]/5 font-semibold px-8 py-3.5 rounded-full transition-all duration-300">
                  Explore
                </button>
              </div>

              {/* Bottom interactive circle buttons */}
              <div className="flex items-center gap-3 pt-4">
                <a href="mailto:hello@cereen.com" className="w-12 h-12 rounded-full border border-[#4C3322]/15 bg-white/20 hover:bg-[#4C3322] hover:text-white flex items-center justify-center text-[#4C3322] transition-all duration-300 group shadow-sm">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
                <a href="#footer" className="w-12 h-12 rounded-full border border-[#4C3322]/15 bg-white/20 hover:bg-[#4C3322] hover:text-white flex items-center justify-center text-[#4C3322] transition-all duration-300 group shadow-sm">
                  <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* CENTER COLUMN: Main Silver Hair Editorial Card */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            
            {/* Outer Container with 3-dot decorative nodes - Set to beautiful soft grey background */}
            <div className="relative w-full bg-[#E5E4DE] rounded-[2.5rem] p-4 shadow-md border border-[#4C3322]/5">
              
              {/* Top-Right Decorative 3-Dots inside the grey container */}
              <div className="absolute top-8 right-8 flex gap-1.5 z-20">
                <div className="w-2 h-2 rounded-full bg-[#4C3322]/25"></div>
                <div className="w-2 h-2 rounded-full bg-[#4C3322]/25"></div>
                <div className="w-2 h-2 rounded-full bg-[#4C3322]/25"></div>
              </div>

              {/* Image Card Container with Custom Left Wavy Cutout */}
              <div className="relative w-full h-[520px] rounded-[2rem] overflow-hidden group shadow-lg">
                
                {/* Wavy left edge inset vector overlay - Matches the website cream background perfectly */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-[#FAF7F2] z-10 pointer-events-none hidden md:block">
                  <svg className="w-full h-full text-[#FAF7F2]" fill="currentColor" viewBox="0 0 100 1000" preserveAspectRatio="none">
                    <path d="M 100 0 C 40 100, 40 200, 100 300 C 40 400, 40 500, 100 600 C 40 700, 40 800, 100 900 C 40 950, 40 980, 100 1000 L 0 1000 L 0 0 Z" />
                  </svg>
                </div>

                {/* Main Generated Image */}
                <img 
                  src="/silver_hair_hero.png" 
                  alt="Silver Hair Wellness Hero" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[6s] ease-out" 
                />

                {/* Ambient vignette and warm color filter overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4C3322]/30 via-transparent to-transparent"></div>

                {/* Floating Glassmorphism Metric Card - Fully Transparent and White Text to match mockup */}
                <div className="absolute top-1/4 right-6 md:right-8 bg-white/15 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl text-white z-20 w-[220px] transform hover:scale-105 transition-all duration-300">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-serif text-3xl font-black leading-none">24k</span>
                    <span className="text-lg font-bold">↗</span>
                  </div>
                  <p className="text-[11px] font-medium leading-normal text-white/90">
                    Woman empowered through our magazines
                  </p>
                </div>

                {/* Floating tags at bottom of card - Replaced stars with organic sunbursts & set to transparent dark */}
                <div className="absolute bottom-6 left-6 md:left-20 right-6 flex flex-wrap gap-2.5 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold tracking-wide">
                    <svg className="w-2.5 h-2.5 text-[#8BAB70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                    Rediscover Your Inner Peace
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold tracking-wide">
                    <svg className="w-2.5 h-2.5 text-[#DE7A49]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                    holistic well-being
                  </span>
                </div>

              </div>

              {/* Bottom-Left Decorative 3-Dots inside the grey container */}
              <div className="absolute bottom-8 left-8 md:left-24 flex gap-1.5 z-20">
                <div className="w-2 h-2 rounded-full bg-[#4C3322]/25"></div>
                <div className="w-2 h-2 rounded-full bg-[#4C3322]/25"></div>
                <div className="w-2 h-2 rounded-full bg-[#4C3322]/25"></div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Meetups, Interactive Catalog & Secondary Portrait Card */}
          <div className="lg:col-span-3 space-y-8 flex flex-col justify-between h-full lg:min-h-[550px]">
            
            {/* Top Meetup Card - Directly on the cream background with thin chocolate underline to match mockup */}
            <div className="space-y-3 py-2">
              <div className="border-b border-[#4C3322]/15 pb-2">
                <h4 className="font-serif italic text-base font-bold flex items-center justify-between">
                  <span>Radiance Soirée</span>
                  <span className="text-[#8BAB70] not-italic">23</span>
                </h4>
              </div>
              <p className="text-xs text-[#4C3322]/70 leading-relaxed font-light">
                Upcoming 2023 meetup hosted by Cereen.
              </p>
            </div>

            {/* Premium Interactive Fanned Explore Button - Refined with exact fanned SVG circle layers */}
            <div className="relative flex items-center justify-center py-6 select-none group cursor-pointer">
              {/* Outer Fanned Ring Vector */}
              <div className="w-32 h-32 rounded-full flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-[1.5s] ease-in-out">
                <svg className="w-full h-full text-[#4C3322]/40" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 3" />
                  <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.75" />
                  <path d="M 50 16 A 34 34 0 0 1 84 50" fill="none" stroke="#4C3322" strokeWidth="1.5" />
                  <path d="M 50 84 A 34 34 0 0 1 16 50" fill="none" stroke="#8BAB70" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Core Floating Arrow & Text Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
                <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-[#4C3322] mt-0.5">Explore</span>
                <span className="text-[9px] tracking-[0.1em] uppercase text-[#4C3322]/60 leading-none">Catalog</span>
              </div>
            </div>

            {/* Secondary Portrait Image Card (Girl with hands over eyes) */}
            <div className="relative rounded-[2rem] overflow-hidden h-[260px] group shadow-lg">
              
              {/* Generated Image */}
              <img 
                src="/girl_expression_card.png" 
                alt="Girl Portrait Card" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
              />

              {/* Accent Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#4C3322]/40 via-transparent to-transparent"></div>

              {/* Floating Badges - Set to transparent dark with white text */}
              <div className="absolute top-4 left-4 flex gap-1.5 z-20">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 backdrop-blur-md text-[9px] font-semibold text-white border border-white/10">
                  ☼ Expression
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 backdrop-blur-md text-[9px] font-semibold text-white border border-white/10">
                  ❀ Self-care
                </span>
              </div>

              {/* Absolute glassmorphism floating statistic - Fully Transparent & White Text to match mockup */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-3.5 shadow text-white z-20 transform group-hover:translate-y-[-2px] transition-transform duration-300">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="font-serif text-xl font-black">17</span>
                  <span className="font-bold">↗</span>
                </div>
                <p className="text-[9.5px] leading-snug text-white/95 font-medium">
                  Successful Radio Shows & Podcasts Launched
                </p>
              </div>

              {/* Bottom corner 3-dot decorative node */}
              <div className="absolute bottom-20 left-4 flex gap-1 z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
              </div>

            </div>

          </div>

        </div>

        {/* 3. Footer Grid Section */}
        <footer id="footer" className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-[#4C3322]/15 mt-16 items-center">
          
          {/* Footer Left Column: Podcasts/Radio Shows - Domino 4-Dot list bullets */}
          <div className="space-y-4">
            
            {/* Podcast Item 1 */}
            <div className="border-t border-[#4C3322]/20 pt-4 pb-2 group cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <h5 className="font-serif italic font-bold group-hover:text-[#8BAB70] transition-colors flex items-center gap-3">
                  {/* Domino 4-dot grid icon */}
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3 text-[#4C3322] inline-grid self-center">
                    <div className="w-1 h-1 rounded-full bg-[#4C3322] group-hover:bg-[#8BAB70] transition-colors"></div>
                    <div className="w-1 h-1 rounded-full bg-[#4C3322] group-hover:bg-[#8BAB70] transition-colors"></div>
                    <div className="w-1 h-1 rounded-full bg-[#4C3322] group-hover:bg-[#8BAB70] transition-colors"></div>
                    <div className="w-1 h-1 rounded-full bg-[#4C3322] group-hover:bg-[#8BAB70] transition-colors"></div>
                  </div>
                  <span>Glow n' Grow</span>
                  <span className="text-[10px] font-sans not-italic text-[#4C3322]/50 font-normal">(Podcast)</span>
                </h5>
                <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </div>
              <p className="text-[11px] text-[#4C3322]/75 leading-relaxed font-light pl-6">
                A podcast hosted by Best Selling Author Emily Warren.
              </p>
            </div>

            {/* Podcast Item 2 */}
            <div className="border-t border-[#4C3322]/20 pt-4 pb-2 border-b border-[#4C3322]/20 group cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <h5 className="font-serif italic font-bold group-hover:text-[#8BAB70] transition-colors flex items-center gap-3">
                  {/* Domino 4-dot grid icon */}
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3 text-[#4C3322] inline-grid self-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4C3322] group-hover:bg-[#8BAB70] transition-colors"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4C3322] group-hover:bg-[#8BAB70] transition-colors"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4C3322] group-hover:bg-[#8BAB70] transition-colors"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4C3322] group-hover:bg-[#8BAB70] transition-colors"></div>
                  </div>
                  <span>Live Up</span>
                  <span className="text-[10px] font-sans not-italic text-[#4C3322]/50 font-normal">(Radio Show)</span>
                </h5>
                <span className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </div>
              <p className="text-[11px] text-[#4C3322]/75 leading-relaxed font-light pl-6">
                A radio show hosted by popular host Candice Augustin.
              </p>
            </div>

          </div>

          {/* Footer Center Column: Curly Hair Black Girl Fashion Card - Added corner 3-dots */}
          <div className="relative">
            {/* Top-Right Decorative 3-Dots */}
            <div className="absolute top-4 right-4 flex gap-1 z-20">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
            </div>

            {/* Image container */}
            <div className="relative h-[200px] rounded-3xl overflow-hidden shadow-lg group bg-[#E5E4DE]">
              <img 
                src="/black_girl_fashion.png" 
                alt="Black Girl Fashion Editorial" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
              />
              {/* Color Tint Overlay */}
              <div className="absolute inset-0 bg-[#DE7A49]/10 mixture-overlay pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#4C3322]/30 via-transparent to-transparent"></div>
            </div>

            {/* Bottom-Left Decorative 3-Dots */}
            <div className="absolute bottom-4 left-4 flex gap-1 z-20">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
            </div>
          </div>

          {/* Footer Right Column: Fashion Show Highlight */}
          <div className="flex items-center gap-4 justify-between">
            <div className="space-y-4 flex-1">
              
              {/* Badges */}
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#8BAB70]/15 text-[10px] font-bold text-[#8BAB70]">
                  <svg className="w-2.5 h-2.5 text-[#8BAB70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  Fashion
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#DE7A49]/15 text-[10px] font-bold text-[#DE7A49]">
                  <svg className="w-2.5 h-2.5 text-[#DE7A49]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  Runway Diversity
                </span>
              </div>

              {/* Large Headline */}
              <h3 className="font-serif text-xl md:text-2xl font-black uppercase tracking-tight leading-tight text-[#4C3322]/90">
                COVERAGE OF THE WEEK'S DAZZLING FASHION SHOW
              </h3>

            </div>

            {/* Vertical 3-Dot Divider Node */}
            <div className="flex flex-col gap-1.5 pl-4 py-2 border-l border-[#4C3322]/15">
              <div className="w-2 h-2 rounded-full bg-[#4C3322]/30"></div>
              <div className="w-2 h-2 rounded-full bg-[#8BAB70]"></div>
              <div className="w-2 h-2 rounded-full bg-[#4C3322]/30"></div>
            </div>

          </div>

        </footer>

        {/* ==================== NEXT SECTION: SECOND FOLD ==================== */}

        {/* 1. Concentric Flower Divider */}
        <div className="relative flex items-center justify-center my-20">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#4C3322]/10"></div></div>
          <div className="relative bg-[#FAF7F2] px-6 text-[#4C3322]/40">
            <svg className="w-6 h-6 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm-6-6a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm12 0a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
            </svg>
          </div>
        </div>

        {/* 2. Curated Editions / Featured Articles Grid */}
        <section id="articles" className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#8BAB70]">LATEST RELEASES</span>
            <h3 className="font-serif text-3xl md:text-4xl font-black uppercase tracking-tight text-[#4C3322]">
              CURATED MAGAZINES & EDITIONS
            </h3>
            <p className="text-sm text-[#4C3322]/60 font-light max-w-lg mx-auto">
              Explore the latest publications and wisdom crafted with care by the Cereen editorial team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Mindfulness Edition */}
            <div className="bg-white/40 backdrop-blur-sm border border-[#4C3322]/8 rounded-[2rem] p-6 space-y-6 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between">
              <div className="space-y-4">
                {/* Mindfulness sanctuary actual generated image */}
                <div className="h-44 rounded-2xl overflow-hidden shadow-sm border border-[#8BAB70]/15 relative group-hover:shadow-md transition-shadow">
                  <img src="/mindfulness_sanctuary.png" alt="Sanctuary Edition" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#8BAB70]/15 text-[#8BAB70] font-bold text-[9px]">
                    ✦ Mindfulness
                  </span>
                  <span className="text-[#4C3322]/50">5 MIN READ</span>
                </div>
                <h4 className="font-serif italic font-bold text-xl group-hover:text-[#8BAB70] transition-colors leading-tight">
                  Deep Sanctuary: Reclaiming Your Mental Space
                </h4>
                <p className="text-xs text-[#4C3322]/70 leading-relaxed font-light line-clamp-2">
                  A foundational guide to breathing rhythms, establishing silent hours, and decluttering modern mental static.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#4C3322]/5 text-sm font-semibold">
                <span>Read Article</span>
                <span className="transform group-hover:translate-x-1 transition-transform">↗</span>
              </div>
            </div>

            {/* Card 2: Meditation Edition */}
            <div className="bg-white/40 backdrop-blur-sm border border-[#4C3322]/8 rounded-[2rem] p-6 space-y-6 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between">
              <div className="space-y-4">
                {/* Meditation stillness actual generated image */}
                <div className="h-44 rounded-2xl overflow-hidden shadow-sm border border-[#DE7A49]/15 relative group-hover:shadow-md transition-shadow">
                  <img src="/meditation_stillness.png" alt="Stillness Edition" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#DE7A49]/15 text-[#DE7A49] font-bold text-[9px]">
                    ★ Meditation
                  </span>
                  <span className="text-[#4C3322]/50">8 MIN READ</span>
                </div>
                <h4 className="font-serif italic font-bold text-xl group-hover:text-[#DE7A49] transition-colors leading-tight">
                  Daily Stillness: The Neural Science Behind Solitude
                </h4>
                <p className="text-xs text-[#4C3322]/70 leading-relaxed font-light line-clamp-2">
                  Unpacking the cognitive restructuring and heart-rate variability enhancements triggered by ten minutes of daily stillness.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#4C3322]/5 text-sm font-semibold">
                <span>Read Article</span>
                <span className="transform group-hover:translate-x-1 transition-transform">↗</span>
              </div>
            </div>

            {/* Card 3: Fashion Runway Edition */}
            <div className="bg-white/40 backdrop-blur-sm border border-[#4C3322]/8 rounded-[2rem] p-6 space-y-6 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between">
              <div className="space-y-4">
                {/* Fashion runway actual generated image */}
                <div className="h-44 rounded-2xl overflow-hidden shadow-sm border border-[#4C3322]/15 relative group-hover:shadow-md transition-shadow">
                  <img src="/runway_diversity.png" alt="Runway Edition" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#8BAB70]/15 text-[#8BAB70] font-bold text-[9px]">
                    ✦ Fashion
                  </span>
                  <span className="text-[#4C3322]/50">6 MIN READ</span>
                </div>
                <h4 className="font-serif italic font-bold text-xl group-hover:text-[#8BAB70] transition-colors leading-tight">
                  Runway Diversity: Outer Expression Meets Inner Peace
                </h4>
                <p className="text-xs text-[#4C3322]/70 leading-relaxed font-light line-clamp-2">
                  Highlighting the revolutionary shifts on high-fashion runways towards body positivity, cultural heritage, and identity.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#4C3322]/5 text-sm font-semibold">
                <span>Read Article</span>
                <span className="transform group-hover:translate-x-1 transition-transform">↗</span>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Interactive Podcast Waveform Player */}
        <section id="podcast" className="bg-[#E5E4DE] rounded-[2.5rem] p-6 md:p-8 mt-16 shadow-md border border-[#4C3322]/5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left: Cover Art & Details */}
            <div className="md:col-span-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow bg-white border border-[#4C3322]/10 relative group cursor-pointer flex-shrink-0">
                <img src="/girl_expression_card.png" alt="Podcast Art" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-lg">▶</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] tracking-wider font-bold text-[#8BAB70] uppercase">NOW PLAYING</span>
                <h5 className="font-serif italic font-bold text-base leading-tight">Glow n' Grow</h5>
                <p className="text-[10px] text-[#4C3322]/70 leading-none mt-0.5">Episode 42: Solitude as Sanctuary</p>
              </div>
            </div>

            {/* Middle: Live-Animated Equalizer Waveform */}
            <div className="md:col-span-5 flex items-center justify-center gap-1.5 h-10 select-none">
              <span className="w-1.5 h-6 bg-[#8BAB70] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-1.5 h-10 bg-[#8BAB70] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
              <span className="w-1.5 h-7 bg-[#8BAB70] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
              <span className="w-1.5 h-12 bg-[#8BAB70] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-5 bg-[#8BAB70] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              <span className="w-1.5 h-9 bg-[#8BAB70] rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></span>
              <span className="w-1.5 h-7 bg-[#8BAB70] rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-1.5 h-11 bg-[#8BAB70] rounded-full animate-pulse" style={{ animationDelay: '0.35s' }}></span>
              <span className="w-1.5 h-6 bg-[#8BAB70] rounded-full animate-pulse" style={{ animationDelay: '0.55s' }}></span>
            </div>

            {/* Right: Audio Playback Slider & Timing Controls */}
            <div className="md:col-span-3 flex items-center gap-4 w-full justify-between">
              <span className="text-[10px] font-mono text-[#4C3322]/60 select-none">12:35</span>
              
              {/* Progress Slider track */}
              <div className="relative flex-1 h-1 bg-[#4C3322]/15 rounded-full cursor-pointer group mx-2">
                <div className="absolute left-0 top-0 bottom-0 w-[42%] bg-[#8BAB70] rounded-full group-hover:bg-[#77955e]"></div>
                <div className="absolute left-[42%] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border border-[#8BAB70] rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <span className="text-[10px] font-mono text-[#4C3322]/60 select-none">28:40</span>

              {/* Minimal Circle Play Button */}
              <button className="w-10 h-10 rounded-full bg-[#4C3322] hover:bg-[#8BAB70] text-white flex items-center justify-center transition-colors shadow flex-shrink-0">
                <span className="text-xs">❚❚</span>
              </button>
            </div>

          </div>
        </section>

        {/* Newsletter moved to the bottom of the page */}

        {/* ==================== NEXT SECTION: THIRD FOLD ==================== */}

        {/* 1. Concentric Flower Divider */}
        <div className="relative flex items-center justify-center my-20">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#4C3322]/10"></div></div>
          <div className="relative bg-[#FAF7F2] px-6 text-[#4C3322]/40">
            <svg className="w-6 h-6 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm-6-6a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm12 0a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
            </svg>
          </div>
        </div>

        {/* 2. Digital Catalog & Magazine Bookshelf */}
        <section id="catalog" className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#DE7A49]">PRINT & DIGITAL</span>
            <h3 className="font-serif text-3xl md:text-4xl font-black uppercase tracking-tight text-[#4C3322]">
              DIGITAL ARCHIVE SHOWCASE
            </h3>
            <p className="text-sm text-[#4C3322]/60 font-light max-w-lg mx-auto">
              Quarterly print collections and digital companion libraries. Hover to inspect collectible covers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Issue 12 Cover */}
            <div className="bg-[#E5E4DE] rounded-[2.5rem] p-6 shadow-md border border-[#4C3322]/5 group hover:shadow-xl transition-all duration-500 relative flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#8BAB70]/10 rounded-bl-full pointer-events-none"></div>
              <div className="space-y-4">
                <div className="h-64 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/10 flex flex-col items-center justify-between shadow-inner relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  {/* Cover Image Background */}
                  <img src="/mindfulness_sanctuary.png" className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none" />
                  <div className="absolute inset-0 bg-[#FAF7F2]/45 backdrop-blur-[1px]"></div>
                  
                  {/* Top cover metadata */}
                  <div className="w-full flex justify-between text-[8px] tracking-widest font-bold text-[#4C3322] z-10 px-6 pt-4">
                    <span>SPRING 2026</span>
                    <span>ISSUE 12</span>
                  </div>
                  
                  {/* Title text */}
                  <h4 className="font-serif text-xl font-black text-[#4C3322] tracking-tight leading-none text-center z-10 pb-6 mt-auto">
                    CEREEN <span className="block text-[8px] uppercase tracking-[0.2em] font-light mt-1 text-[#4C3322]/80">the sanctuary issue</span>
                  </h4>
                </div>
                <h5 className="font-serif italic font-bold text-lg mt-2">The Sanctuary Issue</h5>
                <p className="text-xs text-[#4C3322]/70 leading-relaxed font-light">
                  Exploring deep mindfulness, quiet sanctuaries in dense cities, and green spatial designs.
                </p>
              </div>
              <button className="w-full bg-[#8BAB70] hover:bg-[#77955e] text-white py-2.5 rounded-2xl mt-6 font-semibold text-xs transition-colors flex items-center justify-center gap-2">
                <span>Preview Edition</span>
                <span>↗</span>
              </button>
            </div>

            {/* Issue 11 Cover */}
            <div className="bg-[#E5E4DE] rounded-[2.5rem] p-6 shadow-md border border-[#4C3322]/5 group hover:shadow-xl transition-all duration-500 relative flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#DE7A49]/10 rounded-bl-full pointer-events-none"></div>
              <div className="space-y-4">
                <div className="h-64 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/10 flex flex-col items-center justify-between shadow-inner relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  {/* Cover Image Background */}
                  <img src="/meditation_stillness.png" className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none" />
                  <div className="absolute inset-0 bg-[#FAF7F2]/45 backdrop-blur-[1px]"></div>
                  
                  {/* Top cover metadata */}
                  <div className="w-full flex justify-between text-[8px] tracking-widest font-bold text-[#4C3322] z-10 px-6 pt-4">
                    <span>WINTER 2025</span>
                    <span>ISSUE 11</span>
                  </div>
                  
                  {/* Title text */}
                  <h4 className="font-serif text-xl font-black text-[#4C3322] tracking-tight leading-none text-center z-10 pb-6 mt-auto">
                    CEREEN <span className="block text-[8px] uppercase tracking-[0.2em] font-light mt-1 text-[#4C3322]/80">the solitude issue</span>
                  </h4>
                </div>
                <h5 className="font-serif italic font-bold text-lg mt-2">The Solitude Issue</h5>
                <p className="text-xs text-[#4C3322]/70 leading-relaxed font-light">
                  A winter special diving into solitude, chemical neural changes of silence, and cozy wellness habits.
                </p>
              </div>
              <button className="w-full bg-[#4C3322] hover:bg-[#8BAB70] text-white py-2.5 rounded-2xl mt-6 font-semibold text-xs transition-colors flex items-center justify-center gap-2">
                <span>Preview Edition</span>
                <span>↗</span>
              </button>
            </div>

            {/* Issue 10 Cover */}
            <div className="bg-[#E5E4DE] rounded-[2.5rem] p-6 shadow-md border border-[#4C3322]/5 group hover:shadow-xl transition-all duration-500 relative flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#4C3322]/15 rounded-bl-full pointer-events-none"></div>
              <div className="space-y-4">
                <div className="h-64 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/10 flex flex-col items-center justify-between shadow-inner relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  {/* Cover Image Background */}
                  <img src="/runway_diversity.png" className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none" />
                  <div className="absolute inset-0 bg-[#FAF7F2]/45 backdrop-blur-[1px]"></div>
                  
                  {/* Top cover metadata */}
                  <div className="w-full flex justify-between text-[8px] tracking-widest font-bold text-[#4C3322] z-10 px-6 pt-4">
                    <span>AUTUMN 2025</span>
                    <span>ISSUE 10</span>
                  </div>
                  
                  {/* Title text */}
                  <h4 className="font-serif text-xl font-black text-[#4C3322] tracking-tight leading-none text-center z-10 pb-6 mt-auto">
                    CEREEN <span className="block text-[8px] uppercase tracking-[0.2em] font-light mt-1 text-[#4C3322]/80">the expression issue</span>
                  </h4>
                </div>
                <h5 className="font-serif italic font-bold text-lg mt-2">The Expression Issue</h5>
                <p className="text-xs text-[#4C3322]/70 leading-relaxed font-light">
                  Exploring runway shifts, runway self-care, runway variety, and the art of physical expression.
                </p>
              </div>
              <button className="w-full bg-[#4C3322] hover:bg-[#8BAB70] text-white py-2.5 rounded-2xl mt-6 font-semibold text-xs transition-colors flex items-center justify-center gap-2">
                <span>Preview Edition</span>
                <span>↗</span>
              </button>
            </div>

          </div>
        </section>

        {/* 3. Meet the Editorial Team Masthead */}
        <section className="space-y-12 mt-20">
          <div className="text-center space-y-3">
            <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#8BAB70]">THE MASTHEAD</span>
            <h3 className="font-serif text-3xl md:text-4xl font-black uppercase tracking-tight text-[#4C3322]">
              MEET OUR EDITORIAL MASTHEAD
            </h3>
            <p className="text-sm text-[#4C3322]/60 font-light max-w-lg mx-auto">
              The designers, mindfulness writers, and psychologists curating Cereen editions weekly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Masthead Editor 1 */}
            <div className="bg-white/40 border border-[#4C3322]/10 rounded-[2rem] p-6 text-center hover:shadow-md transition-all duration-300 group">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#8BAB70]/40 group-hover:scale-105 transition-transform duration-300">
                <img src="/silver_hair_hero.png" alt="Emily Warren" className="w-full h-full object-cover" />
              </div>
              <h5 className="font-serif italic font-bold text-lg leading-tight">Emily Warren</h5>
              <span className="text-[9px] tracking-widest uppercase text-[#8BAB70] font-bold block mt-1">Mindfulness & Yoga Editor</span>
              <p className="text-xs text-[#4C3322]/75 leading-relaxed font-light mt-3 px-4">
                Bestselling author on meditative sanctuaries, yoga therapies, and cognitive balance.
              </p>
            </div>

            {/* Masthead Editor 2 */}
            <div className="bg-white/40 border border-[#4C3322]/10 rounded-[2rem] p-6 text-center hover:shadow-md transition-all duration-300 group">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#DE7A49]/40 group-hover:scale-105 transition-transform duration-300">
                <img src="/girl_expression_card.png" alt="Candice Augustin" className="w-full h-full object-cover" />
              </div>
              <h5 className="font-serif italic font-bold text-lg leading-tight">Candice Augustin</h5>
              <span className="text-[9px] tracking-widest uppercase text-[#DE7A49] font-bold block mt-1">Podcast & Audio Host</span>
              <p className="text-xs text-[#4C3322]/75 leading-relaxed font-light mt-3 px-4">
                Licensed therapist and host of the Glow n' Grow radio program, exploring neural calm.
              </p>
            </div>

            {/* Masthead Editor 3 */}
            <div className="bg-white/40 border border-[#4C3322]/10 rounded-[2rem] p-6 text-center hover:shadow-md transition-all duration-300 group">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#4C3322]/20 group-hover:scale-105 transition-transform duration-300">
                <img src="/black_girl_fashion.png" alt="Marcus Vane" className="w-full h-full object-cover" />
              </div>
              <h5 className="font-serif italic font-bold text-lg leading-tight">Marcus Vane</h5>
              <span className="text-[9px] tracking-widest uppercase text-[#4C3322]/60 font-bold block mt-1">Creative Director</span>
              <p className="text-xs text-[#4C3322]/75 leading-relaxed font-light mt-3 px-4">
                High-fashion curator managing editorial photography, runway diversity, and cover aesthetics.
              </p>
            </div>

          </div>
        </section>

        {/* 4. Interactive Accordion FAQ Section */}
        <section className="space-y-12 mt-20 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#8BAB70]">READER FAQ</span>
            <h3 className="font-serif text-3xl font-black uppercase tracking-tight text-[#4C3322]">
              INTERACTIVE READER FAQ
            </h3>
            <p className="text-sm text-[#4C3322]/60 font-light">
              Everything you need to know about subscribing, print archives, and podcasts.
            </p>
          </div>

          <div className="space-y-4">
            
            {[
              {
                q: "How often are new Cereen print editions published?",
                a: "Cereen magazines are published quarterly (Spring, Summer, Autumn, Winter) as collectible high-quality printed editions, accompanied by weekly digital articles, wellness logs, and curated podcasts."
              },
              {
                q: "Is the weekly podcast and radio archive free to access?",
                a: "Yes, our digital radio shows and audio episodes (including Glow n' Grow and Live Up) are fully accessible to the public, with expanded guides, PDFs, and reading notes reserved for premium subscribers."
              },
              {
                q: "Where can I purchase the printed collectible copies?",
                a: "Printed copies are shipped worldwide directly to our premium members. You can purchase back-issues or subscribe to our annual delivery cycle by clicking the 'Subscribe Now' buttons on our main hero layout."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white/40 border border-[#4C3322]/10 rounded-2xl overflow-hidden hover:shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left font-serif font-bold text-base md:text-lg hover:text-[#8BAB70] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl font-light transform transition-transform duration-300">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>
                
                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    openFaq === index ? 'max-h-40 border-t border-[#4C3322]/5 py-4 px-6' : 'max-h-0'
                  }`}
                >
                  <p className="text-xs md:text-sm text-[#4C3322]/75 leading-relaxed font-light">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* 5. Elegant Newsletter Subscription Card (Stay Connected - Moved to Last) */}
        <section id="talk-to-us" className="mt-20 bg-[#4C3322] text-[#FAF7F2] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-xl border border-white/5">
          
          {/* Ambient SVG Sunburst in Top-Left Corner */}
          <div className="absolute -top-12 -left-12 text-white/5 w-40 h-40 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Texts */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-[#8BAB70] border border-white/5">
                  ☼ Weekly Letters
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-[#DE7A49] border border-white/5">
                  ❀ Club Updates
                </span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                STAY INSPIRED BY CEREEN
              </h3>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed font-light max-w-xl">
                Receive curated weekly wellness guides, guided meditation practices, and exclusive fashion runway insights delivered directly into your inbox.
              </p>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-5 w-full">
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Cereen Magazines!'); }} className="flex flex-col sm:flex-row items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 p-2 rounded-[2rem] shadow-inner">
                <input 
                  required
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full bg-transparent border-none outline-none py-3 px-5 text-sm text-white placeholder-white/50 focus:ring-0"
                />
                <button type="submit" className="w-full sm:w-auto bg-[#8BAB70] hover:bg-[#77955e] text-[#FAF7F2] font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 whitespace-nowrap flex-shrink-0 text-xs tracking-wider uppercase">
                  Subscribe
                </button>
              </form>
            </div>

          </div>

          {/* Ambient SVG Sunburst in Bottom-Right Corner */}
          <div className="absolute -bottom-16 -right-16 text-white/5 w-48 h-48 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" />
            </svg>
          </div>

        </section>

        {/* 6. Rich Multi-Column Website Footer */}
        <footer className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-t border-[#4C3322]/10 mt-20 text-left text-xs text-[#4C3322]/70 font-light relative z-10">
          
          {/* Column 1: Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer select-none group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <svg className="w-6 h-6 text-[#4C3322] transform group-hover:rotate-45 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm-6-6a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm12 0a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
              </svg>
              <div>
                <h4 className="font-serif text-lg font-black tracking-tight leading-none text-[#4C3322]">Cereen</h4>
                <span className="text-[8px] tracking-[0.2em] uppercase font-light text-[#4C3322]/60">magazines</span>
              </div>
            </div>
            <p className="leading-relaxed text-[11px] text-[#4C3322]/60">
              Cereen is a premium quarterly print and digital magazine dedicated to mental health, mindfulness, and global runway fashion curation.
            </p>
          </div>

          {/* Column 2: Editions */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-[#4C3322] text-[10px]">EDITIONS</h5>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#catalog" className="hover:text-[#8BAB70] transition-colors">Spring 2026: The Sanctuary Issue</a></li>
              <li><a href="#catalog" className="hover:text-[#8BAB70] transition-colors">Winter 2025: The Solitude Issue</a></li>
              <li><a href="#catalog" className="hover:text-[#8BAB70] transition-colors">Autumn 2025: The Expression Issue</a></li>
              <li><a href="#catalog" className="hover:text-[#8BAB70] transition-colors">Digital Archive Library</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-[#4C3322] text-[10px]">RESOURCES</h5>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#articles" className="hover:text-[#8BAB70] transition-colors">Featured Wellness Articles</a></li>
              <li><a href="#podcast" className="hover:text-[#8BAB70] transition-colors">Glow n' Grow Podcasts</a></li>
              <li><a href="#podcast" className="hover:text-[#8BAB70] transition-colors">Live Up Radio Shows</a></li>
              <li><a href="#talk-to-us" className="hover:text-[#8BAB70] transition-colors">Talk to us / Connect</a></li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-[#4C3322] text-[10px]">CONNECT WITH CEREEN</h5>
            <div className="flex gap-3 text-[#4C3322]/80">
              <a href="#instagram" className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-white flex items-center justify-center transition-all">
                <i className="fab fa-instagram text-xs"></i>
              </a>
              <a href="#facebook" className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-white flex items-center justify-center transition-all">
                <i className="fab fa-facebook-f text-xs"></i>
              </a>
              <a href="#twitter" className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-white flex items-center justify-center transition-all">
                <i className="fab fa-twitter text-xs"></i>
              </a>
              <a href="mailto:hello@cereen.com" className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-white flex items-center justify-center transition-all">
                <i className="fas fa-envelope text-xs"></i>
              </a>
            </div>
            <p className="text-[10px] text-[#4C3322]/50 mt-2 leading-relaxed">
              For submissions, editorial pitches, or general queries, write to: <a href="mailto:hello@cereen.com" className="underline">hello@cereen.com</a>
            </p>
          </div>

        </footer>

        {/* Small Elegant Copyright */}
        <div className="text-center text-[10px] tracking-widest text-[#4C3322]/40 pt-16 pb-8 uppercase font-semibold select-none border-t border-[#4C3322]/5 mt-10">
          © 2026 Cereen magazines inc. All rights reserved. Premium Editorial Experience.
        </div>

      </main>

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in bg-[#4C3322] text-[#FAF7F2] px-6 py-3.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-3">
          <svg className="w-5 h-5 text-[#8BAB70] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs md:text-sm font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Glassmorphic Local Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4C3322]/45 backdrop-blur-md p-4">
          {/* Backdrop Click Closes Modal */}
          <div className="absolute inset-0 cursor-default" onClick={() => setShowAuthModal(false)} />
          
          <div className="bg-[#FAF7F2]/90 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-[0_25px_60px_-15px_rgba(76,51,34,0.2)] relative z-10 animate-fade-in-up">
            {/* Elegant Close Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-white flex items-center justify-center text-[#4C3322] transition-all"
            >
              <i className="fas fa-times text-xs"></i>
            </button>

            {/* Brand/Header Inside Modal */}
            <div className="text-center mb-6">
              <svg className="w-8 h-8 text-[#4C3322] mx-auto mb-2.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm-6-6a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm12 0a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
              </svg>
              <h3 className="font-serif text-2xl font-black tracking-tight leading-none">Cereen</h3>
              <span className="text-[10px] tracking-[0.2em] uppercase font-light text-[#4C3322]/60">magazines</span>
              <h4 className="text-xl font-semibold mt-4 text-[#4C3322]/90">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h4>
              <p className="text-xs text-[#4C3322]/60 mt-1">
                {authMode === 'login' 
                  ? 'Access your saved wellness journals & editions' 
                  : 'Start your journey into modern mindfulness'}
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-[#4C3322]/70 uppercase ml-3">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-5 py-3 rounded-full border border-[#4C3322]/15 bg-white/40 text-[#4C3322] placeholder-[#4C3322]/30 focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all text-sm shadow-sm"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-[#4C3322]/70 uppercase ml-3">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-full border border-[#4C3322]/15 bg-white/40 text-[#4C3322] placeholder-[#4C3322]/30 focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all text-sm shadow-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-[#4C3322]/70 uppercase ml-3">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-full border border-[#4C3322]/15 bg-white/40 text-[#4C3322] placeholder-[#4C3322]/30 focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all text-sm shadow-sm"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 bg-[#4C3322] text-[#FAF7F2] rounded-full font-semibold text-sm shadow-lg hover:bg-[#8BAB70] hover:shadow-xl active:scale-[0.98] transition-all duration-300 mt-2"
              >
                {authMode === 'login' ? 'Sign In to Cereen' : 'Complete Registration'}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center mt-6 pt-4 border-t border-[#4C3322]/5">
              <span className="text-xs text-[#4C3322]/60">
                {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-xs font-semibold text-[#8BAB70] hover:text-[#4C3322] ml-1.5 transition-colors underline"
              >
                {authMode === 'login' ? 'Register Now' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chatbot */}
      <HomepageChatbot />
    </div>
  );
};
