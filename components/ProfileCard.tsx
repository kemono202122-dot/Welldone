import React, { useContext, useState } from 'react';
import { User } from '../types';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

interface ProfileCardProps {
  user: User;
  currentUser: User | null;
  className?: string;
}

const PROFILE_THEMES: Record<string, { gradient: string; accent: string; button: string; ring: string; lightBg: string }> = {
  default: { 
    gradient: 'from-[#4C3322] to-[#8BAB70]', 
    accent: 'text-[#4C3322]', 
    button: 'bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2]',
    ring: 'ring-[#8BAB70]',
    lightBg: 'bg-[#FAF7F2] border border-[#4C3322]/10'
  },
  sunset: { 
    gradient: 'from-[#DE7A49] to-[#4C3322]', 
    accent: 'text-[#DE7A49]', 
    button: 'bg-[#DE7A49] hover:bg-[#4C3322] text-[#FAF7F2]',
    ring: 'ring-[#DE7A49]',
    lightBg: 'bg-[#FAF7F2] border border-[#DE7A49]/10'
  },
  forest: { 
    gradient: 'from-[#8BAB70] to-[#4C3322]', 
    accent: 'text-[#8BAB70]', 
    button: 'bg-[#8BAB70] hover:bg-[#4C3322] text-[#FAF7F2]',
    ring: 'ring-[#8BAB70]',
    lightBg: 'bg-[#FAF7F2] border border-[#8BAB70]/10'
  },
  berry: { 
    gradient: 'from-[#DE7A49] to-[#8BAB70]', 
    accent: 'text-[#DE7A49]', 
    button: 'bg-[#DE7A49] hover:bg-[#8BAB70] text-[#FAF7F2]',
    ring: 'ring-[#DE7A49]',
    lightBg: 'bg-[#FAF7F2] border border-[#DE7A49]/10'
  },
  midnight: { 
    gradient: 'from-[#4C3322] to-[#2E1F14]', 
    accent: 'text-[#4C3322]', 
    button: 'bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2]',
    ring: 'ring-[#4C3322]',
    lightBg: 'bg-[#FAF7F2] border border-[#4C3322]/10'
  },
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, currentUser, className }) => {
  const context = useContext(AppContext);
  const sendFriendRequest = context?.sendFriendRequest;
  const declineFriendRequest = context?.declineFriendRequest;
  const acceptFriendRequest = context?.acceptFriendRequest;
  const startDirectMessage = context?.startDirectMessage;
  const unfriend = context?.unfriend;
  const updateUserProfile = context?.updateUserProfile;
  const friendRequests = context?.friendRequests || [];
  const allUsers = context?.allUsers || [];
  const navigate = useNavigate();

  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [isAvatarZoomed, setIsAvatarZoomed] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const isViewingSelf = currentUser?.id === user.id;

  // Theme Resolution
  const themeKey = (user.theme && PROFILE_THEMES[user.theme]) ? user.theme : 'default';
  const currentTheme = PROFILE_THEMES[themeKey];

  // Relationship Status Logic
  const isFriends = currentUser?.friends?.includes(user.id) || false;
  const outgoingRequest = currentUser 
    ? friendRequests.find(req => req.senderId === currentUser.id && req.receiverId === user.id && req.status === 'pending')
    : undefined;
  const incomingRequest = currentUser
    ? friendRequests.find(req => req.receiverId === currentUser.id && req.senderId === user.id && req.status === 'pending')
    : undefined;

  // Calculate Mutual Friends
  const mutualFriendIds = !isViewingSelf && currentUser
    ? currentUser.friends.filter(friendId => user.friends.includes(friendId))
    : [];
  
  const mutualFriends = mutualFriendIds.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];

  const handleCardClick = () => {
    setIsClicking(true);
    setTimeout(() => {
        navigate(`/users/${user.id}`);
    }, 300);
  };

  const handleThemeSelect = (key: string) => {
    if (currentUser && updateUserProfile) {
        updateUserProfile({ ...currentUser, theme: key }, { silent: true, skipRedirect: true });
        setIsThemePickerOpen(false);
    }
  };

  const handleSendRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sendFriendRequest && currentUser) {
      sendFriendRequest(user.id);
    }
  };

  const handleCancelRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (declineFriendRequest && outgoingRequest) {
        declineFriendRequest(outgoingRequest.id);
    }
  };

  const handleConfirmRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (acceptFriendRequest && incomingRequest) {
        acceptFriendRequest(incomingRequest.id);
    }
  };

  const handleUnfriend = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unfriend && currentUser) {
      if (window.confirm(`Are you sure you want to remove ${user.name} as a companion friend?`)) {
        unfriend(user.id);
      }
    }
  };

  const handleEditProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/edit-profile');
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (startDirectMessage && currentUser && user.id) {
        startDirectMessage(user.id);
    }
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAvatarZoomed(true);
  };

  const closeAvatarZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAvatarZoomed(false);
  };

  return (
    <>
      {isAvatarZoomed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#4C3322]/90 backdrop-blur-sm animate-fade-in cursor-default" onClick={closeAvatarZoom}>
            <img 
                src={user.avatar} 
                alt={user.name} 
                className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl animate-scale-up border-2 border-white" 
                onClick={(e) => e.stopPropagation()}
            />
            <button 
                onClick={closeAvatarZoom}
                className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition-colors cursor-pointer"
            >
                <i className="fas fa-times"></i>
            </button>
        </div>
      )}

      <div 
        className={`group relative bg-white rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col border border-[#4C3322]/10 h-full cursor-pointer 
        transform transition-all duration-300 ease-out select-none
        ${isClicking ? 'scale-95 opacity-90 ring-4 ring-[#8BAB70]/20' : 'hover:scale-[1.01] hover:shadow-md hover:-translate-y-0.5'}
        ${className || ''}`}
        onClick={handleCardClick}
      >
        
        {/* Decorative Banner with Theme Gradient */}
        <div className={`h-32 bg-gradient-to-br ${currentTheme.gradient} relative overflow-hidden flex-shrink-0`}>
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
           
           {/* Theme Picker Trigger */}
           {isViewingSelf && (
              <div className="absolute top-4 right-4 z-10">
                  <button 
                      onClick={(e) => { e.stopPropagation(); setIsThemePickerOpen(!isThemePickerOpen); }}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 flex items-center justify-center text-white transition-all shadow-sm ring-1 ring-white/30 cursor-pointer"
                      title="Customize Theme"
                  >
                     <i className="fas fa-palette text-xs"></i>
                  </button>
                  
                  {isThemePickerOpen && (
                      <div className="absolute top-10 right-0 bg-white p-3.5 rounded-2xl shadow-xl border border-[#4C3322]/10 w-48 animate-fade-in z-20" onClick={e => e.stopPropagation()}>
                          <p className="text-[9px] font-bold text-[#4C3322]/40 uppercase tracking-widest mb-2 px-1">Card Theme</p>
                          <div className="grid grid-cols-5 gap-2">
                              {Object.keys(PROFILE_THEMES).map(key => (
                                  <button
                                      key={key}
                                      onClick={() => handleThemeSelect(key)}
                                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${PROFILE_THEMES[key].gradient} shadow-sm hover:scale-110 transition-transform ring-2 ring-offset-1 cursor-pointer ${themeKey === key ? 'ring-[#4C3322]' : 'ring-transparent'}`}
                                      title={key.charAt(0).toUpperCase() + key.slice(1)}
                                  />
                              ))}
                          </div>
                      </div>
                  )}
              </div>
           )}
        </div>

        {/* Card Body - Centered Layout */}
        <div className="px-6 pb-6 flex-grow flex flex-col items-center relative z-10 -mt-16">
          
          {/* Avatar */}
          <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <div className="p-1 bg-white rounded-full shadow-md cursor-zoom-in border border-[#4C3322]/10" onClick={handleAvatarClick}>
                  <img
                      src={user.avatar}
                      alt={`${user.name}'s avatar`}
                      className="w-24 h-24 rounded-full object-cover"
                  />
              </div>
              {/* Friends Badge */}
              {isFriends && (
                 <div className="absolute bottom-1 right-0 bg-[#8BAB70] text-white w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm" title="Connected Buddy">
                    <i className="fas fa-check text-[10px]"></i>
                 </div>
              )}
          </div>

          {/* User Info */}
          <div className="text-center w-full mb-4">
              <h2 className="text-2xl font-serif font-black text-[#4C3322] leading-tight mb-1">
                  {user.name}
              </h2>
              {user.occupation && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8BAB70]">
                      {user.occupation}
                  </p>
              )}
              <p className="text-xs font-light text-[#4C3322]/70 line-clamp-2 mt-3 px-2 min-h-[2.5em] leading-relaxed">
                  {user.bio || 'Sharing the sanctuary wellness path.'}
              </p>
          </div>

          {/* Interests Pills */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
              {user.interests.slice(0, 3).map((interest, index) => (
              <span
                  key={index}
                  className={`px-3 py-1 ${currentTheme.lightBg} ${currentTheme.accent} text-[9px] font-bold uppercase tracking-wider rounded-full`}
              >
                  {interest}
              </span>
              ))}
              {user.interests.length > 3 && (
                  <span className="px-2 py-1 bg-[#FAF7F2] text-[#4C3322]/40 text-[9px] font-bold rounded-full">+{user.interests.length - 3}</span>
              )}
          </div>

          {/* Mutual Friends */}
          {!isViewingSelf && mutualFriends.length > 0 && (
              <div className="flex items-center gap-2 mb-6 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#4C3322]/5">
                  <div className="flex -space-x-1.5 overflow-hidden">
                      {mutualFriends.slice(0, 3).map(friend => (
                          <img 
                              key={friend.id} 
                              src={friend.avatar} 
                              alt={friend.name} 
                              className="inline-block h-4.5 w-4.5 rounded-full ring-2 ring-white object-cover"
                          />
                      ))}
                  </div>
                  <span className="text-[9px] text-[#4C3322]/50 font-bold uppercase tracking-widest">
                      {mutualFriends.length} Mutual
                  </span>
              </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-auto w-full pt-5 border-t border-[#4C3322]/10 grid grid-cols-2 gap-3 flex-shrink-0">
              {isViewingSelf ? (
                  <button
                      onClick={handleEditProfile}
                      className="col-span-2 w-full py-3.5 bg-[#FAF7F2] border border-[#4C3322]/15 hover:bg-[#4C3322] hover:text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-2xl transition-colors cursor-pointer"
                  >
                      Edit Profile Settings
                  </button>
              ) : (
                  <>
                      {/* Relationship Action */}
                      {isFriends ? (
                          <button
                              onClick={handleUnfriend}
                              className="py-3.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                              <i className="fas fa-user-minus"></i> Unlink
                          </button>
                      ) : outgoingRequest ? (
                          <button
                              onClick={handleCancelRequest}
                              className="py-3.5 bg-[#FAF7F2] border border-[#4C3322]/15 text-[#4C3322]/60 hover:bg-[#4C3322]/5 text-xs font-bold uppercase tracking-wider rounded-2xl transition-colors cursor-pointer"
                          >
                              Cancel
                          </button>
                      ) : incomingRequest ? (
                          <button
                              onClick={handleConfirmRequest}
                              className={`py-3.5 ${currentTheme.button} text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer`}
                          >
                              Confirm
                          </button>
                      ) : (
                          <button
                              onClick={handleSendRequest}
                              className={`py-3.5 ${currentTheme.button} text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5`}
                          >
                              <i className="fas fa-user-plus"></i> Link up
                          </button>
                      )}

                      {/* Message Button */}
                      <button
                          onClick={handleMessage}
                          className="py-3.5 bg-white border border-[#4C3322]/15 text-[#4C3322] hover:bg-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                          <i className="far fa-comment-alt"></i> Dialogue
                      </button>
                  </>
              )}
          </div>

        </div>
      </div>
    </>
  );
};
