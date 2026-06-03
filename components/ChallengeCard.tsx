import React from 'react';
import { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (challengeId: string) => void;
  isJoined: boolean;
  onClick?: () => void; // Prop for card click interaction
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin, isJoined, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer transform hover:-translate-y-1 group relative select-none"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={challenge.image}
          alt={challenge.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4C3322]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 left-4 text-[#FAF7F2] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            View Details
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-serif text-lg font-black text-[#4C3322] leading-snug group-hover:text-[#8BAB70] transition-colors line-clamp-2">
            {challenge.name}
          </h3>
          {isJoined && (
            <span className="bg-[#8BAB70]/15 text-[#8BAB70] border border-[#8BAB70]/20 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
              Joined
            </span>
          )}
        </div>
        
        <p className="text-[#4C3322]/70 text-xs font-light mb-6 line-clamp-2 leading-relaxed">
          {challenge.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4 text-[10px] font-bold uppercase tracking-wider text-[#4C3322]/50">
            <span className="flex items-center gap-1.5 text-[#8BAB70]">
              <i className="fas fa-trophy text-xs"></i> {challenge.reward}
            </span>
            <span className="flex items-center gap-1.5 text-[#4C3322]/50">
              <i className="fas fa-users text-xs"></i> {challenge.participants.length} Joined
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the modal when clicking the button
              if (!isJoined) onJoin(challenge.id);
            }}
            className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm ${
              isJoined 
                ? 'bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70] cursor-default' 
                : 'bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] hover:shadow'
            }`}
            disabled={isJoined}
          >
            {isJoined ? 'Active Challenge' : 'Join Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
