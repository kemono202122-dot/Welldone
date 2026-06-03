import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

export const Navbar: React.FC = () => {
  const context = useContext(AppContext);
  const currentUser = context?.currentUser;
  const logout = context?.logout;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout?.();
    setIsMobileMenuOpen(false); 
    setIsAvatarDropdownOpen(false);
    navigate('/login');
  };

  const dropdownMenus = [
    {
      title: 'Sanctuary Hub',
      icon: 'fas fa-home',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-th-large', desc: 'Main control center & stats' },
        { name: 'Sanctuary Feed', path: '/circle', icon: 'fas fa-users', desc: 'Read & share updates' },
        { name: 'Marketplace', path: '/marketplace', icon: 'fas fa-store', desc: 'Discover wellness offerings' }
      ]
    },
    {
      title: 'Journeys',
      icon: 'fas fa-compass',
      items: [
        { name: 'Travels & Plans', path: '/travels', icon: 'fas fa-plane', desc: 'Create travel companion itineraries' },
        { name: 'Companion Finder', path: '/dating', icon: 'fas fa-handshake', desc: 'Find mindful travel buddies' },
        { name: 'Connections Circle', path: '/connections', icon: 'fas fa-user-friends', desc: 'Manage friends & invitations' }
      ]
    },
    {
      title: 'Mind & Body',
      icon: 'fas fa-heart',
      items: [
        { name: 'Wellness Sanctuary', path: '/wellness', icon: 'fas fa-spa', desc: 'Log mood & meditate' },
        { name: 'Games & Challenges', path: '/games-challenges', icon: 'fas fa-gamepad', desc: 'Strengthen habits & earn rewards' },
        { name: 'AI Companion', path: '/virtual-partner/create', icon: 'fas fa-robot', desc: 'Chat with your virtual guide' }
      ]
    },
    {
      title: 'Dialogues',
      icon: 'fas fa-comments',
      items: [
        { name: 'Community Chat', path: '/chat', icon: 'fas fa-comments', desc: 'General group discussions' },
        { name: 'Direct Messages', path: '/dm', icon: 'fas fa-envelope', desc: 'Private companion dialogues' }
      ]
    }
  ];

  return (
    <nav className="bg-white border-b border-[#4C3322]/10 text-[#4C3322] shadow-sm sticky top-0 z-50 backdrop-blur-md select-none font-outfit">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link to="/" className="hover:scale-102 transition-transform duration-300 flex items-baseline gap-2">
          <span className="text-3xl font-serif font-black tracking-tight text-[#4C3322]">Cereen</span>
          <span className="text-[9px] tracking-[0.2em] uppercase font-light text-[#4C3322]/50 block">magazines</span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#4C3322] focus:outline-none cursor-pointer"
            aria-label="Toggle navigation"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          {currentUser ? (
            <>
              {/* Dropdown Menus */}
              {dropdownMenus.map((menu) => {
                const isOpen = activeDropdown === menu.title;
                return (
                  <div
                    key={menu.title}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(menu.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                        isOpen ? 'text-[#8BAB70]' : 'text-[#4C3322]/70 hover:text-[#4C3322]'
                      }`}
                    >
                      <i className={`${menu.icon} text-sm opacity-60`}></i>
                      {menu.title}
                      <i className={`fas fa-chevron-down text-[8px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    {/* Dropdown Card */}
                    {isOpen && (
                      <div className="absolute left-0 mt-1 w-64 bg-white border border-[#4C3322]/10 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                        {menu.items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="flex items-start gap-3 px-4 py-2.5 hover:bg-[#FAF7F2] transition-colors"
                          >
                            <div className="mt-0.5 text-xs text-[#8BAB70] w-5 text-center">
                              <i className={item.icon}></i>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#4C3322] uppercase tracking-wider">{item.name}</p>
                              {item.desc && <p className="text-[10px] text-[#4C3322]/50 font-light mt-0.5 leading-snug">{item.desc}</p>}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Avatar Dropdown */}
              <div 
                className="relative pl-6 border-l border-[#4C3322]/10 flex items-center"
                onMouseEnter={() => setIsAvatarDropdownOpen(true)}
                onMouseLeave={() => setIsAvatarDropdownOpen(false)}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full border border-[#4C3322]/10 cursor-pointer hover:shadow-md transition-all object-cover"
                  onClick={() => navigate('/profile')}
                />
                
                {isAvatarDropdownOpen && (
                  <div className="absolute right-0 top-10 mt-1 w-52 bg-white border border-[#4C3322]/10 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-[#4C3322]/5">
                      <p className="text-xs font-bold text-[#4C3322]">{currentUser.name}</p>
                      <p className="text-[9px] text-[#8BAB70] uppercase font-bold tracking-wider mt-0.5">{currentUser.occupation || 'Sanctuary Member'}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#FAF7F2] text-xs font-bold uppercase tracking-wider text-[#4C3322]/70 hover:text-[#4C3322]"
                    >
                      <i className="fas fa-user text-[#4C3322]/40 w-4 text-center"></i>
                      Sanctuary Profile
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#FAF7F2] text-xs font-bold uppercase tracking-wider text-[#4C3322]/70 hover:text-[#4C3322]"
                    >
                      <i className="fas fa-cog text-[#4C3322]/40 w-4 text-center"></i>
                      Control Center
                    </Link>
                    
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#FAF7F2] text-xs font-bold uppercase tracking-wider text-[#4C3322]/70 hover:text-[#4C3322] border-t border-[#4C3322]/5"
                    >
                      <i className="fas fa-shield-alt text-[#4C3322]/40 w-4 text-center"></i>
                      Admin Portal
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-xs font-bold uppercase tracking-wider text-red-600 border-t border-[#4C3322]/5 text-left cursor-pointer"
                    >
                      <i className="fas fa-sign-out-alt text-red-500 w-4 text-center"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#4C3322]/10 pb-6 shadow-inner max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="px-4 pt-4 space-y-5">
            {currentUser ? (
              <>
                {/* Mobile Groupings */}
                {dropdownMenus.map((menu) => (
                  <div key={menu.title} className="space-y-1.5">
                    <p className="text-[10px] font-bold text-[#8BAB70] uppercase tracking-widest pl-3">{menu.title}</p>
                    <div className="bg-[#FAF7F2]/50 rounded-2xl border border-[#4C3322]/5 p-1">
                      {menu.items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#4C3322]/70 hover:text-[#4C3322] hover:bg-[#FAF7F2] rounded-xl transition-colors"
                        >
                          <i className={`${item.icon} text-sm text-[#4C3322]/40 w-5 text-center`}></i>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Administrative Controls */}
                <div className="space-y-1.5 pt-2 border-t border-[#4C3322]/5">
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest pl-3">Control & Session</p>
                  <div className="bg-red-50/20 rounded-2xl border border-red-500/5 p-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#4C3322]/70 hover:text-[#4C3322] hover:bg-[#FAF7F2] rounded-xl transition-colors"
                    >
                      <i className="fas fa-user text-[#4C3322]/40 w-5 text-center"></i>
                      Sanctuary Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#4C3322]/70 hover:text-[#4C3322] hover:bg-[#FAF7F2] rounded-xl transition-colors"
                    >
                      <i className="fas fa-cog text-[#4C3322]/40 w-5 text-center"></i>
                      Control Center
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <i className="fas fa-shield-alt text-red-500 w-5 text-center"></i>
                      Admin Portal
                    </Link>
                  </div>
                </div>

                {/* Mobile Session Profile Card */}
                <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-[2rem] border border-[#4C3322]/10 mt-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full border border-[#4C3322]/10 object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#4C3322]">{currentUser.name}</p>
                      <p className="text-[9px] text-[#4C3322]/50 font-light">{currentUser.occupation || 'Sanctuary Member'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
