import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { VirtualPartner } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

export const VirtualPartnerCreationPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('AppContext must be used within an AppContext.Provider');
  }

  const {
    currentUser,
    virtualPartner,
    createVirtualPartner,
    updateVirtualPartner,
    resetVirtualPartner,
    loadingVirtualPartner,
    errorVirtualPartner,
    isDarkMode, 
  } = context;

  // Creation State
  const [nameInput, setNameInput] = useState('');
  const [visualStyleInput, setVisualStyleInput] = useState('');
  const [vibeInput, setVibeInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [commStyleInput, setCommStyleInput] = useState(''); 

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [editedInterests, setEditedInterests] = useState('');
  const [editedPersonalityTraits, setEditedPersonalityTraits] = useState('');
  const [editedScenario, setEditedScenario] = useState('');
  const [editedGoals, setEditedGoals] = useState('');

  // Redirect if no user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Initialize edit fields when virtualPartner is loaded or changes
  useEffect(() => {
    if (virtualPartner) {
      setEditedName(virtualPartner.name);
      setEditedBio(virtualPartner.bio);
      setEditedInterests(virtualPartner.interests.join(', '));
      setEditedPersonalityTraits(virtualPartner.personalityTraits.join(', '));
      setEditedScenario(virtualPartner.currentScenario || '');
      setEditedGoals(virtualPartner.relationshipGoals.map(g => `${g.name}${g.complete ? ' (complete)' : ''}`).join('; '));
    }
  }, [virtualPartner]);

  const handleGeneratePartner = async () => {
    let finalPrompt = descriptionInput;
    
    if (nameInput || visualStyleInput || vibeInput || commStyleInput) {
        finalPrompt = `Name: ${nameInput || 'Any'}. Visual Style: ${visualStyleInput || 'Any'}. Vibe/Relationship: ${vibeInput || 'Any'}. Communication Style: ${commStyleInput || 'Any'}. Additional Details: ${descriptionInput}`;
    }

    if (finalPrompt.trim()) {
      await createVirtualPartner(finalPrompt);
      setIsEditing(false); 
    }
  };

  const handleSaveEdits = () => {
    if (virtualPartner) {
      const updatedPartner: VirtualPartner = {
        ...virtualPartner,
        name: editedName.trim(),
        bio: editedBio.trim(),
        interests: editedInterests.split(',').map(s => s.trim()).filter(Boolean),
        personalityTraits: editedPersonalityTraits.split(',').map(s => s.trim()).filter(Boolean),
        currentScenario: editedScenario.trim() || null,
        relationshipGoals: editedGoals.split(';').map(s => s.trim()).filter(Boolean).map(goalStr => {
          const isComplete = goalStr.toLowerCase().includes('(complete)');
          const name = goalStr.replace(/\s*\(complete\)\s*/i, '');
          return { name, complete: isComplete };
        }),
      };
      updateVirtualPartner(updatedPartner);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (virtualPartner) {
      setEditedName(virtualPartner.name);
      setEditedBio(virtualPartner.bio);
      setEditedInterests(virtualPartner.interests.join(', '));
      setEditedPersonalityTraits(virtualPartner.personalityTraits.join(', '));
      setEditedScenario(virtualPartner.currentScenario || '');
      setEditedGoals(virtualPartner.relationshipGoals.map(g => `${g.name}${g.complete ? ' (complete)' : ''}`).join('; '));
    }
    setIsEditing(false);
  };

  const getProgressBarColor = (value: number) => {
    if (value > 75) return 'bg-[#8BAB70]';
    if (value > 45) return 'bg-[#DE7A49]';
    return 'bg-[#DE7A49]/70';
  };

  if (!currentUser) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden select-none selection:bg-[#8BAB70] selection:text-white">
      
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
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

      {/* CORE WORKSPACE */}
      <div className="max-w-4xl w-full mx-auto space-y-8 flex-1 z-10">

        {errorVirtualPartner && (
          <div className="bg-[#DE7A49]/10 border border-[#DE7A49]/30 text-[#DE7A49] px-6 py-4 rounded-[1.8rem] text-sm font-semibold flex items-center gap-3 shadow-sm" role="alert">
            <i className="fas fa-exclamation-circle"></i>
            <span>{errorVirtualPartner}</span>
          </div>
        )}

        {loadingVirtualPartner ? (
          <div className="flex flex-col items-center justify-center h-96 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-8 shadow-sm">
            <LoadingSpinner />
            <p className="mt-6 text-[#8BAB70] font-black text-sm uppercase tracking-widest animate-pulse">Designing your ideal companion...</p>
          </div>
        ) : !virtualPartner ? (
          
          /* CREATE COMPANION FORM */
          <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-8">
            <div className="space-y-2 text-center border-b border-[#4C3322]/5 pb-6">
              <span className="text-[10px] tracking-[0.25em] font-bold text-[#8BAB70] uppercase">Sanctuary Guide Setup</span>
              <h2 className="font-serif text-3xl font-black text-[#4C3322]">Form Your Guide Persona.</h2>
              <p className="text-sm font-light text-[#4C3322]/70 max-w-lg mx-auto">
                Design a virtual companion to discuss stress relief, breathing goals, or read wellness chapters together.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Companion Name</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-full px-5 py-3.5 focus:outline-none focus:border-[#8BAB70] focus:bg-white text-sm text-[#4C3322] placeholder-[#4C3322]/40 transition-all shadow-inner"
                    placeholder="e.g. Soha"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Visual Persona / Vibe</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-full px-5 py-3.5 focus:outline-none focus:border-[#8BAB70] focus:bg-white text-sm text-[#4C3322] placeholder-[#4C3322]/40 transition-all shadow-inner"
                    placeholder="e.g. Artistic, Athletic, Reader"
                    value={visualStyleInput}
                    onChange={(e) => setVisualStyleInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Relationship Role</label>
                  <select
                    className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-full px-5 py-3.5 focus:outline-none focus:border-[#8BAB70] focus:bg-white text-sm text-[#4C3322] transition-all cursor-pointer shadow-inner appearance-none"
                    value={vibeInput}
                    onChange={(e) => setVibeInput(e.target.value)}
                  >
                    <option value="">Select Vibe Role...</option>
                    <option value="Romantic & Affectionate">Romantic & Affectionate</option>
                    <option value="Supportive Best Friend">Supportive Best Friend</option>
                    <option value="Strict Coach">Strict Coach</option>
                    <option value="Wise Mentor">Wise Mentor</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Communication style</label>
                  <select
                    className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-full px-5 py-3.5 focus:outline-none focus:border-[#8BAB70] focus:bg-white text-sm text-[#4C3322] transition-all cursor-pointer shadow-inner appearance-none"
                    value={commStyleInput}
                    onChange={(e) => setCommStyleInput(e.target.value)}
                  >
                    <option value="">Select Communication Style...</option>
                    <option value="Bold & Direct">Bold & Direct</option>
                    <option value="Gentle & Empathetic">Gentle & Empathetic</option>
                    <option value="Playful & Witty">Playful & Witty</option>
                    <option value="Intellectual & Deep">Intellectual & Deep</option>
                    <option value="Open-Minded & Adventurous">Open-Minded & Adventurous</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Detailed Description (Optional)</label>
                <textarea
                  className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-3xl p-5 focus:outline-none focus:border-[#8BAB70] focus:bg-white text-sm text-[#4C3322] placeholder-[#4C3322]/40 resize-none shadow-inner font-light h-28"
                  placeholder="Specify particular personality elements or backstory notes... e.g. Loves reading wellness books and walks in the park..."
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handleGeneratePartner}
                className="w-full py-4 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-full font-black text-sm tracking-widest uppercase shadow transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                disabled={!nameInput && !descriptionInput}
              >
                Bring Partner to Life
              </button>
            </div>
          </div>
        ) : (
          
          /* COMPANION PASSPORT DISPLAY */
          <div className="flex flex-col items-center bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-10 shadow-sm animate-fade-in space-y-8">
            
            {/* Avatar frame */}
            <div className="relative">
              {/* Outer visualizer ring */}
              <div className="absolute inset-[-8px] rounded-full border-2 border-[#8BAB70]/30 animate-pulse pointer-events-none" />
              <img
                src={virtualPartner.avatar}
                alt={virtualPartner.name}
                className="w-40 h-40 rounded-full border-4 border-[#FAF7F2] object-cover shadow-lg relative z-10"
              />
              <span className="absolute bottom-2 right-2 bg-[#8BAB70] text-[#FAF7F2] px-3 py-1 rounded-full text-[9px] font-bold uppercase shadow z-20">
                {virtualPartner.visualStyle || 'Partner'}
              </span>
            </div>

            {/* Name Details */}
            <div className="text-center space-y-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-3xl font-serif font-black text-[#4C3322] text-center bg-[#FAF7F2]/60 border border-[#4C3322]/15 rounded-full px-5 py-2.5 focus:outline-none focus:border-[#8BAB70]"
                />
              ) : (
                <h3 className="text-3xl font-serif font-black text-[#4C3322]">{virtualPartner.name}</h3>
              )}
              
              <div className="flex flex-wrap justify-center gap-1.5 pt-1.5 select-none">
                {virtualPartner.relationshipType && (
                  <span className="px-3 py-1 rounded-full border border-[#8BAB70]/20 bg-[#8BAB70]/10 text-[#8BAB70] text-[9px] font-bold uppercase">
                    {virtualPartner.relationshipType}
                  </span>
                )}
                {virtualPartner.communicationStyle && (
                  <span className="px-3 py-1 rounded-full border border-[#DE7A49]/20 bg-[#DE7A49]/10 text-[#DE7A49] text-[9px] font-bold uppercase">
                    {virtualPartner.communicationStyle}
                  </span>
                )}
              </div>
            </div>

            {/* Content Sheets */}
            <div className="w-full max-w-2xl space-y-6 text-center">
              
              {/* Biography block */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#4C3322]/40 tracking-wider uppercase block">Biography</label>
                {isEditing ? (
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    rows={4}
                    className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/15 rounded-3xl p-4 focus:outline-none focus:border-[#8BAB70] text-sm text-[#4C3322] font-light resize-none h-24"
                  />
                ) : (
                  <p className="text-sm text-[#4C3322]/80 leading-relaxed font-light italic bg-[#FAF7F2]/30 p-4 rounded-3xl border border-[#4C3322]/5">
                    "{virtualPartner.bio}"
                  </p>
                )}
              </div>

              {/* Interests tag badges */}
              <div className="border-t border-[#4C3322]/5 pt-6 space-y-3">
                <h4 className="text-[10px] font-bold text-[#4C3322]/40 tracking-wider uppercase">Interests Catalog</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedInterests}
                    onChange={(e) => setEditedInterests(e.target.value)}
                    className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/15 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#8BAB70]"
                    placeholder="Comma-separated interests..."
                  />
                ) : (
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {virtualPartner.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-white border border-[#4C3322]/10 text-[#4C3322] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Personality traits tag badges */}
              <div className="border-t border-[#4C3322]/5 pt-6 space-y-3">
                <h4 className="text-[10px] font-bold text-[#4C3322]/40 tracking-wider uppercase">Personality Attributes</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPersonalityTraits}
                    onChange={(e) => setEditedPersonalityTraits(e.target.value)}
                    className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/15 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#8BAB70]"
                    placeholder="Comma-separated personality traits..."
                  />
                ) : (
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {virtualPartner.personalityTraits.map((trait, index) => (
                      <span
                        key={index}
                        className="bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Relationship dynamics */}
              <div className="border-t border-[#4C3322]/5 pt-6 text-left space-y-6">
                <h4 className="font-serif text-lg font-black text-[#4C3322] text-center mb-2">Sanctuary Dynamics</h4>

                {/* Current scenario context */}
                <div className="bg-[#FAF7F2]/60 border border-[#4C3322]/10 p-5 rounded-3xl shadow-inner space-y-1">
                  <span className="text-[9px] font-bold text-[#4C3322]/40 uppercase tracking-wide">Active Scenario Context</span>
                  {isEditing ? (
                    <textarea
                      value={editedScenario}
                      onChange={(e) => setEditedScenario(e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-[#4C3322]/15 rounded-xl p-3 focus:outline-none focus:border-[#8BAB70] text-xs resize-none"
                    />
                  ) : (
                    <p className="text-sm font-light leading-relaxed text-[#4C3322] italic">
                      {virtualPartner.currentScenario || "Establishing standard mindfulness contexts."}
                    </p>
                  )}
                </div>

                {/* Emotional index sliders */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-[#4C3322]/40 uppercase tracking-wide ml-1 block">Emotional Indices</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {['happiness', 'motivation', 'trust'].map((emotionKey) => {
                      const value = virtualPartner.emotionalState[emotionKey as keyof typeof virtualPartner.emotionalState];
                      return (
                        <div key={emotionKey} className="bg-white border border-[#4C3322]/5 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-20">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-[#4C3322]/60">
                            <span>{emotionKey}</span>
                            <span className="text-[#8BAB70]">{value}%</span>
                          </div>
                          <div className="w-full bg-[#FAF7F2] border border-[#4C3322]/5 h-2 rounded-full overflow-hidden mt-2">
                            <div
                              className={`${getProgressBarColor(value)} h-full rounded-full transition-all duration-1000`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Relationship goals list */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-[#4C3322]/40 uppercase tracking-wide ml-1 block">Shared Goals</span>
                  {isEditing ? (
                    <textarea
                      value={editedGoals}
                      onChange={(e) => setEditedGoals(e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-[#4C3322]/15 rounded-3xl p-4 focus:outline-none focus:border-[#8BAB70] text-xs resize-none h-24"
                      placeholder="Goal 1; Goal 2 (complete)..."
                    />
                  ) : (
                    <ul className="space-y-2 select-none">
                      {virtualPartner.relationshipGoals.map((goal, index) => (
                        <li 
                          key={index} 
                          className="flex items-center justify-between bg-[#FAF7F2]/40 border border-[#4C3322]/5 p-3.5 rounded-2xl shadow-sm"
                        >
                          <span className={`text-xs font-semibold ${goal.complete ? 'line-through text-[#4C3322]/40' : 'text-[#4C3322]'}`}>
                            {goal.name}
                          </span>
                          {goal.complete ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70] text-[8px] font-bold uppercase tracking-wider">
                              Done
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#DE7A49]/10 border border-[#DE7A49]/20 text-[#DE7A49] text-[8px] font-bold uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

            </div>

            {/* Action buttons panel */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full justify-center max-w-lg select-none">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveEdits}
                    className="flex-grow py-3 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-grow py-3 border border-[#4C3322]/10 bg-white hover:bg-[#4C3322]/5 text-[#4C3322] rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-grow py-3 border border-[#4C3322]/10 bg-white hover:bg-[#4C3322]/5 text-[#4C3322] rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Edit Persona
                  </button>
                  <button
                    onClick={() => navigate('/virtual-partner/chat')}
                    className="flex-grow py-3 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <i className="fas fa-comments text-[10px]"></i> Start Chat
                  </button>
                  <button
                    onClick={resetVirtualPartner}
                    className="flex-grow py-3 border border-[#DE7A49]/20 hover:bg-[#DE7A49]/5 text-[#DE7A49] rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Reset Persona
                  </button>
                </>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
