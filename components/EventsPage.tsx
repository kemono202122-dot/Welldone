import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Event } from '../types';
import { mockEvents } from '../constants';
import { useNavigate } from 'react-router-dom';

type TabType = 'upcoming' | 'attending' | 'past';

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString('en-US', { weekday: 'short' }),
    date: d.getDate(),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    year: d.getFullYear(),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    isPast: d < new Date(),
  };
};

export const EventsPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const currentUser = context?.currentUser;

  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [search, setSearch] = useState('');
  const [attendingEvents, setAttendingEvents] = useState<string[]>(
    mockEvents.filter(e => currentUser && e.attendees.includes(currentUser.id)).map(e => e.id)
  );
  const [toast, setToast] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRSVP = (event: Event) => {
    if (!currentUser) { navigate('/login'); return; }
    if (attendingEvents.includes(event.id)) {
      setAttendingEvents(prev => prev.filter(id => id !== event.id));
      triggerToast(`Cancelled RSVP for "${event.name}"`);
    } else {
      setAttendingEvents(prev => [...prev, event.id]);
      triggerToast(`🎉 RSVP confirmed for "${event.name}"!`);
    }
  };

  const now = new Date();
  const upcomingAll = mockEvents.filter(e => new Date(e.date) >= now);
  const pastAll = mockEvents.filter(e => new Date(e.date) < now);

  const getFiltered = (list: Event[]) =>
    list.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
    );

  const tabData: Record<TabType, Event[]> = {
    upcoming: getFiltered(upcomingAll),
    attending: getFiltered(mockEvents.filter(e => attendingEvents.includes(e.id))),
    past: getFiltered(pastAll),
  };

  const featuredEvent = upcomingAll[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-outfit text-[#4C3322] pb-24 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4C3322] text-[#FAF7F2] px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold animate-fade-in border border-[#FAF7F2]/10">
          <i className="fas fa-check-circle text-[#8BAB70]"></i>
          <span>{toast}</span>
        </div>
      )}

      {/* Hero */}
      <div className="relative bg-[#4C3322] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, #DE7A49, transparent 60%), radial-gradient(circle at 80% 20%, #8BAB70, transparent 50%)'}} />
        <div className="max-w-6xl mx-auto px-6 py-14 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#DE7A49] mb-3 block">Sanctuary Events</span>
              <h1 className="text-5xl md:text-6xl font-serif font-black text-[#FAF7F2] leading-tight">Gather &<br />Grow Together</h1>
              <p className="text-[#FAF7F2]/60 mt-3 font-light text-sm max-w-md">Attend wellness events, retreats, and community gatherings. Every event is a doorway to connection and growth.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-serif font-black text-[#FAF7F2]">{upcomingAll.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#FAF7F2]/50 font-bold">Upcoming</p>
              </div>
              <div className="w-px h-10 bg-[#FAF7F2]/20" />
              <div className="text-center">
                <p className="text-3xl font-serif font-black text-[#DE7A49]">{attendingEvents.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#FAF7F2]/50 font-bold">Attending</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8 relative max-w-xl">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-[#FAF7F2]/40 text-sm"></i>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events by name or location..."
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-[#FAF7F2] placeholder-[#FAF7F2]/40 focus:outline-none focus:border-[#DE7A49]/60 font-outfit text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Featured Event */}
        {featuredEvent && activeTab === 'upcoming' && !search && (
          <div className="mt-8 mb-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#DE7A49] mb-4">✦ Featured Event</p>
            <FeaturedEventCard
              event={featuredEvent}
              isAttending={attendingEvents.includes(featuredEvent.id)}
              onRSVP={() => handleRSVP(featuredEvent)}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-white border border-[#4C3322]/10 rounded-2xl p-1.5 w-fit">
          {([
            { id: 'upcoming', label: 'Upcoming', icon: 'fa-calendar-alt', count: upcomingAll.length },
            { id: 'attending', label: 'Attending', icon: 'fa-star', count: attendingEvents.length },
            { id: 'past', label: 'Past Events', icon: 'fa-history', count: pastAll.length },
          ] as { id: TabType; label: string; icon: string; count: number }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm'
                  : 'text-[#4C3322]/60 hover:text-[#4C3322]'
              }`}
            >
              <i className={`fas ${tab.icon} text-[10px]`}></i>
              {tab.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#4C3322]/10 text-[#4C3322]/50'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {tabData[activeTab].length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tabData[activeTab].map(event => (
              <EventCard
                key={event.id}
                event={event}
                isAttending={attendingEvents.includes(event.id)}
                isExpanded={expandedEvent === event.id}
                onToggleExpand={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                onRSVP={() => handleRSVP(event)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#4C3322]/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#4C3322]/30 text-2xl">
              <i className="fas fa-calendar-times"></i>
            </div>
            <p className="text-[#4C3322]/50 font-light">
              {activeTab === 'attending' ? "You haven't RSVP'd to any events yet." : 'No events found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Featured Large Event Card ---
const FeaturedEventCard: React.FC<{ event: Event; isAttending: boolean; onRSVP: () => void }> = ({ event, isAttending, onRSVP }) => {
  const fmt = formatDate(event.date);
  return (
    <div className="relative rounded-[2.5rem] overflow-hidden h-72 md:h-80 group cursor-pointer shadow-md">
      <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#4C3322]/90 via-[#4C3322]/60 to-transparent" />
      <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold bg-[#DE7A49] text-white px-3 py-1 rounded-full uppercase tracking-wider">Featured</span>
              <span className="text-[#FAF7F2]/60 text-xs">{fmt.day}, {fmt.month} {fmt.date} · {fmt.time}</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif font-black text-[#FAF7F2] mb-2 leading-tight">{event.name}</h3>
            <p className="text-[#FAF7F2]/70 text-sm font-light line-clamp-2 mb-4">{event.description}</p>
            <div className="flex items-center gap-4 text-[#FAF7F2]/60 text-xs">
              <span className="flex items-center gap-1.5"><i className="fas fa-map-marker-alt text-[#DE7A49]"></i>{event.location}</span>
              <span className="flex items-center gap-1.5"><i className="fas fa-users text-[#8BAB70]"></i>{event.attendees.length} attending</span>
            </div>
          </div>
          <button
            onClick={onRSVP}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
              isAttending
                ? 'bg-[#8BAB70] text-white hover:bg-[#8BAB70]/80'
                : 'bg-[#FAF7F2] text-[#4C3322] hover:bg-[#DE7A49] hover:text-white'
            }`}
          >
            {isAttending ? <><i className="fas fa-check mr-1.5"></i>Attending</> : 'RSVP Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Event Card ---
const EventCard: React.FC<{
  event: Event;
  isAttending: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRSVP: () => void;
}> = ({ event, isAttending, isExpanded, onToggleExpand, onRSVP }) => {
  const fmt = formatDate(event.date);
  return (
    <div className={`bg-white border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col ${isAttending ? 'border-[#8BAB70]/30' : 'border-[#4C3322]/10'} ${fmt.isPast ? 'opacity-75' : ''}`}>
      {/* Image */}
      <div className="relative h-44 overflow-hidden cursor-pointer" onClick={onToggleExpand}>
        <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4C3322]/50 to-transparent" />
        {isAttending && (
          <div className="absolute top-3 right-3 bg-[#8BAB70] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <i className="fas fa-check text-[8px]"></i> Attending
          </div>
        )}
        {fmt.isPast && (
          <div className="absolute top-3 left-3 bg-[#4C3322]/70 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Past</div>
        )}
        {/* Date badge */}
        <div className="absolute bottom-3 left-4 bg-white/95 rounded-xl px-3 py-2 text-center shadow-sm">
          <p className="text-[9px] font-bold text-[#DE7A49] uppercase tracking-wider">{fmt.month}</p>
          <p className="text-xl font-serif font-black text-[#4C3322] leading-none">{fmt.date}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif font-bold text-lg text-[#4C3322] mb-1 leading-tight cursor-pointer hover:text-[#8BAB70] transition-colors" onClick={onToggleExpand}>
          {event.name}
        </h3>

        <div className="flex items-center gap-1.5 text-[#4C3322]/50 text-xs mb-3">
          <i className="fas fa-clock text-[10px]"></i>
          <span>{fmt.day} · {fmt.time}</span>
        </div>

        <p className={`text-xs text-[#4C3322]/60 font-light leading-relaxed mb-3 ${isExpanded ? '' : 'line-clamp-2'}`}>
          {event.description}
        </p>

        <div className="flex items-center gap-1.5 text-[#4C3322]/50 text-xs mb-4">
          <i className="fas fa-map-marker-alt text-[#DE7A49] text-[10px]"></i>
          <span>{event.location}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#4C3322]/50 text-xs mb-5">
          <i className="fas fa-users text-[#8BAB70] text-[10px]"></i>
          <span>{event.attendees.length} attending</span>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          {!fmt.isPast && (
            <button
              onClick={onRSVP}
              className={`flex-grow py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isAttending
                  ? 'border border-[#8BAB70] text-[#8BAB70] hover:bg-red-50 hover:text-red-500 hover:border-red-300'
                  : 'bg-[#4C3322] text-[#FAF7F2] hover:bg-[#DE7A49]'
              }`}
            >
              {isAttending ? 'Cancel RSVP' : 'RSVP'}
            </button>
          )}
          <button
            onClick={onToggleExpand}
            className="w-10 h-10 flex-shrink-0 rounded-xl border border-[#4C3322]/10 text-[#4C3322]/50 hover:bg-[#4C3322]/5 flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};
