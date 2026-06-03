import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  sleep: number;
  water: number;
  gratitude: string;
}

interface MagazineIssue {
  id: string;
  title: string;
  desc: string;
  coverColor: string;
  pages: { title: string; subtitle: string; text: string }[];
}

export const CereenDashboardPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sanctuary' | 'library' | 'journal' | 'audio' | 'settings'>('sanctuary');

  // Journal States
  const [mood, setMood] = useState<number>(8);
  const [sleep, setSleep] = useState<number>(7.5);
  const [water, setWater] = useState<number>(2.5); // in Liters
  const [gratitude, setGratitude] = useState<string>('');
  const [journalHistory, setJournalHistory] = useState<JournalEntry[]>([
    { id: 'log-1', date: 'Jun 02, 2026', mood: 8, sleep: 7.5, water: 2.5, gratitude: 'Caught the early morning sun filtering through the blinds.' },
    { id: 'log-2', date: 'Jun 01, 2026', mood: 7, sleep: 7.0, water: 2.0, gratitude: 'A warm mug of camomile tea before drifting to sleep.' }
  ]);
  
  // Timer & Breathing States
  const [timerSeconds, setTimerSeconds] = useState<number>(600); // 10 mins default
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerPreset, setTimerPreset] = useState<number>(10);
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCounter, setBreathCounter] = useState<number>(1);
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
  const [trackProgress, setTrackProgress] = useState<number>(15); // percentage
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(130); // 2:10 in seconds

  if (!context) return null;
  const { currentUser, logout } = context;

  // Security Redirect
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Load Journal History from LocalStorage
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`cereen_journal_${currentUser.id}`);
      if (saved) {
        setJournalHistory(JSON.parse(saved));
      }
    }
  }, [currentUser]);

  // Web Audio Grounding Bell Chime Synthesizer
  const playBellChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();
      
      // Grounding frequency (D4 note 293.66Hz) and sweet resonance octave (D5 587.33Hz)
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(293.66, now);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(587.33, now);
      
      // Envelopes
      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 4); // 4 second decay
      
      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 3);
      
      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(ctx.destination);
      gain2.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      
      osc1.stop(now + 4);
      osc2.stop(now + 4);
    } catch (e) {
      console.warn("Acoustic bell failed to play:", e);
    }
  };

  // Timer & Breathing Cycles Effect
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playBellChime();
            alert("Your meditation session is complete. Return slowly to your surroundings.");
            return 0;
          }
          return prev - 1;
        });

        // 4-7-8 Breathing Cycle logic
        setBreathCounter((prevCount) => {
          if (breathState === 'Inhale' && prevCount >= 4) {
            setBreathState('Hold');
            return 1;
          } else if (breathState === 'Hold' && prevCount >= 7) {
            setBreathState('Exhale');
            return 1;
          } else if (breathState === 'Exhale' && prevCount >= 8) {
            setBreathState('Inhale');
            return 1;
          }
          return prevCount + 1;
        });

      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setBreathState('Inhale');
      setBreathCounter(1);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, breathState]);

  // Audio Playback Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const parts = currentTrack.length.split(':');
          const maxSecs = parseInt(parts[0]) * 60 + parseInt(parts[1]);
          if (prev >= maxSecs - 1) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          setTrackProgress(Math.round((next / maxSecs) * 100));
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack]);

  if (!currentUser) return null;

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

  // AI Chat Simulation
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setAiHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setLoadingAi(true);

    setTimeout(() => {
      let reply = "Focus on the weight of your thoughts drifting away. What area of wellness or mindfulness would you like to explore next?";
      const lower = userMsg.toLowerCase();

      if (lower.includes('meditat') || lower.includes('breath') || lower.includes('timer')) {
        reply = "Meditation builds mental resilience. Select the Mindfulness Log tab and start our Meditation Timer. Try focusing purely on the rise and fall of your abdomen.";
      } else if (lower.includes('anxi') || lower.includes('stress') || lower.includes('worry')) {
        reply = "When stress spikes, remember the 4-7-8 breathing system: inhale for 4s, hold for 7s, and exhale for 8s. You can practice this live using our timer breathing visualizer.";
      } else if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia')) {
        reply = "Restful sleep begins with digital separation. Try logging your gratitude thoughts in the Log tab, dimming your display, and turning off updates.";
      } else if (lower.includes('journal') || lower.includes('mood') || lower.includes('water')) {
        reply = "Self-tracking cultivates awareness. Record your sleep quality and hydration inside the Log. Your entry history will display immediately on the dashboard.";
      } else if (lower.includes('magazine') || lower.includes('book') || lower.includes('issue')) {
        reply = "You have full access to our digital volumes in the Library tab. Open 'Spring 2026: The Sanctuary Issue' to explore Marcus Vance's column on sensory architecture.";
      }

      setAiHistory(prev => [...prev, { sender: 'ai', text: reply }]);
      setLoadingAi(false);
    }, 900);
  };

  // Save Daily Reflection
  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: JournalEntry = {
      id: `log-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      mood,
      sleep,
      water,
      gratitude: gratitude.trim() || 'Enjoyed a moment of pure awareness.'
    };

    const updated = [newEntry, ...journalHistory];
    setJournalHistory(updated);
    localStorage.setItem(`cereen_journal_${currentUser.id}`, JSON.stringify(updated));
    setGratitude('');
    alert("Mindfulness log recorded and added to your Sanctuary History.");
  };

  // E-Reader Magazine Collection
  const magazineIssues: MagazineIssue[] = [
    { 
      id: 'spring-2026', 
      title: 'Spring 2026: The Sanctuary Issue', 
      desc: 'Exploring modern spaces designed for deep sensory relief, organic architecture, and forest meditation.', 
      coverColor: 'bg-[#8BAB70]/20 border-[#8BAB70]/30', 
      pages: [
        { title: "Overview & Welcome", subtitle: "A Message from the Editors", text: "Welcome to our Spring 2026 sanctuary volume. This issue is an exploration of the spaces that hold us. In a world of digital fragmentation, creating sensory zones of stillness is not a luxury—it is an act of restoration. Over the following columns, we invite you to dim your lights, breathe with our timer, and wander through forest sanctuaries." },
        { title: "Chapter 1: The Architecture of Silence", subtitle: "By Marcus Vance", text: "How do we design rooms that let the mind settle? Architects are shifting from cold minimalism to sensory warmth. By using sunlit textures, porous concrete, raw wood, and acoustic ceiling baffles, we can design spaces that filter sound. In a sanctuary room, the noise floor drops, allowing our internal dialogue to speak clearly." },
        { title: "Chapter 2: The Forest Canopy Walkway", subtitle: "By Elena Rostova", text: "Shinrin-yoku, or forest bathing, is a physiological practice. Studies show that inhaling phytoncides—organic compounds released by evergreen conifers—reduces cortisol levels and blood pressure. Walks on elevated wooden ramps among hemlocks allow the body to hover between earth and sky, finding geometric alignment." },
        { title: "Chapter 3: Breathwork & Fragrance", subtitle: "By Sarah Jenkins", text: "Scent routes directly to the amygdala. Coupling mindful breathing with natural cedar wood or orange blossom extracts accelerates heart rate variability recovery. Try practicing the 4-7-8 method while introducing warm amber oils, breathing through the nose and noticing the temperature transitions." },
        { title: "Editorial: Forward Vision", subtitle: "Reflections for Summer", text: "As the light shifts, we look forward to active expansion. But before we move outward, we invite you to sit with this volume, log your daily water indices, check in on your mood, and listen to the ambient recordings in our audio library. Stay inspired." }
      ] 
    },
    { 
      id: 'winter-2025', 
      title: 'Winter 2025: The Solitude Issue', 
      desc: 'A dedicated volume on self-reliance, silence, cold hydrotherapy, and finding peace in seasonal transitions.', 
      coverColor: 'bg-[#DE7A49]/20 border-[#DE7A49]/30', 
      pages: [
        { title: "Overview & Welcome", subtitle: "A Column on Winter Transition", text: "Welcome to our Winter volume. Winter is the planet's respiration period—a deep exhalation. We examine structural ways to embrace seasonal cold, configure your living environment for heat conservation, and find wellness in absolute solitude." },
        { title: "Chapter 1: The Beauty of Silence", subtitle: "By Thomas Wright", text: "We live in an acoustically crowded world. True silence is a raw, rare resource. In this chapter, we outline how to spend 30 minutes in full acoustic isolation daily, letting your brain waves transition from active Beta to relaxed Alpha and Theta cycles." },
        { title: "Chapter 2: Cold Plunge Protocols", subtitle: "By Dr. Liam Karr", text: "Cold water triggers significant norepinephrine release, raising alertness and reducing neural inflammation. We review baseline routines: maintaining temperatures between 45-55°F, practicing diaphragmatic breathing, and taking 3-minute dips to stabilize vascular reflexes." }
      ] 
    },
    { 
      id: 'autumn-2025', 
      title: 'Autumn 2025: The Expression Issue', 
      desc: 'Focuses on creative outlets, journal releases, art therapeutics, and alignment through vocal expression.', 
      coverColor: 'bg-[#4C3322]/10 border-[#4C3322]/20', 
      pages: [
        { title: "Overview & Welcome", subtitle: "Reflections on Autumn", text: "Welcome to our Autumn volume. As foliage transitions, we look at human expression. How do we let go of habits that no longer serve us, and how do we translate our internal journeys into creative mediums?" },
        { title: "Chapter 1: Writing as Healing", subtitle: "By Clara Oswald", text: "Expressive writing has direct correlation with immune efficiency. Spending 15 minutes drafting emotional reflections without grammatical restriction or judgment lets the amygdala file away stress as narrative memory, lowering psychological tension." }
      ] 
    }
  ];

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
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <svg className="w-8 h-8 text-[#4C3322]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm-6-6a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm12 0a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
          </svg>
          <div>
            <h1 className="font-serif text-2xl font-black tracking-tight leading-none">Cereen</h1>
            <span className="text-[10px] tracking-[0.2em] uppercase font-light text-[#4C3322]/60">magazines</span>
          </div>
        </div>

        {/* User profile details Card */}
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
        
        {/* SIDEBAR NAVIGATION */}
        <nav className="lg:col-span-3 bg-white/60 backdrop-blur-md border border-[#4C3322]/10 rounded-[2rem] p-5 space-y-2 shadow-sm flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar">
          <div className="text-xs font-bold uppercase tracking-widest text-[#4C3322]/40 mb-3 px-3 hidden lg:block">
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

          <button 
            onClick={() => navigate('/circle')}
            className="w-full text-left px-4 py-3 rounded-full flex items-center gap-3 text-sm font-semibold transition-all duration-300 hover:bg-[#8BAB70]/15 hover:text-[#8BAB70] text-[#4C3322]"
          >
            <i className="fas fa-users text-xs"></i>
            <span className="whitespace-nowrap font-bold">Sanctuary Circle</span>
          </button>

          <button 
            onClick={() => navigate('/wellness')}
            className="w-full text-left px-4 py-3 rounded-full flex items-center gap-3 text-sm font-semibold transition-all duration-300 hover:bg-[#8BAB70]/15 hover:text-[#8BAB70] text-[#4C3322]"
          >
            <i className="fas fa-spa text-xs"></i>
            <span className="whitespace-nowrap font-bold">Wellness Sanctuary</span>
          </button>

          <button 
            onClick={() => navigate('/virtual-partner/create')}
            className="w-full text-left px-4 py-3 rounded-full flex items-center gap-3 text-sm font-semibold transition-all duration-300 hover:bg-[#8BAB70]/15 hover:text-[#8BAB70] text-[#4C3322]"
          >
            <i className="fas fa-robot text-xs"></i>
            <span className="whitespace-nowrap font-bold">Companion Guide</span>
          </button>

          <button 
            onClick={() => navigate('/marketplace')}
            className="w-full text-left px-4 py-3 rounded-full flex items-center gap-3 text-sm font-semibold transition-all duration-300 hover:bg-[#8BAB70]/15 hover:text-[#8BAB70] text-[#4C3322]"
          >
            <i className="fas fa-store text-xs"></i>
            <span className="whitespace-nowrap font-bold">Marketplace Catalog</span>
          </button>

          <button 
            onClick={() => navigate('/travels')}
            className="w-full text-left px-4 py-3 rounded-full flex items-center gap-3 text-sm font-semibold transition-all duration-300 hover:bg-[#8BAB70]/15 hover:text-[#8BAB70] text-[#4C3322]"
          >
            <i className="fas fa-plane text-xs"></i>
            <span className="whitespace-nowrap font-bold">Wanderlust Journey</span>
          </button>
        </nav>

        {/* WORKSPACE AREA */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: SANCTUARY GUIDE */}
          {activeTab === 'sanctuary' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white/40 border border-[#4C3322]/10 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-black text-[#4C3322]">Welcome to your sanctuary, {currentUser.name.split(' ')[0]}.</h2>
                  <p className="text-sm text-[#4C3322]/70 font-light mt-1">Explore custom breathing intervals, wellness library editions, and interactive guides.</p>
                </div>
                <div>
                  <span className="px-3.5 py-1.5 rounded-full border border-[#8BAB70]/20 bg-[#8BAB70]/10 text-[#8BAB70] text-[10px] font-bold tracking-wider uppercase">
                    Collector Account
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
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[#4C3322]/50">Reflection Streak</h5>
                    <p className="text-2xl font-black font-serif text-[#4C3322]">{journalHistory.length < 10 ? '0' : ''}{journalHistory.length} Days</p>
                  </div>
                </div>

                <div className="bg-white border border-[#4C3322]/10 rounded-[2rem] p-6 shadow-sm flex items-center gap-4 hover:shadow transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#DE7A49]/15 text-[#DE7A49] flex items-center justify-center text-lg">
                    <i className="fas fa-glass-water"></i>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[#4C3322]/50">Today's Hydration</h5>
                    <p className="text-2xl font-black font-serif text-[#4C3322]">{water.toFixed(1)} Liters</p>
                  </div>
                </div>

                <div className="bg-white border border-[#4C3322]/10 rounded-[2rem] p-6 shadow-sm flex items-center gap-4 hover:shadow transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#4C3322]/10 text-[#4C3322] flex items-center justify-center text-lg">
                    <i className="fas fa-book-reader"></i>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-[#4C3322]/50">Sleep Average</h5>
                    <p className="text-2xl font-black font-serif text-[#4C3322]">7.2 Hours</p>
                  </div>
                </div>
              </div>

              {/* AI Chatbox Widget */}
              <div className="bg-white/60 backdrop-blur-md border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm flex flex-col h-[500px] overflow-hidden">
                <div className="flex items-center gap-3 border-b border-[#4C3322]/5 pb-4 mb-4">
                  <div className="w-9 h-9 rounded-full bg-[#8BAB70] text-white flex items-center justify-center text-xs shadow-inner">
                    <i className="fas fa-feather-alt animate-pulse"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Cereen Sanctuary Guide</h4>
                    <p className="text-[9px] uppercase tracking-wider text-[#4C3322]/60 font-medium">Interactive Mindfulness Companion</p>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-grow overflow-y-auto space-y-4 pr-2 mb-4 scroll-smooth">
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
                    placeholder="Ask about breathing tools, stress support, or edit page chapters..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-grow px-5 py-3.5 rounded-full border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner placeholder-[#4C3322]/40"
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

          {/* TAB 2: LIBRARY & E-READER */}
          {activeTab === 'library' && (
            <div className="space-y-6 animate-fade-in">
              {!selectedIssue ? (
                <>
                  <div className="bg-white/40 border border-[#4C3322]/10 rounded-[2rem] p-6 shadow-sm">
                    <h2 className="font-serif text-2xl font-black text-[#4C3322]">Digital Archive Library</h2>
                    <p className="text-sm text-[#4C3322]/70 font-light mt-1">Unlock your subscription copies. Read directly inside your web console.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {magazineIssues.map((issue) => (
                      <div key={issue.id} className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
                        <div className={`h-48 ${issue.coverColor} p-8 flex flex-col justify-between border-b border-[#4C3322]/5 relative`}>
                          <svg className="w-12 h-12 text-[#4C3322]/10 absolute bottom-4 right-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
                          </svg>
                          <span className="text-[9px] uppercase font-bold tracking-widest bg-[#4C3322] text-[#FAF7F2] px-2.5 py-1 rounded-full self-start">Quarterly</span>
                          <h4 className="font-serif text-lg font-black leading-tight tracking-tight mt-4">{issue.title.split(': ')[1]}</h4>
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
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
                /* DETAILED READER FRAME */
                <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm flex flex-col h-[600px] animate-fade-in-up">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-[#4C3322]/5 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedIssue(null)}
                        className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-all"
                      >
                        <i className="fas fa-arrow-left text-xs"></i>
                      </button>
                      <div>
                        <h4 className="text-sm font-bold truncate max-w-xs md:max-w-md">
                          {magazineIssues.find(i => i.id === selectedIssue)?.title}
                        </h4>
                        <p className="text-[9px] uppercase tracking-wider text-[#8BAB70] font-bold">Collector E-Reader Active</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold tracking-wider bg-[#FAF7F2] border border-[#4C3322]/10 px-3.5 py-1 rounded-full">
                      Page {readerPage} / {magazineIssues.find(i => i.id === selectedIssue)?.pages.length}
                    </span>
                  </div>

                  {/* Editorial Layout */}
                  <div className="flex-1 bg-[#FAF7F2]/60 rounded-3xl border border-[#4C3322]/5 p-6 md:p-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full relative overflow-y-auto">
                    <span className="text-[10px] tracking-[0.2em] font-bold text-[#8BAB70] uppercase mb-1">
                      {magazineIssues.find(i => i.id === selectedIssue)?.pages[readerPage - 1].subtitle}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl font-black tracking-tight text-[#4C3322] mb-4">
                      {magazineIssues.find(i => i.id === selectedIssue)?.pages[readerPage - 1].title}
                    </h3>
                    <p className="text-sm font-light text-[#4C3322]/80 max-w-lg leading-relaxed text-justify md:text-center">
                      {magazineIssues.find(i => i.id === selectedIssue)?.pages[readerPage - 1].text}
                    </p>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between border-t border-[#4C3322]/5 pt-4 mt-4">
                    <button 
                      onClick={() => setReaderPage(p => Math.max(1, p - 1))}
                      disabled={readerPage === 1}
                      className="px-5 py-2 border border-[#4C3322]/15 text-xs font-semibold rounded-full hover:bg-[#4C3322] hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Previous Page
                    </button>
                    <button 
                      onClick={() => setReaderPage(p => Math.min(magazineIssues.find(i => i.id === selectedIssue)?.pages.length || 1, p + 1))}
                      disabled={readerPage === (magazineIssues.find(i => i.id === selectedIssue)?.pages.length || 1)}
                      className="px-5 py-2 border border-[#4C3322]/15 text-xs font-semibold rounded-full hover:bg-[#4C3322] hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Next Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MINDFULNESS LOG & TIMER */}
          {activeTab === 'journal' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              {/* Journal Form */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-black text-[#4C3322]">Mindfulness Log</h3>
                    <p className="text-xs text-[#4C3322]/60 font-light mt-1">Self-observation generates mental focus. Note down today's wellness indices.</p>
                  </div>

                  <form onSubmit={handleSaveJournal} className="space-y-4">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Mood Level</span>
                      <span className="text-[#8BAB70]">{mood} / 10</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" value={mood} 
                      onChange={(e) => setMood(parseInt(e.target.value))}
                      className="w-full accent-[#8BAB70] bg-[#4C3322]/10 rounded-full h-2 appearance-none cursor-pointer"
                    />

                    <div className="flex justify-between text-xs font-bold mt-2">
                      <span>Sleep Quality</span>
                      <span className="text-[#8BAB70]">{sleep} hrs</span>
                    </div>
                    <input 
                      type="range" min="3" max="12" step="0.5" value={sleep} 
                      onChange={(e) => setSleep(parseFloat(e.target.value))}
                      className="w-full accent-[#8BAB70] bg-[#4C3322]/10 rounded-full h-2 appearance-none cursor-pointer"
                    />

                    <div className="space-y-2 mt-2">
                      <label className="block text-xs font-bold">Hydration (Water Intake)</label>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => setWater(w => Math.max(0, w - 0.5))} className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#DE7A49]/15 hover:text-[#DE7A49] flex items-center justify-center font-bold">-</button>
                        <span className="text-base font-black w-16 text-center">{water.toFixed(1)} L</span>
                        <button type="button" onClick={() => setWater(w => w + 0.5)} className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#8BAB70]/15 hover:text-[#8BAB70] flex items-center justify-center font-bold">+</button>
                      </div>
                    </div>

                    <div className="space-y-1.5 mt-2">
                      <label className="block text-xs font-bold">Gratitude Entry</label>
                      <textarea 
                        placeholder="Write down one thing you are grateful for today..." 
                        value={gratitude} onChange={(e) => setGratitude(e.target.value)} rows={3}
                        className="w-full px-4 py-3 rounded-2xl border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner placeholder-[#4C3322]/30 resize-none"
                      />
                    </div>

                    <button type="submit" className="w-full py-3 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-semibold text-xs rounded-full shadow transition-all duration-300">
                      Record Daily Entry
                    </button>
                  </form>
                </div>

                {/* Persistent Journal History list */}
                <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-lg font-black text-[#4C3322]">Reflection History</h4>
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                    {journalHistory.map((log) => (
                      <div key={log.id} className="p-4 bg-[#FAF7F2]/50 border border-[#4C3322]/5 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#4C3322]/60">{log.date}</span>
                          <div className="flex gap-2">
                            <span className="bg-[#8BAB70]/15 text-[#8BAB70] px-2 py-0.5 rounded text-[10px] font-bold">Mood: {log.mood}</span>
                            <span className="bg-[#DE7A49]/15 text-[#DE7A49] px-2 py-0.5 rounded text-[10px] font-bold">Water: {log.water}L</span>
                          </div>
                        </div>
                        <p className="text-xs font-light text-[#4C3322]/80 leading-relaxed italic">"{log.gratitude}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meditation Space */}
              <div className="lg:col-span-5 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm flex flex-col items-center justify-between text-center min-h-[450px]">
                <div className="w-full">
                  <h3 className="font-serif text-xl font-black text-[#4C3322]">Meditation Space</h3>
                  <p className="text-[10px] text-[#4C3322]/60 font-light mt-0.5">Focus on breathing cycles to restore sensory balance.</p>
                </div>

                {/* Animated breathing coach */}
                <div className="relative my-4">
                  <div className={`w-36 h-36 rounded-full border-2 border-[#8BAB70]/40 flex flex-col items-center justify-center relative transition-all duration-1000 ${timerRunning ? 'scale-110 bg-[#8BAB70]/5 shadow-[0_0_40px_rgba(139,171,112,0.2)] animate-pulse' : ''}`}>
                    <span className="font-serif text-3xl font-black text-[#4C3322] tracking-wider mb-1">
                      {formatTime(timerSeconds)}
                    </span>
                    {timerRunning && (
                      <span className="text-[9px] uppercase tracking-widest text-[#8BAB70] font-black animate-pulse">
                        {breathState} ({breathCounter}s)
                      </span>
                    )}
                  </div>
                </div>

                {/* Timer Presets */}
                <div className="flex gap-2 justify-center w-full mb-2">
                  {[5, 10, 20].map(m => (
                    <button 
                      key={m} type="button" onClick={() => handleSetTimerPreset(m)}
                      className={`px-3.5 py-1 text-[10px] font-bold rounded-full border transition-all ${timerPreset === m ? 'bg-[#4C3322] border-[#4C3322] text-[#FAF7F2]' : 'border-[#4C3322]/15 text-[#4C3322]/70 hover:bg-[#4C3322]/5'}`}
                    >
                      {m} Min
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`w-full py-3 rounded-full font-semibold text-xs shadow transition-all duration-300 active:scale-[0.98] ${timerRunning ? 'bg-[#DE7A49] text-[#FAF7F2]' : 'bg-[#8BAB70] text-[#FAF7F2]'}`}
                >
                  {timerRunning ? 'Pause Meditation' : 'Start Meditation'}
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
                      setElapsedSeconds(0);
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
                  {/* Info & Equalizer */}
                  <div className="flex items-center gap-3">
                    {isPlaying && (
                      <div className="flex gap-0.5 items-end h-5 w-5 justify-center">
                        <span className="w-0.5 bg-[#8BAB70] rounded h-3 animate-[pulse_0.8s_infinite]" />
                        <span className="w-0.5 bg-[#8BAB70] rounded h-5 animate-[pulse_1.2s_infinite]" />
                        <span className="w-0.5 bg-[#8BAB70] rounded h-4 animate-[pulse_1.0s_infinite]" />
                        <span className="w-0.5 bg-[#8BAB70] rounded h-2 animate-[pulse_0.7s_infinite]" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold">{currentTrack.title}</h4>
                      <p className="text-[10px] text-[#4C3322]/60">Playing Now • {currentTrack.host}</p>
                    </div>
                  </div>

                  {/* Progress Line Bar */}
                  <div className="flex-grow max-w-md flex items-center gap-3 text-[10px] font-bold text-[#4C3322]/70">
                    <span>{formatTime(elapsedSeconds)}</span>
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                        const parts = currentTrack.length.split(':');
                        const totalSecs = parseInt(parts[0]) * 60 + parseInt(parts[1]);
                        setElapsedSeconds(Math.round((pct / 100) * totalSecs));
                        setTrackProgress(pct);
                      }}
                      className="flex-grow bg-[#4C3322]/10 h-1.5 rounded-full relative overflow-hidden cursor-pointer"
                    >
                      <div className="bg-[#8BAB70] h-full" style={{ width: `${trackProgress}%` }} />
                    </div>
                    <span>{currentTrack.length}</span>
                  </div>

                  {/* Controls */}
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
              <div className="md:col-span-7 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-black text-[#4C3322]">Profile Configuration</h3>
                  <p className="text-xs text-[#4C3322]/60 font-light mt-1">Audit your details. Changes update your global user session variables.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); alert("Profile configs saved successfully."); }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-wider text-[#4C3322]/70 uppercase ml-2">Full Name</label>
                      <input 
                        type="text" defaultValue={currentUser.name} required
                        className="w-full px-4 py-2.5 rounded-full border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner text-[#4C3322]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-wider text-[#4C3322]/70 uppercase ml-2">Occupation</label>
                      <input 
                        type="text" defaultValue={currentUser.occupation || "Mindfulness Practitioner"} required
                        className="w-full px-4 py-2.5 rounded-full border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner text-[#4C3322]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-wider text-[#4C3322]/70 uppercase ml-2">Avatar URL</label>
                    <input 
                      type="url" defaultValue={currentUser.avatar || ""} required
                      className="w-full px-4 py-2.5 rounded-full border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner text-[#4C3322]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-wider text-[#4C3322]/70 uppercase ml-2">Bio / Intentions</label>
                    <textarea 
                      defaultValue={currentUser.bio || "Finding balance, silence, and clarity through quarterly print columns."} rows={3}
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#4C3322]/15 bg-white/40 text-sm focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all shadow-inner text-[#4C3322] resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-semibold text-xs rounded-full shadow transition-all duration-300">
                    Save Configuration Changes
                  </button>
                </form>
              </div>

              {/* Subscription Card */}
              <div className="md:col-span-5 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm flex flex-col justify-between text-center min-h-[300px]">
                <div className="w-full">
                  <h3 className="font-serif text-xl font-black text-[#4C3322]">Membership Tier</h3>
                  <p className="text-[10px] text-[#4C3322]/60 font-light mt-0.5">You are an active collector of Cereen print editions.</p>
                </div>

                <div className="my-4">
                  <div className="inline-block p-6 rounded-[2rem] bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70]">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
                    </svg>
                    <span className="font-serif text-xl font-black tracking-tight block">Collector's Tier</span>
                    <span className="text-[9px] uppercase tracking-widest font-bold text-[#4C3322]/60 block mt-1">Renews January 2027</span>
                  </div>
                </div>

                <button 
                  type="button" onClick={() => alert("Billing portal redirect initialized.")}
                  className="w-full py-3 border border-[#4C3322]/15 text-[#4C3322] hover:bg-[#4C3322] hover:text-white font-semibold text-xs rounded-full shadow transition-all duration-300"
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
