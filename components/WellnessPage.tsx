import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { MoodEntry } from '../types';
import { MOCK_COMMUNITY_PULSE } from '../constants';

export const WellnessPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'reflections' | 'practice' | 'library'>('reflections');

  // --- Hero Carousel State ---
  const [currentHero, setCurrentHero] = useState(0);

  // --- Reflections State ---
  const [waterCount, setWaterCount] = useState(0);
  const [sleepHours, setSleepHours] = useState(7);
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');

  // --- Practice State ---
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // --- Toast Alert State ---
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!context) return null;
  const { currentUser, wellnessBanners, logWellnessEntry } = context;

  // Security Redirect: Return user if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Auto-scroll Hero
  useEffect(() => {
    if (!wellnessBanners || wellnessBanners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % wellnessBanners.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [wellnessBanners]);

  // Web Audio API bell chime helper for mindfulness breathing transitions
  const playChime = (freq: number) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Smooth fade-out transition
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.warn("Web Audio Context not permitted or supported in this browser viewport.", e);
    }
  };

  // Breathing Loop (4s inhale, 4s hold, 4s exhale)
  useEffect(() => {
    let timeout: any;
    if (isBreathingActive) {
      if (breathingPhase === 'inhale') {
        playChime(528); // Solfeggio 528Hz transformation frequency
        timeout = setTimeout(() => setBreathingPhase('hold'), 4000);
      } else if (breathingPhase === 'hold') {
        playChime(639); // Solfeggio 639Hz connection frequency
        timeout = setTimeout(() => setBreathingPhase('exhale'), 4000);
      } else if (breathingPhase === 'exhale') {
        playChime(417); // Solfeggio 417Hz change frequency
        timeout = setTimeout(() => setBreathingPhase('inhale'), 4000);
      }
    } else {
      setBreathingPhase('inhale');
    }
    return () => clearTimeout(timeout);
  }, [isBreathingActive, breathingPhase, soundEnabled]);

  if (!currentUser) return null;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Handle Complete Reflection Submit
  const handleSaveReflection = () => {
    if (!selectedMood) {
      triggerToast("Please pick a mood index to complete your log.");
      return;
    }

    if (logWellnessEntry) {
      const entry: MoodEntry = {
        date: new Date().toISOString().split('T')[0],
        mood: selectedMood,
        water: waterCount,
        sleep: sleepHours,
        note: note.trim() ? note : "Completed mindfulness reflection check-in."
      };
      logWellnessEntry(entry);
      triggerToast("Mindfulness reflection logged to your Cereen passport.");
      // Reset inputs
      setSelectedMood('');
      setWaterCount(0);
      setSleepHours(7);
      setNote('');
    }
  };

  // Preset Mood Spectrum
  const moodPresets = [
    { emoji: '😊', label: 'Alignment', desc: 'Flowing with comfort' },
    { emoji: '😌', label: 'Peace', desc: 'Calm and centered' },
    { emoji: '😴', label: 'Rest', desc: 'Restorative quietude' },
    { emoji: '😫', label: 'Weariness', desc: 'Tired or overextended' },
    { emoji: '🤩', label: 'Inspiration', desc: 'Sparks of energy' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden select-none selection:bg-[#8BAB70] selection:text-white">
      
      {/* Background radial accent layers */}
      <div className="absolute top-[-10%] right-[-15%] w-[600px] h-[600px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[500px] h-[500px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* STYLISH HEADER */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 mb-8 border-b border-[#4C3322]/5 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Back to Dashboard"
          >
            <i className="fas fa-arrow-left text-xs"></i>
          </button>
          
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <svg className="w-8 h-8 text-[#4C3322]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm-6-6a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm12 0a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
            </svg>
            <div>
              <h1 className="font-serif text-2xl font-black tracking-tight leading-none">Cereen</h1>
              <span className="text-[10px] tracking-[0.2em] uppercase font-light text-[#4C3322]/60">magazines</span>
            </div>
          </div>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3 bg-white/50 border border-[#4C3322]/10 rounded-full px-4 py-1.5 shadow-sm">
          <img 
            src={currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"} 
            className="w-7 h-7 rounded-full border border-[#4C3322]/10 object-cover shadow-sm"
            alt="Avatar"
          />
          <span className="text-xs font-semibold hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
        </div>
      </header>

      {/* CORE WORKSPACE LIMIT */}
      <div className="max-w-7xl w-full mx-auto space-y-8 flex-1 z-10">

        {/* PROFILE ID & TITLE BANNER */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.25em] font-bold text-[#8BAB70] uppercase">wellness sanctuary</span>
            <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-[#4C3322]">Nurture Your Sanctuary.</h2>
            <p className="text-sm font-light text-[#4C3322]/70 max-w-xl">
              Log daily indices, exercise conscious box breathing with chime timers, and browse catalogued research.
            </p>
          </div>

          {/* Member Card */}
          <div className="w-full sm:w-80 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8BAB70]/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
            <div className="relative z-10 flex items-center gap-4 mb-4">
              <img 
                src={currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"} 
                className="w-12 h-12 rounded-2xl object-cover border border-[#4C3322]/10 shadow-sm" 
                alt="Avatar" 
              />
              <div>
                <h4 className="font-bold text-sm leading-tight text-[#4C3322]">{currentUser.name}</h4>
                <p className="text-[9px] font-bold tracking-wider uppercase text-[#8BAB70] mt-0.5">Wellness Passport #0012</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-[#4C3322]/40">
                <span>Practitioner Rank</span>
                <span className="text-[#8BAB70]">Pro Status</span>
              </div>
              <div className="h-1.5 bg-[#FAF7F2] border border-[#4C3322]/5 rounded-full overflow-hidden">
                <div className="bg-[#8BAB70] h-full w-[70%]" />
              </div>
            </div>
          </div>
        </div>

        {/* HERO CAROUSEL */}
        {wellnessBanners && wellnessBanners.length > 0 && (
          <div className="relative h-[360px] md:h-[400px] w-full bg-white border border-[#4C3322]/10 rounded-[2.5rem] overflow-hidden shadow-sm group">
            {wellnessBanners.map((banner, idx) => (
              <div 
                key={banner.id} 
                className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${idx === currentHero ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
              >
                {banner.mediaType === 'video' ? (
                  <video 
                    src={banner.mediaUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover select-none pointer-events-none" 
                  />
                ) : (
                  <img 
                    src={banner.mediaUrl} 
                    alt={banner.title} 
                    className="w-full h-full object-cover select-none pointer-events-none" 
                  />
                )}
                
                {/* Vintage overlay shade */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#4C3322] via-[#4C3322]/40 to-transparent flex flex-col justify-center px-8 md:px-16" />
                
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-xl text-[#FAF7F2] z-20 space-y-4">
                  <span className="text-[10px] tracking-[0.25em] font-bold text-[#8BAB70] uppercase">Editorial highlight</span>
                  <h3 className="font-serif text-3xl md:text-5xl font-black leading-tight drop-shadow-sm">{banner.title}</h3>
                  <p className="text-sm font-light text-[#FAF7F2]/80 leading-relaxed max-w-md">{banner.subtitle}</p>
                </div>
              </div>
            ))}
            
            {/* Control indicators */}
            <div className="absolute bottom-6 right-10 z-20 flex gap-2">
              {wellnessBanners.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentHero(i)} 
                  className={`h-2 rounded-full transition-all cursor-pointer ${currentHero === i ? 'bg-[#8BAB70] w-6' : 'bg-[#FAF7F2]/40 w-2 hover:bg-[#FAF7F2]/60'}`} 
                  title={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* COMMUNITY PULSE TICKER */}
        <div className="bg-white/60 border border-[#4C3322]/10 rounded-[2rem] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-wider text-[#4C3322]/50">
            <span className="w-1.5 h-1.5 bg-[#8BAB70] rounded-full animate-pulse" /> Live Community Pulse
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_COMMUNITY_PULSE.map(pulse => (
              <div key={pulse.id} className="flex items-center gap-3 bg-white/40 border border-[#4C3322]/5 rounded-2xl p-3 shadow-inner">
                <img 
                  src={pulse.avatar} 
                  className="w-8 h-8 rounded-full border border-[#4C3322]/10 object-cover shadow-sm" 
                  alt={pulse.user} 
                />
                <div>
                  <p className="text-xs text-[#4C3322] font-semibold leading-tight">
                    <span className="font-bold text-[#8BAB70]">{pulse.user}</span> {pulse.action}
                  </p>
                  <span className="text-[9px] font-light text-[#4C3322]/40 tracking-wide mt-0.5 block">{pulse.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TAB CONTROLLERS */}
        <div className="flex justify-center border-t border-b border-[#4C3322]/10 py-4">
          <div className="bg-white/50 border border-[#4C3322]/10 p-1.5 rounded-full shadow-sm inline-flex gap-1.5 flex-wrap">
            {[
              { id: 'reflections', label: 'Reflection Check-in', icon: 'fas fa-pen-nib' },
              { id: 'practice', label: 'Breathing Coach', icon: 'fas fa-heart' },
              { id: 'library', label: 'Wellness Library', icon: 'fas fa-book-open' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${activeTab === tab.id ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm' : 'text-[#4C3322]/60 hover:bg-[#4C3322]/5'}`}
              >
                <i className={tab.icon}></i> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE WORKSPACE CONTENTS */}
        <div className="min-h-[500px] relative">
          
          {/* TAB 1: DAILY REFLECTIONS */}
          {activeTab === 'reflections' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              
              {/* Check-in parameters (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-8">
                <div className="flex justify-between items-center border-b border-[#4C3322]/5 pb-4">
                  <h3 className="font-serif text-2xl font-black text-[#4C3322]">Reflect & Align</h3>
                  <span className="text-xs font-bold text-[#8BAB70] tracking-wider uppercase">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Mood picker grid */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">1. Today's Mood Index</label>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {moodPresets.map(preset => (
                      <button
                        key={preset.emoji}
                        type="button"
                        onClick={() => setSelectedMood(preset.emoji)}
                        className={`p-4 rounded-3xl border flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${selectedMood === preset.emoji ? 'bg-[#8BAB70]/10 border-[#8BAB70] scale-105 shadow-sm' : 'border-[#4C3322]/10 hover:bg-[#4C3322]/5 bg-[#FAF7F2]/20'}`}
                      >
                        <span className="text-3xl select-none">{preset.emoji}</span>
                        <span className="text-[10px] font-bold text-[#4C3322] mt-2 block">{preset.label}</span>
                        <span className="text-[8px] font-light text-[#4C3322]/60 mt-0.5 text-center leading-none">{preset.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Hydration tracker */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">
                      2. Hydration ({waterCount} / 8 Glasses)
                    </label>
                    <div className="bg-[#FAF7F2]/40 border border-[#4C3322]/5 rounded-3xl p-4 flex flex-col justify-center items-center gap-4">
                      <div className="flex gap-1.5 select-none w-full max-w-[280px]">
                        {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setWaterCount(num)}
                            className={`flex-grow h-10 rounded-xl transition-all duration-300 flex items-center justify-center border cursor-pointer ${num <= waterCount ? 'bg-[#8BAB70] border-[#8BAB70] text-[#FAF7F2] shadow-sm' : 'border-[#4C3322]/15 bg-white text-[#4C3322]/40 hover:bg-[#8BAB70]/10'}`}
                            title={`Log ${num} glasses`}
                          >
                            <i className="fas fa-glass-whiskey text-xs"></i>
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between w-full text-[10px] font-bold text-[#4C3322]/40 px-1">
                        <span>Hydrate</span>
                        <button 
                          onClick={() => setWaterCount(0)} 
                          className="hover:text-[#DE7A49] transition-colors"
                        >
                          Reset Counter
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sleep duration pills */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">
                      3. Sleep Indices ({sleepHours} Hours)
                    </label>
                    <div className="bg-[#FAF7F2]/40 border border-[#4C3322]/5 rounded-3xl p-4 flex items-center justify-center">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {[4, 5, 6, 7, 8, 9, 10].map(hours => (
                          <button
                            key={hours}
                            type="button"
                            onClick={() => setSleepHours(hours)}
                            className={`w-9 h-9 rounded-full text-xs font-bold border transition-all duration-300 cursor-pointer ${sleepHours === hours ? 'bg-[#4C3322] border-[#4C3322] text-[#FAF7F2] scale-105 shadow-sm' : 'border-[#4C3322]/15 bg-white text-[#4C3322]/70 hover:bg-[#4C3322]/5'}`}
                          >
                            {hours}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Journal personal notes */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">4. Personal Reflection Note</label>
                  <textarea
                    rows={4}
                    placeholder="Capture your stream of consciousness, a list of gratitude, or sensory logs..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-3xl p-4 focus:outline-none focus:border-[#8BAB70] focus:bg-white text-sm text-[#4C3322] placeholder-[#4C3322]/40 resize-none shadow-inner font-light italic"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveReflection}
                  className="w-full py-4 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-3xl font-black text-sm tracking-widest uppercase shadow transition-all duration-300 cursor-pointer"
                >
                  Log Daily Reflection
                </button>
              </div>

              {/* Sidebar quotes/notes (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Editorial box */}
                <div className="bg-gradient-to-br from-[#4C3322] to-[#2E1F14] text-[#FAF7F2] rounded-[2.5rem] p-6 shadow-md relative overflow-hidden select-none">
                  <h4 className="font-serif text-lg font-black tracking-tight mb-2">Self-Observation</h4>
                  <p className="text-xs font-light leading-relaxed italic opacity-85">
                    "Keeping records of daily elements generates deep neurological loops of awareness. By observing your hydration, sleep hours, and internal pulse, you begin to steer your alignment consciously."
                  </p>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#8BAB70]/10 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Tips checklist */}
                <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-lg font-black tracking-tight text-[#4C3322]">Nurturing Practices</h4>
                  <ul className="space-y-3.5 text-xs font-light text-[#4C3322]/70 leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <i className="fas fa-check text-xs text-[#8BAB70] mt-0.5"></i>
                      <span>Record alignment entries regularly to populate statistics indices.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <i className="fas fa-check text-xs text-[#8BAB70] mt-0.5"></i>
                      <span>Aim for at least 8 glasses of fresh hydration every day.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <i className="fas fa-check text-xs text-[#8BAB70] mt-0.5"></i>
                      <span>Integrate a 4-second hold breathing session after check-in.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BREATHING PRACTICE */}
          {activeTab === 'practice' && (
            <div className="max-w-3xl mx-auto bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col items-center justify-center text-center animate-fade-in space-y-8 relative overflow-hidden">
              
              {/* Tone chime status controller */}
              <div className="absolute top-6 right-8 flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#4C3322]/40 uppercase tracking-wider">
                  Solfeggio Sound: {soundEnabled ? "ON" : "OFF"}
                </span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${soundEnabled ? 'bg-[#8BAB70]/10 border-[#8BAB70] text-[#8BAB70]' : 'border-[#4C3322]/10 text-[#4C3322]/40 hover:bg-[#4C3322]/5'}`}
                  title="Toggle bell tone sounds"
                >
                  <i className={`fas ${soundEnabled ? 'fa-volume-up' : 'fa-volume-mute'} text-[10px]`}></i>
                </button>
              </div>

              {/* Dynamic breathing circle frame */}
              <div className="relative my-10 flex items-center justify-center select-none w-80 h-80">
                {/* Expansive ripple border */}
                {isBreathingActive && (
                  <div className="absolute -inset-4 border border-[#8BAB70]/20 rounded-full animate-ping pointer-events-none" />
                )}
                
                {/* Primary Breathing coach bubble */}
                <div 
                  className={`w-72 h-72 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-[4000ms] ease-in-out relative ${
                    isBreathingActive 
                      ? (breathingPhase === 'inhale' 
                          ? 'scale-110 bg-[#8BAB70]/10 border-[#8BAB70]/40 shadow-xl' 
                          : breathingPhase === 'hold' 
                            ? 'scale-110 bg-[#DE7A49]/10 border-[#DE7A49]/40 shadow-xl' 
                            : 'scale-90 bg-transparent border-[#8BAB70]/15') 
                      : 'border-[#4C3322]/15 bg-[#FAF7F2]/40'
                  }`}
                >
                  {isBreathingActive ? (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold tracking-[0.25em] text-[#4C3322]/50 uppercase block">
                        {breathingPhase === 'inhale' ? 'Phase 1' : breathingPhase === 'hold' ? 'Phase 2' : 'Phase 3'}
                      </span>
                      <h4 className="font-serif text-3xl font-black text-[#4C3322] uppercase tracking-[0.1em]">
                        {breathingPhase === 'inhale' ? 'Breathe In' : breathingPhase === 'hold' ? 'Hold Still' : 'Breathe Out'}
                      </h4>
                      <span className="text-[9px] font-semibold text-[#8BAB70] tracking-widest uppercase block mt-1">
                        {breathingPhase === 'inhale' ? '528Hz Love' : breathingPhase === 'hold' ? '639Hz Connect' : '417Hz Change'}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <i className="fas fa-leaf text-2xl text-[#8BAB70] mb-2"></i>
                      <h4 className="font-serif text-2xl font-black text-[#4C3322] uppercase tracking-wide">
                        Box Rhythm
                      </h4>
                      <p className="text-[10px] text-[#4C3322]/50 font-bold uppercase tracking-wider">
                        4s Inhale • 4s Hold • 4s Exhale
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Descriptions & Toggles */}
              <div className="space-y-2 max-w-md">
                <h4 className="font-serif text-xl font-bold text-[#4C3322]">Lower Cortisol Levels Instantly</h4>
                <p className="text-xs text-[#4C3322]/70 font-light leading-relaxed">
                  Box breathing balances the autonomic nervous system, resetting your emotional frequency and creating mental clarity. Focus on the chime sounds at each transition.
                </p>
              </div>

              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`px-12 py-4 rounded-full font-black text-sm tracking-widest uppercase shadow transition-all duration-300 cursor-pointer ${isBreathingActive ? 'bg-[#DE7A49] text-[#FAF7F2]' : 'bg-[#4C3322] text-[#FAF7F2] hover:scale-105'}`}
              >
                {isBreathingActive ? 'Stop Breathing Coach' : 'Start Conscious Breathing'}
              </button>
            </div>
          )}

          {/* TAB 3: WELLNESS LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-12 animate-fade-in">
              
              {/* Highlight featured story box */}
              <div className="relative h-[400px] w-full rounded-[2.5rem] overflow-hidden shadow-sm group border border-[#4C3322]/10 select-none">
                <img 
                  src="https://picsum.photos/seed/mag/1200/600" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2000ms] pointer-events-none" 
                  alt="Featured Article Cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4C3322] via-[#4C3322]/20 to-transparent" />
                <div className="absolute bottom-8 left-8 md:left-12 max-w-xl text-[#FAF7F2] space-y-4">
                  <span className="bg-[#DE7A49] text-[#FAF7F2] px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm">
                    Featured Edition
                  </span>
                  <h3 className="text-3xl md:text-5xl font-serif font-black leading-tight leading-none drop-shadow-sm">
                    Finding Zen in the Digital Chaos.
                  </h3>
                  <p className="text-sm font-light text-[#FAF7F2]/80 leading-relaxed">
                    Discover why modern practitioners are returning to analog journals and intentional alignment logs to preserve cognitive focus in 2026.
                  </p>
                  <button 
                    onClick={() => triggerToast("Journal PDF downloading to your library...")}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8BAB70] hover:text-[#FAF7F2] hover:gap-3 transition-all cursor-pointer"
                  >
                    Read Full Story <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>

              {/* Sub categories section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { 
                    category: 'Mindfulness', 
                    title: 'The Resonance of Stillness', 
                    readTime: '5 min read', 
                    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80' 
                  },
                  { 
                    category: 'Nutrition', 
                    title: 'Hydration and Brain Synapse Speed', 
                    readTime: '3 min read', 
                    image: 'https://images.unsplash.com/photo-1548839130-3fd96157f5f8?auto=format&fit=crop&w=400&q=80' 
                  },
                  { 
                    category: 'Sleep', 
                    title: 'The Seven Hour Sleep Standard', 
                    readTime: '6 min read', 
                    image: 'https://images.unsplash.com/photo-1520206183501-b80df6103962?auto=format&fit=crop&w=400&q=80' 
                  }
                ].map(item => (
                  <div 
                    key={item.title} 
                    className="group bg-white border border-[#4C3322]/10 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow transition-all duration-300 flex flex-col cursor-pointer"
                    onClick={() => triggerToast(`Opening "${item.title}" in magazine reader...`)}
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img 
                        src={item.image} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" 
                        alt={item.title} 
                      />
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-[#4C3322]/10 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-[#4C3322] uppercase">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <h5 className="font-serif font-black text-base text-[#4C3322] leading-snug group-hover:text-[#8BAB70] transition-colors">
                        {item.title}
                      </h5>
                      <div className="flex justify-between items-center text-[10px] font-bold text-[#4C3322]/40 tracking-wide">
                        <span>Cereen Library</span>
                        <span>{item.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Pop up toast indicator */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in bg-[#4C3322] text-[#FAF7F2] px-6 py-3.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-3">
          <svg className="w-5 h-5 text-[#8BAB70] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs md:text-sm font-semibold tracking-wide">{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
