import React, { useContext, useState, useEffect } from 'react';
import { AppContext, THEME_COLORS } from '../App';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { LANGUAGES, CURRENCIES } from '../constants';

// --- Sub-Components ---

// Reusable Premium Toggle Switch
const ToggleSwitch: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = ({ label, description, checked, onChange, disabled }) => (
  <div className={`flex items-center justify-between py-4 border-b border-[#4C3322]/10 last:border-0 ${disabled ? 'opacity-50' : ''}`}>
    <div className="pr-4 select-none">
      <h4 className="font-outfit font-bold text-[#4C3322] text-sm md:text-base">{label}</h4>
      {description && <p className="text-xs text-[#4C3322]/60 mt-1 font-light leading-relaxed">{description}</p>}
    </div>
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
        checked ? 'bg-[#8BAB70]' : 'bg-[#4C3322]/20'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

// Reusable Premium Input Field
const InputField: React.FC<{
  label: string;
  value: string;
  type?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}> = ({ label, value, type = 'text', onChange, disabled = false }) => (
  <div className="mb-5">
    <label className="block text-xs font-bold text-[#4C3322] uppercase tracking-wider mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] focus:ring-1 focus:ring-[#8BAB70] text-[#4C3322] font-outfit text-sm transition-all duration-300 ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    />
  </div>
);

// --- Main Settings Page Component ---

export const SettingsPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!context) {
    throw new Error('AppContext must be used within an AppContext.Provider');
  }

  const { currentUser, updateUserProfile, isDarkMode, toggleTheme, themeColor, setThemeColor, allUsers, sendFriendRequest } = context;

  // Tabs
  type Tab = 'account' | 'preferences' | 'notifications' | 'privacy' | 'appearance' | 'integrations' | 'help';
  const [activeTab, setActiveTab] = useState<Tab>('appearance');

  // --- Local State for Forms ---
  
  // Account
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || 'user@example.com'); 
  const [password, setPassword] = useState('');
  
  // Preferences
  const [language, setLanguage] = useState(currentUser?.preferences?.language || 'English');
  const [currency, setCurrency] = useState(currentUser?.preferences?.currency || 'USD ($) - US Dollar');
  const [units, setUnits] = useState<'metric' | 'imperial'>(currentUser?.preferences?.units || 'metric');
  const [timezone, setTimezone] = useState(currentUser?.preferences?.timezone || 'UTC');
  
  // Appearance
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(currentUser?.preferences?.fontSize || 'medium');
  const [reducedMotion, setReducedMotion] = useState(currentUser?.preferences?.reducedMotion || false);

  // Notifications
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(true);
  const [notifFriendReq, setNotifFriendReq] = useState(true);

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [dataSharing, setDataSharing] = useState(false);

  // Integrations Status
  const [fbConnected, setFbConnected] = useState(!!currentUser?.fbId);
  const [instaConnected, setInstaConnected] = useState(!!currentUser?.instaId);
  const [spotifyConnected, setSpotifyConnected] = useState(!!currentUser?.spotifyId);
  
  // Sync State
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [foundFriends, setFoundFriends] = useState<{source: string, users: User[]} | null>(null);

  // Update local state when user changes
  useEffect(() => {
      if (currentUser) {
          setName(currentUser.name);
          setEmail(currentUser.email);
          setFbConnected(!!currentUser.fbId);
          setInstaConnected(!!currentUser.instaId);
          setSpotifyConnected(!!currentUser.spotifyId);
      }
  }, [currentUser]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit flex flex-col items-center justify-center p-4">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />
        
        <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-8 md:p-12 shadow-sm text-center max-w-md w-full z-10 relative">
          <div className="w-16 h-16 bg-[#DE7A49]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#DE7A49] text-2xl">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-3xl font-serif font-black mb-4">Sanctuary Lock</h2>
          <p className="text-[#4C3322]/70 mb-8 font-light text-sm">
            Please register or sign in to configure your wellness profile settings.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
          >
            Login / Register
          </button>
        </div>
      </div>
    );
  }

  const handleAccountSave = () => {
    if (currentUser) {
        const updatedUser: User = {
            ...currentUser,
            name: name,
            email: email,
            preferences: {
                ...currentUser.preferences,
                language,
                currency,
                units,
                timezone,
                fontSize,
                reducedMotion,
                contentFilter: currentUser.preferences?.contentFilter || 'moderate'
            }
        };
        updateUserProfile(updatedUser);
        triggerToast("Settings saved successfully!");
    }
  };

  const handleConnectSocial = (platform: 'instagram' | 'facebook' | 'spotify') => {
      setIsSyncing(platform);
      
      // Simulate API delay and finding friends
      setTimeout(() => {
          let updatedUser = { ...currentUser };
          if (platform === 'instagram') {
              setInstaConnected(true);
              updatedUser.instaId = 'linked_insta_123';
          }
          else if (platform === 'facebook') {
              setFbConnected(true);
              updatedUser.fbId = 'linked_fb_123';
          }
          else if (platform === 'spotify') {
              setSpotifyConnected(true);
              updatedUser.spotifyId = 'linked_spotify_123';
          }

          // Persist the link
          updateUserProfile(updatedUser, { silent: true, skipRedirect: true });

          // Mock finding friends for social platforms
          if (platform !== 'spotify') {
              const potentialFriends = allUsers.filter(u => 
                  u.id !== currentUser.id && 
                  !currentUser.friends.includes(u.id) &&
                  (foundFriends?.source !== platform || !foundFriends?.users.some(existing => existing.id === u.id))
              ).slice(0, 3);
              setFoundFriends({ source: platform, users: potentialFriends });
          }
          
          setIsSyncing(null);
          triggerToast(`Connected to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
      }, 1500);
  };

  const handleDisconnect = (platform: 'instagram' | 'facebook' | 'spotify') => {
      let updatedUser = { ...currentUser };
      if (platform === 'instagram') {
          setInstaConnected(false);
          updatedUser.instaId = undefined;
          if (foundFriends?.source === 'instagram') setFoundFriends(null);
      } else if (platform === 'facebook') {
          setFbConnected(false);
          updatedUser.fbId = undefined;
          if (foundFriends?.source === 'facebook') setFoundFriends(null);
      } else if (platform === 'spotify') {
          setSpotifyConnected(false);
          updatedUser.spotifyId = undefined;
      }
      updateUserProfile(updatedUser, { silent: true, skipRedirect: true });
      triggerToast(`Disconnected ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
  };

  const handleInviteUser = (userId: string) => {
      sendFriendRequest(userId);
      if (foundFriends) {
          setFoundFriends({
              ...foundFriends,
              users: foundFriends.users.filter(u => u.id !== userId)
          });
      }
      triggerToast("Buddy invitation sent!");
  };

  const menuItems: { id: Tab; label: string; icon: string }[] = [
    { id: 'appearance', label: 'Appearance', icon: 'fas fa-palette' },
    { id: 'account', label: 'Account Profile', icon: 'fas fa-user-cog' },
    { id: 'preferences', label: 'Preferences', icon: 'fas fa-sliders-h' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'integrations', label: 'Integrations', icon: 'fas fa-link' },
    { id: 'privacy', label: 'Privacy & Data', icon: 'fas fa-lock' },
    { id: 'help', label: 'Help & Guides', icon: 'fas fa-question-circle' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit pb-24 pt-6 md:pt-10 px-4 md:px-8 relative overflow-hidden select-none">
      
      {/* Decorative Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4C3322] text-[#FAF7F2] px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-[#FAF7F2]/10 text-sm font-semibold">
          <i className="fas fa-check-circle text-[#8BAB70]"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#4C3322]/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#4C3322]">Sanctuary Control</h1>
            <p className="text-[#4C3322]/60 mt-2 font-light text-sm md:text-base">Customize your wellness sanctuary experience and sync connections.</p>
          </div>
          <div className="self-start md:self-end">
            <span className="text-[10px] font-bold bg-[#8BAB70]/10 text-[#8BAB70] px-4 py-2 rounded-full uppercase tracking-wider border border-[#8BAB70]/20">
              System Settings
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-md border border-[#4C3322]/10 rounded-[2.5rem] p-4 shadow-sm space-y-1.5 w-full">
              <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar gap-2 lg:gap-1.5">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3.5 px-5 py-4 text-sm font-bold transition-all duration-300 rounded-2xl whitespace-nowrap w-full cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm'
                        : 'text-[#4C3322]/70 hover:bg-[#4C3322]/5 hover:text-[#4C3322]'
                    }`}
                  >
                    <i className={`${item.icon} text-base w-5 text-center ${activeTab === item.id ? 'text-[#8BAB70]' : 'text-[#4C3322]/40'}`}></i>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-grow w-full">
            <div className="bg-white/80 backdrop-blur-md border border-[#4C3322]/10 rounded-[2.5rem] p-8 md:p-10 shadow-sm min-h-[550px] transition-all duration-500">
              
              {/* --- APPEARANCE TAB --- */}
              {activeTab === 'appearance' && (
                <div className="animate-fade-in space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#4C3322] mb-1">Visual Appearance</h2>
                    <p className="text-xs text-[#4C3322]/60 font-light">Set interface themes, animations, and typography sizes.</p>
                  </div>
                  
                  <div className="space-y-2 max-w-2xl">
                     <ToggleSwitch 
                        label="Dark Mode Support" 
                        description="Toggle dark styling overrides (optimized for daytime cream values)."
                        checked={isDarkMode} 
                        onChange={toggleTheme} 
                    />
                    
                    <ToggleSwitch 
                        label="Reduced Animation Mode" 
                        description="Minimize transitions and motion vectors for a serene browsing pace."
                        checked={reducedMotion} 
                        onChange={() => { setReducedMotion(!reducedMotion); handleAccountSave(); }} 
                    />

                    {/* App Theme Selector */}
                    <div className="pt-8 border-t border-[#4C3322]/10">
                      <h3 className="font-outfit font-bold text-[#4C3322] text-sm uppercase tracking-wider mb-4">Core Accents</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Object.keys(THEME_COLORS).map((colorKey) => {
                          const color = THEME_COLORS[colorKey];
                          const isActive = themeColor === colorKey;
                          return (
                            <button
                              key={colorKey}
                              onClick={() => setThemeColor(colorKey)}
                              className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                isActive 
                                  ? 'border-[#4C3322] bg-[#4C3322]/5 shadow-sm scale-[1.02]' 
                                  : 'border-[#4C3322]/10 hover:border-[#4C3322]/30 hover:bg-[#4C3322]/5'
                              }`}
                            >
                              <div 
                                className="w-7 h-7 rounded-full shadow-inner border border-white flex-shrink-0"
                                style={{ backgroundColor: color.primary }}
                              ></div>
                              <span className="text-xs font-bold capitalize text-[#4C3322]">{colorKey}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    
                    {/* Font Size Settings */}
                    <div className="pt-8 border-t border-[#4C3322]/10">
                        <label className="block text-xs font-bold text-[#4C3322] uppercase tracking-wider mb-3">Typography Scales</label>
                        <div className="flex items-center gap-3 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#4C3322]/10">
                            {['small', 'medium', 'large'].map((size) => (
                              <button
                                key={size}
                                onClick={() => setFontSize(size as 'small' | 'medium' | 'large')}
                                className={`flex-1 py-3.5 rounded-xl text-xs font-bold capitalize cursor-pointer transition-all duration-300 ${
                                  fontSize === size 
                                    ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm' 
                                    : 'text-[#4C3322]/60 hover:text-[#4C3322]'
                                }`}
                              >
                                {size} size
                              </button>
                            ))}
                        </div>
                    </div>
                  </div>
                  
                  {/* Live Editorial Preview */}
                  <div className="p-6 bg-[#FAF7F2] rounded-3xl border border-[#4C3322]/15 max-w-2xl">
                      <p className="text-[10px] text-[#4C3322]/40 uppercase font-bold tracking-widest text-center mb-4">Typography & Accent Preview</p>
                      <div className="flex flex-col items-center justify-center text-center">
                          <div className="max-w-md">
                              <h4 className="text-2xl font-serif font-black text-[#4C3322]">Elegant Editorial Header</h4>
                              <p className={`text-[#4C3322]/70 mt-2 font-light leading-relaxed ${fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
                                This is a simulation showing how body margins and typography scale relative to your configuration settings.
                              </p>
                          </div>
                      </div>
                  </div>
                </div>
              )}

              {/* --- ACCOUNT TAB --- */}
              {activeTab === 'account' && (
                <div className="animate-fade-in space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#4C3322] mb-1">Account settings</h2>
                    <p className="text-xs text-[#4C3322]/60 font-light">Update display identity, credentials, and profile state.</p>
                  </div>
                  
                  <div className="space-y-6 max-w-xl">
                    <InputField label="Display Name" value={name} onChange={setName} />
                    <InputField label="Email Address" value={email} onChange={setEmail} />
                    
                    <div className="pt-6 border-t border-[#4C3322]/10">
                         <h3 className="font-serif font-bold text-lg text-[#4C3322] mb-4">Change Security Credentials</h3>
                         <InputField label="New Password" value={password} onChange={setPassword} type="password" />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <button 
                            onClick={handleAccountSave}
                            className="px-6 py-3.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md transition-colors cursor-pointer"
                        >
                            Save Changes
                        </button>
                        <button 
                             onClick={() => navigate('/edit-profile')}
                             className="px-6 py-3.5 border border-[#4C3322]/20 text-[#4C3322] hover:bg-[#4C3322]/5 text-xs font-bold uppercase tracking-wider rounded-2xl transition-colors cursor-pointer"
                        >
                             Edit Public Profile
                        </button>
                    </div>

                    <div className="pt-8 mt-8 border-t border-red-500/10">
                        <h3 className="text-red-600 font-serif font-bold text-lg mb-2">Danger Zone</h3>
                        <p className="text-xs text-[#4C3322]/60 mb-4">Once you delete your account, all companion connections and profile logs will be permanently erased.</p>
                        <button className="text-red-600 border border-red-500/20 bg-red-500/5 hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
                            Delete Sanctuary Account
                        </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- PREFERENCES TAB --- */}
              {activeTab === 'preferences' && (
                  <div className="animate-fade-in space-y-8">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-[#4C3322] mb-1">Global Preferences</h2>
                        <p className="text-xs text-[#4C3322]/60 font-light">Set localized parameters for language, timezones, and measurements.</p>
                      </div>
                      
                      <div className="space-y-6 max-w-xl">
                          <div>
                              <label className="block text-xs font-bold text-[#4C3322] uppercase tracking-wider mb-2">Language</label>
                              <select 
                                  value={language} 
                                  onChange={(e) => setLanguage(e.target.value)} 
                                  className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] focus:ring-1 focus:ring-[#8BAB70] text-[#4C3322] font-outfit text-sm cursor-pointer transition-all duration-300"
                              >
                                  <option value="">Select Language</option>
                                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                              </select>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-[#4C3322] uppercase tracking-wider mb-2">Currency</label>
                                  <select 
                                      value={currency} 
                                      onChange={(e) => setCurrency(e.target.value)} 
                                      className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-[#4C3322] font-outfit text-sm cursor-pointer transition-all duration-300"
                                  >
                                      <option value="">Select Currency</option>
                                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-[#4C3322] uppercase tracking-wider mb-2">Units System</label>
                                  <select 
                                      value={units} 
                                      onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')} 
                                      className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-[#4C3322] font-outfit text-sm cursor-pointer transition-all duration-300"
                                  >
                                      <option value="metric">Metric (km, kg, celsius)</option>
                                      <option value="imperial">Imperial (mi, lbs, fahrenheit)</option>
                                  </select>
                              </div>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-[#4C3322] uppercase tracking-wider mb-2">Default Timezone</label>
                              <select 
                                  value={timezone} 
                                  onChange={(e) => setTimezone(e.target.value)} 
                                  className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-[#4C3322] font-outfit text-sm cursor-pointer transition-all duration-300"
                              >
                                  <option>UTC</option>
                                  <option>PST (Pacific Standard)</option>
                                  <option>EST (Eastern Standard)</option>
                                  <option>CET (Central European)</option>
                                  <option>JST (Japan Standard)</option>
                              </select>
                          </div>

                          <div className="pt-4">
                              <button 
                                  onClick={handleAccountSave}
                                  className="px-6 py-3.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md transition-colors cursor-pointer"
                              >
                                  Save Preferences
                              </button>
                          </div>
                      </div>
                  </div>
              )}

              {/* --- NOTIFICATIONS TAB --- */}
              {activeTab === 'notifications' && (
                <div className="animate-fade-in space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#4C3322] mb-1">Notification Controls</h2>
                    <p className="text-xs text-[#4C3322]/60 font-light">Choose which updates and alerts you wish to receive.</p>
                  </div>
                  <div className="space-y-2 max-w-2xl">
                    <ToggleSwitch 
                        label="Email Updates" 
                        description="Receive digests, system updates, and journal recaps via email."
                        checked={notifEmail} 
                        onChange={() => setNotifEmail(!notifEmail)} 
                    />
                    <ToggleSwitch 
                        label="Push Alert Notifications" 
                        description="Get real-time device screen banners when events match."
                        checked={notifPush} 
                        onChange={() => setNotifPush(!notifPush)} 
                    />
                     <ToggleSwitch 
                        label="Buddy Connection Alerts" 
                        description="Notify me instantly when another traveler links or requests alignment."
                        checked={notifFriendReq} 
                        onChange={() => setNotifFriendReq(!notifFriendReq)} 
                    />
                    <ToggleSwitch 
                        label="Daily Sanctuary Tips" 
                        description="Get morning quotes and weekly wellness report cards."
                        checked={notifMarketing} 
                        onChange={() => setNotifMarketing(!notifMarketing)} 
                    />
                  </div>
                </div>
              )}

              {/* --- PRIVACY TAB --- */}
              {activeTab === 'privacy' && (
                <div className="animate-fade-in space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#4C3322] mb-1">Privacy & Security</h2>
                    <p className="text-xs text-[#4C3322]/60 font-light">Protect your visibility settings and control shared metric data.</p>
                  </div>
                  
                  <div className="mb-6">
                     <label className="block text-xs font-bold text-[#4C3322] uppercase tracking-wider mb-3">Sanctuary Profile Visibility</label>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['public', 'friends', 'private'].map((option) => (
                             <div 
                                key={option}
                                onClick={() => setProfileVisibility(option)}
                                className={`cursor-pointer rounded-2xl border p-5 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                                    profileVisibility === option 
                                    ? 'border-[#4C3322] bg-[#4C3322]/5 shadow-sm' 
                                    : 'border-[#4C3322]/10 hover:border-[#4C3322]/30 hover:bg-[#4C3322]/5'
                                }`}
                             >
                                <div className={`w-4 h-4 rounded-full border mb-3 flex items-center justify-center transition-colors ${
                                     profileVisibility === option ? 'border-[#4C3322]' : 'border-[#4C3322]/30'
                                }`}>
                                    {profileVisibility === option && <div className="w-2.5 h-2.5 rounded-full bg-[#8BAB70]"></div>}
                                </div>
                                <span className="capitalize font-bold text-sm text-[#4C3322]">{option}</span>
                             </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-2 max-w-2xl">
                     <ToggleSwitch 
                        label="Share Usage Metrics" 
                        description="Allow anonymous wellness score tracking to optimize matching systems."
                        checked={dataSharing} 
                        onChange={() => setDataSharing(!dataSharing)} 
                    />
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-[#4C3322]/10">
                      <h3 className="font-serif font-bold text-lg text-[#4C3322] mb-2">Blocked Profiles</h3>
                      <p className="text-xs text-[#4C3322]/60 mb-4">Manage profiles restricted from searching or messaging your sanctuary feed.</p>
                      <button className="text-xs font-bold text-[#4C3322] border border-[#4C3322]/20 px-5 py-2.5 rounded-xl hover:bg-[#4C3322] hover:text-[#FAF7F2] transition-all cursor-pointer">
                          Manage Restriction List
                      </button>
                  </div>
                </div>
              )}

              {/* --- INTEGRATIONS TAB --- */}
              {activeTab === 'integrations' && (
                 <div className="animate-fade-in space-y-8">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-[#4C3322] mb-1">Connected Networks</h2>
                      <p className="text-xs text-[#4C3322]/60 font-light">Link platforms to verify alignments and discover companions.</p>
                    </div>

                    <div className="space-y-5 max-w-2xl">
                        
                        {/* Facebook */}
                        <div className="border border-[#4C3322]/10 rounded-3xl overflow-hidden shadow-sm transition-all bg-white">
                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center text-xl">
                                        <i className="fab fa-facebook-f"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#4C3322] text-base">Facebook</h4>
                                        <p className="text-xs text-[#4C3322]/60 font-light">{fbConnected ? 'Synchronized' : 'Find friends nearby'}</p>
                                    </div>
                                </div>
                                {isSyncing === 'facebook' ? (
                                    <div className="transform scale-75"><LoadingSpinner /></div>
                                ) : (
                                    <button 
                                        onClick={() => fbConnected ? handleDisconnect('facebook') : handleConnectSocial('facebook')}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                            fbConnected 
                                            ? 'bg-[#4C3322]/10 text-[#4C3322] hover:bg-[#4C3322]/20' 
                                            : 'bg-[#4C3322] text-[#FAF7F2] hover:bg-[#8BAB70]'
                                        }`}
                                    >
                                        {fbConnected ? 'Disconnect' : 'Connect'}
                                    </button>
                                )}
                            </div>
                            
                            {/* Found Friends */}
                            {fbConnected && foundFriends?.source === 'facebook' && foundFriends.users.length > 0 && (
                                <div className="bg-[#FAF7F2] p-5 border-t border-[#4C3322]/10 animate-fade-in space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-[#4C3322]/60 uppercase tracking-widest">Suggested Companions on Welldone</p>
                                        <button onClick={() => setFoundFriends(null)} className="text-xs text-[#4C3322]/40 hover:text-[#4C3322]"><i className="fas fa-times"></i></button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {foundFriends.users.map(user => (
                                            <div key={user.id} className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#4C3322]/10 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover border border-[#4C3322]/10" alt="" />
                                                    <span className="text-xs font-bold text-[#4C3322]">{user.name}</span>
                                                </div>
                                                <button 
                                                    onClick={() => handleInviteUser(user.id)}
                                                    className="text-[10px] bg-[#8BAB70] text-white hover:bg-[#4C3322] px-3.5 py-2 rounded-xl transition-colors font-bold uppercase tracking-wider cursor-pointer"
                                                >
                                                    Link Up
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Instagram */}
                        <div className="border border-[#4C3322]/10 rounded-3xl overflow-hidden shadow-sm transition-all bg-white">
                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center text-xl">
                                        <i className="fab fa-instagram"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#4C3322] text-base">Instagram</h4>
                                        <p className="text-xs text-[#4C3322]/60 font-light">{instaConnected ? 'Synchronized' : 'Sync bio & media feed'}</p>
                                    </div>
                                </div>
                                {isSyncing === 'instagram' ? (
                                    <div className="transform scale-75"><LoadingSpinner /></div>
                                ) : (
                                    <button 
                                        onClick={() => instaConnected ? handleDisconnect('instagram') : handleConnectSocial('instagram')}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                            instaConnected 
                                            ? 'bg-[#4C3322]/10 text-[#4C3322] hover:bg-[#4C3322]/20' 
                                            : 'bg-[#4C3322] text-[#FAF7F2] hover:bg-[#8BAB70]'
                                        }`}
                                    >
                                        {instaConnected ? 'Disconnect' : 'Connect'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Spotify */}
                        <div className="border border-[#4C3322]/10 rounded-3xl overflow-hidden shadow-sm transition-all bg-white">
                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center text-xl">
                                        <i className="fab fa-spotify"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#4C3322] text-base">Spotify</h4>
                                        <p className="text-xs text-[#4C3322]/60 font-light">{spotifyConnected ? 'Synchronized' : 'Analyze music frequencies'}</p>
                                    </div>
                                </div>
                                {isSyncing === 'spotify' ? (
                                    <div className="transform scale-75"><LoadingSpinner /></div>
                                ) : (
                                    <button 
                                        onClick={() => spotifyConnected ? handleDisconnect('spotify') : handleConnectSocial('spotify')}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                            spotifyConnected 
                                            ? 'bg-[#4C3322]/10 text-[#4C3322] hover:bg-[#4C3322]/20' 
                                            : 'bg-[#4C3322] text-[#FAF7F2] hover:bg-[#8BAB70]'
                                        }`}
                                    >
                                        {spotifyConnected ? 'Disconnect' : 'Connect'}
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                 </div>
              )}

              {/* --- HELP TAB --- */}
              {activeTab === 'help' && (
                  <div className="animate-fade-in space-y-8">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-[#4C3322] mb-1">Help & Support Guides</h2>
                        <p className="text-xs text-[#4C3322]/60 font-light">Read frequently asked guides or notify the advisory desk.</p>
                      </div>
                      
                      <div className="space-y-4 max-w-2xl">
                          <div className="bg-white hover:bg-[#FAF7F2] p-5 rounded-2xl border border-[#4C3322]/10 cursor-pointer transition-all duration-300">
                              <h4 className="font-bold text-[#4C3322] mb-1 text-sm">Frequently Asked Questions</h4>
                              <p className="text-xs text-[#4C3322]/60 font-light">Quick guides regarding companion alignment metrics and retreats.</p>
                          </div>
                          <div className="bg-white hover:bg-[#FAF7F2] p-5 rounded-2xl border border-[#4C3322]/10 cursor-pointer transition-all duration-300">
                              <h4 className="font-bold text-[#4C3322] mb-1 text-sm">Direct Sanctuary Advisory Support</h4>
                              <p className="text-xs text-[#4C3322]/60 font-light">Connect with our support team regarding account verification logs.</p>
                          </div>
                          <div className="bg-white hover:bg-[#FAF7F2] p-5 rounded-2xl border border-[#4C3322]/10 cursor-pointer transition-all duration-300">
                              <h4 className="font-bold text-[#4C3322] mb-1 text-sm">Report Interface Glitches</h4>
                              <p className="text-xs text-[#4C3322]/60 font-light">Report issues to help improve sanctuary layout parameters.</p>
                          </div>
                          
                          <div className="mt-10 pt-6 border-t border-[#4C3322]/10 text-center text-xs text-[#4C3322]/40 font-light">
                              <p className="font-semibold text-xs mb-1 text-[#4C3322]/60">Welldone Sanctuary Edition 2.5.0</p>
                              <p>&copy; 2026 Welldone Inc. All Rights Reserved.</p>
                          </div>
                      </div>
                  </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
