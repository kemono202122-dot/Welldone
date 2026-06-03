import React from 'react';
import { TravelPlan } from '../types';

interface TravelPlanCardProps {
  travelPlan: TravelPlan;
  onViewDetails: (id: string) => void;
  onShare?: (plan: TravelPlan) => void;
}

export const TravelPlanCard: React.FC<TravelPlanCardProps> = ({ travelPlan, onViewDetails, onShare }) => {
  return (
    <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow transition-all duration-300 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden border-b border-[#4C3322]/5 select-none">
        <img
          src={travelPlan.image}
          alt={travelPlan.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-lg font-black text-[#4C3322] mb-2 leading-tight select-none">
          {travelPlan.name}
        </h3>
        <p className="text-xs font-light text-[#4C3322]/70 leading-relaxed mb-4 line-clamp-3">
          {travelPlan.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-4 select-none">
          {travelPlan.wellnessFocus.map((focus, index) => (
            <span
              key={index}
              className="bg-[#8BAB70]/10 border border-[#8BAB70]/20 text-[#8BAB70] text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            >
              {focus}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold text-[#4C3322]/50 mb-6 mt-auto border-t border-[#4C3322]/5 pt-4 select-none">
          <span className="flex items-center gap-1.5">
            <i className="fas fa-map-marker-alt text-[#8BAB70]"></i>
            {travelPlan.location}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fas fa-calendar-alt text-[#8BAB70]"></i>
            {travelPlan.dates}
          </span>
        </div>

        <div className="flex gap-2.5 select-none">
          <button
            onClick={() => onViewDetails(travelPlan.id)}
            className="flex-grow bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow transition-colors cursor-pointer"
          >
            View Details
          </button>
          {onShare && (
            <button
              onClick={() => onShare(travelPlan)}
              className="bg-white border border-[#4C3322]/15 hover:bg-[#4C3322]/5 text-[#4C3322] px-4 py-3 rounded-2xl transition-colors cursor-pointer text-xs"
              aria-label="Share Travel Plan"
            >
              <i className="fas fa-share-alt"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
