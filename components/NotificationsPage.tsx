import React, { useContext } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../types';

export const NotificationsPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] flex items-center justify-center font-outfit">
        <p className="text-center text-xl font-serif">Loading application context...</p>
      </div>
    );
  }

  const { currentUser, notifications, markNotificationAsRead } = context;

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
            Please register or sign in to view your notification circle.
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

  const userNotifications = notifications
    .filter(n => n.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    if (notification.type === 'friend_request') {
      navigate('/connections');
    } else if (notification.type === 'activity_invite') {
      navigate('/dashboard');
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <i className="fas fa-user-plus text-[#8BAB70] text-lg"></i>;
      case 'activity_invite':
        return <i className="fas fa-calendar-plus text-[#DE7A49] text-lg"></i>;
      case 'activity_update':
        return <i className="fas fa-bell text-[#4C3322] text-lg"></i>;
      default:
        return <i className="fas fa-info-circle text-[#4C3322]/60 text-lg"></i>;
    }
  };

  const getIconBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-[#4C3322]/5';
    switch (type) {
      case 'friend_request':
        return 'bg-[#8BAB70]/10';
      case 'activity_invite':
        return 'bg-[#DE7A49]/10';
      case 'activity_update':
        return 'bg-[#4C3322]/10';
      default:
        return 'bg-[#4C3322]/5';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit pb-24 pt-6 md:pt-10 px-4 md:px-8 relative overflow-hidden select-none">
      
      {/* Background Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-[#4C3322]/10">
          <div>
            <h1 className="text-4xl font-serif font-black tracking-tight text-[#4C3322]">Notifications</h1>
            <p className="text-[#4C3322]/60 mt-1 font-light text-sm">Stay connected and updated with your wellness buddy network.</p>
          </div>
          <div className="flex-shrink-0">
             <span className="text-xs font-bold bg-[#8BAB70]/10 text-[#8BAB70] px-4 py-2 rounded-full border border-[#8BAB70]/20 tracking-wider">
               {unreadCount} Unread
             </span>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {userNotifications.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-8 shadow-sm">
              <div className="bg-[#DE7A49]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[#DE7A49]">
                 <i className="far fa-bell-slash text-2xl"></i>
              </div>
              <p className="text-lg font-serif font-bold text-[#4C3322] mb-1">No alerts yet</p>
              <p className="text-[#4C3322]/50 text-sm font-light">We'll alert you here when friends invite you to wellness walks or updates align.</p>
            </div>
          ) : (
            userNotifications.map((notification) => {
              const isUnread = !notification.isRead;
              return (
                <div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`relative overflow-hidden rounded-[1.8rem] p-5 md:p-6 border transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 select-none ${
                    isUnread 
                      ? 'bg-white border-[#8BAB70]/30 shadow-md hover:border-[#8BAB70]' 
                      : 'bg-white/80 border-[#4C3322]/10 opacity-75 hover:bg-white hover:opacity-100'
                  }`}
                >
                  {isUnread && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#8BAB70] rounded-full m-4 shadow-sm animate-pulse"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                      getIconBgColor(notification.type, notification.isRead)
                    }`}>
                      {getIconForType(notification.type)}
                    </div>
                    
                    <div className="flex-grow pt-0.5 pr-4">
                      <p className={`text-sm md:text-base leading-relaxed ${
                        isUnread ? 'text-[#4C3322] font-bold' : 'text-[#4C3322]/80'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-[#4C3322]/40 mt-1.5 font-light">
                        {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>

                    <div className="flex-shrink-0 self-center text-[#4C3322]/30 group-hover:text-[#4C3322]/70 group-hover:translate-x-1 transition-all duration-300">
                      <i className="fas fa-chevron-right text-xs"></i>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
