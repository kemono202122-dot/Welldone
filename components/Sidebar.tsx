import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../App';

export const Sidebar: React.FC = () => {
  const context = useContext(AppContext);
  const currentUser = context?.currentUser;
  const logout = context?.logout;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout?.();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', requiresAuth: true, icon: 'fas fa-th-large' },
    { name: 'Sanctuary Profile', path: '/profile', requiresAuth: true, icon: 'fas fa-user' },
    { name: 'Travels', path: '/travels', requiresAuth: true, icon: 'fas fa-plane' },
    { name: 'Companion Finder', path: '/dating', requiresAuth: true, icon: 'fas fa-handshake' },
    { name: 'Games & Challenges', path: '/games-challenges', requiresAuth: true, icon: 'fas fa-gamepad' },
    { name: 'Wellness sanctuary', path: '/wellness', requiresAuth: true, icon: 'fas fa-spa' },
    { name: 'Marketplace catalog', path: '/marketplace', requiresAuth: true, icon: 'fas fa-store' },
    { name: 'AI Companion', path: '/virtual-partner/create', requiresAuth: true, icon: 'fas fa-robot' },
    { name: 'Sanctuary Feed', path: '/circle', requiresAuth: true, icon: 'fas fa-users' },
    { name: 'Community Chat', path: '/chat', requiresAuth: true, icon: 'fas fa-comments' },
    { name: 'Connections circle', path: '/connections', requiresAuth: true, icon: 'fas fa-user-friends' },
    { name: 'Direct Dialogues', path: '/dm', requiresAuth: true, icon: 'fas fa-envelope' },
    { name: 'Control Center', path: '/settings', requiresAuth: true, icon: 'fas fa-cog' },
    { name: 'Admin Portal', path: '/admin', requiresAuth: true, icon: 'fas fa-shield-alt', requiresAdmin: false }
  ];

  return (
    <>
      {/* Sidebar Content - Hidden on Mobile, Visible on Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#4C3322]/10 h-full font-outfit text-[#4C3322] select-none">
        
        {/* Brand Logo */}
        <div className="flex flex-col justify-center px-6 h-24 border-b border-[#4C3322]/10 bg-white">
           <Link to="/" className="hover:scale-102 transition-transform duration-300">
             <h1 className="text-3xl font-serif font-black tracking-tight leading-none text-[#4C3322]">Cereen</h1>
             <span className="text-[9px] tracking-[0.2em] uppercase font-light text-[#4C3322]/50 mt-1 block">magazines</span>
           </Link>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {/* User Profile Section */}
            {currentUser ? (
            <div className="flex flex-col items-center p-6 border-b border-[#4C3322]/10 bg-[#FAF7F2]">
                <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
                    <img 
                        src={currentUser.avatar} 
                        alt={currentUser.name} 
                        className="w-20 h-20 rounded-full border border-[#4C3322]/10 shadow-sm object-cover transition-transform group-hover:scale-103"
                    />
                </div>
                <h3 className="mt-3 font-serif font-bold text-base text-[#4C3322] text-center leading-tight">{currentUser.name}</h3>
                <p className="text-[10px] font-bold text-[#8BAB70] uppercase tracking-wider mt-1 text-center line-clamp-1 px-2">{currentUser.occupation || 'Sanctuary Member'}</p>
                
                {/* Coin Balance Display */}
                <div className="mt-3.5 flex items-center gap-2 bg-[#DE7A49]/5 px-3.5 py-1.5 rounded-full border border-[#DE7A49]/15 shadow-sm">
                    <i className="fas fa-coins text-[#DE7A49] text-xs animate-pulse"></i>
                    <span className="text-xs font-bold text-[#DE7A49]">{currentUser.virtualBalance || 0} Coins</span>
                </div>
            </div>
            ) : (
                <div className="p-6 border-b border-[#4C3322]/10 text-center bg-[#FAF7F2]">
                    <p className="text-[#4C3322]/60 text-xs font-light mb-3">Join our wellness sanctuary</p>
                    <Link to="/login" className="block w-full bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all duration-300">Login</Link>
                </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
                if (item.requiresAuth && !currentUser) return null;

                const isActive = location.pathname === item.path;
                const isAdminItem = item.name === 'Admin Portal';

                return (
                    <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer
                        ${isActive 
                        ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm font-bold' 
                        : 'text-[#4C3322]/70 hover:bg-[#4C3322]/5 hover:text-[#4C3322] font-medium'}
                        ${isAdminItem ? 'mt-4 border-t border-[#4C3322]/10 pt-4 text-red-600 hover:text-red-700' : ''}
                    `}
                    >
                    <div className={`w-6 flex justify-center mr-3 text-base ${isActive ? 'text-[#8BAB70]' : 'text-[#4C3322]/40 group-hover:text-[#4C3322] transition-colors'} ${isAdminItem ? 'text-red-600' : ''}`}>
                        <i className={item.icon}></i>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
                    </Link>
                );
            })}
            </nav>
        </div>

        {/* Logout Button */}
        {currentUser && (
          <div className="p-4 border-t border-[#4C3322]/10 bg-white">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold group cursor-pointer text-xs uppercase tracking-wider"
            >
              <div className="w-6 flex justify-center mr-3 text-base text-red-500 group-hover:text-red-600 transition-colors">
                 <i className="fas fa-sign-out-alt"></i>
              </div>
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
