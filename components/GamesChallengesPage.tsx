import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { ChallengeCard } from './ChallengeCard';
import { Challenge, ShareContentResult } from '../types';
import { ShareModal } from './ShareModal';
import { generateShareContent } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

// --- Mini-Game Data & Types ---

type GameType = 'empathy' | 'compass' | null;

interface EmpathyScenario {
  id: number;
  text: string;
  context: string;
  options: { text: string; isCorrect: boolean; feedback: string }[];
}

const empathyScenarios: EmpathyScenario[] = [
  {
    id: 1,
    context: "Your companion comes home, slams the door, and goes straight to the bedroom without saying hello.",
    text: "What is the most empathetic interpretation of this behavior?",
    options: [
      { text: "They are angry at me and being passive-aggressive.", isCorrect: false, feedback: "This assumes malice. Try to consider external factors." },
      { text: "They are overwhelmed or had a bad day and need a moment to decompress.", isCorrect: true, feedback: "Correct! Recognizing potential overwhelm shows deep empathy." },
      { text: "They don't respect me anymore.", isCorrect: false, feedback: "This is a defensive reaction. Try to stay grounded." }
    ]
  },
  {
    id: 2,
    context: "A close friend cancels plans with you for the third time this month.",
    text: "How do you respond with a secure and mindful connection behavior?",
    options: [
      { text: "Ignore them for a week so they know how it feels.", isCorrect: false, feedback: "This is a reactive behavior. Open communication is healthier." },
      { text: "Send a text: 'Is everything okay? I miss you, but I understand if you're busy. Let me know when you can talk.'", isCorrect: true, feedback: "Correct! This expresses needs without blame and offers support." },
      { text: "Assume they hate you and block them.", isCorrect: false, feedback: "This is a defensive reaction. Try to communicate openly." }
    ]
  },
  {
    id: 3,
    context: "Your companion is excited about a hobby you find boring.",
    text: "How do you show support in this moment?",
    options: [
      { text: "Tell them it's not worth the time.", isCorrect: false, feedback: "Dismissiveness hurts connection." },
      { text: "Nod silently while checking your phone.", isCorrect: false, feedback: "Passive listening doesn't build connection." },
      { text: "Ask questions and listen to their excitement, even if the topic isn't for you.", isCorrect: true, feedback: "Correct! You are validating their joy, which is a powerful act of connection." }
    ]
  }
];

interface CompassQuestion {
  id: number;
  question: string;
  choices: { text: string; score: number; outcome: string }[];
}

const compassQuestions: CompassQuestion[] = [
  {
    id: 1,
    question: "You feel neglected because your companion has been working late every night.",
    choices: [
      { text: "Accuse them of caring about work more than you.", score: 0, outcome: "Conflict Escalated. Accusations usually trigger defensiveness." },
      { text: "Say nothing and withdraw connection.", score: 0, outcome: "Distance Created. The 'Silent Treatment' damages mutual trust." },
      { text: "Say: 'I feel lonely when we don't catch up. Can we schedule a virtual tea session?'", score: 10, outcome: "Connection Built. You expressed a vulnerable feeling and a concrete need." }
    ]
  },
  {
    id: 2,
    question: "Your friend gives you a gift you don't really like.",
    choices: [
      { text: "Pretend to love it enthusiastically.", score: 5, outcome: "Polite, but slightly inauthentic. It keeps peace but hides your true self." },
      { text: "Say: 'Thank you for thinking of me. I really appreciate the gesture.'", score: 10, outcome: "Graceful & Honest. You acknowledged the kindness behind the gift." },
      { text: "Tell them it's not your style and ask for the receipt.", score: 2, outcome: "Brutal Honesty. While honest, it may hurt feelings unnecessarily." }
    ]
  }
];

export const GamesChallengesPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'games' | 'challenges'>('games');
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareContent, setShareContent] = useState<ShareContentResult | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareItemTitle, setShareItemTitle] = useState('');

  // Celebration State
  const [celebrationData, setCelebrationData] = useState<{ name: string; reward: string } | null>(null);

  // Empathy Game State
  const [currentEmpathyIndex, setCurrentEmpathyIndex] = useState(0);
  const [empathyFeedback, setEmpathyFeedback] = useState<string | null>(null);
  const [empathyScore, setEmpathyScore] = useState(0);

  // Compass Game State
  const [currentCompassIndex, setCurrentCompassIndex] = useState(0);
  const [compassOutcome, setCompassOutcome] = useState<string | null>(null);
  const [compassTotalScore, setCompassTotalScore] = useState(0);

  if (!context) return null;
  const { allChallenges, handleJoin, currentUser, awardVirtualCurrency } = context;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Derive selected challenge from ID
  const selectedChallenge = allChallenges.find(c => c.id === selectedChallengeId);

  // Helper to get progress based on goal name matching challenge name
  const getChallengeProgress = (challenge: Challenge) => {
    if (!currentUser) return 0;
    const goal = currentUser.goals.find(g => g.name === challenge.name);
    return goal ? goal.progress : 0;
  };

  const handleShareChallenge = async (challenge: Challenge) => {
    setShareItemTitle(`Share "${challenge.name}"`);
    setIsShareModalOpen(true);
    setShareLoading(true);
    setShareError(null);
    setShareContent(null);
    try {
      const content = await generateShareContent('challenge', challenge);
      setShareContent(content);
    } catch (err) {
      setShareError("Failed to generate share content. Please try again.");
    } finally {
      setShareLoading(false);
    }
  };

  const handleJoinWithCelebration = (challenge: Challenge) => {
    handleJoin('challenge', challenge.id);
    awardVirtualCurrency(1000);
    setSelectedChallengeId(null); // Close details modal if open
    setCelebrationData({ name: challenge.name, reward: challenge.reward });
  };

  // --- Game Logic ---
  const handleEmpathyChoice = (isCorrect: boolean, feedback: string) => {
    setEmpathyFeedback(feedback);
    if (isCorrect) setEmpathyScore(prev => prev + 1);
  };

  const nextEmpathyScenario = () => {
    setEmpathyFeedback(null);
    if (currentEmpathyIndex < empathyScenarios.length - 1) {
      setCurrentEmpathyIndex(prev => prev + 1);
    } else {
      triggerToast(`Game Over! You scored ${empathyScore} out of ${empathyScenarios.length}`);
      setCurrentEmpathyIndex(0);
      setEmpathyScore(0);
      setActiveGame(null);
    }
  };

  const handleCompassChoice = (score: number, outcome: string) => {
    setCompassOutcome(outcome);
    setCompassTotalScore(prev => prev + score);
  };

  const nextCompassQuestion = () => {
    setCompassOutcome(null);
    if (currentCompassIndex < compassQuestions.length - 1) {
      setCurrentCompassIndex(prev => prev + 1);
    } else {
      triggerToast(`Journey Complete! Your Mindful Connection Score: ${compassTotalScore + 10} points.`);
      setCurrentCompassIndex(0);
      setCompassTotalScore(0);
      setActiveGame(null);
    }
  };

  const resetGames = () => {
    setActiveGame(null);
    setCurrentEmpathyIndex(0);
    setEmpathyFeedback(null);
    setEmpathyScore(0);
    setCurrentCompassIndex(0);
    setCompassOutcome(null);
    setCompassTotalScore(0);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden select-none selection:bg-[#8BAB70] selection:text-white">
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        loading={shareLoading}
        content={shareContent}
        error={shareError}
        title={shareItemTitle}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#4C3322] text-[#FAF7F2] px-6 py-3.5 rounded-2xl shadow-xl z-50 text-xs font-bold uppercase tracking-wider border border-[#FAF7F2]/10 flex items-center gap-2">
          <i className="fas fa-info-circle text-[#8BAB70]"></i>
          {toastMsg}
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
        {currentUser && (
          <div className="flex items-center gap-3 bg-white/50 border border-[#4C3322]/10 rounded-full px-4 py-1.5 shadow-sm">
            <img 
              src={currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"} 
              className="w-7 h-7 rounded-full border border-[#4C3322]/10 object-cover shadow-sm"
              alt="Avatar"
            />
            <span className="text-xs font-semibold hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl w-full mx-auto flex-grow z-10 flex flex-col">
        
        {/* Title Block */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#4C3322]/5 pb-6">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-[#4C3322] leading-tight">
              Mind & Heart Space
            </h2>
            <p className="text-[#4C3322]/70 text-sm font-light mt-2 max-w-xl">
              Sharpen your emotional intelligence, run empathetic scenario checks, or participate in active challenges.
            </p>
          </div>
        </div>

        {/* Header Tabs */}
        <div className="flex mb-8 bg-white/40 border border-[#4C3322]/10 backdrop-blur-md p-1.5 rounded-2xl shadow-sm self-start">
          <button
            onClick={() => { setActiveTab('games'); resetGames(); }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'games'
                ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm'
                : 'text-[#4C3322]/60 hover:text-[#4C3322]'
            }`}
          >
            Mind & Heart Games
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'challenges'
                ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm'
                : 'text-[#4C3322]/60 hover:text-[#4C3322]'
            }`}
          >
            Active Challenges
          </button>
        </div>

        {/* --- CONTENT: GAMES TAB --- */}
        {activeTab === 'games' && (
          <div className="animate-fade-in flex-grow flex flex-col">
            {!activeGame ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Empathy Echo Game Card */}
                <div 
                  className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-8 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col items-center text-center group relative overflow-hidden h-full"
                  onClick={() => setActiveGame('empathy')}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#8BAB70]"></div>
                  <div className="bg-[#8BAB70]/10 border border-[#8BAB70]/20 p-5 rounded-full mb-6 group-hover:scale-105 transition-transform duration-500 text-[#8BAB70]">
                    <i className="fas fa-heart text-4xl"></i>
                  </div>
                  <h3 className="font-serif text-2xl font-black mb-3">Empathy Echo</h3>
                  <p className="text-[#4C3322]/70 text-sm font-light mb-8 max-w-sm">
                    Test your emotional intelligence. Can you decode the hidden feelings and support needs behind daily interactions?
                  </p>
                  <button className="mt-auto bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow transition-colors">
                    Play Now
                  </button>
                </div>

                {/* Connection Compass Game Card */}
                <div 
                  className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-8 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col items-center text-center group relative overflow-hidden h-full"
                  onClick={() => setActiveGame('compass')}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#DE7A49]"></div>
                  <div className="bg-[#DE7A49]/10 border border-[#DE7A49]/20 p-5 rounded-full mb-6 group-hover:scale-105 transition-transform duration-500 text-[#DE7A49]">
                    <i className="fas fa-compass text-4xl"></i>
                  </div>
                  <h3 className="font-serif text-2xl font-black mb-3">Connection Compass</h3>
                  <p className="text-[#4C3322]/70 text-sm font-light mb-8 max-w-sm">
                    Navigate tricky social and companionship scenarios. Your conscious choices determine the health of your connections.
                  </p>
                  <button className="mt-auto bg-[#4C3322] hover:bg-[#DE7A49] text-[#FAF7F2] px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow transition-colors">
                    Play Now
                  </button>
                </div>

              </div>
            ) : (
              <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col">
                <button 
                  onClick={resetGames} 
                  className="mb-6 text-[#4C3322]/70 hover:text-[#4C3322] flex items-center font-bold text-xs uppercase tracking-wider gap-2 select-none"
                >
                  <i className="fas fa-arrow-left text-[10px]"></i> Back to Games
                </button>

                {/* EMPATHY ECHO PLAY AREA */}
                {activeGame === 'empathy' && (
                  <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm relative overflow-hidden animate-fade-in flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#8BAB70]"></div>
                    
                    <div className="flex justify-between items-center mb-6 border-b border-[#4C3322]/5 pb-4">
                       <span className="bg-[#8BAB70]/15 text-[#8BAB70] border border-[#8BAB70]/20 px-3.5 py-1 rounded-full text-xs font-bold">
                         Level {currentEmpathyIndex + 1} of {empathyScenarios.length}
                       </span>
                       <span className="text-[#4C3322]/70 text-xs font-bold uppercase tracking-wider">
                         Score: {empathyScore}
                       </span>
                    </div>
                    
                    <h3 className="text-[10px] font-bold text-[#4C3322]/40 uppercase tracking-widest mb-2">The Scenario</h3>
                    <p className="font-serif text-xl md:text-2xl font-black text-[#4C3322] mb-6 leading-snug">
                      "{empathyScenarios[currentEmpathyIndex].context}"
                    </p>
                    
                    <p className="text-sm font-bold text-[#8BAB70] uppercase tracking-wider mb-6">
                      {empathyScenarios[currentEmpathyIndex].text}
                    </p>

                    <div className="space-y-3">
                      {empathyScenarios[currentEmpathyIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => !empathyFeedback && handleEmpathyChoice(option.isCorrect, option.feedback)}
                          disabled={!!empathyFeedback}
                          className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 text-sm font-light leading-relaxed cursor-pointer ${
                            empathyFeedback 
                              ? option.isCorrect 
                                  ? 'bg-[#8BAB70]/15 border-[#8BAB70]/30 text-[#8BAB70] font-medium'
                                  : 'bg-transparent border-[#4C3322]/5 text-[#4C3322]/30' 
                              : 'border-[#4C3322]/10 hover:border-[#8BAB70] hover:bg-[#8BAB70]/5 text-[#4C3322]'
                          }`}
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>

                    {empathyFeedback && (
                      <div className="mt-8 animate-fade-in border-t border-[#4C3322]/5 pt-6">
                        <div className={`p-5 rounded-2xl mb-6 border ${
                          empathyFeedback.includes('Correct') 
                            ? 'bg-[#8BAB70]/10 border-[#8BAB70]/20 text-[#8BAB70]' 
                            : 'bg-[#DE7A49]/10 border-[#DE7A49]/20 text-[#DE7A49]'
                        }`}>
                          <p className="font-serif text-lg font-black mb-1">
                            {empathyFeedback.includes('Correct') ? 'Empathetic Reflection' : 'Mindful Growth Point'}
                          </p>
                          <p className="text-xs font-light">{empathyFeedback}</p>
                        </div>
                        
                        <button 
                          onClick={nextEmpathyScenario}
                          className="w-full bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors shadow"
                        >
                          Next Scenario
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* CONNECTION COMPASS PLAY AREA */}
                {activeGame === 'compass' && (
                  <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm relative overflow-hidden animate-fade-in flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#DE7A49]"></div>
                    
                    <div className="flex justify-between items-center mb-6 border-b border-[#4C3322]/5 pb-4">
                       <span className="bg-[#DE7A49]/15 text-[#DE7A49] border border-[#DE7A49]/20 px-3.5 py-1 rounded-full text-xs font-bold">
                         Compass Check {currentCompassIndex + 1} of {compassQuestions.length}
                       </span>
                    </div>

                    <h3 className="text-[10px] font-bold text-[#4C3322]/40 uppercase tracking-widest mb-2">The Social Choice</h3>
                    <h3 className="font-serif text-xl md:text-2xl font-black text-[#4C3322] mb-8 leading-snug">
                      {compassQuestions[currentCompassIndex].question}
                    </h3>

                    <div className="space-y-3">
                      {compassQuestions[currentCompassIndex].choices.map((choice, idx) => (
                        <button
                          key={idx}
                          onClick={() => !compassOutcome && handleCompassChoice(choice.score, choice.outcome)}
                          disabled={!!compassOutcome}
                          className="w-full text-left p-4.5 rounded-2xl bg-[#FAF7F2]/40 hover:bg-[#FAF7F2]/80 border border-[#4C3322]/10 hover:border-[#DE7A49] transition-all duration-300 text-sm font-light text-[#4C3322] leading-relaxed cursor-pointer"
                        >
                          {choice.text}
                        </button>
                      ))}
                    </div>

                    {compassOutcome && (
                      <div className="mt-8 animate-fade-in border-t border-[#4C3322]/5 pt-6">
                        <div className="bg-[#FAF7F2] p-5 rounded-2xl mb-6 border border-[#4C3322]/10">
                          <h4 className="font-serif text-lg font-black text-[#DE7A49] mb-1">Outcome Connection:</h4>
                          <p className="text-xs font-light text-[#4C3322]/80 leading-relaxed">{compassOutcome}</p>
                        </div>
                        
                        <button 
                          onClick={nextCompassQuestion}
                          className="w-full bg-[#4C3322] hover:bg-[#DE7A49] text-[#FAF7F2] py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors shadow"
                        >
                          Continue Journey
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- CONTENT: CHALLENGES TAB --- */}
        {activeTab === 'challenges' && (
          <div className="animate-fade-in-up flex-grow">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-black text-[#4C3322] mb-3">Community Challenges</h2>
              <p className="text-sm text-[#4C3322]/70 max-w-xl mx-auto font-light leading-relaxed">
                Commit to shared daily practices. Complete mindfulness goals to unlock print credits, virtual coins, and premium guides.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allChallenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onJoin={() => handleJoinWithCelebration(challenge)}
                  isJoined={currentUser ? challenge.participants.includes(currentUser.id) : false}
                  onClick={() => setSelectedChallengeId(challenge.id)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Celebration Modal (Immediate Reward) */}
      {celebrationData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] border-2 border-[#8BAB70]/30 rounded-[3rem] p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl animate-bounce-in">
            {/* Top highlight bar */}
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#8BAB70] to-[#DE7A49]"></div>

            <div className="relative z-10 pt-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-[#8BAB70] to-[#8BAB70]/70 rounded-full flex items-center justify-center mb-6 shadow-md">
                <i className="fas fa-trophy text-4xl text-[#FAF7F2]"></i>
              </div>
              
              <h2 className="font-serif text-2xl font-black text-[#4C3322] mb-2">Challenge Accepted!</h2>
              <p className="text-xs font-light text-[#4C3322]/80 mb-6">
                You've committed to <span className="font-bold text-[#8BAB70]">{celebrationData.name}</span>
              </p>

              <div className="bg-white border border-[#4C3322]/10 rounded-2xl p-4 mb-4">
                <p className="text-[9px] font-bold text-[#8BAB70] uppercase tracking-wider mb-1">Immediate Benefit</p>
                <div className="flex items-center justify-center gap-2 text-[#4C3322] font-black text-xl">
                  <i className="fas fa-coins text-yellow-500"></i> <span>+1000 Coins</span>
                </div>
                <p className="text-[9px] text-[#4C3322]/40 mt-1 uppercase tracking-wide">Added to your virtual balance</p>
              </div>

              <div className="bg-[#FAF7F2] border border-[#4C3322]/10 rounded-2xl p-4 mb-6">
                <p className="text-[9px] font-bold text-[#4C3322]/40 uppercase tracking-wider mb-1">Final Reward</p>
                <p className="text-sm font-bold text-[#DE7A49] uppercase tracking-wide">{celebrationData.reward}</p>
              </div>

              <button 
                onClick={() => setCelebrationData(null)}
                className="w-full bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-bold py-4.5 rounded-2xl text-xs uppercase tracking-wider transition-colors shadow cursor-pointer"
              >
                Let's Begin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Details Modal */}
      {selectedChallenge && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" 
          onClick={() => setSelectedChallengeId(null)}
        >
          <div 
            className="bg-[#FAF7F2] rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden transform transition-all border border-[#4C3322]/15"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-64">
              <img src={selectedChallenge.image} alt={selectedChallenge.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4C3322] via-[#4C3322]/30 to-transparent"></div>
              <button 
                onClick={() => setSelectedChallengeId(null)}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-serif text-3xl font-black text-white shadow-sm leading-tight mb-1">{selectedChallenge.name}</h3>
                <p className="text-white/80 text-xs uppercase tracking-widest font-bold">Community Movement</p>
              </div>
            </div>
            
            <div className="p-8">
              <p className="text-[#4C3322]/70 mb-8 text-sm font-light leading-relaxed">{selectedChallenge.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-white border border-[#4C3322]/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-9 h-9 rounded-full bg-[#DE7A49]/10 flex items-center justify-center mb-2 text-[#DE7A49]">
                      <i className="fas fa-trophy text-base"></i>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-[#4C3322]/50 tracking-wider mb-1">Reward</span>
                    <span className="font-bold text-xs uppercase tracking-wide text-[#4C3322]">{selectedChallenge.reward}</span>
                 </div>
                 <div className="bg-white border border-[#4C3322]/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-9 h-9 rounded-full bg-[#8BAB70]/10 flex items-center justify-center mb-2 text-[#8BAB70]">
                      <i className="fas fa-users text-base"></i>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-[#4C3322]/50 tracking-wider mb-1">Participants</span>
                    <span className="font-bold text-xs uppercase tracking-wide text-[#4C3322]">{selectedChallenge.participants.length} Active</span>
                 </div>
              </div>

              {currentUser && selectedChallenge.participants.includes(currentUser.id) && (
                <div className="mb-8 bg-white border border-[#4C3322]/10 p-6 rounded-[2rem]">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#4C3322]/50">Your Challenge Progress</span>
                    <span className="text-xl font-black text-[#8BAB70]">{getChallengeProgress(selectedChallenge)}%</span>
                  </div>
                  <div className="w-full bg-[#FAF7F2] rounded-full h-3 overflow-hidden border border-[#4C3322]/5">
                    <div 
                      className="bg-gradient-to-r from-[#8BAB70] to-[#8BAB70]/50 h-3 rounded-full transition-all duration-1000 ease-out relative" 
                      style={{ width: `${getChallengeProgress(selectedChallenge)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-[#4C3322]/50 mt-3 font-medium uppercase tracking-wider">
                    {getChallengeProgress(selectedChallenge) === 100 ? "🎉 Practice Completed! Final Reward Unlocked." : "Continue practicing to earn print reward."}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {!selectedChallenge.participants.includes(currentUser?.id || '') ? (
                  <button 
                    onClick={() => handleJoinWithCelebration(selectedChallenge)}
                    className="flex-1 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-bold py-4 px-6 rounded-2xl transition-colors shadow text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Accept Challenge
                  </button>
                ) : (
                  <button disabled className="flex-1 bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70] font-bold py-4 px-6 rounded-2xl cursor-default text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                    <i className="fas fa-check"></i> Challenge Active
                  </button>
                )}
                
                <button 
                  onClick={() => handleShareChallenge(selectedChallenge)}
                  className="px-6 py-4 border border-[#4C3322]/15 text-[#4C3322] font-bold rounded-2xl hover:bg-[#4C3322]/5 transition-colors cursor-pointer"
                  title="Share"
                >
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
