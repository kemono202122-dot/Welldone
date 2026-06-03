import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { TravelBuddyCard } from './TravelBuddyCard';
import { TravelPlanCard } from './TravelPlanCard';
import { LoadingSpinner } from './LoadingSpinner';
import { SUCCESS_STORIES } from '../constants';

export const TravelsPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'soulmate' | 'plans' | 'spots' | 'stories'>('soulmate');
  const [destination, setDestination] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('Any');
  const [selectedBudget, setSelectedBudget] = useState('Any');
  const [isExpandedSearch, setIsExpandedSearch] = useState(false);
  const [isAddSpotModalOpen, setIsAddSpotModalOpen] = useState(false);

  // --- Notification Toast State ---
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!context) {
    return <p className="text-center text-xl">Loading application context...</p>;
  }

  const { 
    currentUser, allUsers, friendRequests, sendFriendRequest,
    travelBuddySuggestions, loadingTravelBuddies, searchTravelBuddies,
    travelPlans, meetingSpots, addMeetingSpot 
  } = context;

  // Security Redirect: Return user if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const isSearching = loadingTravelBuddies;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCosmicSearch = () => {
    if (searchTravelBuddies) {
      searchTravelBuddies(destination, { 
        interests: currentUser?.interests || [], 
        travelStyle: selectedVibe !== 'Any' ? selectedVibe : null, 
        budget: selectedBudget !== 'Any' ? selectedBudget : null 
      });
      triggerToast("Scanning sanctuary catalog for compatible guides...");
    }
  };

  const handleUserAddSpot = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addMeetingSpot) return;

    const formData = new FormData(e.currentTarget);
    addMeetingSpot({
      id: `spot-${Date.now()}`,
      name: formData.get('name') as string,
      type: 'User Recommendation',
      location: formData.get('location') as string,
      address: formData.get('address') as string,
      vibe: 'Community',
      visualTheme: formData.get('visualTheme') as any,
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80',
      tags: ['User Added'],
      description: formData.get('description') as string,
      rating: 5,
      approved: false,
      addedBy: currentUser?.id || 'anon',
      mapUrl: '#'
    });

    setIsAddSpotModalOpen(false);
    triggerToast("Spot submitted successfully to the Cereen library review!");
  };

  const getThemeColor = (theme?: string) => {
    switch (theme) {
      case 'Mystical': return 'bg-[#DE7A49]/10 border border-[#DE7A49]/20 text-[#DE7A49]';
      case 'Modern': return 'bg-[#4C3322]/10 border border-[#4C3322]/20 text-[#4C3322]';
      case 'Cozy': return 'bg-[#DE7A49]/10 border border-[#DE7A49]/20 text-[#DE7A49]';
      case 'Energetic': return 'bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70]';
      default: return 'bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70]';
    }
  };

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
      <div className="max-w-7xl w-full mx-auto space-y-8 flex-grow z-10">
        
        {/* Banner Title */}
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] tracking-[0.25em] font-bold text-[#8BAB70] uppercase">shared journeys</span>
          <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-[#4C3322]">Wanderlust.</h2>
          <p className="text-sm font-light text-[#4C3322]/70 max-w-xl">
            Scan for wellness companions, coordinate curated retreats, or inspect gathering spots reviewed by our community.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center border-t border-b border-[#4C3322]/10 py-4 select-none">
          <div className="bg-white/50 border border-[#4C3322]/10 p-1.5 rounded-full shadow-sm inline-flex gap-1.5 flex-wrap">
            {[
              { id: 'soulmate', label: 'Companion Scan', icon: 'fas fa-user-astronaut' },
              { id: 'plans', label: 'Wellness Journeys', icon: 'fas fa-map-marked-alt' },
              { id: 'spots', label: 'Gathering Spots', icon: 'fas fa-map-pin' },
              { id: 'stories', label: 'Community Stories', icon: 'fas fa-heart' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${activeTab === tab.id ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm font-black' : 'text-[#4C3322]/60 hover:bg-[#4C3322]/5'}`}
              >
                <i className={tab.icon}></i> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- TAB 1: COMPANION SCAN --- */}
        {activeTab === 'soulmate' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Companion Search Console */}
            <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center md:text-left">
                <span className="text-[10px] tracking-[0.25em] font-bold text-[#8BAB70] uppercase">Cosmic Match Engine</span>
                <h3 className="font-serif text-2xl font-black text-[#4C3322] mt-1">Companion Scan</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Destination */}
                <div className="md:col-span-4 space-y-2">
                  <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Destination</label>
                  <div className="relative">
                    <i className="fas fa-globe-americas absolute left-4 top-1/2 -translate-y-1/2 text-[#4C3322]/30 text-xs"></i>
                    <input 
                      type="text" 
                      placeholder="e.g. Kyoto, Japan" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2]/60 border border-[#4C3322]/10 focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all rounded-full text-xs text-[#4C3322] font-bold shadow-inner" 
                    />
                  </div>
                </div>

                {/* Vibe */}
                <div className="md:col-span-3 space-y-2">
                  <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Travel Vibe</label>
                  <select 
                    value={selectedVibe}
                    onChange={(e) => setSelectedVibe(e.target.value)}
                    className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-full px-4 py-3 text-xs focus:outline-none focus:border-[#8BAB70] focus:bg-white text-[#4C3322] cursor-pointer appearance-none font-bold shadow-inner"
                  >
                    <option value="Any">Any Vibe</option>
                    <option value="Adventure">🌋 Adventure</option>
                    <option value="Chill">🌴 Chill & Relax</option>
                    <option value="Spiritual">🧘 Spiritual</option>
                    <option value="Party">🎉 Nightlife</option>
                  </select>
                </div>

                {/* Budget */}
                <div className="md:col-span-3 space-y-2">
                  <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Budget tier</label>
                  <select 
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-full px-4 py-3 text-xs focus:outline-none focus:border-[#8BAB70] focus:bg-white text-[#4C3322] cursor-pointer appearance-none font-bold shadow-inner"
                  >
                    <option value="Any">Any Budget</option>
                    <option value="Low">$ Shoestring</option>
                    <option value="Medium">$$ Balanced</option>
                    <option value="High">$$$ Luxury</option>
                  </select>
                </div>

                {/* Button */}
                <div className="md:col-span-2 select-none">
                  <button 
                    onClick={handleCosmicSearch}
                    className="w-full py-3.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSearching ? <LoadingSpinner /> : <><i className="fas fa-search text-[10px]"></i> Scan</>}
                  </button>
                </div>
              </div>

              {/* Expand toggles */}
              <div className="flex justify-between items-center px-1 border-t border-[#4C3322]/5 pt-4 select-none">
                <button 
                  onClick={() => setIsExpandedSearch(!isExpandedSearch)}
                  className="text-xs font-bold text-[#4C3322]/40 hover:text-[#8BAB70] transition-colors flex items-center gap-1.5"
                >
                  <i className="fas fa-sliders-h text-[10px]"></i>
                  {isExpandedSearch ? 'Fewer Filters' : 'Expand Scan filters'}
                </button>
              </div>

              {isExpandedSearch && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in border-t border-[#4C3322]/5 pt-4 text-xs font-bold text-[#4C3322]/80">
                  <label className="flex items-center gap-2.5 cursor-pointer p-3.5 bg-[#FAF7F2]/40 border border-[#4C3322]/5 rounded-2xl hover:bg-[#FAF7F2] transition-all">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#4C3322]/15 text-[#8BAB70] focus:ring-[#8BAB70]" /> Female Only
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer p-3.5 bg-[#FAF7F2]/40 border border-[#4C3322]/5 rounded-2xl hover:bg-[#FAF7F2] transition-all">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#4C3322]/15 text-[#8BAB70] focus:ring-[#8BAB70]" /> Verified Guides
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer p-3.5 bg-[#FAF7F2]/40 border border-[#4C3322]/5 rounded-2xl hover:bg-[#FAF7F2] transition-all">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#4C3322]/15 text-[#8BAB70] focus:ring-[#8BAB70]" /> Close to Location
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer p-3.5 bg-[#FAF7F2]/40 border border-[#4C3322]/5 rounded-2xl hover:bg-[#FAF7F2] transition-all">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#4C3322]/15 text-[#8BAB70] focus:ring-[#8BAB70]" /> Speak English
                  </label>
                </div>
              )}
            </div>

            {/* Match Grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {travelBuddySuggestions.map(buddy => (
                <TravelBuddyCard 
                  key={buddy.id}
                  buddy={buddy}
                  currentUser={currentUser}
                  allUsers={allUsers}
                  friendRequests={friendRequests}
                  onSendFriendRequest={(id) => sendFriendRequest(id)}
                  onViewProfile={(id) => navigate(`/users/${id}`)}
                />
              ))}
              {travelBuddySuggestions.length === 0 && !isSearching && (
                <div className="col-span-full text-center py-20 bg-white border border-[#4C3322]/10 rounded-[2.5rem] shadow-sm select-none">
                  <h3 className="font-serif text-lg font-black text-[#4C3322]/40">No companion matches scanned.</h3>
                  <p className="text-xs text-[#4C3322]/50 font-light mt-1">Specify destination or vibes parameter to find guides.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- TAB 2: WELLNESS JOURNEYS --- */}
        {activeTab === 'plans' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center select-none">
              <h3 className="font-serif text-2xl font-black text-[#4C3322]">Curated Retreat Plans</h3>
              <button 
                onClick={() => triggerToast("Loading additional journey catalog...")}
                className="bg-white border border-[#4C3322]/10 px-4 py-2 rounded-full text-xs font-bold hover:bg-[#4C3322] hover:text-[#FAF7F2] transition-all"
              >
                Explore More
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {travelPlans.map(plan => (
                <TravelPlanCard 
                  key={plan.id} 
                  travelPlan={plan} 
                  onViewDetails={(id) => triggerToast(`Opening journey details for plan id ${id}...`)} 
                  onShare={(p) => triggerToast(`Retreat link copied! Shared "${p.name}".`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 3: GATHERING SPOTS --- */}
        {activeTab === 'spots' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#4C3322]/5 pb-4 select-none">
              <div>
                <h3 className="font-serif text-2xl font-black text-[#4C3322]">Gathering Spots</h3>
                <p className="text-xs font-light text-[#4C3322]/70 mt-1">Vetted gathering spaces loved by practitioners.</p>
              </div>
              <button 
                onClick={() => setIsAddSpotModalOpen(true)} 
                className="px-5 py-2.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-full text-xs font-bold uppercase tracking-wider shadow transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fas fa-plus text-[10px]"></i> Suggest Spot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {meetingSpots.map(spot => (
                <div key={spot.id} className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow transition-all duration-300 flex flex-col h-full group">
                  <div className="relative h-52 overflow-hidden border-b border-[#4C3322]/5 select-none">
                    <img src={spot.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" alt="" />
                    <span className="absolute top-4 left-4 bg-white border border-[#4C3322]/10 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-[#4C3322] uppercase tracking-wide">
                      {spot.type}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end text-white">
                      <h4 className="font-serif text-lg font-black leading-tight drop-shadow-sm">{spot.name}</h4>
                      <p className="text-[10px] opacity-90 flex items-center gap-1 mt-0.5"><i className="fas fa-map-marker-alt"></i> {spot.location}</p>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1.5 select-none">
                        <span className="text-[9px] font-bold text-[#8BAB70] bg-[#8BAB70]/10 border border-[#8BAB70]/20 px-2 py-0.5 rounded-full">Vibe: {spot.vibe}</span>
                        {spot.visualTheme && (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getThemeColor(spot.visualTheme)}`}>
                            {spot.visualTheme}
                          </span>
                        )}
                        {!spot.approved && (
                          <span className="bg-[#DE7A49]/10 border border-[#DE7A49]/20 text-[#DE7A49] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Pending Review
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#4C3322]/70 font-light leading-relaxed line-clamp-3">{spot.description}</p>
                    </div>

                    <button 
                      onClick={() => triggerToast(`Displaying detailed map directions for "${spot.name}"...`)}
                      className="w-full py-2.5 border border-[#4C3322]/15 bg-[#FAF7F2]/40 hover:bg-[#4C3322]/5 text-[#4C3322] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors mt-6 select-none cursor-pointer"
                    >
                      Details & Maps
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: COMMUNITY STORIES --- */}
        {activeTab === 'stories' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2 select-none">
              <span className="text-[10px] tracking-[0.25em] font-bold text-[#8BAB70] uppercase">shared experience logs</span>
              <h3 className="font-serif text-3xl font-black text-[#4C3322]">Community Journeys</h3>
              <p className="text-xs font-light text-[#4C3322]/60 max-w-sm mx-auto">Read how others found wellness and alignment on the road.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SUCCESS_STORIES.map(story => (
                <div key={story.id} className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-5 shadow-sm hover:shadow transition-shadow duration-300 flex flex-col justify-between h-full">
                  <div>
                    <img src={story.image} alt="" className="w-full h-44 object-cover rounded-3xl border border-[#4C3322]/5 mb-4 select-none pointer-events-none" />
                    <h4 className="font-serif text-lg font-black text-[#4C3322]">{story.couple}</h4>
                    <span className="text-[10px] font-bold text-[#8BAB70] uppercase tracking-wider block mt-1"><i className="fas fa-map-pin mr-1 text-[#DE7A49]"></i> {story.location}</span>
                    <p className="text-xs text-[#4C3322]/70 font-light leading-relaxed italic mt-4 relative pl-4 border-l border-[#8BAB70]">
                      "{story.story}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUGGEST MEETING SPOT DIALOG MODAL */}
        {isAddSpotModalOpen && (
          <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fade-in text-[#4C3322] font-outfit">
            <div className="bg-[#FAF7F2] border border-[#4C3322]/10 rounded-[2.5rem] w-full max-w-md p-6 md:p-8 shadow-2xl relative animate-fade-in-up">
              
              <button 
                onClick={() => setIsAddSpotModalOpen(false)} 
                className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-all cursor-pointer"
              >
                <i className="fas fa-times text-xs"></i>
              </button>

              <form onSubmit={handleUserAddSpot} className="space-y-4">
                <div className="space-y-1.5 text-center border-b border-[#4C3322]/5 pb-4">
                  <span className="text-[9px] font-bold text-[#8BAB70] uppercase tracking-wider">Sanctuary Spots</span>
                  <h4 className="font-serif text-xl font-black">Suggest a Gathering Spot</h4>
                  <p className="text-[10px] text-[#4C3322]/50 tracking-wide uppercase font-light">
                    Add a spot for peer review and database logging.
                  </p>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block mb-1">Place Name</label>
                  <input name="name" required className="w-full bg-white border border-[#4C3322]/15 rounded-full px-4 py-2.5 focus:outline-none focus:border-[#8BAB70] text-xs text-[#4C3322]" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block mb-1">City / Country</label>
                    <input name="location" required className="w-full bg-white border border-[#4C3322]/15 rounded-full px-4 py-2.5 focus:outline-none focus:border-[#8BAB70] text-xs text-[#4C3322]" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block mb-1">Visual Theme</label>
                    <select name="visualTheme" className="w-full bg-white border border-[#4C3322]/15 rounded-full px-4 py-2.5 focus:outline-none focus:border-[#8BAB70] text-xs text-[#4C3322] cursor-pointer appearance-none">
                      <option value="">Select Theme</option>
                      <option value="Mystical">Mystical</option>
                      <option value="Modern">Modern</option>
                      <option value="Cozy">Cozy</option>
                      <option value="Energetic">Energetic</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block mb-1">Full Address</label>
                  <input name="address" required className="w-full bg-white border border-[#4C3322]/15 rounded-full px-4 py-2.5 focus:outline-none focus:border-[#8BAB70] text-xs text-[#4C3322]" />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block mb-1">Why is this spot special?</label>
                  <textarea name="description" required className="w-full bg-white border border-[#4C3322]/15 rounded-2xl px-4 py-2.5 focus:outline-none focus:border-[#8BAB70] text-xs text-[#4C3322] resize-none h-20" />
                </div>

                <button type="submit" className="w-full py-3 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-full text-xs font-bold uppercase tracking-wider shadow transition-colors mt-2 cursor-pointer">
                  Submit Spot Recommendation
                </button>
              </form>
            </div>
          </div>
        )}

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
