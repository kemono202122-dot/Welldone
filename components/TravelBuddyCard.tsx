import React, { useContext } from 'react';
import { SuggestedTravelBuddy, User, FriendRequest } from '../types';
import { AppContext } from '../App';

interface TravelBuddyCardProps {
  buddy: SuggestedTravelBuddy;
  currentUser: User | null;
  allUsers: User[]; 
  friendRequests: FriendRequest[];
  onSendFriendRequest: (receiverId: string) => void;
  onViewProfile: (userId: string) => void;
}

export const TravelBuddyCard: React.FC<TravelBuddyCardProps> = ({
  buddy,
  currentUser,
  allUsers,
  friendRequests,
  onSendFriendRequest,
  onViewProfile,
}) => {
  const context = useContext(AppContext);
  const startDirectMessage = context?.startDirectMessage;

  const realUser = allUsers.find(u => u.id === buddy.id);

  const isFriends = currentUser && realUser?.friends?.includes(currentUser.id) || false;
  const hasSentRequest = currentUser && realUser
    ? friendRequests.some(
        (req) => (req.senderId === currentUser.id && req.receiverId === realUser.id && req.status === 'pending') ||
                 (req.senderId === realUser.id && req.receiverId === currentUser.id && req.status === 'pending')
      )
    : false;
  
  const handleSendRequest = () => {
    if (realUser) {
      onSendFriendRequest(realUser.id);
    }
  };

  const handleMessage = () => {
    if (realUser && startDirectMessage) {
        startDirectMessage(realUser.id);
    }
  };

  const getUserAvatar = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    return user ? user.avatar : `https://picsum.photos/100/100?random=${userId.charCodeAt(0)}`;
  };

  return (
    <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm hover:shadow transition-shadow duration-300 flex flex-col items-center text-center group h-full">
      
      {/* Match Score */}
      <div className="w-full flex justify-end mb-2 select-none">
        <span className="text-[9px] font-bold bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70] px-2.5 py-1 rounded-full uppercase tracking-wider">
          {buddy.matchScore}% Match
        </span>
      </div>

      {/* Avatar frame */}
      <div className="relative mb-4">
        <img
          src={getUserAvatar(buddy.id)}
          alt={buddy.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-[#FAF7F2] shadow-md cursor-pointer hover:scale-105 transition-transform duration-500"
          onClick={() => onViewProfile(buddy.id)}
        />
        {isFriends && (
          <div className="absolute bottom-0 right-0 bg-[#8BAB70] text-[#FAF7F2] w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm text-[10px]">
            <i className="fas fa-check"></i>
          </div>
        )}
      </div>

      {/* Name details */}
      <div className="mb-4 w-full select-none">
        <h3 
          className="font-serif text-lg font-black text-[#4C3322] cursor-pointer hover:text-[#8BAB70] transition-colors truncate"
          onClick={() => onViewProfile(buddy.id)}
        >
          {buddy.name}
        </h3>
        <p className="text-[9px] font-bold text-[#8BAB70] uppercase tracking-wider mt-1 truncate">
          {realUser?.occupation || 'Traveler'}
        </p>
      </div>
      
      {/* Reason details */}
      <div className="bg-[#FAF7F2]/60 border border-[#4C3322]/5 p-4 rounded-3xl w-full mb-6 flex-grow flex items-center justify-center shadow-inner">
        <p className="text-[#4C3322]/80 text-xs italic leading-relaxed line-clamp-3 font-light">
          "{buddy.reason}"
        </p>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 w-full mt-auto select-none">
        <button
          onClick={handleMessage}
          className="flex items-center justify-center gap-2 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow transition-colors cursor-pointer"
          title="Send Direct Message"
        >
          <i className="far fa-comment-alt text-[10px]"></i> Chat
        </button>

        {isFriends ? (
          <button disabled className="bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70] py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-default opacity-80">
            <i className="fas fa-check text-[10px]"></i> Friends
          </button>
        ) : hasSentRequest ? (
          <button disabled className="bg-[#DE7A49]/10 border border-[#DE7A49]/20 text-[#DE7A49] py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-default opacity-80">
            <i className="fas fa-clock text-[10px]"></i> Pending
          </button>
        ) : (
          <button
            onClick={handleSendRequest}
            className="bg-white border border-[#4C3322]/15 hover:bg-[#4C3322]/5 text-[#4C3322] py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <i className="fas fa-user-plus text-[10px]"></i> Connect
          </button>
        )}
      </div>
    </div>
  );
};
