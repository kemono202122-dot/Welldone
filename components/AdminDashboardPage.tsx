import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { User, Listing, WellnessBanner } from '../types';
import { MARKETPLACE_CATEGORIES } from '../constants';

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4C3322]/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
                <div className="p-5 border-b border-[#4C3322]/10 flex justify-between items-center bg-[#FAF7F2]">
                    <h3 className="font-serif font-black text-lg text-[#4C3322]">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#4C3322]/5 flex items-center justify-center text-[#4C3322]/50 hover:text-[#4C3322] transition-colors cursor-pointer">
                      <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar bg-white font-outfit text-[#4C3322]">{children}</div>
            </div>
        </div>
    );
};

export const AdminDashboardPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'banners' | 'bookings' | 'ads'>('overview');

  // Modal States
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!context) return null;
  const { 
      currentUser, allUsers, 
      listings, addListing, updateListing, deleteListing,
      allBookings, adCampaigns,
      wellnessBanners, setWellnessBanners, login
  } = context;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />
        
        <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-8 md:p-12 shadow-sm text-center max-w-md w-full z-10 relative">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-2xl">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-3xl font-serif font-black mb-4">Advisory Entrance Only</h2>
          <p className="text-[#4C3322]/70 mb-8 font-light text-sm">
            This section is restricted to Welldone Administrative Advisors. Use the button below to authorize administrative credentials.
          </p>
          <button 
            onClick={() => { 
                const admin = allUsers.find(u => u.role === 'admin') || allUsers[0]; 
                login({...admin, role: 'admin'}); 
            }} 
            className="w-full bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
          >
              Authorize Administrative Access
          </button>
        </div>
      </div>
    );
  }

  const handleSaveListing = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      const newListing: Listing = {
          id: editingListing ? editingListing.id : `l-${Date.now()}`,
          name: formData.get('name') as string,
          tagline: formData.get('tagline') as string,
          description: formData.get('description') as string,
          category: formData.get('category') as string,
          subCategory: formData.get('subCategory') as string,
          rating: editingListing?.rating || 4.5,
          reviewCount: editingListing?.reviewCount || 0,
          location: formData.get('location') as string,
          contact: formData.get('contact') as string,
          services: editingListing?.services || [], 
          features: (formData.get('features') as string).split(',').map(f => f.trim()),
          gallery: [formData.get('mainImage') as string || 'https://picsum.photos/800/600'],
          priceRange: formData.get('priceRange') as any,
          verified: formData.get('verified') === 'on',
          ownerId: editingListing?.ownerId || currentUser.id,
          socials: {
            website: formData.get('website') as string,
            instagram: formData.get('instagram') as string,
            whatsapp: formData.get('whatsapp') as string
          },
          team: editingListing?.team || [],
          reviews: editingListing?.reviews || [],
          openingHours: formData.get('openingHours') as string,
          seoTags: (formData.get('seoTags') as string).split(',').map(t => t.trim()),
          promoted: formData.get('promoted') === 'on'
      };

      if (editingListing) {
        updateListing(editingListing.id, newListing);
        triggerToast("Inventory item updated successfully!");
      } else {
        addListing(newListing);
        triggerToast("Inventory item published successfully!");
      }
      setIsListingModalOpen(false);
      setEditingListing(null);
  };

  const handleSaveBanner = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newBanner: WellnessBanner = {
          id: `wb-${Date.now()}`,
          mediaType: formData.get('mediaType') as any,
          mediaUrl: formData.get('mediaUrl') as string,
          title: formData.get('title') as string,
          subtitle: formData.get('subtitle') as string,
          actionUrl: formData.get('actionUrl') as string
      };
      setWellnessBanners(prev => [newBanner, ...prev]);
      setIsBannerModalOpen(false);
      triggerToast("Mindfulness banner published successfully!");
  };

  const ListingsTab = () => (
      <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                  <h3 className="text-2xl font-serif font-black text-[#4C3322]">Sanctuary Marketplace Inventory</h3>
                  <p className="text-[#4C3322]/60 text-xs mt-1 font-light">Curate authorized partner listings, wellness retreats, and expert workshops.</p>
              </div>
              <button 
                onClick={() => { setEditingListing(null); setIsListingModalOpen(true); }} 
                className="bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 self-start sm:self-center"
              >
                  <i className="fas fa-plus"></i> Add New Partner
              </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map(l => (
                  <div key={l.id} className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 flex gap-5 shadow-sm hover:shadow-md transition-all duration-300">
                      <img src={l.gallery[0]} className="w-24 h-24 rounded-2xl object-cover border border-[#4C3322]/10 flex-shrink-0" alt="" />
                      <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
                          <div>
                              <h4 className="font-bold text-[#4C3322] text-base truncate">{l.name}</h4>
                              <p className="text-[10px] font-bold text-[#8BAB70] uppercase tracking-wider mt-0.5">{l.category}</p>
                          </div>
                          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-[#4C3322]/5">
                              <div className="flex gap-3">
                                  <button onClick={() => { setEditingListing(l); setIsListingModalOpen(true); }} className="text-xs font-bold text-[#4C3322] hover:text-[#8BAB70] transition-colors cursor-pointer">Edit Details</button>
                                  <button onClick={() => { deleteListing(l.id); triggerToast("Listing removed"); }} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer">Remove</button>
                              </div>
                              <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full border ${l.verified ? 'bg-[#8BAB70]/10 border-[#8BAB70]/20 text-[#8BAB70]' : 'bg-[#4C3322]/5 border-transparent text-[#4C3322]/55'}`}>
                                {l.verified ? 'Verified' : 'Pending'}
                              </span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          <Modal isOpen={isListingModalOpen} onClose={() => setIsListingModalOpen(false)} title={editingListing ? "Edit Marketplace Partner Info" : "Create Marketplace Partner Entry"}>
              <form onSubmit={handleSaveListing} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-wider mb-2">Partner Name</label>
                          <input name="name" defaultValue={editingListing?.name} required className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm" />
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-wider mb-2">Category</label>
                          <select name="category" defaultValue={editingListing?.category} className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm cursor-pointer">{Object.keys(MARKETPLACE_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}</select>
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-wider mb-2">Tagline (One-line slogan)</label>
                      <input name="tagline" defaultValue={editingListing?.tagline} required className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm" />
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-wider mb-2">Full Bio Description</label>
                      <textarea name="description" defaultValue={editingListing?.description} rows={3} className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm resize-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-wider mb-2">Location details</label>
                          <input name="location" defaultValue={editingListing?.location} required className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm" />
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-wider mb-2">Contact Link / Number</label>
                          <input name="contact" defaultValue={editingListing?.contact} required className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm" />
                      </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-wider mb-2">Price Tier</label>
                          <select name="priceRange" defaultValue={editingListing?.priceRange} className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none text-sm cursor-pointer"><option>Economy</option><option>Standard</option><option>Premium</option></select>
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-wider mb-2">Website URL</label>
                          <input name="website" defaultValue={editingListing?.socials.website} className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none text-sm" />
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-wider mb-2">Main Graphic URL</label>
                          <input name="mainImage" defaultValue={editingListing?.gallery[0]} className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none text-sm" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-wider mb-2">SEO Search Tags (comma separated)</label>
                      <input name="seoTags" defaultValue={editingListing?.seoTags?.join(', ')} className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none text-sm" />
                  </div>
                  <div className="flex gap-6 items-center bg-[#FAF7F2] p-4.5 rounded-2xl border border-[#4C3322]/10">
                      <label className="flex items-center gap-2.5 cursor-pointer font-bold text-xs uppercase tracking-wider"><input type="checkbox" name="verified" defaultChecked={editingListing?.verified} className="accent-[#8BAB70] w-4 h-4" /> Verified Partner</label>
                      <label className="flex items-center gap-2.5 cursor-pointer font-bold text-xs uppercase tracking-wider"><input type="checkbox" name="promoted" defaultChecked={editingListing?.promoted} className="accent-[#8BAB70] w-4 h-4" /> Promote to Featured</label>
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-bold text-xs uppercase tracking-widest rounded-2xl shadow-md transition-colors cursor-pointer">Publish Partner Profile</button>
              </form>
          </Modal>
      </div>
  );

  const BannersTab = () => (
      <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                  <h3 className="text-2xl font-serif font-black text-[#4C3322]">Mindfulness Carousel Management</h3>
                  <p className="text-[#4C3322]/60 text-xs mt-1 font-light">Configure editorial quotes and full-width artwork sliders visible on the dashboard header.</p>
              </div>
              <button onClick={() => setIsBannerModalOpen(true)} className="bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer">
                  Add New Banner Slide
              </button>
          </div>
          <div className="space-y-4">
              {wellnessBanners.map(b => (
                  <div key={b.id} className="bg-white border border-[#4C3322]/10 rounded-[2rem] p-4.5 flex items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-5 min-w-0">
                          <div className="w-28 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-[#4C3322]/10">
                              {b.mediaType === 'video' ? <video src={b.mediaUrl} className="w-full h-full object-cover" /> : <img src={b.mediaUrl} className="w-full h-full object-cover" />}
                          </div>
                          <div className="min-w-0">
                              <h4 className="font-bold text-sm text-[#4C3322] truncate">{b.title}</h4>
                              <p className="text-[10px] text-[#4C3322]/50 font-light mt-0.5">{b.mediaType === 'video' ? 'Autoplay Video' : 'Static Artwork Image'}</p>
                          </div>
                      </div>
                      <button onClick={() => { setWellnessBanners(prev => prev.filter(x => x.id !== b.id)); triggerToast("Banner removed"); }} className="w-10 h-10 rounded-full hover:bg-red-50 text-red-500 hover:text-red-700 flex items-center justify-center transition-colors cursor-pointer"><i className="fas fa-trash-alt"></i></button>
                  </div>
              ))}
          </div>

          <Modal isOpen={isBannerModalOpen} onClose={() => setIsBannerModalOpen(false)} title="Upload Mindfulness Cover Slide">
              <form onSubmit={handleSaveBanner} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#4C3322]/60 mb-2 uppercase tracking-wider">Media Format</label>
                        <select name="mediaType" className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none text-sm cursor-pointer"><option value="image">Static Artwork Image</option><option value="video">Background Video</option></select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#4C3322]/60 mb-2 uppercase tracking-wider">Resource Media URL</label>
                        <input name="mediaUrl" required className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none text-sm" />
                      </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#4C3322]/60 mb-2 uppercase tracking-wider">Cover Title Header</label>
                    <input name="title" required className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#4C3322]/60 mb-2 uppercase tracking-wider">Subtitle / Quote Text</label>
                    <input name="subtitle" required className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none text-sm" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-bold text-xs uppercase tracking-widest rounded-2xl shadow-md transition-colors cursor-pointer">Launch Carousel Slide</button>
              </form>
          </Modal>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit pb-24 pt-6 md:pt-10 px-4 md:px-8 relative overflow-hidden select-none">
      
      {/* Background decoration blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* Floating success toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4C3322] text-[#FAF7F2] px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-[#FAF7F2]/10 text-sm font-semibold">
          <i className="fas fa-check-circle text-[#8BAB70]"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-[1500px] mx-auto relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Dashboard Control Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-md border border-[#4C3322]/10 rounded-[2.5rem] p-4 shadow-sm w-full space-y-4">
              
              {/* Header Title block */}
              <div className="p-5 bg-[#4C3322] text-[#FAF7F2] rounded-[1.8rem] text-center select-none shadow-sm relative overflow-hidden">
                  <div className="absolute top-[-50%] right-[-50%] w-[120px] h-[120px] rounded-full bg-[#8BAB70]/20 blur-xl"></div>
                  <h2 className="font-serif font-black text-xl tracking-tight leading-none">Cereen Desk</h2>
                  <p className="text-[9px] uppercase tracking-widest text-[#FAF7F2]/65 font-bold mt-1.5">Administrative Panel</p>
              </div>

              {/* Navigation list */}
              <nav className="flex flex-col gap-1">
                <SidebarItem id="overview" label="Sanctuary Overview" icon="fas fa-chart-pie" />
                <SidebarItem id="listings" label="Marketplace Inventory" icon="fas fa-store" />
                <SidebarItem id="banners" label="Mindfulness Carousel" icon="fas fa-play-circle" />
                <SidebarItem id="bookings" label="Partner Reservations" icon="fas fa-calendar-check" />
              </nav>

              <div className="pt-4 border-t border-[#4C3322]/10 px-2">
                  <button onClick={() => navigate('/dashboard')} className="w-full py-3.5 border border-[#4C3322]/20 hover:bg-[#4C3322]/5 text-[#4C3322] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                      <i className="fas fa-sign-out-alt text-[#DE7A49]"></i> Exit to Dashboard
                  </button>
              </div>
            </div>
          </div>

          {/* Active Worksite Console */}
          <div className="flex-grow w-full bg-white/90 backdrop-blur-md border border-[#4C3322]/10 rounded-[2.5rem] p-8 shadow-sm min-h-[550px]">
              {activeTab === 'overview' && (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-center py-10 max-w-lg mx-auto">
                      <div className="w-16 h-16 bg-[#8BAB70]/10 rounded-full flex items-center justify-center mb-6 text-[#8BAB70] text-2xl"><i className="fas fa-user-shield"></i></div>
                      <h2 className="text-3xl font-serif font-black text-[#4C3322] leading-tight">Welcome back, Admin Advisor</h2>
                      <p className="text-sm text-[#4C3322]/60 mt-3 font-light leading-relaxed">
                        Curate the partner catalog network, maintain hero banners, verify wellness events, and review member reservation logs.
                      </p>
                  </div>
              )}
              
              {activeTab === 'listings' && <ListingsTab />}
              
              {activeTab === 'banners' && <BannersTab />}
              
              {activeTab === 'bookings' && (
                   <div className="space-y-6 animate-fade-in">
                      <div>
                          <h3 className="text-2xl font-serif font-black text-[#4C3322]">Partner Reservations log</h3>
                          <p className="text-[#4C3322]/60 text-xs mt-1 font-light font-outfit">Real-time log of retreats and workshop bookings initiated by sanctuary members.</p>
                      </div>
                      
                      <div className="overflow-x-auto rounded-[2rem] border border-[#4C3322]/10 bg-white">
                          <table className="w-full text-left border-collapse">
                              <thead>
                                  <tr className="bg-[#FAF7F2] border-b border-[#4C3322]/10 text-[#4C3322] font-serif font-bold text-xs">
                                      <th className="p-5 pl-7">Booking ID</th>
                                      <th className="p-5">Sanctuary Member</th>
                                      <th className="p-5">Service / Retreat</th>
                                      <th className="p-5">Wellness Provider</th>
                                      <th className="p-5 pr-7">Status</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-[#4C3322]/5">
                                  {allBookings.map(b => (
                                      <tr key={b.id} className="text-xs hover:bg-[#FAF7F2]/40 transition-colors">
                                          <td className="p-5 pl-7 font-mono text-[10px] text-[#4C3322]/50">{b.id}</td>
                                          <td className="p-5 font-bold">{b.userName}</td>
                                          <td className="p-5 font-light">{b.serviceName}</td>
                                          <td className="p-5 font-light">{b.providerName}</td>
                                          <td className="p-5 pr-7">
                                            <span className="px-3 py-1 rounded-full bg-[#DE7A49]/10 border border-[#DE7A49]/20 text-[#DE7A49] font-bold text-[9px] uppercase tracking-wider">
                                              {b.status}
                                            </span>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                   </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
  
  function SidebarItem({ id, label, icon }: { id: any, label: string, icon: string }) {
      const isActive = activeTab === id;
      return (
          <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-4 px-5 py-4 transition-all duration-300 rounded-2xl cursor-pointer ${
                isActive 
                ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm font-bold' 
                : 'text-[#4C3322]/70 hover:bg-[#4C3322]/5 hover:text-[#4C3322]'
            }`}
          >
              <i className={`${icon} text-base w-5 text-center ${isActive ? 'text-[#8BAB70]' : 'text-[#4C3322]/40'}`}></i>
              <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
          </button>
      );
  }
};
