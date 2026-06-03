import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { COUNTRIES, CITIES_BY_COUNTRY, LANGUAGES, RELIGIONS, POLITICAL_VIEWS, PHILOSOPHIES, CURRENCIES } from '../constants';

export const EditProfilePage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('AppContext must be used within an AppContext.Provider');
  }

  const { currentUser, updateUserProfile } = context;

  // Redirect if no user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Images
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [coverImage, setCoverImage] = useState(currentUser?.coverImage || 'https://picsum.photos/seed/nature_wide/1200/400');

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [occupation, setOccupation] = useState(currentUser?.occupation || '');
  
  // Demographics
  const [country, setCountry] = useState(currentUser?.country || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [area, setArea] = useState(currentUser?.area || '');
  const [language, setLanguage] = useState(currentUser?.language || '');
  const [currency, setCurrency] = useState(currentUser?.currency || '');
  const [religion, setReligion] = useState(currentUser?.religion || '');
  const [politicalView, setPoliticalView] = useState(currentUser?.politicalView || '');
  const [philosophy, setPhilosophy] = useState(currentUser?.philosophy || '');

  // Socials
  const [facebook, setFacebook] = useState(currentUser?.socialMediaLinks?.facebook || '');
  const [instagram, setInstagram] = useState(currentUser?.socialMediaLinks?.instagram || '');
  const [twitter, setTwitter] = useState(currentUser?.socialMediaLinks?.twitter || '');
  const [linkedin, setLinkedin] = useState(currentUser?.socialMediaLinks?.linkedin || '');
  const [tiktok, setTiktok] = useState(currentUser?.socialMediaLinks?.tiktok || '');

  const availableCities = country ? CITIES_BY_COUNTRY[country] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        name,
        avatar,
        coverImage,
        bio,
        occupation,
        country,
        city,
        area,
        language,
        currency,
        religion,
        politicalView,
        philosophy,
        socialMediaLinks: {
            facebook,
            instagram,
            twitter,
            linkedin,
            tiktok
        }
      };
      updateUserProfile(updatedUser);
      navigate('/profile');
    }
  };

  const handleImageChange = (type: 'avatar' | 'cover') => {
      const url = prompt(`Enter new ${type} image URL:`, type === 'avatar' ? avatar : coverImage);
      if (url) {
          if (type === 'avatar') setAvatar(url);
          else setCoverImage(url);
      }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden select-none selection:bg-[#8BAB70] selection:text-white pb-20">
      
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 mb-8 border-b border-[#4C3322]/5 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-all cursor-pointer bg-white/20"
            title="Back to Profile"
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

      {/* CORE FORM CONTAINER */}
      <div className="max-w-4xl w-full mx-auto z-10 flex flex-col">
        
        {/* Banner Cover Editor */}
        <div className="relative mb-20">
            <div className="h-44 md:h-56 w-full rounded-[2.5rem] overflow-hidden relative group border border-[#4C3322]/10">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleImageChange('cover')} 
                      className="bg-white/20 backdrop-blur-md border border-white/50 text-[#FAF7F2] px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white/40 transition-all cursor-pointer"
                    >
                        <i className="fas fa-camera"></i> Change Cover
                    </button>
                </div>
            </div>
            
            {/* Avatar Circle Editor */}
            <div className="absolute -bottom-12 left-6 md:left-12 group">
                <div className="relative">
                    <img src={avatar} alt="Avatar" className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-[#FAF7F2] shadow-md object-cover" />
                    <button 
                      onClick={() => handleImageChange('avatar')} 
                      className="absolute bottom-0 right-0 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] w-8 h-8 rounded-full flex items-center justify-center shadow border-2 border-[#FAF7F2] transition-colors cursor-pointer"
                    >
                        <i className="fas fa-pencil-alt text-xs"></i>
                    </button>
                </div>
            </div>
        </div>

        {/* Input Fields */}
        <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          <h2 className="font-serif text-2xl font-black text-[#4C3322] mb-6">Profile Settings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Info */}
              <section className="space-y-4">
                  <h3 className="font-serif text-lg font-black text-[#4C3322] border-b border-[#4C3322]/5 pb-2">Basic Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest mb-1.5 pl-1">Name</label>
                          <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322]" 
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest mb-1.5 pl-1">Occupation</label>
                          <input 
                            type="text" 
                            value={occupation} 
                            onChange={(e) => setOccupation(e.target.value)} 
                            className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322]" 
                          />
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest mb-1.5 pl-1">Bio Description</label>
                      <textarea 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                        rows={3} 
                        className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322] resize-none h-24" 
                      />
                  </div>
              </section>

              {/* Location & Culture */}
              <section className="space-y-4">
                  <h3 className="font-serif text-lg font-black text-[#4C3322] border-b border-[#4C3322]/5 pb-2">Location & Language</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest mb-1.5 pl-1">Country</label>
                          <select 
                            value={country} 
                            onChange={(e) => { setCountry(e.target.value); setCity(''); }} 
                            className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322] cursor-pointer"
                          >
                              <option value="">Select Country</option>
                              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest mb-1.5 pl-1">City</label>
                          {availableCities ? (
                              <select 
                                value={city} 
                                onChange={(e) => setCity(e.target.value)} 
                                className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322] cursor-pointer" 
                                disabled={!country}
                              >
                                  <option value="">Select City</option>
                                  {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                                  <option value="Other">Other</option>
                              </select>
                          ) : (
                              <input 
                                  type="text" 
                                  value={city} 
                                  onChange={(e) => setCity(e.target.value)} 
                                  placeholder={country ? "Enter City Name" : "Select Country First"}
                                  disabled={!country}
                                  className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322] disabled:opacity-50" 
                              />
                          )}
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest mb-1.5 pl-1">Area/District</label>
                          <input 
                            type="text" 
                            value={area} 
                            onChange={(e) => setArea(e.target.value)} 
                            className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322]" 
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest mb-1.5 pl-1">Primary Language</label>
                          <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)} 
                            className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322] cursor-pointer"
                          >
                              <option value="">Select Language</option>
                              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest mb-1.5 pl-1">Preferred Currency</label>
                          <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)} 
                            className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322] cursor-pointer"
                          >
                              <option value="">Select Currency</option>
                              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                      </div>
                  </div>
              </section>

              {/* Identity & Views */}
              <section className="space-y-4">
                  <h3 className="font-serif text-lg font-black text-[#4C3322] border-b border-[#4C3322]/5 pb-2">Outlook & Alignment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest mb-1.5 pl-1">Religion / Belief System</label>
                          <select 
                            value={religion} 
                            onChange={(e) => setReligion(e.target.value)} 
                            className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322] cursor-pointer"
                          >
                              <option value="">Select Belief System</option>
                              {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest mb-1.5 pl-1">Political Outlook</label>
                          <select 
                            value={politicalView} 
                            onChange={(e) => setPoliticalView(e.target.value)} 
                            className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322] cursor-pointer"
                          >
                              <option value="">Select Political Outlook</option>
                              {POLITICAL_VIEWS.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest mb-1.5 pl-1">Philosophical Outlook</label>
                          <select 
                            value={philosophy} 
                            onChange={(e) => setPhilosophy(e.target.value)} 
                            className="w-full p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322] cursor-pointer"
                          >
                              <option value="">Select Philosophy</option>
                              {PHILOSOPHIES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                      </div>
                  </div>
              </section>

              {/* Social Links */}
              <section className="space-y-4">
                  <h3 className="font-serif text-lg font-black text-[#4C3322] border-b border-[#4C3322]/5 pb-2">Social Integrations</h3>
                  <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                          <div className="w-8 flex items-center justify-center text-[#4C3322]"><i className="fab fa-facebook-f text-lg"></i></div>
                          <input 
                            type="text" 
                            placeholder="Facebook Profile URL" 
                            value={facebook} 
                            onChange={(e) => setFacebook(e.target.value)} 
                            className="flex-1 p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322]" 
                          />
                      </div>
                      <div className="flex items-center space-x-2">
                          <div className="w-8 flex items-center justify-center text-[#DE7A49]"><i className="fab fa-instagram text-lg"></i></div>
                          <input 
                            type="text" 
                            placeholder="Instagram Profile URL" 
                            value={instagram} 
                            onChange={(e) => setInstagram(e.target.value)} 
                            className="flex-1 p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322]" 
                          />
                      </div>
                      <div className="flex items-center space-x-2">
                          <div className="w-8 flex items-center justify-center text-[#8BAB70]"><i className="fab fa-twitter text-lg"></i></div>
                          <input 
                            type="text" 
                            placeholder="Twitter Profile URL" 
                            value={twitter} 
                            onChange={(e) => setTwitter(e.target.value)} 
                            className="flex-1 p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322]" 
                          />
                      </div>
                      <div className="flex items-center space-x-2">
                          <div className="w-8 flex items-center justify-center text-[#4C3322]"><i className="fab fa-linkedin-in text-lg"></i></div>
                          <input 
                            type="text" 
                            placeholder="LinkedIn Profile URL" 
                            value={linkedin} 
                            onChange={(e) => setLinkedin(e.target.value)} 
                            className="flex-1 p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322]" 
                          />
                      </div>
                      <div className="flex items-center space-x-2">
                          <div className="w-8 flex items-center justify-center text-[#DE7A49]"><i className="fab fa-tiktok text-lg"></i></div>
                          <input 
                            type="text" 
                            placeholder="TikTok Profile URL" 
                            value={tiktok} 
                            onChange={(e) => setTiktok(e.target.value)} 
                            className="flex-1 p-3.5 border border-[#4C3322]/10 bg-[#FAF7F2]/40 rounded-2xl text-sm focus:outline-none focus:border-[#8BAB70] text-[#4C3322]" 
                          />
                      </div>
                  </div>
              </section>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-[#4C3322]/5">
                  <button
                      type="button"
                      onClick={() => navigate('/profile')}
                      className="px-6 py-3.5 bg-white border border-[#4C3322]/15 text-[#4C3322] rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors hover:bg-[#4C3322]/5 cursor-pointer shadow-sm"
                  >
                      Cancel
                  </button>
                  <button
                      type="submit"
                      className="px-8 py-3.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                      Save Profile
                  </button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};
