import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Post } from '../types';
import { StoryBoard } from './StoryBoard';

export const DetailedProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const context = useContext(AppContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'diary' | 'goals' | 'gallery'>('overview');
  
  // Local state for adding items
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntryLoc, setNewEntryLoc] = useState('');
  const [newEntryDate, setNewEntryDate] = useState('');
  const [newEntryStory, setNewEntryStory] = useState('');

  if (!context) return null;
  const { currentUser, allUsers, createPost, likePost, commentOnPost, sharePost, updateUserProfile } = context;

  const targetUser = userId 
    ? allUsers.find(u => u.id === userId) 
    : currentUser;

  if (!targetUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] flex items-center justify-center font-outfit">
        <p className="text-center text-xl font-serif">User sanctuary not found.</p>
      </div>
    );
  }

  const isMe = currentUser?.id === targetUser.id;
  const userPosts = (targetUser.posts || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // -- Handlers --

  const handleAddGoal = () => {
    if(!newGoalTitle || !currentUser) return;
    const newGoal = {
        id: Date.now().toString(),
        title: newGoalTitle,
        category: 'Personal',
        progress: 0,
        completed: false
    };
    const updatedUser = { ...currentUser, goals: [...currentUser.goals, newGoal] };
    updateUserProfile(updatedUser);
    setNewGoalTitle('');
    setIsAddingGoal(false);
  };

  const handleAddEntry = () => {
    if(!newEntryLoc || !currentUser) return;
    const newEntry = {
        id: Date.now().toString(),
        location: newEntryLoc,
        date: newEntryDate,
        story: newEntryStory,
        image: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80` // Premium beach background
    };
    const updatedUser = { ...currentUser, travelDiary: [newEntry, ...currentUser.travelDiary] };
    updateUserProfile(updatedUser);
    setNewEntryLoc(''); setNewEntryDate(''); setNewEntryStory('');
    setIsAddingEntry(false);
  };

  const getPlatformIcon = (platform: string) => {
      switch(platform) {
          case 'instagram': return 'fab fa-instagram text-[#DE7A49]';
          case 'facebook': return 'fab fa-facebook-f text-[#4C3322]';
          case 'twitter': return 'fab fa-twitter text-[#8BAB70]';
          case 'linkedin': return 'fab fa-linkedin-in text-[#4C3322]';
          case 'spotify': return 'fab fa-spotify text-[#8BAB70]';
          default: return 'fas fa-share-alt';
      }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden select-none selection:bg-[#8BAB70] selection:text-white">
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-4 mb-8 border-b border-[#4C3322]/5 z-10">
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

      {/* PROFILE BLOCK CONTAINER */}
      <div className="max-w-5xl w-full mx-auto flex-grow z-10 flex flex-col">
        
        {/* Profile Card Header */}
        <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] overflow-hidden shadow-sm mb-8 relative flex flex-col">
          
          {/* Header Banner Background */}
          <div className="h-44 bg-gradient-to-r from-[#8BAB70]/20 to-[#DE7A49]/15 relative">
              {/* Social Media Link Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                  {targetUser.socialMediaLinks?.facebook && (
                    <a href={targetUser.socialMediaLinks.facebook} target="_blank" rel="noreferrer" className="bg-[#FAF7F2] text-[#4C3322] border border-[#4C3322]/10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                      <i className="fab fa-facebook-f text-xs"></i>
                    </a>
                  )}
                  {targetUser.socialMediaLinks?.instagram && (
                    <a href={targetUser.socialMediaLinks.instagram} target="_blank" rel="noreferrer" className="bg-[#FAF7F2] text-[#4C3322] border border-[#4C3322]/10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                      <i className="fab fa-instagram text-xs"></i>
                    </a>
                  )}
                  {targetUser.socialMediaLinks?.twitter && (
                    <a href={targetUser.socialMediaLinks.twitter} target="_blank" rel="noreferrer" className="bg-[#FAF7F2] text-[#4C3322] border border-[#4C3322]/10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                      <i className="fab fa-twitter text-xs"></i>
                    </a>
                  )}
                  {targetUser.socialMediaLinks?.linkedin && (
                    <a href={targetUser.socialMediaLinks.linkedin} target="_blank" rel="noreferrer" className="bg-[#FAF7F2] text-[#4C3322] border border-[#4C3322]/10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                      <i className="fab fa-linkedin-in text-xs"></i>
                    </a>
                  )}
              </div>
          </div>
          
          {/* Avatar and Info Body */}
          <div className="px-6 md:px-8 pb-6 relative">
              <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-4 text-center md:text-left">
                  
                  {/* Photo frame */}
                  <img 
                    src={targetUser.avatar} 
                    alt={targetUser.name} 
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#FAF7F2] shadow-md object-cover cursor-pointer hover:scale-105 transition-transform duration-500 z-10" 
                  />
                  
                  {/* Text details */}
                  <div className="md:ml-6 mb-2 mt-4 md:mt-0 flex-grow">
                      <h2 className="font-serif text-3xl font-black text-[#4C3322] tracking-tight leading-tight">
                        {targetUser.name}
                      </h2>
                      <p className="text-[#8BAB70] text-xs font-bold uppercase tracking-wider mt-1">
                        {targetUser.occupation || 'Wellness Member'}
                      </p>
                      
                      {/* Demographics Badges */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3.5">
                          {targetUser.city && (
                            <span className="bg-[#FAF7F2]/80 border border-[#4C3322]/10 text-[#4C3322]/70 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                              <i className="fas fa-map-marker-alt text-[8px] text-[#DE7A49]"></i> {targetUser.city}, {targetUser.country}
                            </span>
                          )}
                          {targetUser.language && (
                            <span className="bg-[#FAF7F2]/80 border border-[#4C3322]/10 text-[#4C3322]/70 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                              <i className="fas fa-language text-[8px] text-[#8BAB70]"></i> {targetUser.language}
                            </span>
                          )}
                          {targetUser.religion && (
                            <span className="bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70] text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                              <i className="fas fa-leaf text-[8px]"></i> {targetUser.religion}
                            </span>
                          )}
                          {targetUser.politicalView && (
                            <span className="bg-[#4C3322]/5 border border-[#4C3322]/10 text-[#4C3322]/70 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                              <i className="fas fa-landmark text-[8px]"></i> {targetUser.politicalView}
                            </span>
                          )}
                          {targetUser.philosophy && (
                            <span className="bg-[#DE7A49]/10 border border-[#DE7A49]/20 text-[#DE7A49] text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                              <i className="fas fa-brain text-[8px]"></i> {targetUser.philosophy}
                            </span>
                          )}
                      </div>
                  </div>

                  {/* Actions */}
                  {isMe && (
                      <button 
                        onClick={() => navigate('/edit-profile')} 
                        className="px-6 py-2.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors mb-2 cursor-pointer shadow-sm shrink-0"
                      >
                        Edit Profile
                      </button>
                  )}
              </div>
              
              <div className="max-w-2xl mt-6 text-center md:text-left">
                <p className="text-[#4C3322]/80 text-xs italic font-light leading-relaxed mb-4">
                  "{targetUser.bio || 'Sharing moments of calm, focus, and wellness.'}"
                </p>
              </div>
              
              {/* Interest Badges */}
              <div className="flex gap-1.5 flex-wrap justify-center md:justify-start">
                  {targetUser.interests.map((interest, i) => (
                      <span key={i} className="px-3 py-1 bg-[#FAF7F2] text-[#4C3322]/70 border border-[#4C3322]/10 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          {interest}
                      </span>
                  ))}
              </div>
          </div>

          {/* Symmetrical Tab Navigation Box */}
          <div className="flex border-t border-[#4C3322]/5 bg-[#FAF7F2]/30 p-1.5">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'diary', label: 'Travel Diary' },
                { id: 'goals', label: 'Sanctuary Goals' },
                { id: 'gallery', label: 'Media Gallery' }
              ].map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 rounded-xl cursor-pointer ${
                          activeTab === tab.id 
                          ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm' 
                          : 'text-[#4C3322]/60 hover:text-[#4C3322]'
                      }`}
                  >
                      {tab.label}
                  </button>
              ))}
          </div>
        </div>

        {/* --- TAB CONTENT AREA --- */}

        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              {/* Left Column (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm">
                      <h3 className="font-serif text-lg font-black text-[#4C3322] mb-4">Sanctuary Stats</h3>
                      <ul className="space-y-3.5 text-xs text-[#4C3322]/70 font-light">
                          <li className="flex justify-between border-b border-[#4C3322]/5 pb-2">
                            <span>Published Stories</span> 
                            <span className="font-bold text-[#4C3322]">{targetUser.posts?.length || 0}</span>
                          </li>
                          <li className="flex justify-between border-b border-[#4C3322]/5 pb-2">
                            <span>Sanctuary Friends</span> 
                            <span className="font-bold text-[#4C3322]">{targetUser.friends.length}</span>
                          </li>
                          <li className="flex justify-between pb-1">
                            <span>Year Joined</span> 
                            <span className="font-bold text-[#4C3322]">2026</span>
                          </li>
                      </ul>
                  </div>

                  {/* Social Pulse Feed */}
                  {targetUser.socialActivity && targetUser.socialActivity.length > 0 && (
                      <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm">
                          <h3 className="font-serif text-lg font-black text-[#4C3322] mb-4 flex items-center gap-2">
                              <i className="fas fa-satellite-dish text-[#DE7A49] text-sm animate-pulse"></i> Social Pulse
                          </h3>
                          <div className="space-y-4">
                              {targetUser.socialActivity.map(activity => (
                                  <div key={activity.id} className="border-l border-[#4C3322]/10 pl-4 pb-2">
                                      <div className="flex items-center gap-2 mb-1">
                                          <i className={`${getPlatformIcon(activity.platform)} text-xs`}></i>
                                          <span className="text-[9px] font-bold text-[#4C3322]/40 uppercase tracking-wide">{activity.timestamp}</span>
                                      </div>
                                      <p className="text-xs text-[#4C3322]/80 leading-relaxed font-light mb-2">
                                          {activity.content}
                                      </p>
                                      {activity.image && (
                                          <img src={activity.image} alt="Social Update" className="rounded-2xl w-full h-28 object-cover mb-2" />
                                      )}
                                      <div className="flex items-center gap-3 text-[10px] text-[#4C3322]/50 font-bold uppercase">
                                          {activity.likes && <span><i className="far fa-heart"></i> {activity.likes} Likes</span>}
                                          <a href={activity.url} target="_blank" rel="noreferrer" className="text-[#8BAB70] hover:underline">View Source</a>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
              
              {/* Right Column (8 Cols) */}
              <div className="lg:col-span-8">
                  <h3 className="font-serif text-xl font-black text-[#4C3322] mb-4">Feed Timeline</h3>
                  <StoryBoard
                      currentUser={currentUser}
                      posts={userPosts}
                      users={allUsers}
                      onPostCreate={isMe ? createPost : undefined}
                      onLike={likePost}
                      onComment={commentOnPost}
                      onShare={sharePost}
                      showCreateBox={isMe}
                  />
              </div>
          </div>
        )}

        {/* 2. TRAVEL DIARY */}
        {activeTab === 'diary' && (
          <div className="animate-fade-in space-y-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#4C3322]/5">
                  <h3 className="font-serif text-2xl font-black text-[#4C3322]">Travel Diary</h3>
                  {isMe && (
                    <button 
                      onClick={() => setIsAddingEntry(!isAddingEntry)} 
                      className="px-5 py-2.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                    >
                      <i className="fas fa-plus mr-1.5 text-[10px]"></i> Add Entry
                    </button>
                  )}
              </div>

              {isAddingEntry && (
                  <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm mb-8 animate-fade-in flex flex-col space-y-4">
                      <h4 className="font-serif text-lg font-black text-[#4C3322]">Add Journey Note</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Destination Location" 
                            value={newEntryLoc} 
                            onChange={e => setNewEntryLoc(e.target.value)} 
                            className="p-3 border border-[#4C3322]/10 rounded-2xl dark:text-white bg-[#FAF7F2]/40 text-sm focus:outline-none focus:border-[#8BAB70]" 
                          />
                          <input 
                            type="date" 
                            value={newEntryDate} 
                            onChange={e => setNewEntryDate(e.target.value)} 
                            className="p-3 border border-[#4C3322]/10 rounded-2xl dark:text-white bg-[#FAF7F2]/40 text-sm focus:outline-none focus:border-[#8BAB70]" 
                          />
                      </div>
                      <textarea 
                        placeholder="Write your travel story here..." 
                        value={newEntryStory} 
                        onChange={e => setNewEntryStory(e.target.value)} 
                        className="w-full p-4 border border-[#4C3322]/10 rounded-2xl bg-[#FAF7F2]/40 text-sm focus:outline-none focus:border-[#8BAB70] resize-none h-28" 
                      />
                      <button 
                        onClick={handleAddEntry} 
                        className="self-end px-6 py-3 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors shadow cursor-pointer"
                      >
                        Publish Journey
                      </button>
                  </div>
              )}

              <div className="space-y-6">
                  {targetUser.travelDiary && targetUser.travelDiary.length > 0 ? (
                      targetUser.travelDiary.map((entry) => (
                          <div key={entry.id} className="flex flex-col md:flex-row bg-white border border-[#4C3322]/10 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow transition-shadow duration-300">
                              <div className="md:w-1/3 h-48 md:h-auto">
                                  <img src={entry.image} alt={entry.location} className="w-full h-full object-cover" />
                              </div>
                              <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center">
                                  <div className="flex justify-between items-start mb-3">
                                      <h4 className="font-serif text-xl font-black text-[#4C3322]">{entry.location}</h4>
                                      <span className="text-[10px] font-bold text-[#8BAB70] bg-[#8BAB70]/10 border border-[#8BAB70]/20 px-3 py-1 rounded-full uppercase tracking-wider">{entry.date}</span>
                                  </div>
                                  <p className="text-[#4C3322]/80 text-xs italic font-light leading-relaxed">
                                      "{entry.story}"
                                  </p>
                              </div>
                          </div>
                      ))
                  ) : (
                      <p className="text-center text-[#4C3322]/40 italic text-sm py-8 font-light">No travel journal entries shared.</p>
                  )}
              </div>
          </div>
        )}

        {/* 3. GOALS */}
        {activeTab === 'goals' && (
          <div className="animate-fade-in space-y-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#4C3322]/5">
                  <h3 className="font-serif text-2xl font-black text-[#4C3322]">Sanctuary Goals</h3>
                  {isMe && (
                    <button 
                      onClick={() => setIsAddingGoal(!isAddingGoal)} 
                      className="px-5 py-2.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                    >
                      <i className="fas fa-plus mr-1.5 text-[10px]"></i> New Goal
                    </button>
                  )}
              </div>

              {isAddingGoal && (
                  <div className="flex gap-2 mb-6">
                      <input 
                        type="text" 
                        placeholder="Define your goal..." 
                        value={newGoalTitle} 
                        onChange={e => setNewGoalTitle(e.target.value)} 
                        className="flex-1 p-3.5 border border-[#4C3322]/10 bg-white rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70]" 
                      />
                      <button 
                        onClick={handleAddGoal} 
                        className="px-6 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                      >
                        Add Goal
                      </button>
                  </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {targetUser.goals.map((goal) => (
                      <div key={goal.id} className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm border-l-4 border-l-[#8BAB70]">
                          <div className="flex justify-between items-start mb-4">
                              <h4 className="font-serif text-base font-black text-[#4C3322]">{goal.title}</h4>
                              <span className="text-[9px] font-bold text-[#4C3322]/40 bg-[#4C3322]/5 border border-[#4C3322]/10 px-2 py-1 rounded-full uppercase tracking-wider">{goal.category}</span>
                          </div>
                          
                          {/* Progress slider bar */}
                          <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                  <div>
                                      <span className="text-[8px] font-bold uppercase tracking-wider text-[#8BAB70]">
                                          Completeness
                                      </span>
                                  </div>
                                  <div className="text-right">
                                      <span className="text-[10px] font-bold text-[#8BAB70]">
                                          {goal.progress}%
                                      </span>
                                  </div>
                              </div>
                              <div className="overflow-hidden h-2.5 rounded-full bg-[#8BAB70]/10 border border-[#8BAB70]/20 flex">
                                  <div style={{ width: `${goal.progress}%` }} className="rounded-full bg-gradient-to-r from-[#8BAB70] to-[#8BAB70]/50 transition-all duration-500"></div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        )}

        {/* 4. GALLERY */}
        {activeTab === 'gallery' && (
          <div className="animate-fade-in space-y-6">
              <h3 className="font-serif text-2xl font-black text-[#4C3322] mb-6 pb-4 border-b border-[#4C3322]/5">Media Gallery</h3>
              {targetUser.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {targetUser.gallery.map((asset) => (
                          <div key={asset.id} className="relative group aspect-square rounded-[2rem] overflow-hidden bg-white border border-[#4C3322]/10 cursor-pointer">
                              {asset.type === 'video' ? (
                                  <>
                                      <video src={asset.url} className="w-full h-full object-cover opacity-95" />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                          <i className="fas fa-play text-white text-2xl opacity-80 group-hover:scale-105 transition-transform duration-300"></i>
                                      </div>
                                      <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md">Reel</div>
                                  </>
                              ) : (
                                  <img src={asset.url} alt="User Gallery item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              )}
                          </div>
                      ))}
                  </div>
              ) : (
                  <p className="text-center text-[#4C3322]/40 italic text-sm py-8 font-light">No media uploads available.</p>
              )}
          </div>
        )}

      </div>
    </div>
  );
};
