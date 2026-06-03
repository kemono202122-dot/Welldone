import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export const CereenDashboardPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sanctuary' | 'library' | 'journal' | 'audio' | 'settings'>('sanctuary');

  // Journal States
  const [mood, setMood] = useState<number>(8);
  const [sleep, setSleep] = useState<number>(7.5);
  const [water, setWater] = useState<number>(3); // in Liters
  const [gratitude, setGratitude] = useState<string>('');
  
  // Timer States
  const [timerSeconds, setTimerSeconds] = useState<number>(600); // 10 mins default
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerPreset, setTimerPreset] = useState<number>(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // E-Reader States
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [readerPage, setReaderPage] = useState<number>(1);

  // AI Chat States
  const [aiHistory, setAiHistory] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Welcome to your sanctuary. I am your Cereen guide. How can I help you find focus and relaxation today?' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Audio Streamer States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<{ title: string; host: string; length: string; id: number } | null>({
    id: 1, title: "Self-Reflection & Stillness", host: "Sarah Jenkins", length: "14:20"
  });
  const [trackProgress, setTrackProgress] = useState<number>(32); // percentage

  if (!context) return null;
  const { currentUser, logout, updateUserProfile } = context;

  // Security Redirect: Route user back if they are not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Timer Countdown Logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            alert("Your meditation session is complete. Return slowly to the present moment.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-[#4C3322]">
        <div className="text-center space-y-4 animate-pulse">
          <svg className="w-10 h-10 mx-auto animate-spin text-[#8BAB70]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="font-serif text-lg tracking-wider">Accessing your Cereen Sanctuary...</p>
        </div>
      </div>
    );
  }

  // Handle setting preset timer minutes
  const handleSetTimerPreset = (mins: number) => {
    setTimerPreset(mins);
    setTimerSeconds(mins * 60);
    setTimerRunning(false);
  };

  // Format timer output
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // AI Chat Simulation/Integration
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setAiHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setLoadingAi(true);

    // Dynamic Wellness/Mindfulness AI responses
    setTimeout(() => {
      let reply = "Take a deep breath. Focus on your body and notice the weight of your thoughts drifting away. What area of your life would you like to explore next?";
      const lower = userMsg.toLowerCase();

      if (lower.includes('meditat') || lower.includes('breath') || lower.includes('timer')) {
        reply = "Meditation is the art of sitting in awareness. Try setting our Meditation Timer for 5 minutes and focus purely on the rise and fall of your chest.";
      } else if (lower.includes('anxi') || lower.includes('stress') || lower.includes('worry')) {
        reply = "When stress feels overwhelming, try the 4-7-8 breathing method: inhale for 4 seconds, hold for 7, and exhale completely for 8. Let's try it once together.";
      } else if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia')) {
        reply = "To invite restful sleep, try winding down 30 minutes before bed. Dim your screen, log your gratitude notes in your journal tab, and avoid heavy meals.";
      } else if (lower.includes('journal') || lower.includes('mood') || lower.includes('water')) {
        reply = "Tracking your wellness habits creates awareness. Log your water intake and sleep quality in the Journal tab to build a foundation for clarity.";
      } else if (lower.includes('magazine') || lower.includes('book') || lower.includes('issue')) {
        reply = "You have full access to our catalog under the 'Library' tab. Open 'Spring 2026: The Sanctuary Issue' to read about natural habitats and calming spaces.";
      }

      setAiHistory(prev => [...prev, { sender: 'ai', text: reply }]);
      setLoadingAi(false);
    }, 1000);
  };

  // Simulated Journal Save
  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mindfulness log recorded. Your updates are saved to your local profile dashboard.");
    setGratitude('');
  };

  // Handle Avatar/Details Form
  const handleUpdateProfileDetails = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile configurations saved successfully.");
  };

  // Mock Issue Data
  const magazineIssues = [
    { id: 'spring-2026', title: 'Spring 2026: The Sanctuary Issue', desc: 'Exploring modern spaces designed for deep sensory relief, organic architecture, and forest meditation.', coverColor: 'bg-[#8BAB70]/20 border-[#8BAB70]/30', pages: ["Overview & Welcome", "Chapter 1: Spaces of Solace", "Chapter 2: The Forest Canopy Walkway", "Chapter 3: Breathwork in Natural Scents", "Editorial: Looking Ahead"] },
    { id: 'winter-2025', title: 'Winter 2025: The Solitude Issue', desc: 'A dedicated volume on self-reliance, silence, cold hydrotherapy, and finding peace in seasonal transitions.', coverColor: 'bg-[#DE7A49]/20 border-[#DE7A49]/30', pages: ["Overview & Welcome", "Chapter 1: The Beauty of Silence", "Chapter 2: Cold Plunge Protocols", "Chapter 3: Cozy Solitude Spaces", "Editorial: Winter Retrospective"] },
    { id: 'autumn-2025', title: 'Autumn 2025: The Expression Issue', desc: 'Focuses on creative outlets, journal releases, art therapeutics, and alignment through vocal expression.', coverColor: 'bg-[#4C3322]/10 border-[#4C3322]/20', pages: ["Overview & Welcome", "Chapter 1: Writing as Healing", "Chapter 2: Therapeutic Painting", "Chapter 3: Voice Tonalities", "Editorial: Autumn Leaves Reflection"] }
  ];

  // Mock Tracks
  const podcastTracks = [
    { id: 1, title: "Self-Reflection & Stillness", host: "Sarah Jenkins", length: "14:20" },
    { id: 2, title: "The 4-7-8 Breathing Protocol", host: "David Miller", length: "08:45" },
    { id: 3, title: "Forest Soundscapes (Ambience)", host: "Cereen Sound Lab", length: "30:00" },
    { id: 4, title: "Digital Detox Discussions", host: "Emma Watson", length: "22:15" }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden select-none selection:bg-[#8BAB70] selection:text-white">
      
      {/* BACKGROUND GRAPHIC ORNAMENTS */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* DASHBOARD HEADER */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 mb-6 border-b border-[#4C3322]/5">
        {/* Brand Title */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <svg className="w-8 h-8 text-[#4C3322]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm-6-6a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm12 0a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
          </svg>
          <div>
            <h1 className="font-serif text-2xl font-black tracking-tight leading-none">Cereen</h1>
            <span className="text-[10px] tracking-[0.2em] uppercase font-light text-[#4C3322]/60">magazines</span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-4 bg-white/50 border border-[#4C3322]/10 rounded-full px-4 py-1.5 shadow-sm">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold">{currentUser.name}</p>
            <p className="text-[9px] uppercase tracking-wider text-[#4C3322]/50 font-bold">{currentUser.occupation || "Collector"}</p>
          </div>
          <img 
            src={currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"} 
            className="w-8 h-8 rounded-full border border-[#4C3322]/10 object-cover shadow-sm"
            alt="Avatar"
          />
          <button 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#DE7A49]/15 hover:text-[#DE7A49] flex items-center justify-center transition-all cursor-pointer"
            title="Log Out"
          >
            <i className="fas fa-sign-out-alt text-xs"></i>
          </button>
        </div>
      </header>

      {/* DASHBOARD WORKSPACE */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1 z-10">
        
        {/* SIDEBAR TABS (3 Cols) */}
        <nav className="lg:col-span-3 bg-white/60 backdrop-blur-md border border-[#4C3322]/10 rounded-[2rem] p-5 space-y-2 shadow-sm flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar">
          <div className="text-xs font-bold uppercase tracking-widest text-[#4C3322]/40 mb-3 px-3 hidden lg:block select-none">
            Member Navigation
          </div>

          <button 
            onClick={() => { setActiveTab('sanctuary'); setSelectedIssue(null); }}
            className={`w-full text-left px-4 py-3 rounded-full flex items-center gap-3 text-sm font-semibold transition-all duration-300 ${activeTab === 'sanctuary' ? 'bg-[#4C3322] text-[#FAF7F2]' : 'hover:bg-[#4C3322]/5 text-[#4C3322]'}`}
          >
            <i className="fas fa-leaf text-xs"></i>
            <span className="whitespace-nowrap">Sanctuary Guide</span>
          </button>

          <button 
            onClick={() => { setActiveTab('library'); }}
            className={`w-full text-left px-4 py-3 rounded-full flex items-center gap-3 text-sm font-semibold transition-all duration-300 ${activeTab === 'library' ? 'bg-[#4C3322] text-[#FAF7F2]' : 'hover:bg-[#4C3322]/5 text-[#4C3322]'}`}
          >
            <i className="fas fa-book-open text-xs"></i>
            <span className="whitespace-nowrap">My Library</span>
          </button>

          <button 
            onClick={() => { setActiveTab('journal'); setSelectedIssue(null); }}
            className={`w-full text-left px-4 py-3 rounded-full flex items-center gap-3 text-sm font-semibold transition-all duration-300 ${activeTab === 'journal' ? 'bg-[#4C3322] text-[#FAF7F2]' : 'hover:bg-[#4C3322]/5 text-[#4C3322]'}`}
          >
            <i className="fas fa-edit text-xs"></i>
            <span className="whitespace-nowrap">Mindfulness Log</span>
          </button>

          <button 
            onClick={() => { setActiveTab('audio'); setSelectedIssue(null); }}
            className={`w-full text-left px-4 py-3 rounded-full flex items-center gap-3 text-sm font-semibold transition-all duration-300 ${activeTab === 'audio' ? 'bg-[#4C3322] text-[#FAF7F2]' : 'hover:bg-[#4C3322]/5 text-[#4C3322]'}`}
          >
            <i className="fas fa-headphones text-xs"></i>
            <span className="whitespace-nowrap">Podcast & Radio</span>
          </button>

          <button 
            onClick={() => { setActiveTab('settings'); setSelectedIssue(null); }}
            className={`w-full text-left px-4 py-3 rounded-full flex items-center gap-3 text-sm font-semibold transition-all duration-300 ${activeTab === 'settings' ? 'bg-[#4C3322] text-[#FAF7F2]' : 'hover:bg-[#4C3322]/5 text-[#4C3322]'}`}
          >
            <i className="fas fa-sliders-h text-xs"></i>
            <span className="whitespace-nowrap">Profile & Settings</span>
          </button>
        </nav>

        {/* WORKSPACE AREA (9 Cols) */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: SANCTUARY GUIDE (HOME OVERVIEW) */}
          {activeTab === 'sanctuary' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Greeting */}
              <div className="bg-white/40 border border-[#4C3322]/10 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-black text-[#4C3322]">Welcome to your sanctuary, {currentUser.name.split(' ')[0]}.</h2>
                  <p className="text-sm text-[#4C3322]/70 font-light mt-1">Explore custom breathing intervals, wellness library editions, and interactive guides.</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3.5 py-1.5 rounded-full border border-[#8BAB70]/20 bg-[#8BAB70]/10 text-[#8BAB70] text-[10px] font-bold tracking-wider uppercase">
                    Subscription: Premium
                  </span>
                </div>
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#4C3322]/10 rounded-[2rem] p-6 shadow-sm flex items-center gap-4 hover:shadow transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#8BAB70]/15 text-[#8BAB70] flex items-center justify-center text-lg">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[#4C3322]/50">Meditation Streak</h5>
                    <p className="text-2xl font-black font-serif text-[#4C3322]">05 Days</p>
                  </div>
                </div>

                <div className="bg-white border border-[#4C3322]/10 rounded-[2rem] p-6 shadow-sm flex items-center gap-4 hover:shadow transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#DE7A49]/15 text-[#DE7A49] flex items-center justify-center text-lg">
                    <i className="fas fa-hourglass-half"></i>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[#4C3322]/50">Total Focus Time</h5>
                    <p className="text-2xl font-black font-serif text-[#4C3322]">120 Mins</p>
                  </div>
                </div>

                <div className="bg-white border border-[#4C3322]/10 rounded-[2rem] p-6 shadow-sm flex items-center gap-4 hover:shadow transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#4C3322]/10 text-[#4C3322] flex items-center justify-center text-lg">
                    <i className="fas fa-book-reader"></i>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[#4C3322]/50">Read Chapters</h5>
                    <p className="text-2xl font-black font-serif text-[#4C3322]">08 Logged</p>
                  </div>
                </div>
              </div>

              {/* AI Chatbox Widget */}
              <div className="bg-white/60 backdrop-blur-md border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm flex flex-col h-[500px] overflow-hidden">
                <div className="flex items-center gap-3 border-b border-[#4C3322]/5 pb-4 mb-4 select-none">
                  <div className="w-9 h-9 rounded-full bg-[#8BAB70] text-white flex items-center justify-center text-xs shadow-inner">
                    <i className="fas fa-feather-alt animate-pulse"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Cereen Sanctuary Guide</h4>
                    <p className="text-[9px] uppercase tracking-wider text-[#4C3322]/60 font-medium">Equipped with AI Wellness Analytics</p>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scroll-smooth">
                  {aiHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-5 py-3 rounded-[1.8rem] text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-[#4C3322] text-[#FAF7F2] rounded-tr-none' : 'bg-white border border-[#4C3322]/10 text-[#4C3322] rounded-tl-none shadow-sm'}`}>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {loadingAi && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-[#4C3322]/10 text-[#4C3322] px-5 py-3 rounded-[1.8rem] rounded-tl-none text-sm shadow-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#4C3322]/50 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-[#4C3322]/50 rounded-full animate-bounce delay-150" />
                        <span className="w-1.5 h-1.5 bg-[#4C3322]/50 rounded-full animate-bounce delay-300" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Field */}
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask about breathing techniques, stress support, or our library..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-5 py-3.5 rounded-full border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner placeholder-[#4C3322]/40"
                  />
                  <button 
                    type="submit" 
                    className="w-12 h-12 bg-[#4C3322] text-[#FAF7F2] rounded-full hover:bg-[#8BAB70] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-300 shadow-md"
                  >
                    <i className="fas fa-paper-plane text-xs"></i>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: LIBRARY (MAGAZINES & E-READER) */}
          {activeTab === 'library' && (
            <div className="space-y-6 animate-fade-in">
              {!selectedIssue ? (
                <>
                  <div className="bg-white/40 border border-[#4C3322]/10 rounded-[2rem] p-6 shadow-sm">
                    <h2 className="font-serif text-2xl font-black text-[#4C3322]">Digital Magazine Library</h2>
                    <p className="text-sm text-[#4C3322]/70 font-light mt-1">Unlock your subscription copies. Read directly inside your web console.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {magazineIssues.map((issue) => (
                      <div key={issue.id} className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
                        <div className={`h-48 ${issue.coverColor} p-8 flex flex-col justify-between border-b border-[#4C3322]/5 relative`}>
                          {/* Flower Art */}
                          <svg className="w-12 h-12 text-[#4C3322]/10 absolute bottom-4 right-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
                          </svg>
                          <span className="text-[9px] uppercase font-bold tracking-widest bg-[#4C3322] text-[#FAF7F2] px-2.5 py-1 rounded-full self-start">Quarterly</span>
                          <h4 className="font-serif text-lg font-black leading-tight tracking-tight mt-4">{issue.title.split(': ')[1]}</h4>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <p className="text-xs text-[#4C3322]/60 leading-relaxed font-light">{issue.desc}</p>
                          <button 
                            onClick={() => {
                              setSelectedIssue(issue.id);
                              setReaderPage(1);
                            }}
                            className="w-full py-2.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] text-xs font-semibold rounded-full shadow transition-all duration-300 active:scale-[0.98]"
                          >
                            Read Issue Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* SIMULATED E-READER CONTAINER */
                <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm flex flex-col h-[600px]">
                  {/* Reader Header */}
                  <div className="flex justify-between items-center border-b border-[#4C3322]/5 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedIssue(null)}
                        className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-all"
                      >
                        <i className="fas fa-arrow-left text-xs"></i>
                      </button>
                      <div>
                        <h4 className="text-sm font-bold truncate max-w-md">
                          {magazineIssues.find(i => i.id === selectedIssue)?.title}
                        </h4>
                        <p className="text-[9px] uppercase tracking-wider text-[#8BAB70] font-bold">Simulated E-Reader Portal</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold tracking-wider bg-white border border-[#4C3322]/15 px-3 py-1 rounded-full text-[#4C3322]/70">
                      Page {readerPage} of {magazineIssues.find(i => i.id === selectedIssue)?.pages.length}
                    </span>
                  </div>

                  {/* Reader Content Page Layout */}
                  <div className="flex-1 bg-[#FAF7F2]/60 rounded-3xl border border-[#4C3322]/5 p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full relative overflow-y-auto">
                    <svg className="w-8 h-8 text-[#8BAB70] mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
                    </svg>
                    
                    <h3 className="font-serif text-2xl font-black tracking-tight text-[#4C3322] mb-3">
                      {magazineIssues.find(i => i.id === selectedIssue)?.pages[readerPage - 1]}
                    </h3>
                    
                    <p className="text-sm font-light text-[#4C3322]/70 max-w-md leading-relaxed mt-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac lacus non dolor pulvinar efficitur. 
                      Morbi et rhoncus tellus. Integer viverra nibh sed magna commodo imperdiet. Suspendisse a eleifend erat.
                    </p>
                    
                    <p className="text-xs italic text-[#4C3322]/50 max-w-sm mt-4">
                      Focus on the sun, feel the warmth, clear the mind. Cereen premium editions are designed to curate sensory pathways.
                    </p>
                  </div>

                  {/* Reader Controls */}
                  <div className="flex items-center justify-between border-t border-[#4C3322]/5 pt-4 mt-4 select-none">
                    <button 
                      onClick={() => setReaderPage(p => Math.max(1, p - 1))}
                      disabled={readerPage === 1}
                      className="px-4 py-2 border border-[#4C3322]/15 text-xs font-semibold rounded-full hover:bg-[#4C3322] hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Previous Page
                    </button>
                    <button 
                      onClick={() => setReaderPage(p => Math.min(magazineIssues.find(i => i.id === selectedIssue)?.pages.length || 1, p + 1))}
                      disabled={readerPage === (magazineIssues.find(i => i.id === selectedIssue)?.pages.length || 1)}
                      className="px-4 py-2 border border-[#4C3322]/15 text-xs font-semibold rounded-full hover:bg-[#4C3322] hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Next Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MINDFULNESS LOG & MEDITATION TIMER */}
          {activeTab === 'journal' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
              {/* Left Column: Logging Form (7 Cols) */}
              <div className="md:col-span-7 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-black text-[#4C3322]">Mindfulness Log</h3>
                  <p className="text-xs text-[#4C3322]/60 font-light mt-1">Self-observation generates mental focus. Note down today's wellness indices.</p>
                </div>

                <form onSubmit={handleSaveJournal} className="space-y-4">
                  {/* Slider: Mood */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#4C3322]/80">
                      <span>Mood Level</span>
                      <span className="text-[#8BAB70]">{mood} / 10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={mood} 
                      onChange={(e) => setMood(parseInt(e.target.value))}
                      className="w-full accent-[#8BAB70] bg-[#4C3322]/10 rounded-full h-2 appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Slider: Sleep */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#4C3322]/80">
                      <span>Hours of Sleep</span>
                      <span className="text-[#8BAB70]">{sleep} hrs</span>
                    </div>
                    <input 
                      type="range" 
                      min="3" 
                      max="12" 
                      step="0.5"
                      value={sleep} 
                      onChange={(e) => setSleep(parseFloat(e.target.value))}
                      className="w-full accent-[#8BAB70] bg-[#4C3322]/10 rounded-full h-2 appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Water Counter */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#4C3322]/80">Hydration (Liters of Water)</label>
                    <div className="flex items-center gap-4">
                      <button 
                        type="button" 
                        onClick={() => setWater(w => Math.max(0, w - 0.5))}
                        className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#DE7A49]/15 hover:text-[#DE7A49] flex items-center justify-center transition-all font-bold"
                      >
                        -
                      </button>
                      <span className="text-base font-black text-[#4C3322] w-16 text-center">{water.toFixed(1)} L</span>
                      <button 
                        type="button" 
                        onClick={() => setWater(w => w + 0.5)}
                        className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#8BAB70]/15 hover:text-[#8BAB70] flex items-center justify-center transition-all font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Area: Gratitude */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#4C3322]/80">Gratitude Entry</label>
                    <textarea 
                      placeholder="Write down one thing you are grateful for today..." 
                      value={gratitude}
                      onChange={(e) => setGratitude(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner placeholder-[#4C3322]/30 resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-semibold text-xs rounded-full shadow transition-all duration-300 active:scale-[0.98]"
                  >
                    Record Log & Save
                  </button>
                </form>
              </div>

              {/* Right Column: Meditation Timer (5 Cols) */}
              <div className="md:col-span-5 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm flex flex-col items-center justify-between text-center min-h-[400px]">
                <div className="w-full">
                  <h3 className="font-serif text-xl font-black text-[#4C3322]">Meditation Space</h3>
                  <p className="text-[10px] text-[#4C3322]/60 font-light mt-0.5">Pause, close your eyes, and listen to the silence.</p>
                </div>

                {/* Circle Pulsing Graphic */}
                <div className="relative my-6 select-none">
                  <div className={`w-36 h-36 rounded-full border-2 border-[#8BAB70]/40 flex items-center justify-center relative transition-all duration-1000 ${timerRunning ? 'scale-110 bg-[#8BAB70]/5 shadow-[0_0_30px_rgba(139,171,112,0.15)] animate-pulse' : ''}`}>
                    <span className="font-serif text-3xl font-black text-[#4C3322] tracking-wider">
                      {formatTime(timerSeconds)}
                    </span>
                  </div>
                </div>

                {/* Presets */}
                <div className="flex gap-2 justify-center w-full mb-4">
                  {[5, 10, 20].map(m => (
                    <button 
                      key={m} 
                      type="button" 
                      onClick={() => handleSetTimerPreset(m)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all ${timerPreset === m ? 'bg-[#4C3322] border-[#4C3322] text-[#FAF7F2]' : 'border-[#4C3322]/15 text-[#4C3322]/70 hover:bg-[#4C3322]/5'}`}
                    >
                      {m} Mins
                    </button>
                  ))}
                </div>

                {/* Control Action */}
                <button 
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`w-full py-3 rounded-full font-semibold text-xs shadow transition-all duration-300 active:scale-[0.98] ${timerRunning ? 'bg-[#DE7A49] text-[#FAF7F2] hover:bg-[#DE7A49]/90' : 'bg-[#8BAB70] text-[#FAF7F2] hover:bg-[#8BAB70]/90'}`}
                >
                  {timerRunning ? 'Pause Session' : 'Start Meditation'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PODCASTS & AUDIO STREAMER */}
          {activeTab === 'audio' && (
            <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-2xl font-black text-[#4C3322]">Podcast & Live Radio Portal</h3>
                <p className="text-xs text-[#4C3322]/60 font-light mt-1">Listen to Glow n' Grow podcasts and premium soundscapes customized for sensory balance.</p>
              </div>

              {/* Track Grid */}
              <div className="space-y-3">
                {podcastTracks.map((track) => (
                  <div 
                    key={track.id} 
                    onClick={() => {
                      setCurrentTrack(track);
                      setIsPlaying(true);
                      setTrackProgress(0);
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${currentTrack?.id === track.id ? 'bg-[#8BAB70]/10 border-[#8BAB70]/30 shadow-sm' : 'border-[#4C3322]/5 bg-[#FAF7F2]/30 hover:bg-[#FAF7F2]/80 hover:border-[#4C3322]/15'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentTrack?.id === track.id ? 'bg-[#8BAB70] text-white' : 'bg-[#4C3322]/10 text-[#4C3322]'}`}>
                        {currentTrack?.id === track.id && isPlaying ? (
                          <i className="fas fa-pause text-[10px]"></i>
                        ) : (
                          <i className="fas fa-play text-[10px]"></i>
                        )}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold">{track.title}</h5>
                        <p className="text-[10px] text-[#4C3322]/50">Host: {track.host}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#4C3322]/60">{track.length}</span>
                  </div>
                ))}
              </div>

              {/* ACTIVE PLAYER BAR */}
              {currentTrack && (
                <div className="border-t border-[#4C3322]/10 pt-6 mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                  {/* Info */}
                  <div className="flex items-center gap-3">
                    {/* Equalizer animation */}
                    {isPlaying && (
                      <div className="flex gap-0.5 items-end h-5 w-5 justify-center">
                        <span className="w-0.5 bg-[#8BAB70] rounded animate-[pulse_0.8s_infinite] h-3" />
                        <span className="w-0.5 bg-[#8BAB70] rounded animate-[pulse_1.2s_infinite] h-5" />
                        <span className="w-0.5 bg-[#8BAB70] rounded animate-[pulse_1.0s_infinite] h-4" />
                        <span className="w-0.5 bg-[#8BAB70] rounded animate-[pulse_0.7s_infinite] h-2" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold">{currentTrack.title}</h4>
                      <p className="text-[10px] text-[#4C3322]/60">Playing Now • {currentTrack.host}</p>
                    </div>
                  </div>

                  {/* Track Timeline Progress */}
                  <div className="flex-1 max-w-md flex items-center gap-3 text-[10px] font-bold text-[#4C3322]/70">
                    <span>2:15</span>
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                        setTrackProgress(pct);
                      }}
                      className="flex-grow bg-[#4C3322]/10 h-1.5 rounded-full relative overflow-hidden cursor-pointer"
                    >
                      <div className="bg-[#8BAB70] h-full" style={{ width: `${trackProgress}%` }} />
                    </div>
                    <span>{currentTrack.length}</span>
                  </div>

                  {/* Audio Actions */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 bg-[#4C3322] hover:bg-[#8BAB70] text-white rounded-full flex items-center justify-center shadow transition-all duration-300"
                    >
                      {isPlaying ? <i className="fas fa-pause text-xs"></i> : <i className="fas fa-play text-xs"></i>}
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentTrack(null);
                        setIsPlaying(false);
                      }}
                      className="w-10 h-10 rounded-full border border-[#4C3322]/10 hover:bg-[#DE7A49]/10 hover:text-[#DE7A49] flex items-center justify-center transition-all"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
              
              {/* General details Form (7 Cols) */}
              <div className="md:col-span-7 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-black text-[#4C3322]">Profile Configuration</h3>
                  <p className="text-xs text-[#4C3322]/60 font-light mt-1">Audit your details. Changes update your global user session variables.</p>
                </div>

                <form onSubmit={handleUpdateProfileDetails} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-wider text-[#4C3322]/70 uppercase ml-2">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue={currentUser.name}
                        required
                        className="w-full px-4 py-2.5 rounded-full border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner text-[#4C3322]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-wider text-[#4C3322]/70 uppercase ml-2">Occupation</label>
                      <input 
                        type="text" 
                        defaultValue={currentUser.occupation || "Mindfulness Practitioner"}
                        required
                        className="w-full px-4 py-2.5 rounded-full border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner text-[#4C3322]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-wider text-[#4C3322]/70 uppercase ml-2">Avatar URL</label>
                    <input 
                      type="url" 
                      defaultValue={currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"}
                      required
                      className="w-full px-4 py-2.5 rounded-full border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner text-[#4C3322]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-wider text-[#4C3322]/70 uppercase ml-2">Bio / Intentions</label>
                    <textarea 
                      defaultValue={currentUser.bio || "Finding balance, silence, and clarity through quarterly print columns."}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner text-[#4C3322] resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-semibold text-xs rounded-full shadow transition-all duration-300 active:scale-[0.98]"
                  >
                    Save Configuration Changes
                  </button>
                </form>
              </div>

              {/* Subscription Card (5 Cols) */}
              <div className="md:col-span-5 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm flex flex-col justify-between text-center min-h-[300px]">
                <div className="w-full">
                  <h3 className="font-serif text-xl font-black text-[#4C3322]">Membership Tier</h3>
                  <p className="text-[10px] text-[#4C3322]/60 font-light mt-0.5">You are an active collector of Cereen print editions.</p>
                </div>

                <div className="my-6">
                  <div className="inline-block p-6 rounded-[2rem] bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70]">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
                    </svg>
                    <span className="font-serif text-xl font-black tracking-tight block">Collector's Tier</span>
                    <span className="text-[9px] uppercase tracking-widest font-bold text-[#4C3322]/60 block mt-1">Renews January 2027</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => alert("Billing portal redirect initialized.")}
                  className="w-full py-3 border border-[#4C3322]/15 text-[#4C3322] hover:bg-[#4C3322] hover:text-white font-semibold text-xs rounded-full shadow transition-all duration-300 active:scale-[0.98]"
                >
                  Manage Subscription Billing
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
