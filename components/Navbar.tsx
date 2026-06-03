import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

export const Navbar: React.FC = () => {
  const context = useContext(AppContext);
  const currentUser = context?.currentUser;
  const logout = context?.logout;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout?.();
    setIsMobileMenuOpen(false); 
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', requiresAuth: true, icon: 'fas fa-th-large' },
    { name: 'Profile', path: '/profile', requiresAuth: true, icon: 'fas fa-user' },
    { name: 'Travels', path: '/travels', requiresAuth: true, icon: 'fas fa-plane' },
    { name: 'Companion Finder', path: '/dating', requiresAuth: true, icon: 'fas fa-handshake' },
    { name: 'Games', path: '/games-challenges', requiresAuth: true, icon: 'fas fa-gamepad' },
    { name: 'Wellness', path: '/wellness', requiresAuth: true, icon: 'fas fa-spa' },
    { name: 'Marketplace', path: '/marketplace', requiresAuth: true, icon: 'fas fa-store' },
    { name: 'AI Companion', path: '/virtual-partner/create', requiresAuth: true, icon: 'fas fa-robot' },
    { name: 'Sanctuary Feed', path: '/circle', requiresAuth: true, icon: 'fas fa-users' },
    { name: 'Chat', path: '/chat', requiresAuth: true, icon: 'fas fa-comments' },
    { name: 'Connections', path: '/connections', requiresAuth: true, icon: 'fas fa-user-friends' },
    { name: 'Messages', path: '/dm', requiresAuth: true, icon: 'fas fa-envelope' },
    { name: 'Settings', path: '/settings', requiresAuth: true, icon: 'fas fa-cog' }
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
        <div className="hidden md:flex items-center space-x-6">
          {currentUser ? (
            <>
              {navItems.slice(0, 6).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-xs font-bold uppercase tracking-wider text-[#4C3322]/70 hover:text-[#4C3322] transition-colors flex items-center gap-2"
                  aria-label={item.name}
                >
                  <i className={`${item.icon} text-base text-[#4C3322]/40`}></i>
                  {item.name}
                </Link>
              ))}
              
              {/* Admin Link */}
              <Link
                to="/admin"
                className="bg-[#FAF7F2] border border-red-500/25 hover:bg-red-500 hover:text-white text-red-600 transition-all text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <i className="fas fa-shield-alt"></i>
                Admin Panel
              </Link>

              <div className="relative group pl-4 border-l border-[#4C3322]/10 flex items-center">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full border border-[#4C3322]/10 cursor-pointer hover:shadow-md transition-all object-cover"
                  onClick={() => navigate('/profile')}
                />
                <span className="absolute top-12 right-0 hidden group-hover:block px-3 py-2 bg-white border border-[#4C3322]/10 text-[#4C3322] text-xs font-bold rounded-xl shadow-md whitespace-nowrap z-50">
                  {currentUser.name}
                </span>
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
        <div className="md:hidden bg-white border-t border-[#4C3322]/10 pb-4 shadow-inner max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col items-center space-y-2 pt-4">
            {currentUser ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center py-3 text-xs font-bold uppercase tracking-wider text-[#4C3322]/70 hover:bg-[#4C3322]/5 hover:text-[#4C3322] transition-colors"
                    aria-label={item.name}
                  >
                    {item.icon ? <><i className={`${item.icon} mr-2 w-6 text-center text-[#4C3322]/40`}></i> {item.name}</> : item.name}
                  </Link>
                ))}
                
                <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center py-3 bg-red-500/5 hover:bg-red-500/10 text-xs font-bold uppercase tracking-wider text-red-600 border-y border-[#4C3322]/10"
                >
                    <i className="fas fa-shield-alt mr-2"></i> Admin Panel
                </Link>

                <div className="flex items-center space-x-3 py-4 border-t border-[#4C3322]/10 w-full justify-center mt-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border border-[#4C3322]/10 object-cover"
                  />
                  <span className="text-sm font-bold text-[#4C3322]">{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider w-2/3 shadow-sm mb-4 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-xl w-2/3 transition-colors shadow-sm"
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
