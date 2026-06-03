import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, User } from '../types';

interface ChatWindowProps {
  currentUser: User;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  allUsers: User[]; // To display sender avatars/names
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, messages, onSendMessage, allUsers }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const getUserAvatar = (senderId: string) => {
    const user = allUsers.find(u => u.id === senderId);
    return user ? user.avatar : 'https://picsum.photos/50/50?random=0'; // Default avatar
  };

  const getUserName = (senderId: string) => {
    const user = allUsers.find(u => u.id === senderId);
    return user ? user.name : 'Unknown User';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] bg-[#FAF7F2] text-[#4C3322] font-outfit rounded-[2.5rem] border border-[#4C3322]/10 shadow-sm overflow-hidden select-none relative">
      
      {/* Decorative Blur */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#8BAB70]/5 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="p-5 bg-white border-b border-[#4C3322]/10 flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-xl font-serif font-black tracking-tight">Community sanctuary chat</h2>
          <p className="text-[10px] text-[#4C3322]/60 font-light mt-0.5 uppercase tracking-widest">Live discussion board</p>
        </div>
        <div className="w-2.5 h-2.5 bg-[#8BAB70] rounded-full shadow-sm animate-pulse"></div>
      </div>

      {/* Messages */}
      <div className="flex-grow p-5 overflow-y-auto space-y-5 custom-scrollbar relative z-10 bg-[#FAF7F2]/40">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#4C3322]/50">
            <div className="w-14 h-14 bg-white border border-[#4C3322]/10 rounded-full flex items-center justify-center mb-4 text-xl shadow-sm">
              <i className="far fa-comments text-[#8BAB70]"></i>
            </div>
            <p className="font-serif font-bold text-base">Begin the connection</p>
            <p className="text-xs text-[#4C3322]/60 font-light mt-1">Send a message to share with everyone in the sanctuary.</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            return (
              <div
                key={message.id}
                className={`flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {!isCurrentUser && (
                  <img
                    src={getUserAvatar(message.senderId)}
                    alt={getUserName(message.senderId)}
                    className="w-8 h-8 rounded-full mr-3 object-cover border border-[#4C3322]/10 hover:scale-105 transition-transform"
                  />
                )}
                
                <div className={`max-w-xs md:max-w-md flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 shadow-sm ${
                      isCurrentUser
                        ? 'bg-[#4C3322] text-[#FAF7F2] rounded-[1.5rem] rounded-br-none'
                        : 'bg-white text-[#4C3322] border border-[#4C3322]/10 rounded-[1.5rem] rounded-bl-none'
                    }`}
                  >
                    {!isCurrentUser && (
                      <p className="font-bold text-xs uppercase tracking-wider text-[#8BAB70] mb-1.5">{getUserName(message.senderId)}</p>
                    )}
                    <p className="text-sm leading-relaxed font-light">{message.text}</p>
                  </div>
                  <span className="block text-[9px] text-[#4C3322]/40 font-light mt-1.5 px-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {isCurrentUser && (
                  <img
                    src={getUserAvatar(message.senderId)}
                    alt={getUserName(message.senderId)}
                    className="w-8 h-8 rounded-full ml-3 object-cover border border-[#4C3322]/10 hover:scale-105 transition-transform"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-[#4C3322]/10 flex items-center gap-3 relative z-10">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-grow px-5 py-3.5 border border-[#4C3322]/15 rounded-2xl focus:outline-none focus:border-[#8BAB70] focus:ring-1 focus:ring-[#8BAB70] bg-[#FAF7F2] text-[#4C3322] placeholder-[#4C3322]/40 text-sm font-outfit transition-all duration-300"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-colors disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
};