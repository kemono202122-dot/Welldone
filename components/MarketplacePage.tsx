import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Listing, ServiceItem } from '../types';
import { MARKETPLACE_CATEGORIES } from '../constants';

export const MarketplacePage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [budgetFilter, setBudgetFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // --- Selected Listing & Overlay Toggles ---
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // --- Custom Booking Modal State ---
  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:00');

  // --- Notification Toast State ---
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!context) return null;
  const { currentUser, listings, addBooking } = context;

  // Security Redirect: Return user if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Handle Custom Booking Submission
  const handleBookingConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingService || !selectedListing) return;

    if (addBooking) {
      addBooking({
        id: `bk-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        serviceName: bookingService.name,
        providerName: selectedListing.name,
        date: bookingDate,
        time: bookingTime,
        status: 'pending',
        image: bookingService.image,
        price: bookingService.price
      });

      triggerToast(`Booking requested for ${bookingService.name}!`);
      setBookingService(null);
    }
  };

  // Filter Algorithm
  const filteredListings = listings.filter(l => {
    const matchQuery = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       l.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       l.seoTags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = activeCategory === 'All' || l.category === activeCategory;
    const matchLoc = locationFilter === 'All' || l.location.includes(locationFilter);
    const matchBudget = budgetFilter === 'All' || l.priceRange === budgetFilter;
    const matchTag = tagFilter === 'All' || l.seoTags?.includes(tagFilter);
    return matchQuery && matchCat && matchLoc && matchBudget && matchTag;
  });

  const allLocations = Array.from(new Set(listings.map(l => l.location.split(',').pop()?.trim() || ''))).filter(Boolean);
  const allTags = Array.from(new Set(listings.flatMap(l => l.seoTags || []))).sort();

  // Full-Screen Booklet Overlay for Verified Business Listings
  const ListingOverlay = () => {
    if (!selectedListing) return null;
    return (
      <div className="fixed inset-0 z-[100] bg-[#FAF7F2] overflow-y-auto animate-fade-in flex flex-col selection:bg-[#8BAB70] selection:text-white font-outfit text-[#4C3322]">
        
        {/* Background blurs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

        {/* Microsite Hero Header */}
        <div className="relative h-[380px] md:h-[450px] w-full">
          <img src={selectedListing.gallery[0]} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-transparent" />
          
          <button 
            onClick={() => setSelectedListing(null)} 
            className="absolute top-6 left-6 w-11 h-11 rounded-full bg-white/40 border border-white/20 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-all z-50 shadow-md cursor-pointer text-sm"
            title="Return to Marketplace"
          >
            <i className="fas fa-arrow-left"></i>
          </button>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="space-y-2">
                <span className="bg-[#8BAB70] text-[#FAF7F2] px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm">
                  Verified wellness Practitioner
                </span>
                <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight">{selectedListing.name}</h1>
                <p className="text-sm font-light text-[#4C3322]/80 leading-relaxed max-w-xl italic">"{selectedListing.tagline}"</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => triggerToast("Business profile link copied to library.")} 
                  className="w-10 h-10 rounded-full border border-[#4C3322]/15 bg-white/70 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-colors cursor-pointer text-xs"
                >
                  <i className="fas fa-share-alt"></i>
                </button>
                <button 
                  onClick={() => triggerToast("Added to bookmarked sanctuary catalogs.")} 
                  className="w-10 h-10 rounded-full border border-[#4C3322]/15 bg-white/70 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-colors cursor-pointer text-xs"
                >
                  <i className="far fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Details (2 Columns) */}
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 flex-grow z-10">
          
          {/* Main info panel (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            <section className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-black flex items-center gap-2"><i className="fas fa-info-circle text-xs text-[#8BAB70]"></i> Brand Overview</h3>
              <p className="text-sm text-[#4C3322]/85 font-light leading-relaxed whitespace-pre-wrap">{selectedListing.description}</p>
            </section>

            {/* Service Lists */}
            <section className="space-y-6">
              <h3 className="font-serif text-xl font-black flex items-center gap-2"><i className="fas fa-concierge-bell text-xs text-[#8BAB70]"></i> Vetted Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedListing.services.map(s => (
                  <div key={s.id} className="bg-white border border-[#4C3322]/10 p-5 rounded-[2.5rem] flex flex-col justify-between h-full shadow-sm hover:shadow transition-shadow">
                    <div>
                      <div className="h-40 rounded-3xl overflow-hidden mb-4 border border-[#4C3322]/5">
                        <img src={s.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <h4 className="font-bold text-sm leading-tight mb-1">{s.name}</h4>
                      <div className="flex gap-2 text-[9px] font-bold text-[#4C3322]/50 uppercase tracking-wide mb-3">
                        <span>{s.duration}</span>
                        <span>•</span>
                        <span className="text-[#8BAB70]">{s.price}</span>
                      </div>
                      <p className="text-xs text-[#4C3322]/70 font-light leading-relaxed mb-6">{s.description}</p>
                    </div>
                    
                    <button 
                      onClick={() => setBookingService(s)} 
                      className="w-full py-3 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-2xl font-bold text-xs tracking-wider uppercase shadow transition-all cursor-pointer"
                    >
                      Reserve Now
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Image Gallery */}
            <section className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-black flex items-center gap-2"><i className="fas fa-images text-xs text-[#8BAB70]"></i> Gallery Portfolio</h3>
              <div className="grid grid-cols-3 gap-4">
                {selectedListing.gallery.map((img, i) => (
                  <img key={i} src={img} className="rounded-2xl h-36 w-full object-cover border border-[#4C3322]/5 shadow-sm" alt="" />
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm space-y-6">
              <h4 className="font-serif text-lg font-black text-[#4C3322] border-b border-[#4C3322]/5 pb-3">Contact Details</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 text-xs">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#4C3322]/5 flex items-center justify-center text-[#4C3322]"><i className="fas fa-phone"></i></div>
                  <span className="font-semibold text-[#4C3322]">{selectedListing.contact}</span>
                </div>
                <div className="flex items-center gap-3.5 text-xs">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#4C3322]/5 flex items-center justify-center text-[#4C3322]"><i className="fas fa-clock"></i></div>
                  <span className="font-semibold text-[#4C3322]">{selectedListing.openingHours || 'Open: 9 AM - 8 PM'}</span>
                </div>
                <div className="flex items-center gap-3.5 text-xs">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#4C3322]/5 flex items-center justify-center text-[#4C3322]"><i className="fas fa-globe"></i></div>
                  <a 
                    href={selectedListing.socials.website || "#"} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="font-bold text-[#8BAB70] hover:underline"
                  >
                    Official Website
                  </a>
                </div>
              </div>
              <div className="flex gap-2.5 border-t border-[#4C3322]/5 pt-6">
                {selectedListing.socials.instagram && (
                  <button className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#4C3322]/10 hover:bg-[#8BAB70] hover:text-[#FAF7F2] flex items-center justify-center text-xs transition-colors"><i className="fab fa-instagram"></i></button>
                )}
                {selectedListing.socials.whatsapp && (
                  <button className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#4C3322]/10 hover:bg-[#8BAB70] hover:text-[#FAF7F2] flex items-center justify-center text-xs transition-colors"><i className="fab fa-whatsapp"></i></button>
                )}
                {selectedListing.socials.facebook && (
                  <button className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#4C3322]/10 hover:bg-[#8BAB70] hover:text-[#FAF7F2] flex items-center justify-center text-xs transition-colors"><i className="fab fa-facebook-f"></i></button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Microsite Footer */}
        <footer className="bg-white border-t border-[#4C3322]/10 py-12 z-10 select-none">
          <div className="max-w-7xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 space-y-3">
              <h4 className="font-serif text-xl font-black text-[#4C3322]">{selectedListing.name}</h4>
              <p className="text-xs text-[#4C3322]/60 font-light leading-relaxed max-w-sm">
                Redefining health and happiness through conscious living and professional guidance. Partnering with Welldone to log daily alignments.
              </p>
            </div>
            <div className="space-y-4">
              <h5 className="font-serif text-xs font-black uppercase tracking-wider text-[#4C3322]/40">Links</h5>
              <ul className="space-y-2 text-xs font-semibold text-[#4C3322]/70">
                <li className="hover:text-[#8BAB70] transition-colors cursor-pointer">Sanctuary Details</li>
                <li className="hover:text-[#8BAB70] transition-colors cursor-pointer">Services Catalog</li>
                <li className="hover:text-[#8BAB70] transition-colors cursor-pointer">Privacy Guidelines</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-serif text-xs font-black uppercase tracking-wider text-[#4C3322]/40">Brand Keywords</h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedListing.seoTags?.map(tag => (
                  <span key={tag} className="text-[9px] font-bold text-[#4C3322]/50 bg-[#FAF7F2] border border-[#4C3322]/10 px-2 py-0.5 rounded">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="max-w-7xl w-full mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-[#4C3322]/5 text-center">
            <p className="text-[10px] font-bold uppercase text-[#4C3322]/30 tracking-widest">&copy; 2026 {selectedListing.name} x Welldone Sanctuary. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden select-none selection:bg-[#8BAB70] selection:text-white">
      <ListingOverlay />
      
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
      <div className="max-w-7xl w-full mx-auto space-y-8 flex-grow z-10 animate-fade-in">
        
        {/* Banner Title */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.25em] font-bold text-[#8BAB70] uppercase">vetted catalog</span>
          <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-[#4C3322]">The Marketplace.</h2>
          <p className="text-sm font-light text-[#4C3322]/70 max-w-xl">
            Discover verified local practices, therapeutic massage centers, meal planners, and custom coaching catalogs.
          </p>
        </div>

        {/* Advanced Filters Block */}
        <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-6 items-end">
          <div className="sm:col-span-1 space-y-2">
            <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Search Listings</label>
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#4C3322]/30 text-xs"></i>
              <input 
                type="text" 
                placeholder="Search name or tags..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2]/60 border border-[#4C3322]/10 focus:outline-none focus:border-[#8BAB70] focus:bg-white transition-all rounded-full text-xs text-[#4C3322]" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Location</label>
            <select 
              value={locationFilter} 
              onChange={e => setLocationFilter(e.target.value)} 
              className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-full px-4 py-3 text-xs focus:outline-none focus:border-[#8BAB70] focus:bg-white text-[#4C3322] cursor-pointer appearance-none font-bold"
            >
              <option value="All">Global</option>
              {allLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Price Tier</label>
            <select 
              value={budgetFilter} 
              onChange={e => setBudgetFilter(e.target.value)} 
              className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-full px-4 py-3 text-xs focus:outline-none focus:border-[#8BAB70] focus:bg-white text-[#4C3322] cursor-pointer appearance-none font-bold"
            >
              <option value="All">All Tiers</option>
              <option value="Economy">Economy</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Seo Tag</label>
            <select 
              value={tagFilter} 
              onChange={e => setTagFilter(e.target.value)} 
              className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-full px-4 py-3 text-xs focus:outline-none focus:border-[#8BAB70] focus:bg-white text-[#4C3322] cursor-pointer appearance-none font-bold"
            >
              <option value="All">All Tags</option>
              {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="overflow-x-auto no-scrollbar pb-2 select-none border-b border-[#4C3322]/5">
          <div className="flex gap-2 whitespace-nowrap">
            <button 
              onClick={() => setActiveCategory('All')} 
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeCategory === 'All' ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm' : 'bg-white border border-[#4C3322]/10 text-[#4C3322]/60 hover:bg-[#4C3322]/5'}`}
            >
              All Categories
            </button>
            {Object.keys(MARKETPLACE_CATEGORIES).map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeCategory === cat ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm' : 'bg-white border border-[#4C3322]/10 text-[#4C3322]/60 hover:bg-[#4C3322]/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Listing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white border border-[#4C3322]/10 rounded-[2.5rem] shadow-sm select-none">
              <p className="text-sm text-[#4C3322]/50 font-bold uppercase tracking-widest">No wellness brands found matching these filters.</p>
            </div>
          ) : (
            filteredListings.map(listing => (
              <div 
                key={listing.id} 
                onClick={() => setSelectedListing(listing)} 
                className="group bg-white border border-[#4C3322]/10 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden border-b border-[#4C3322]/5 select-none">
                  <img src={listing.gallery[0]} alt={listing.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-[#4C3322]/10 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-[#4C3322] uppercase tracking-wide">
                    {listing.category}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end text-white">
                    <h3 className="font-serif text-lg font-black leading-tight drop-shadow-sm">{listing.name}</h3>
                    <p className="text-[10px] opacity-90 flex items-center gap-1.5 font-light mt-0.5">
                      <i className="fas fa-map-marker-alt"></i> {listing.location}
                    </p>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <p className="text-xs text-[#4C3322]/70 font-light leading-relaxed line-clamp-2 italic">
                    "{listing.tagline}"
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-[#4C3322]/5 mt-4 text-[10px] font-bold">
                    <div className="flex items-center gap-1 text-[#DE7A49]">
                      <i className="fas fa-star text-[9px]"></i> {listing.rating}
                    </div>
                    <span className={`px-2 py-0.5 rounded border ${listing.priceRange === 'Premium' ? 'bg-[#DE7A49]/10 border-[#DE7A49]/20 text-[#DE7A49]' : 'bg-[#8BAB70]/10 border-[#8BAB70]/20 text-[#8BAB70]'} uppercase tracking-wider`}>
                      {listing.priceRange}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* CUSTOM BOOKING POPUP MODAL */}
      {bookingService && selectedListing && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fade-in text-[#4C3322] font-outfit">
          <div className="bg-[#FAF7F2] border border-[#4C3322]/10 rounded-[2.5rem] w-full max-w-md p-6 md:p-8 shadow-2xl relative animate-fade-in-up">
            
            <button 
              onClick={() => setBookingService(null)} 
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-all cursor-pointer"
            >
              <i className="fas fa-times text-xs"></i>
            </button>

            <form onSubmit={handleBookingConfirm} className="space-y-6">
              <div className="space-y-1.5 text-center border-b border-[#4C3322]/5 pb-4">
                <span className="text-[9px] font-bold text-[#8BAB70] uppercase tracking-wider">Sanctuary Booking</span>
                <h4 className="font-serif text-xl font-black">{bookingService.name}</h4>
                <p className="text-[10px] font-bold text-[#4C3322]/50 tracking-wide uppercase">
                  {selectedListing.name} • {bookingService.price}
                </p>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Reservation Date</label>
                <input 
                  type="date" 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full bg-white border border-[#4C3322]/15 rounded-full px-5 py-3 focus:outline-none focus:border-[#8BAB70] text-sm text-[#4C3322] font-bold"
                />
              </div>

              {/* Time Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider uppercase ml-1 block">Preferred Time Slot</label>
                <input 
                  type="time" 
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  required
                  className="w-full bg-white border border-[#4C3322]/15 rounded-full px-5 py-3 focus:outline-none focus:border-[#8BAB70] text-sm text-[#4C3322] font-bold"
                />
              </div>

              <div className="flex gap-3 pt-2 select-none">
                <button
                  type="submit"
                  className="flex-grow py-3.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all cursor-pointer"
                >
                  Request Reservation
                </button>
                <button
                  type="button"
                  onClick={() => setBookingService(null)}
                  className="flex-grow py-3.5 border border-[#4C3322]/10 bg-white hover:bg-[#4C3322]/5 text-[#4C3322] rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast popup */}
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
