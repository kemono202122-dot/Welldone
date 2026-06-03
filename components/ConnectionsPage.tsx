
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

export const ConnectionsPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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
    friendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    startDirectMessage
  } = context;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
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
            Please register or sign in to explore and manage your wellness companion circle.
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

  // --- Logic for Connections ---
  const friendsList = allUsers.filter(u => currentUser.friends.includes(u.id));
  const filteredFriends = friendsList.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (f.occupation && f.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // --- Logic for Requests ---
  const incomingRequests = friendRequests.filter(
    (req) => req.receiverId === currentUser.id && req.status === 'pending'
  );
  const outgoingRequests = friendRequests.filter(
    (req) => req.senderId === currentUser.id && req.status === 'pending'
  );

  const handleMessage = (userId: string) => {
    if (startDirectMessage) {
      startDirectMessage(userId);
    }
  };

  const getUserDetails = (userId: string) => allUsers.find((u) => u.id === userId);

  // Helper to identify mutual interests
  const getMutualInterests = (friendInterests: string[]) => {
    return friendInterests.filter(i => currentUser.interests.includes(i));
  };

  const handleSyncContacts = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden select-none selection:bg-[#8BAB70] selection:text-white">
      
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#4C3322] text-[#FAF7F2] px-6 py-3.5 rounded-2xl shadow-xl z-50 text-xs font-bold uppercase tracking-wider animate-bounce border border-[#FAF7F2]/10 flex items-center gap-2">
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
        <div className="flex items-center gap-3 bg-white/50 border border-[#4C3322]/10 rounded-full px-4 py-1.5 shadow-sm">
          <img 
            src={currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"} 
            className="w-7 h-7 rounded-full border border-[#4C3322]/10 object-cover shadow-sm"
            alt="Avatar"
          />
          <span className="text-xs font-semibold hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl w-full mx-auto flex-grow z-10 flex flex-col">
        
        {/* Title Block */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#4C3322]/5 pb-6">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-[#4C3322] leading-tight">
              Connections Circle
            </h2>
            <p className="text-[#4C3322]/70 text-sm font-light mt-2 max-w-xl">
              Nurture your network of wellness guides, travel companions, and community buddies.
            </p>
          </div>
          
          {/* Frosted Stats Dashboard */}
          <div className="flex gap-4">
            <div className="bg-white/40 border border-[#4C3322]/10 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm flex flex-col items-center min-w-[110px]">
               <span className="text-2xl font-bold text-[#8BAB70]">{friendsList.length}</span>
               <span className="text-[10px] uppercase font-bold text-[#4C3322]/50 tracking-wider mt-1">Buddies</span>
            </div>
            <div className="bg-white/40 border border-[#4C3322]/10 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm flex flex-col items-center min-w-[110px] relative">
               <span className="text-2xl font-bold text-[#DE7A49]">{incomingRequests.length}</span>
               <span className="text-[10px] uppercase font-bold text-[#4C3322]/50 tracking-wider mt-1">Pending</span>
            </div>
          </div>
        </div>

        {/* Tab & Search Console Grid */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Tabs */}
          <div className="bg-white/40 border border-[#4C3322]/10 backdrop-blur-md p-1.5 rounded-2xl shadow-sm flex">
            <button
              onClick={() => setActiveTab('connections')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'connections'
                  ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm'
                  : 'text-[#4C3322]/60 hover:text-[#4C3322]'
              }`}
            >
              Connections Circle
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'requests'
                  ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm'
                  : 'text-[#4C3322]/60 hover:text-[#4C3322]'
              }`}
            >
              Requests Queue
              {incomingRequests.length > 0 && (
                <span className="bg-[#DE7A49] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {incomingRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* Search bar & Sync Controls - visible on appropriate context */}
          {activeTab === 'connections' && (
            <div className="flex gap-3 flex-grow md:flex-grow-0 max-w-md w-full md:w-auto">
              <div className="relative flex-grow min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4C3322]/40">
                  <i className="fas fa-search text-xs"></i>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search buddies..."
                  className="w-full pl-9 pr-4 py-3 rounded-2xl border border-[#4C3322]/10 bg-white/40 focus:outline-none focus:border-[#8BAB70] text-sm text-[#4C3322] transition-colors placeholder:text-[#4C3322]/40"
                />
              </div>
              
              <button 
                onClick={handleSyncContacts}
                className="px-5 bg-white border border-[#4C3322]/10 text-[#4C3322] rounded-2xl text-xs font-bold hover:bg-[#4C3322]/5 transition-colors flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider whitespace-nowrap"
                title="Sync Contacts with Integrations"
              >
                <i className="fas fa-sync-alt text-[#8BAB70] text-xs"></i>
                <span>Sync</span>
              </button>
            </div>
          )}
        </div>

        {/* --- CONNECTIONS TAB CONTENT --- */}
        {activeTab === 'connections' && (
          <div className="animate-fade-in flex-grow flex flex-col">
            {friendsList.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#4C3322]/10 rounded-[2.5rem] flex-grow flex flex-col justify-center items-center p-6">
                <div className="bg-[#8BAB70]/10 border border-[#8BAB70]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-[#8BAB70] text-xl">
                   <i className="fas fa-user-friends"></i>
                </div>
                <h3 className="font-serif text-2xl font-black text-[#4C3322] mb-2">Build Your Sanctuary Circle</h3>
                <p className="text-[#4C3322]/70 mb-8 max-w-sm mx-auto font-light text-sm">
                  Add new wellness partners to share routines, plan retreats, and keep each other motivated.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    Find Wellness Partners
                  </button>
                  <button 
                    onClick={handleSyncContacts}
                    className="px-6 py-3.5 bg-white border border-[#4C3322]/15 text-[#4C3322] rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors hover:bg-[#4C3322]/5 shadow-sm cursor-pointer"
                  >
                    Import From Contacts
                  </button>
                </div>
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#4C3322]/10 rounded-[2.5rem] flex-grow flex flex-col justify-center items-center">
                 <i className="fas fa-search text-2xl text-[#4C3322]/30 mb-4"></i>
                 <p className="text-[#4C3322]/60 text-lg font-light">No buddies found matching "{searchQuery}".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFriends.map((friend) => {
                  const mutualInterests = getMutualInterests(friend.interests);
                  const otherInterests = friend.interests.filter(i => !mutualInterests.includes(i));
                  // Limit displayed tags to maintain layout aesthetics
                  const displayInterests = [...mutualInterests, ...otherInterests].slice(0, 4);

                  return (
                    <div 
                      key={friend.id} 
                      className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm hover:shadow transition-all duration-300 group relative overflow-hidden flex flex-col h-full"
                    >
                      {/* Top Artistic Highlight */}
                      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-[#8BAB70]/10 to-[#DE7A49]/5 pointer-events-none"></div>

                      <div className="relative flex flex-col items-center flex-grow pt-4">
                        
                        {/* Avatar Image Frame */}
                        <div className="relative mb-4">
                          <img 
                            src={friend.avatar} 
                            alt={friend.name} 
                            className="w-20 h-20 rounded-full object-cover border-4 border-[#FAF7F2] shadow-md cursor-pointer hover:scale-105 transition-transform duration-500"
                            onClick={() => navigate(`/users/${friend.id}`)}
                          />
                          <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-[#8BAB70] border-2 border-white rounded-full" title="Active in circle"></div>
                        </div>
                        
                        {/* Name and Occupation */}
                        <h3 
                          className="font-serif text-xl font-black text-[#4C3322] mb-1 group-hover:text-[#8BAB70] transition-colors cursor-pointer text-center"
                          onClick={() => navigate(`/users/${friend.id}`)}
                        >
                          {friend.name}
                        </h3>
                        <p className="text-[9px] font-bold text-[#8BAB70] uppercase tracking-wider mb-3">
                          {friend.occupation || "Wellness Supporter"}
                        </p>

                        {/* Bio Text */}
                        <p className="text-center text-[#4C3322]/70 text-xs font-light mb-6 line-clamp-2 px-2 min-h-[32px] leading-relaxed">
                          {friend.bio || "Striving for natural, conscious wellness rituals."}
                        </p>

                        {/* Mutual & Regular Interest Capsules */}
                        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                          {displayInterests.map((interest, idx) => {
                            const isMutual = mutualInterests.includes(interest);
                            return (
                              <span 
                                key={idx} 
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                                  isMutual 
                                    ? 'bg-[#8BAB70]/15 text-[#8BAB70] border border-[#8BAB70]/20' 
                                    : 'bg-[#FAF7F2]/80 text-[#4C3322]/80 border border-[#4C3322]/5'
                                }`}
                              >
                                {interest}
                                {isMutual && <i className="fas fa-check text-[8px]"></i>}
                              </span>
                            );
                          })}
                          {friend.interests.length > 4 && (
                            <span className="px-2.5 py-1 rounded-full bg-[#4C3322]/5 text-[9px] font-bold text-[#4C3322]/50 uppercase">
                              +{friend.interests.length - 4} More
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Custom Curvature Interaction Buttons */}
                      <div className="grid grid-cols-2 gap-3 w-full mt-auto">
                        <button
                          onClick={() => handleMessage(friend.id)}
                          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                        >
                          <i className="far fa-comment-alt text-[10px]"></i> Message
                        </button>
                        <button
                          onClick={() => navigate(`/users/${friend.id}`)}
                          className="flex items-center justify-center py-3 px-4 rounded-2xl bg-white border border-[#4C3322]/15 hover:bg-[#4C3322]/5 text-[#4C3322] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- REQUESTS TAB CONTENT --- */}
        {activeTab === 'requests' && (
          <div className="animate-fade-in max-w-3xl mx-auto w-full space-y-8 flex-grow">
            
            {/* Incoming Requests Board */}
            <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#4C3322]/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#8BAB70]/10 flex items-center justify-center text-[#8BAB70]">
                     <i className="fas fa-arrow-down text-xs"></i>
                  </div>
                  <h3 className="font-serif text-xl font-black text-[#4C3322]">Incoming Network Requests</h3>
                </div>
                <span className="bg-[#8BAB70]/15 text-[#8BAB70] px-3.5 py-1 rounded-full text-xs font-bold">
                  {incomingRequests.length} Pending
                </span>
              </div>

              {incomingRequests.length === 0 ? (
                <p className="text-[#4C3322]/40 italic text-center py-8 font-light text-sm">No incoming companion requests at this time.</p>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map((req) => {
                    const sender = getUserDetails(req.senderId);
                    if (!sender) return null;
                    return (
                      <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-3xl bg-[#FAF7F2]/50 border border-[#4C3322]/5 hover:border-[#4C3322]/10 transition-colors">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <img 
                            src={sender.avatar} 
                            alt={sender.name} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
                            onClick={() => navigate(`/users/${sender.id}`)}
                          />
                          <div>
                            <h4 
                              className="font-serif font-black text-[#4C3322] cursor-pointer hover:text-[#8BAB70] transition-colors"
                              onClick={() => navigate(`/users/${sender.id}`)}
                            >
                              {sender.name}
                            </h4>
                            <p className="text-[10px] text-[#4C3322]/60 font-light mt-0.5">{sender.occupation || "Sanctuary Member"}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              acceptFriendRequest(req.id);
                              triggerToast(`You are now connected with ${sender.name}!`);
                            }}
                            className="px-5 py-2.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              declineFriendRequest(req.id);
                              triggerToast("Connection request declined.");
                            }}
                            className="px-5 py-2.5 bg-white border border-[#4C3322]/15 text-[#4C3322] hover:bg-[#4C3322]/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Outgoing Requests Board */}
            <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#4C3322]/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DE7A49]/10 flex items-center justify-center text-[#DE7A49]">
                     <i className="fas fa-arrow-up text-xs"></i>
                  </div>
                  <h3 className="font-serif text-xl font-black text-[#4C3322]">Sent Invitations</h3>
                </div>
                <span className="bg-[#4C3322]/5 text-[#4C3322]/70 px-3.5 py-1 rounded-full text-xs font-bold">
                  {outgoingRequests.length} Outgoing
                </span>
              </div>

              {outgoingRequests.length === 0 ? (
                <p className="text-[#4C3322]/40 italic text-center py-8 font-light text-sm">No outgoing requests waiting.</p>
              ) : (
                <div className="space-y-4">
                  {outgoingRequests.map((req) => {
                    const receiver = getUserDetails(req.receiverId);
                    if (!receiver) return null;
                    return (
                      <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-3xl bg-[#FAF7F2]/30 border border-[#4C3322]/5 hover:border-[#4C3322]/10 transition-colors opacity-95">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <img 
                            src={receiver.avatar} 
                            alt={receiver.name} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm grayscale cursor-pointer"
                            onClick={() => navigate(`/users/${receiver.id}`)}
                          />
                          <div>
                            <h4 
                              className="font-serif font-black text-[#4C3322] cursor-pointer hover:text-[#8BAB70] transition-colors"
                              onClick={() => navigate(`/users/${receiver.id}`)}
                            >
                              {receiver.name}
                            </h4>
                            <p className="text-[10px] text-[#4C3322]/50 font-light mt-0.5">Awaiting response</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            declineFriendRequest(req.id);
                            triggerToast("Invitation cancelled.");
                          }}
                          className="px-4 py-2 bg-transparent text-[#DE7A49] hover:bg-[#DE7A49]/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-[#DE7A49]/20 hover:border-[#DE7A49]/30 cursor-pointer"
                        >
                          Cancel Invite
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
