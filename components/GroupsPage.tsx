import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Group } from '../types';
import { mockGroups } from '../constants';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Yoga', 'Meditation', 'Hiking', 'Cooking', 'Running', 'Mindfulness', 'Music', 'Healing'];

const categoryIcons: Record<string, string> = {
  All: 'fa-globe',
  Yoga: 'fa-spa',
  Meditation: 'fa-brain',
  Hiking: 'fa-mountain',
  Cooking: 'fa-utensils',
  Running: 'fa-running',
  Mindfulness: 'fa-leaf',
  Music: 'fa-music',
  Healing: 'fa-heart',
};

export const GroupsPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const currentUser = context?.currentUser;

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [joinedGroups, setJoinedGroups] = useState<string[]>(
    mockGroups.filter(g => currentUser && g.members.includes(currentUser.id)).map(g => g.id)
  );
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleJoinLeave = (group: Group) => {
    if (!currentUser) { navigate('/login'); return; }
    if (joinedGroups.includes(group.id)) {
      setJoinedGroups(prev => prev.filter(id => id !== group.id));
      triggerToast(`Left "${group.name}"`);
    } else {
      setJoinedGroups(prev => [...prev, group.id]);
      triggerToast(`Joined "${group.name}"! Welcome to the circle.`);
    }
  };

  const filtered = mockGroups.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || g.interests.some(i => i.toLowerCase().includes(activeCategory.toLowerCase()));
    return matchSearch && matchCat;
  });

  const myGroups = filtered.filter(g => joinedGroups.includes(g.id));
  const discoverGroups = filtered.filter(g => !joinedGroups.includes(g.id));

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-outfit text-[#4C3322] pb-24 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4C3322] text-[#FAF7F2] px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold animate-fade-in border border-[#FAF7F2]/10">
          <i className="fas fa-check-circle text-[#8BAB70]"></i>
          <span>{toast}</span>
        </div>
      )}

      {/* Hero */}
      <div className="relative bg-[#4C3322] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 70% 50%, #8BAB70, transparent 60%), radial-gradient(circle at 20% 80%, #DE7A49, transparent 50%)'}} />
        <div className="max-w-6xl mx-auto px-6 py-14 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8BAB70] mb-3 block">Sanctuary Circles</span>
              <h1 className="text-5xl md:text-6xl font-serif font-black text-[#FAF7F2] leading-tight">Find Your<br />Tribe</h1>
              <p className="text-[#FAF7F2]/60 mt-3 font-light text-sm max-w-md">Join wellness circles built around shared passions. From morning yoga to mindful hiking — your people are here.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-serif font-black text-[#FAF7F2]">{mockGroups.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#FAF7F2]/50 font-bold">Active Circles</p>
              </div>
              <div className="w-px h-10 bg-[#FAF7F2]/20" />
              <div className="text-center">
                <p className="text-3xl font-serif font-black text-[#8BAB70]">{joinedGroups.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#FAF7F2]/50 font-bold">Joined</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8 relative max-w-xl">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-[#4C3322]/40 text-sm"></i>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search circles by name or interest..."
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-[#FAF7F2] placeholder-[#FAF7F2]/40 focus:outline-none focus:border-[#8BAB70]/60 font-outfit text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm'
                  : 'bg-white border border-[#4C3322]/10 text-[#4C3322]/70 hover:border-[#4C3322]/30'
              }`}
            >
              <i className={`fas ${categoryIcons[cat] || 'fa-circle'} text-[10px]`}></i>
              {cat}
            </button>
          ))}
        </div>

        {/* My Groups */}
        {myGroups.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-serif font-bold text-[#4C3322]">My Circles</h2>
              <span className="bg-[#8BAB70]/15 text-[#8BAB70] text-[10px] font-bold px-3 py-1 rounded-full border border-[#8BAB70]/20 uppercase tracking-wider">{myGroups.length} Joined</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGroups.map(group => (
                <GroupCard key={group.id} group={group} isJoined={true} onJoinLeave={() => handleJoinLeave(group)} />
              ))}
            </div>
          </section>
        )}

        {/* Discover */}
        {discoverGroups.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-serif font-bold text-[#4C3322]">Discover Circles</h2>
              <span className="bg-[#DE7A49]/10 text-[#DE7A49] text-[10px] font-bold px-3 py-1 rounded-full border border-[#DE7A49]/20 uppercase tracking-wider">{discoverGroups.length} available</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoverGroups.map(group => (
                <GroupCard key={group.id} group={group} isJoined={false} onJoinLeave={() => handleJoinLeave(group)} />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#4C3322]/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#4C3322]/30 text-2xl">
              <i className="fas fa-users"></i>
            </div>
            <p className="text-[#4C3322]/50 font-light">No circles match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const GroupCard: React.FC<{ group: Group; isJoined: boolean; onJoinLeave: () => void }> = ({ group, isJoined, onJoinLeave }) => (
  <div className={`bg-white border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col ${isJoined ? 'border-[#8BAB70]/30' : 'border-[#4C3322]/10'}`}>
    {/* Image */}
    <div className="relative h-44 overflow-hidden">
      <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#4C3322]/60 via-transparent to-transparent" />
      {isJoined && (
        <div className="absolute top-3 right-3 bg-[#8BAB70] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
          <i className="fas fa-check text-[8px]"></i> Joined
        </div>
      )}
      <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white text-xs font-bold">
        <i className="fas fa-users text-[10px] opacity-70"></i>
        <span>{group.members.length} members</span>
      </div>
    </div>

    {/* Content */}
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="font-serif font-bold text-lg text-[#4C3322] mb-2 leading-tight">{group.name}</h3>
      <p className="text-xs text-[#4C3322]/60 font-light leading-relaxed mb-4 flex-grow line-clamp-3">{group.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {group.interests.map(tag => (
          <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-[#8BAB70]/10 text-[#8BAB70] font-bold border border-[#8BAB70]/20 uppercase tracking-wider">
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={onJoinLeave}
        className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
          isJoined
            ? 'border border-[#4C3322]/20 text-[#4C3322] hover:bg-red-50 hover:text-red-600 hover:border-red-300'
            : 'bg-[#4C3322] text-[#FAF7F2] hover:bg-[#8BAB70]'
        }`}
      >
        {isJoined ? 'Leave Circle' : 'Join Circle'}
      </button>
    </div>
  </div>
);
