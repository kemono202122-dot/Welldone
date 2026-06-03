import React from 'react';
import { SuggestedDatingMatch, User } from '../types';

interface DatingMatchCardProps {
  match: SuggestedDatingMatch;
  currentUser: User | null;
  allUsers: User[];
  onViewProfile: (userId: string) => void;
  onSendRequest: (userId: string) => void;
}

export const DatingMatchCard: React.FC<DatingMatchCardProps> = ({
  match,
  allUsers,
  onViewProfile,
  onSendRequest
}) => {
  const realUser = allUsers.find(u => u.id === match.id);

  // Helper for color coding the match score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#8BAB70]';
    if (score >= 75) return 'text-[#DE7A49]';
    return 'text-[#4C3322]';
  };

  return (
    <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm hover:shadow transition-all duration-300 flex flex-col relative overflow-hidden group select-none">
      
      {/* Visual Match Gradient Top */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8BAB70] to-[#DE7A49]"></div>

      <div className="flex flex-col items-center mb-4 pt-4">
        <div className="relative mb-4">
          <img 
            src={realUser?.avatar || 'https://picsum.photos/100/100?random=date'} 
            alt={match.name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-[#FAF7F2] shadow-md cursor-pointer hover:scale-105 transition-transform duration-500"
            onClick={() => onViewProfile(match.id)}
          />
          <div className="absolute -bottom-2 -right-2 bg-[#FAF7F2] px-2.5 py-1 rounded-full shadow-sm border border-[#4C3322]/10 flex items-center gap-1">
            <i className={`fas fa-leaf text-xs ${getScoreColor(match.compatibilityScore)}`}></i>
            <span className={`font-bold text-xs ${getScoreColor(match.compatibilityScore)}`}>{match.compatibilityScore}%</span>
          </div>
        </div>
        
        <h3 
          className="font-serif text-lg font-black text-[#4C3322] hover:text-[#8BAB70] transition-colors cursor-pointer text-center"
          onClick={() => onViewProfile(match.id)}
        >
          {match.name}
        </h3>
        <p className="text-[#8BAB70] text-[9px] font-bold uppercase tracking-wider">{realUser?.occupation || 'Wellness Companion'}</p>
      </div>

      <div className="bg-[#FAF7F2] border border-[#4C3322]/5 p-4 rounded-3xl mb-4 text-center">
        <p className="text-xs text-[#4C3322]/80 italic leading-relaxed">
          "{match.reason}"
        </p>
      </div>

      <div className="mb-6">
        <p className="text-[9px] font-bold text-[#4C3322]/40 uppercase tracking-widest text-center mb-2">AI Icebreaker</p>
        <div className="bg-white border border-dashed border-[#4C3322]/20 p-3.5 rounded-2xl text-center">
          <p className="text-xs text-[#4C3322]/80 italic">"{match.icebreaker}"</p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <button
          onClick={() => onSendRequest(match.id)}
          className="bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <i className="fas fa-user-plus text-[10px]"></i> Connect
        </button>
        <button
          onClick={() => onViewProfile(match.id)}
          className="bg-white border border-[#4C3322]/15 text-[#4C3322] hover:bg-[#4C3322]/5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
        >
          Profile
        </button>
      </div>
    </div>
  );
};
