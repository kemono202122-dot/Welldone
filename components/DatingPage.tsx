import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { DatingMatchCard } from './DatingMatchCard';
import { LoadingSpinner } from './LoadingSpinner';
import { RelationshipGoal } from '../types';

export const DatingPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  // Search Mode State
  const [searchMode, setSearchMode] = useState<'standard' | 'cosmic'>('standard');

  // Standard Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<RelationshipGoal>('Any');
  const [selectedVibe, setSelectedVibe] = useState('');

  // Cosmic Search State
  const [astroName, setAstroName] = useState('');
  const [astroBirthDate, setAstroBirthDate] = useState('');
  const [astroLuckyNumber, setAstroLuckyNumber] = useState('');

  // Quiz State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(1);
  const [quizGoal, setQuizGoal] = useState<RelationshipGoal | null>(null);
  const [quizVibe, setQuizVibe] = useState('');
  const [quizGreenFlag, setQuizGreenFlag] = useState('');
  const [quizDescription, setQuizDescription] = useState('');

  // Celebration State
  const [celebrationData, setCelebrationData] = useState<{ title: string; message: string } | null>(null);

  if (!context) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] flex items-center justify-center font-outfit">
        <p className="text-center text-xl font-serif">Loading application context...</p>
      </div>
    );
  }

  const {
    currentUser,
    allUsers,
    sendFriendRequest,
    datingMatches,
    loadingDating,
    errorDating,
    searchDatingPartners,
    searchAstrologyPartners,
    awardVirtualCurrency
  } = context;

  const relationshipOptions: { value: RelationshipGoal; label: string }[] = [
    { value: 'Long-term Partner', label: 'Long-term Companion' },
    { value: 'Workout Buddy & More', label: 'Workout Buddy' },
    { value: 'Activity Partner', label: 'Activity Partner' },
    { value: 'Intellectual Connection', label: 'Intellectual Connection' },
    { value: 'Spiritual Journey', label: 'Spiritual Journey' },
    { value: 'Friendship First', label: 'Friendship First' },
    { value: 'Any', label: 'Any Goal' }
  ];

  const vibeOptions = [
    'Adventurous 🎒', 'Chill ☕', 'Ambitious 💼', 'Creative 🎨', 'Spiritual 🧘', 'Intellectual 📚'
  ];

  const activityTags = [
    { label: '📚 Book Club', desc: 'Looking for a book reading partner to discuss literature.', goal: 'Intellectual Connection' as RelationshipGoal },
    { label: '🧘 Meditation', desc: 'Finding peace together through shared meditation sessions.', goal: 'Spiritual Journey' as RelationshipGoal },
    { label: '🏃 Fitness Pal', desc: 'Need a gym buddy or running partner to stay motivated.', goal: 'Workout Buddy & More' as RelationshipGoal },
    { label: '🏛️ Art & Museums', desc: 'Looking for a companion to explore history and galleries.', goal: 'Activity Partner' as RelationshipGoal },
  ];

  // --- Handlers ---

  const handleQuickSelect = (tag: typeof activityTags[0]) => {
    setSearchQuery(tag.desc);
    setSelectedGoal(tag.goal);
  };

  const handleStandardSearch = async () => {
    if (!searchQuery.trim() && selectedGoal === 'Any' && !selectedVibe) {
      alert("Please describe your ideal connection or select a filter!");
      return;
    }
    
    // Construct a prompt from the inputs
    let finalDescription = searchQuery;
    if (selectedVibe) {
        finalDescription += ` (Vibe: ${selectedVibe})`;
    }

    await searchDatingPartners({
      description: finalDescription || "Looking for a compatible wellness companion.",
      relationshipGoal: selectedGoal
    });
  };

  const handleCosmicSearch = async () => {
    if (!astroBirthDate && !astroName && !astroLuckyNumber) {
        alert("Please enter at least one criteria (Name, Birthdate, or Lucky Number)!");
        return;
    }
    await searchAstrologyPartners({
        nameContains: astroName,
        birthDate: astroBirthDate,
        luckyNumber: astroLuckyNumber
    });
  };

  const handleImportSocialData = () => {
      if (currentUser?.instaId || currentUser?.fbId) {
          setAstroName(currentUser.name);
          setAstroBirthDate('1995-06-15'); 
          setAstroLuckyNumber('7');
          alert("Profile details imported successfully!");
      } else {
          alert("No connected accounts found. Please connect integrations in settings.");
          navigate('/settings');
      }
  };

  const handleQuizSubmit = async () => {
      setIsQuizOpen(false);
      setQuizStep(1);

      const constructedPrompt = `
        I am looking for a ${quizGoal || 'companion'}.
        My ideal companion vibe is ${quizVibe}.
        I value ${quizGreenFlag} in a buddy.
        Additional details: ${quizDescription}
      `;

      setSearchQuery(constructedPrompt);
      setSelectedGoal(quizGoal || 'Any');

      await searchDatingPartners({
          description: constructedPrompt,
          relationshipGoal: quizGoal || 'Any'
      });
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleConnectWithReward = (userId: string) => {
    sendFriendRequest(userId);
    awardVirtualCurrency(1000);
    setCelebrationData({
        title: "Connection Request Sent!",
        message: "You've taken a wonderful step toward shared mindfulness."
    });
  };

  // --- Sub-Components ---

  const QuizModal = () => {
      if (!isQuizOpen) return null;
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-[#FAF7F2] border border-[#4C3322]/15 rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                  
                  <div className="p-6 bg-[#4C3322] text-[#FAF7F2] flex justify-between items-center">
                      <div>
                          <h2 className="font-serif text-2xl font-black">Companion Vibe Quiz</h2>
                          <p className="opacity-70 text-[10px] uppercase font-bold tracking-widest mt-1">Step {quizStep} of 3</p>
                      </div>
                      <button 
                        onClick={() => setIsQuizOpen(false)} 
                        className="text-[#FAF7F2]/60 hover:text-[#FAF7F2] rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                  </div>
                  
                  <div className="w-full bg-[#4C3322]/10 h-1.5">
                    <div className="bg-[#8BAB70] h-1.5 transition-all duration-500" style={{ width: `${(quizStep / 3) * 100}%` }}></div>
                  </div>
                  
                  <div className="p-8 overflow-y-auto flex-grow space-y-6">
                      {quizStep === 1 && (
                          <div className="space-y-6 animate-fade-in">
                              <h3 className="font-serif text-xl font-black text-[#4C3322]">What connection style aligns with you?</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {relationshipOptions.filter(r => r.value !== 'Any').map(opt => (
                                      <button 
                                        key={opt.value} 
                                        onClick={() => setQuizGoal(opt.value)} 
                                        className={`p-4 rounded-2xl border text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                          quizGoal === opt.value 
                                            ? 'border-[#8BAB70] bg-[#8BAB70]/10 text-[#8BAB70]' 
                                            : 'border-[#4C3322]/10 hover:border-[#8BAB70] bg-white'
                                        }`}
                                      >
                                        {opt.label}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      )}
                      {quizStep === 2 && (
                          <div className="space-y-6 animate-fade-in">
                              <h3 className="font-serif text-xl font-black text-[#4C3322]">Pick a Vibe & Core Value</h3>
                              <div>
                                  <label className="block text-[10px] font-bold text-[#4C3322]/50 uppercase tracking-widest mb-2">Ideal Vibe</label>
                                  <div className="flex flex-wrap gap-2">
                                      {vibeOptions.map(v => (
                                          <button 
                                            key={v} 
                                            onClick={() => setQuizVibe(v)} 
                                            className={`px-4 py-2 rounded-full text-xs border font-bold transition-all cursor-pointer ${
                                              quizVibe === v 
                                                ? 'bg-[#8BAB70]/15 border-[#8BAB70] text-[#8BAB70]' 
                                                : 'border-[#4C3322]/10 bg-white hover:bg-[#FAF7F2]'
                                            }`}
                                          >
                                            {v}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-[10px] font-bold text-[#4C3322]/50 uppercase tracking-widest mb-2">Key Value or Trait</label>
                                  <input 
                                    type="text" 
                                    value={quizGreenFlag} 
                                    onChange={(e) => setQuizGreenFlag(e.target.value)} 
                                    className="w-full p-4 border border-[#4C3322]/10 rounded-2xl bg-white focus:outline-none focus:border-[#8BAB70] text-sm text-[#4C3322]" 
                                    placeholder="e.g. Kindness, Active Listener, Calm energy" 
                                  />
                              </div>
                          </div>
                      )}
                      {quizStep === 3 && (
                          <div className="space-y-6 animate-fade-in">
                              <div className="text-center mb-4">
                                  <div className="w-14 h-14 bg-[#8BAB70]/10 rounded-full flex items-center justify-center mx-auto mb-3 text-[#8BAB70] text-xl">
                                    <i className="fas fa-magic"></i>
                                  </div>
                                  <h3 className="font-serif text-xl font-black text-[#4C3322]">Describe Your Sanctuary Companion</h3>
                              </div>
                              <textarea 
                                value={quizDescription} 
                                onChange={(e) => setQuizDescription(e.target.value)} 
                                rows={4} 
                                className="w-full p-4 border border-[#4C3322]/10 rounded-2xl bg-white focus:outline-none focus:border-[#8BAB70] text-sm text-[#4C3322] resize-none" 
                                placeholder="I want someone who values early morning yoga, hiking, or discussing philosophy over tea..."
                              />
                          </div>
                      )}
                  </div>

                  <div className="p-6 border-t border-[#4C3322]/5 bg-white flex justify-between">
                      {quizStep > 1 ? (
                        <button 
                          onClick={() => setQuizStep(s => s - 1)} 
                          className="px-6 py-3.5 border border-[#4C3322]/15 text-[#4C3322] font-bold rounded-2xl text-xs uppercase tracking-wider hover:bg-[#4C3322]/5 cursor-pointer"
                        >
                          Back
                        </button>
                      ) : <div />}
                      {quizStep < 3 ? (
                          <button 
                            onClick={() => setQuizStep(s => s + 1)} 
                            className="px-8 py-3.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Next
                          </button>
                      ) : (
                          <button 
                            onClick={handleQuizSubmit} 
                            className="px-8 py-3.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Find Companion
                          </button>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit flex flex-col items-center justify-center p-4">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />
        
        <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-8 md:p-12 shadow-sm text-center max-w-md w-full z-10 relative">
          <div className="w-16 h-16 bg-[#DE7A49]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#DE7A49] text-2xl">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-3xl font-serif font-black mb-4">Sanctuary Lock</h2>
          <p className="text-[#4C3322]/70 mb-8 font-light text-sm">
            Please register or sign in to seek wellness matches.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
          >
            Login / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden select-none selection:bg-[#8BAB70] selection:text-white">
      
      <QuizModal />

      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* Celebration Modal */}
      {celebrationData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] border-2 border-[#8BAB70]/30 rounded-[3rem] p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl animate-bounce-in">
            {/* Top highlight bar */}
            <div className="absolute top-0 left-0 w-full h-3 bg-[#8BAB70]"></div>
            
            <div className="relative z-10 pt-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-[#8BAB70] to-[#8BAB70]/70 rounded-full flex items-center justify-center mb-6 shadow-md">
                <i className="fas fa-leaf text-4xl text-[#FAF7F2]"></i>
              </div>
              <h2 className="font-serif text-2xl font-black text-[#4C3322] mb-2">{celebrationData.title}</h2>
              <p className="text-xs font-light text-[#4C3322]/80 mb-6">{celebrationData.message}</p>
              
              <div className="bg-white border border-[#4C3322]/10 rounded-2xl p-4 mb-6">
                <p className="text-[9px] font-bold text-[#8BAB70] uppercase tracking-wider mb-1">Sanctuary Bonus</p>
                <div className="flex items-center justify-center gap-2 text-[#4C3322] font-black text-xl">
                  <i className="fas fa-coins text-yellow-500"></i> <span>+1000 Coins</span>
                </div>
              </div>

              <button 
                onClick={() => setCelebrationData(null)} 
                className="w-full bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-bold py-4 rounded-2xl text-xs uppercase tracking-wider transition-colors shadow cursor-pointer"
              >
                Continue Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 mb-8 border-b border-[#4C3322]/5 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-all cursor-pointer bg-white/20"
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

      {/* Hero & Search Section */}
      <section className="relative pt-6 pb-12 max-w-5xl mx-auto w-full z-10 flex flex-col items-center">
          <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in-up">
              <div className="inline-flex bg-white/40 border border-[#4C3322]/10 backdrop-blur-md p-1.5 rounded-2xl shadow-sm mb-6">
                  <button 
                    onClick={() => setSearchMode('standard')} 
                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      searchMode === 'standard' 
                        ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm' 
                        : 'text-[#4C3322]/60 hover:text-[#4C3322]'
                    }`}
                  >
                    Vibe Match
                  </button>
                  <button 
                    onClick={() => setSearchMode('cosmic')} 
                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      searchMode === 'cosmic' 
                        ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm' 
                        : 'text-[#4C3322]/60 hover:text-[#4C3322]'
                    }`}
                  >
                    <i className="fas fa-moon text-[10px]"></i> Cosmic Alignment
                  </button>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl font-black text-[#4C3322] mb-4 tracking-tight leading-tight">
                Seek Your <span className="text-[#8BAB70]">Wellness Companion</span>
              </h1>
              <p className="text-sm text-[#4C3322]/70 font-light max-w-lg mx-auto">
                {searchMode === 'standard' 
                  ? "Connect with fellow guides who share your mindfulness routines, active paces, and spiritual vibes." 
                  : "Explore astronomical synchronicity matching your date and lucky intervals."}
              </p>
          </div>

          {/* Search Console */}
          <div className="w-full relative z-20 animate-fade-in-up">
              <div className={`bg-white border border-[#4C3322]/10 rounded-[2.5rem] shadow-sm p-4 transition-colors duration-500`}>
                  
                  {searchMode === 'standard' ? (
                      // STANDARD SEARCH BAR
                      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#4C3322]/10 gap-3 lg:gap-0">
                          {/* 1. Description Input */}
                          <div className="flex-grow relative group p-3 hover:bg-[#FAF7F2]/40 rounded-2xl transition-colors cursor-text">
                              <label className="block text-[9px] font-bold text-[#4C3322]/50 uppercase tracking-widest mb-1 group-focus-within:text-[#8BAB70]">Describe Companion Vibe</label>
                              <div className="flex items-center">
                                  <i className="fas fa-magic text-[#4C3322]/30 group-focus-within:text-[#8BAB70] mr-3 text-sm transition-colors"></i>
                                  <input 
                                    type="text" 
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)} 
                                    className="w-full bg-transparent border-none p-0 text-[#4C3322] font-bold text-sm placeholder-[#4C3322]/30 focus:ring-0 focus:outline-none" 
                                    placeholder="Kind, loves hiking, morning yoga..." 
                                  />
                              </div>
                          </div>

                          {/* 2. Goal Dropdown */}
                          <div className="lg:w-1/4 relative group p-3 hover:bg-[#FAF7F2]/40 rounded-2xl transition-colors cursor-pointer">
                              <label className="block text-[9px] font-bold text-[#4C3322]/50 uppercase tracking-widest mb-1 group-focus-within:text-[#8BAB70]">Companion Goal</label>
                              <div className="flex items-center">
                                  <i className="fas fa-bullseye text-[#4C3322]/30 group-focus-within:text-[#8BAB70] mr-3 text-sm transition-colors"></i>
                                  <select 
                                    value={selectedGoal} 
                                    onChange={(e) => setSelectedGoal(e.target.value as RelationshipGoal)} 
                                    className="w-full bg-transparent border-none p-0 text-[#4C3322] font-bold text-sm focus:ring-0 cursor-pointer appearance-none focus:outline-none"
                                  >
                                      {relationshipOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                              </div>
                          </div>

                          {/* 3. Vibe Dropdown */}
                          <div className="lg:w-1/5 relative group p-3 hover:bg-[#FAF7F2]/40 rounded-2xl transition-colors cursor-pointer">
                              <label className="block text-[9px] font-bold text-[#4C3322]/50 uppercase tracking-widest mb-1 group-focus-within:text-[#8BAB70]">Vibe</label>
                              <div className="flex items-center">
                                  <i className="fas fa-icons text-[#4C3322]/30 group-focus-within:text-[#8BAB70] mr-3 text-sm transition-colors"></i>
                                  <select 
                                    value={selectedVibe} 
                                    onChange={(e) => setSelectedVibe(e.target.value)} 
                                    className="w-full bg-transparent border-none p-0 text-[#4C3322] font-bold text-sm focus:ring-0 cursor-pointer appearance-none focus:outline-none"
                                  >
                                      <option value="">Any Vibe</option>
                                      {vibeOptions.map(v => <option key={v} value={v}>{v}</option>)}
                                  </select>
                              </div>
                          </div>

                          {/* Search Button */}
                          <div className="p-1 flex items-center justify-center lg:justify-end">
                              <button 
                                onClick={handleStandardSearch} 
                                disabled={loadingDating} 
                                className="w-full lg:w-14 h-14 rounded-2xl bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] transition-all flex items-center justify-center group disabled:opacity-75 cursor-pointer shadow-sm"
                              >
                                  {loadingDating ? <LoadingSpinner /> : <i className="fas fa-search transition-transform group-hover:scale-110"></i>}
                              </button>
                          </div>
                      </div>
                  ) : (
                      // COSMIC SEARCH BAR
                      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#4C3322]/10 gap-3 lg:gap-0 bg-[#FAF7F2]/40 rounded-[1.5rem] p-2">
                          <div className="flex-grow p-3 relative group">
                              <label className="block text-[9px] font-bold text-[#4C3322]/50 uppercase tracking-widest mb-1">Name filter</label>
                              <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    value={astroName} 
                                    onChange={(e) => setAstroName(e.target.value)} 
                                    className="w-full bg-transparent border-none p-0 text-[#4C3322] font-bold text-sm focus:ring-0 focus:outline-none" 
                                    placeholder="Friend name contains..." 
                                  />
                                  <button 
                                    onClick={handleImportSocialData} 
                                    className="text-[9px] bg-white border border-[#4C3322]/10 text-[#4C3322] px-3 py-1.5 rounded-xl hover:bg-[#4C3322]/5 font-bold uppercase tracking-wider" 
                                    title="Auto-fill from profile details"
                                  >
                                    Auto-fill
                                  </button>
                              </div>
                          </div>
                          <div className="lg:w-1/4 p-3 relative group">
                              <label className="block text-[9px] font-bold text-[#4C3322]/50 uppercase tracking-widest mb-1">Birth Date</label>
                              <input 
                                type="date" 
                                value={astroBirthDate} 
                                onChange={(e) => setAstroBirthDate(e.target.value)} 
                                className="w-full bg-transparent border-none p-0 text-[#4C3322] font-bold text-sm focus:ring-0 focus:outline-none" 
                              />
                          </div>
                          <div className="lg:w-1/5 p-3 relative group">
                              <label className="block text-[9px] font-bold text-[#4C3322]/50 uppercase tracking-widest mb-1">Lucky Number</label>
                              <input 
                                type="number" 
                                value={astroLuckyNumber} 
                                onChange={(e) => setAstroLuckyNumber(e.target.value)} 
                                className="w-full bg-transparent border-none p-0 text-[#4C3322] font-bold text-sm focus:ring-0 focus:outline-none" 
                                placeholder="7" 
                              />
                          </div>
                          <div className="p-1 flex items-center justify-center">
                              <button 
                                onClick={handleCosmicSearch} 
                                disabled={loadingDating} 
                                className="w-full lg:w-auto h-14 px-6 rounded-2xl bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-75 cursor-pointer shadow-sm"
                              >
                                  {loadingDating ? <LoadingSpinner /> : <><i className="fas fa-star text-[10px]"></i> Scan Cosmic Orbit</>}
                              </button>
                          </div>
                      </div>
                  )}
              </div>

              {/* Quick Tags / Quiz Trigger */}
              {searchMode === 'standard' && (
                  <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in">
                      {activityTags.map((tag, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => handleQuickSelect(tag)} 
                            className="px-4 py-2 rounded-full bg-white border border-[#4C3322]/10 text-xs font-bold uppercase tracking-wider text-[#4C3322]/70 hover:border-[#8BAB70] hover:text-[#8BAB70] transition-all shadow-sm cursor-pointer"
                          >
                            {tag.label}
                          </button>
                      ))}
                      <button 
                        onClick={() => setIsQuizOpen(true)} 
                        className="px-4 py-2 rounded-full bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-xs font-bold uppercase tracking-wider text-[#8BAB70] hover:bg-[#8BAB70] hover:text-[#FAF7F2] transition-all shadow-sm flex items-center gap-2 cursor-pointer animate-pulse"
                      >
                        <i className="fas fa-magic"></i> Companion Vibe Quiz
                      </button>
                  </div>
              )}
          </div>
      </section>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto w-full px-4 flex-grow">
        {errorDating && (
            <div className="bg-[#DE7A49]/10 border border-[#DE7A49]/20 text-[#DE7A49] px-6 py-4.5 rounded-2xl mb-8 flex items-center shadow-sm animate-fade-in text-xs font-bold uppercase tracking-wide gap-2">
              <i className="fas fa-exclamation-circle text-sm"></i>
              <span>Companion Search Scan Error: {errorDating}</span>
            </div>
        )}

        {datingMatches && datingMatches.length > 0 ? (
            <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-8">
                   <h2 className="font-serif text-2xl font-black text-[#4C3322]">Top Matches</h2>
                   <span className="bg-[#8BAB70]/15 border border-[#8BAB70]/20 text-[#8BAB70] px-3.5 py-1 rounded-full text-xs font-bold">{datingMatches.length} Found</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {datingMatches.map(match => (
                      <DatingMatchCard 
                         key={match.id}
                         match={match}
                         allUsers={allUsers}
                         currentUser={currentUser}
                         onViewProfile={handleViewProfile}
                         onSendRequest={handleConnectWithReward}
                      />
                   ))}
                </div>
            </div>
        ) : (
             !loadingDating && (
                 <div className="text-center py-20 bg-white border border-[#4C3322]/10 rounded-[2.5rem] shadow-sm animate-fade-in flex flex-col justify-center items-center">
                    <div className="bg-[#FAF7F2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[#4C3322]/40 text-xl border border-[#4C3322]/5">
                       <i className={`far ${searchMode === 'cosmic' ? 'fa-star' : 'fa-handshake'}`}></i>
                    </div>
                    <p className="text-[#4C3322] font-serif text-lg font-black mb-1">Seek Conscious Connections</p>
                    <p className="text-xs text-[#4C3322]/50 font-light">Describe companion details or take the vibe quiz to search for matches.</p>
                 </div>
             )
        )}
      </div>
    </div>
  );
};
