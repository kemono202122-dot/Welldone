import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';

export const DirectMessageList: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] flex items-center justify-center font-outfit">
        <p className="text-center text-xl font-serif">Loading application context...</p>
      </div>
    );
  }

  const { currentUser, allUsers, allConversations } = context;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit flex flex-col items-center justify-center p-4">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
        
        <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-8 md:p-12 shadow-sm text-center max-w-md w-full z-10 relative">
          <div className="w-16 h-16 bg-[#DE7A49]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#DE7A49] text-2xl">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-3xl font-serif font-black mb-4">Sanctuary Lock</h2>
          <p className="text-[#4C3322]/70 mb-8 font-light text-sm">
            Please register or sign in to view your conversation circle.
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

  const userConversations = allConversations
    .filter(conv => conv.participants.includes(currentUser.id))
    .sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());

  const getOtherParticipant = (conversationParticipants: string[]) => {
    const otherParticipantId = conversationParticipants.find(id => id !== currentUser.id);
    return allUsers.find(user => user.id === otherParticipantId);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit pb-24 pt-6 md:pt-10 px-4 md:px-8 relative overflow-hidden select-none">
      
      {/* Decorative blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[#4C3322]/10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-serif font-black tracking-tight text-[#4C3322]">Direct Dialogues</h2>
            <p className="text-xs text-[#4C3322]/60 font-light mt-1">Keep in touch with your wellness travel partners.</p>
          </div>
          <div>
            <span className="text-[10px] font-bold bg-[#8BAB70]/10 text-[#8BAB70] px-4 py-2 rounded-full border border-[#8BAB70]/20 tracking-wider">
              {userConversations.length} Active Chats
            </span>
          </div>
        </div>

        {/* Conversation List */}
        {userConversations.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-8 shadow-sm">
            <div className="bg-[#8BAB70]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[#8BAB70]">
               <i className="far fa-comments text-2xl"></i>
            </div>
            <p className="text-lg font-serif font-bold text-[#4C3322] mb-1">No dialogue logs</p>
            <p className="text-[#4C3322]/50 text-sm font-light">You have no active direct messages yet. Explore buddies and start talking!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {userConversations.map(conversation => {
              const otherUser = getOtherParticipant(conversation.participants);
              const lastMessage = conversation.messages[conversation.messages.length - 1];

              if (!otherUser) return null;

              return (
                <li key={conversation.id} className="bg-white border border-[#4C3322]/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <Link to={`/dm/${conversation.id}`} className="flex items-center space-x-4 p-5">
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#8BAB70] shadow-sm flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="font-bold text-base text-[#4C3322] truncate pr-2">{otherUser.name}</p>
                        {lastMessage && (
                          <span className="text-[10px] text-[#4C3322]/40 font-light flex-shrink-0">
                            {new Date(lastMessage.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#4C3322]/60 font-light truncate">
                        {lastMessage ? `${lastMessage.senderId === currentUser.id ? 'You: ' : ''}${lastMessage.text}` : 'No messages yet.'}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};