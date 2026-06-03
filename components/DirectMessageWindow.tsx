import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { ChatMessage, User, ChatAttachment } from '../types';
import { mockChallenges, mockEvents, mockGroups, mockTravelPlans } from '../constants';

// Mock Data for New Features
const mockGifs = [
  { id: 'gif1', url: 'https://picsum.photos/seed/gif1/300/200', title: 'Excited' },
  { id: 'gif2', url: 'https://picsum.photos/seed/gif2/300/200', title: 'Funny' },
  { id: 'gif3', url: 'https://picsum.photos/seed/gif3/300/200', title: 'Wow' },
  { id: 'gif4', url: 'https://picsum.photos/seed/gif4/300/200', title: 'High Five' },
];

const mockMusic = [
  { id: 'm1', title: 'Healing Sounds', subtitle: 'Nature Vibes', imageUrl: 'https://picsum.photos/seed/music1/100/100' },
  { id: 'm2', title: 'Morning Flow', subtitle: 'Yoga Beats', imageUrl: 'https://picsum.photos/seed/music2/100/100' },
  { id: 'm3', title: 'Deep Focus', subtitle: 'Lo-Fi Study', imageUrl: 'https://picsum.photos/seed/music3/100/100' },
];

const mockMovies = [
  { id: 'mov1', title: 'The Peaceful Warrior', subtitle: '2006', imageUrl: 'https://picsum.photos/seed/movie1/100/150' },
  { id: 'mov2', title: 'Into the Wild', subtitle: '2007', imageUrl: 'https://picsum.photos/seed/movie2/100/150' },
  { id: 'mov3', title: 'Eat Pray Love', subtitle: '2010', imageUrl: 'https://picsum.photos/seed/movie3/100/150' },
];

const mockBooks = [
  { id: 'bk1', title: 'The Power of Now', subtitle: 'Eckhart Tolle', imageUrl: 'https://picsum.photos/seed/book1/100/150' },
  { id: 'bk2', title: 'Atomic Habits', subtitle: 'James Clear', imageUrl: 'https://picsum.photos/seed/book2/100/150' },
  { id: 'bk3', title: 'Think Like a Monk', subtitle: 'Jay Shetty', imageUrl: 'https://picsum.photos/seed/book3/100/150' },
];

export const DirectMessageWindow: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const context = useContext(AppContext);

  // Action Menu State
  const [showActions, setShowActions] = useState(false);
  const [activeActionTab, setActiveActionTab] = useState<'games' | 'travel' | 'events' | 'groups' | 'gif' | 'music' | 'movie' | 'book' | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  if (!context) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] flex items-center justify-center font-outfit">
        <p className="text-center text-xl font-serif">Loading application context...</p>
      </div>
    );
  }

  const { currentUser, allUsers, allConversations, sendDirectMessage, updateMessageStatus } = context;

  const conversation = allConversations.find(conv => conv.id === conversationId);
  const otherParticipantId = conversation?.participants.find(id => id !== currentUser?.id);
  const otherUser = allUsers.find(user => user.id === otherParticipantId);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, scrollToBottom, isTyping]);

  // Simulation Effect for Read Receipts and Typing
  useEffect(() => {
    if (!conversation || !currentUser || !updateMessageStatus) return;

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    
    // Only simulate if the last message was sent by current user and isn't read yet
    if (lastMessage && lastMessage.senderId === currentUser.id && lastMessage.status !== 'read') {
        // 1. Simulate Delivered
        const deliverTimer = setTimeout(() => {
            updateMessageStatus(conversation.id, lastMessage.id, 'delivered');
        }, 1000);

        // 2. Simulate Read (after delivery)
        const readTimer = setTimeout(() => {
            updateMessageStatus(conversation.id, lastMessage.id, 'read');
        }, 2500);

        // 3. Simulate Typing Reply (after read)
        const typingStartTimer = setTimeout(() => {
            setIsTyping(true);
        }, 3500);

        // 4. Stop Typing (simulation ends)
        const typingStopTimer = setTimeout(() => {
            setIsTyping(false);
        }, 6500);

        return () => {
            clearTimeout(deliverTimer);
            clearTimeout(readTimer);
            clearTimeout(typingStartTimer);
            clearTimeout(typingStopTimer);
        };
    }
  }, [conversation?.messages, currentUser, updateMessageStatus]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit flex flex-col items-center justify-center p-4">
        <p className="text-lg mb-4 font-serif">Please log in to participate in dialogues.</p>
        <button onClick={() => navigate('/login')} className="bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors cursor-pointer">Login</button>
      </div>
    );
  }

  if (!conversation || !otherUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit flex flex-col items-center justify-center p-4">
        <p className="text-lg mb-4 font-serif">Conversation details not found.</p>
        <button onClick={() => navigate('/dm')} className="border border-[#4C3322]/20 hover:bg-[#4C3322]/5 px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors cursor-pointer">Go Back</button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && conversationId && sendDirectMessage) {
      sendDirectMessage(conversationId, inputText);
      setInputText('');
    }
  };

  const handleSendAttachment = (type: ChatAttachment['type'], item: any) => {
    if (!conversationId || !sendDirectMessage) return;

    let attachment: ChatAttachment;
    let fallbackText = '';

    switch (type) {
      case 'game':
        attachment = { type, id: item.id, title: item.name, subtitle: item.reward, imageUrl: item.image };
        fallbackText = `Challenged you to: ${item.name}`;
        break;
      case 'travel':
        attachment = { type, id: item.id, title: item.name, subtitle: item.location, imageUrl: item.image };
        fallbackText = `Shared a travel plan: ${item.name}`;
        break;
      case 'event':
        attachment = { type, id: item.id, title: item.name, subtitle: new Date(item.date).toLocaleDateString(), imageUrl: item.image };
        fallbackText = `Invited you to event: ${item.name}`;
        break;
      case 'group':
        attachment = { type, id: item.id, title: item.name, subtitle: `${item.members.length} members`, imageUrl: item.image };
        fallbackText = `Shared group: ${item.name}`;
        break;
      case 'gif':
        attachment = { type, id: item.id, title: 'GIF', imageUrl: item.url };
        fallbackText = 'Sent a GIF';
        break;
      case 'music':
        attachment = { type, id: item.id, title: item.title, subtitle: item.subtitle, imageUrl: item.imageUrl };
        fallbackText = `Shared song: ${item.title}`;
        break;
      case 'movie':
        attachment = { type, id: item.id, title: item.title, subtitle: item.subtitle, imageUrl: item.imageUrl };
        fallbackText = `Recommended movie: ${item.title}`;
        break;
      case 'book':
        attachment = { type, id: item.id, title: item.title, subtitle: item.subtitle, imageUrl: item.imageUrl };
        fallbackText = `Recommended book: ${item.title}`;
        break;
      default:
        return;
    }

    sendDirectMessage(conversationId, fallbackText, attachment);
    setShowActions(false);
    setActiveActionTab(null);
  };

  const StatusIcon = ({ status }: { status?: 'sent' | 'delivered' | 'read' | 'unread' }) => {
      if (!status) return null;
      let icon = 'fa-check';
      let color = 'text-[#4C3322]/40';
      if (status === 'delivered') icon = 'fa-check-double';
      else if (status === 'read') { icon = 'fa-check-double'; color = 'text-[#8BAB70]'; }
      return <i className={`fas ${icon} ${color} text-[10px] transition-colors duration-300 ml-1`} title={status}></i>;
  };

  const AttachmentCard = ({ attachment, isMe }: { attachment: ChatAttachment; isMe: boolean }) => {
    const iconMap: any = { game: 'fas fa-gamepad', travel: 'fas fa-plane', event: 'fas fa-calendar-alt', group: 'fas fa-users', gif: 'fas fa-image', music: 'fas fa-music', movie: 'fas fa-film', book: 'fas fa-book' };
    const colorMap: any = {
      game: 'text-[#4C3322] bg-[#FAF7F2] border border-[#4C3322]/10',
      travel: 'text-[#FAF7F2] bg-[#8BAB70] border border-[#8BAB70]/20',
      event: 'text-[#FAF7F2] bg-[#DE7A49] border border-[#DE7A49]/20',
      group: 'text-[#FAF7F2] bg-[#4C3322]',
      gif: 'text-[#4C3322] bg-[#FAF7F2]',
      music: 'text-[#4C3322] bg-[#FAF7F2]',
      movie: 'text-[#4C3322] bg-[#FAF7F2]',
      book: 'text-[#4C3322] bg-[#FAF7F2]'
    };

    if (attachment.type === 'gif') {
        return (
            <div className="mt-2 rounded-2xl overflow-hidden shadow-sm border border-[#4C3322]/10">
                <img src={attachment.imageUrl} alt="GIF" className="w-full h-auto max-h-48 object-cover" />
            </div>
        );
    }

    return (
      <div className={`mt-3 rounded-2xl overflow-hidden border shadow-sm ${
        isMe 
          ? 'border-white/25 bg-[#FAF7F2]/10' 
          : 'border-[#4C3322]/10 bg-[#FAF7F2]'
      }`}>
        {attachment.imageUrl && (
          <div className="h-28 w-full relative group cursor-pointer">
            <img src={attachment.imageUrl} alt={attachment.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-md ${colorMap[attachment.type]}`}>
               <i className={iconMap[attachment.type]}></i>
               <span>{attachment.type}</span>
            </div>
          </div>
        )}
        <div className="p-3.5">
          <h4 className={`font-bold text-xs leading-tight mb-1 ${isMe ? 'text-[#FAF7F2]' : 'text-[#4C3322]'}`}>{attachment.title}</h4>
          {attachment.subtitle && (
            <p className={`text-[10px] mb-3 font-light ${isMe ? 'text-[#FAF7F2]/75' : 'text-[#4C3322]/60'}`}>{attachment.subtitle}</p>
          )}
          <button className={`w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-[0.97] cursor-pointer ${
            isMe 
              ? 'bg-white/20 text-[#FAF7F2] hover:bg-white/30' 
              : 'bg-white text-[#4C3322] hover:bg-[#4C3322] hover:text-[#FAF7F2] border border-[#4C3322]/15'
          }`}>
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-120px)] bg-white text-[#4C3322] font-outfit rounded-[2.5rem] shadow-sm overflow-hidden max-w-4xl mx-auto relative border border-[#4C3322]/10 select-none">
      
      {/* 1. Modern Editorial Header */}
      <div className="px-6 py-4 bg-white/95 backdrop-blur-md border-b border-[#4C3322]/10 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dm')} className="md:hidden text-[#4C3322]/70 hover:text-[#4C3322] transition-colors">
            <i className="fas fa-arrow-left text-lg"></i>
          </button>
          <div className="relative cursor-pointer flex-shrink-0" onClick={() => navigate(`/users/${otherUser.id}`)}>
            <img src={otherUser.avatar} alt={otherUser.name} className="w-12 h-12 rounded-full object-cover border border-[#4C3322]/10" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#8BAB70] border-2 border-white rounded-full"></div>
          </div>
          <div className="cursor-pointer" onClick={() => navigate(`/users/${otherUser.id}`)}>
            <h2 className="font-serif font-black text-lg text-[#4C3322] leading-tight">{otherUser.name}</h2>
            <p className="text-[10px] text-[#8BAB70] font-bold uppercase tracking-widest mt-0.5">
              Sanctuary Contact
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#4C3322]/50">
           <button className="p-2.5 rounded-full hover:bg-[#4C3322]/5 hover:text-[#4C3322] transition-all cursor-pointer" title="Call">
             <i className="fas fa-phone-alt text-base"></i>
           </button>
           <button className="p-2.5 rounded-full hover:bg-[#4C3322]/5 hover:text-[#4C3322] transition-all cursor-pointer" title="Video">
             <i className="fas fa-video text-base"></i>
           </button>
           <button className="p-2.5 rounded-full hover:bg-[#4C3322]/5 hover:text-[#4C3322] transition-all cursor-pointer" onClick={() => navigate(`/users/${otherUser.id}`)} title="Info">
             <i className="fas fa-info-circle text-lg"></i>
           </button>
        </div>
      </div>

      {/* 2. Message Area */}
      <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-5 bg-[#FAF7F2]/60 scroll-smooth custom-scrollbar">
        {conversation.messages.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-[#4C3322]/50 animate-fade-in">
              <div className="w-16 h-16 bg-white border border-[#4C3322]/10 rounded-full flex items-center justify-center mb-4 text-xl shadow-sm">👋</div>
              <p className="font-serif font-bold text-base">Begin the Dialogue</p>
              <p className="text-xs text-[#4C3322]/60 font-light mt-1">Say hello to initialize matching interests.</p>
           </div>
        ) : (
          conversation.messages.map((message) => {
            const isMe = message.senderId === currentUser.id;
            return (
              <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group items-end`}>
                {!isMe && (
                   <img 
                    src={otherUser.avatar} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full object-cover mr-2.5 mb-4 border border-[#4C3322]/10 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => navigate(`/users/${otherUser.id}`)}
                   />
                )}
                
                <div className={`max-w-[80%] md:max-w-[65%] relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                   <div className={`px-4.5 py-3 text-sm leading-relaxed shadow-sm ${
                     isMe 
                       ? 'bg-[#4C3322] text-[#FAF7F2] rounded-2xl rounded-tr-none' 
                       : 'bg-white text-[#4C3322] border border-[#4C3322]/10 rounded-2xl rounded-tl-none'
                   }`}>
                     {message.text && <p className="font-light">{message.text}</p>}
                     {message.attachment && <AttachmentCard attachment={message.attachment} isMe={isMe} />}
                   </div>
                   
                   <div className={`text-[9px] font-light text-[#4C3322]/40 mt-1.5 px-1 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                     <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     {isMe && message.status && <StatusIcon status={message.status} />}
                   </div>
                </div>
              </div>
            );
          })
        )}
        
        {isTyping && (
            <div className="flex justify-start mb-2 items-end">
                <img 
                    src={otherUser.avatar} 
                    alt={otherUser.name} 
                    className="w-8 h-8 rounded-full object-cover mr-2.5 mb-1 border border-[#4C3322]/10"
                />
                <div className="bg-white border border-[#4C3322]/10 rounded-2xl rounded-bl-none py-2.5 px-4 shadow-sm flex items-center gap-1.5 h-9">
                    <div className="w-1.5 h-1.5 bg-[#4C3322]/30 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-[#4C3322]/30 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-[#4C3322]/30 rounded-full animate-bounce"></div>
                </div>
            </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Action Menu (Slide Up Drawer) */}
      {showActions && (
        <div className="absolute bottom-24 left-4 right-4 bg-white/95 backdrop-blur-md rounded-[2rem] shadow-xl border border-[#4C3322]/15 overflow-hidden z-30 animate-fade-in-up">
           
           {/* Tab Headers */}
           {!activeActionTab ? (
              <div className="p-6">
                 <h3 className="text-[10px] font-bold text-[#4C3322]/50 uppercase tracking-widest mb-4">Integrations & Recommends</h3>
                 <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                       { id: 'gif', label: 'GIFs', icon: 'fas fa-bolt', color: 'text-[#DE7A49] bg-[#DE7A49]/5 hover:bg-[#DE7A49]/10' },
                       { id: 'music', label: 'Music', icon: 'fas fa-music', color: 'text-[#4C3322] bg-[#FAF7F2] hover:bg-[#4C3322]/5' },
                       { id: 'movie', label: 'Movies', icon: 'fas fa-film', color: 'text-[#4C3322] bg-[#FAF7F2] hover:bg-[#4C3322]/5' },
                       { id: 'book', label: 'Books', icon: 'fas fa-book', color: 'text-[#4C3322] bg-[#FAF7F2] hover:bg-[#4C3322]/5' }
                    ].map(action => (
                        <button 
                          key={action.id}
                          onClick={() => setActiveActionTab(action.id as any)}
                          className="flex flex-col items-center gap-2 group cursor-pointer"
                        >
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 shadow-sm group-hover:scale-105 ${action.color}`}>
                              <i className={action.icon}></i>
                           </div>
                           <span className="text-[10px] font-bold text-[#4C3322]/80">{action.label}</span>
                        </button>
                    ))}
                 </div>

                 <h3 className="text-[10px] font-bold text-[#4C3322]/50 uppercase tracking-widest mb-4">Share Core Activities</h3>
                 <div className="grid grid-cols-4 gap-4">
                 {[
                   { id: 'games', label: 'Challenges', icon: 'fas fa-gamepad', color: 'text-[#8BAB70] bg-[#8BAB70]/5 hover:bg-[#8BAB70]/10' },
                   { id: 'travel', label: 'Travel', icon: 'fas fa-plane', color: 'text-[#4C3322] bg-[#FAF7F2] hover:bg-[#4C3322]/5' },
                   { id: 'events', label: 'Events', icon: 'fas fa-calendar-alt', color: 'text-[#DE7A49] bg-[#DE7A49]/5 hover:bg-[#DE7A49]/10' },
                   { id: 'groups', label: 'Gatherings', icon: 'fas fa-users', color: 'text-[#8BAB70] bg-[#8BAB70]/5 hover:bg-[#8BAB70]/10' }
                 ].map(action => (
                     <button 
                       key={action.id}
                       onClick={() => setActiveActionTab(action.id as any)}
                       className="flex flex-col items-center gap-2 group cursor-pointer"
                     >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 shadow-sm group-hover:scale-105 ${action.color}`}>
                           <i className={action.icon}></i>
                        </div>
                        <span className="text-[10px] font-bold text-[#4C3322]/80">{action.label}</span>
                     </button>
                 ))}
                 </div>
              </div>
           ) : (
              <div className="flex flex-col h-72">
                 <div className="flex items-center justify-between p-4 border-b border-[#4C3322]/10 bg-[#FAF7F2]/50">
                    <button onClick={() => setActiveActionTab(null)} className="text-[#4C3322]/70 hover:text-[#4C3322] px-2 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                       <i className="fas fa-chevron-left"></i> Back
                    </button>
                    <span className="font-bold text-xs uppercase tracking-widest text-[#4C3322] flex items-center gap-2">
                       Select {activeActionTab === 'games' ? 'Challenge' : activeActionTab === 'groups' ? 'Gathering' : activeActionTab}
                    </span>
                    <div className="w-12"></div>
                 </div>
                 
                 <div className="flex-grow overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {activeActionTab === 'games' && mockChallenges.map(c => (
                       <div key={c.id} onClick={() => handleSendAttachment('game', c)} className="flex items-center gap-4 p-3 hover:bg-[#8BAB70]/5 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-[#8BAB70]/15">
                          <img src={c.image} className="w-11 h-11 rounded-xl object-cover border border-[#4C3322]/10 shadow-sm" alt="" />
                          <div className="flex-grow">
                             <p className="text-xs font-bold text-[#4C3322]">{c.name}</p>
                             <p className="text-[9px] text-[#4C3322]/60 flex items-center gap-1.5 mt-0.5"><i className="fas fa-trophy text-[#8BAB70]"></i> {c.reward}</p>
                          </div>
                       </div>
                    ))}
                    
                    {activeActionTab === 'gif' && (
                        <div className="grid grid-cols-2 gap-2">
                            {mockGifs.map(g => (
                                <div key={g.id} onClick={() => handleSendAttachment('gif', g)} className="cursor-pointer overflow-hidden rounded-xl border border-transparent hover:border-[#DE7A49]/50 transition-all">
                                    <img src={g.url} alt={g.title} className="w-full h-24 object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeActionTab === 'music' && mockMusic.map(m => (
                       <div key={m.id} onClick={() => handleSendAttachment('music', m)} className="flex items-center gap-4 p-3 hover:bg-[#4C3322]/5 rounded-2xl cursor-pointer transition-colors border border-transparent">
                          <img src={m.imageUrl} className="w-11 h-11 rounded-xl object-cover border border-[#4C3322]/10 shadow-sm" alt="" />
                          <div className="flex-grow">
                             <p className="text-xs font-bold text-[#4C3322]">{m.title}</p>
                             <p className="text-[9px] text-[#4C3322]/60 mt-0.5">{m.subtitle}</p>
                          </div>
                       </div>
                    ))}
                    {activeActionTab === 'movie' && mockMovies.map(m => (
                       <div key={m.id} onClick={() => handleSendAttachment('movie', m)} className="flex items-center gap-4 p-3 hover:bg-[#4C3322]/5 rounded-2xl cursor-pointer transition-colors border border-transparent">
                          <img src={m.imageUrl} className="w-11 h-15 rounded-xl object-cover border border-[#4C3322]/10 shadow-sm" alt="" />
                          <div className="flex-grow">
                             <p className="text-xs font-bold text-[#4C3322]">{m.title}</p>
                             <p className="text-[9px] text-[#4C3322]/60 mt-0.5">{m.subtitle}</p>
                          </div>
                       </div>
                    ))}
                    {activeActionTab === 'book' && mockBooks.map(b => (
                       <div key={b.id} onClick={() => handleSendAttachment('book', b)} className="flex items-center gap-4 p-3 hover:bg-[#4C3322]/5 rounded-2xl cursor-pointer transition-colors border border-transparent">
                          <img src={b.imageUrl} className="w-11 h-15 rounded-xl object-cover border border-[#4C3322]/10 shadow-sm" alt="" />
                          <div className="flex-grow">
                             <p className="text-xs font-bold text-[#4C3322]">{b.title}</p>
                             <p className="text-[9px] text-[#4C3322]/60 mt-0.5">{b.subtitle}</p>
                          </div>
                       </div>
                    ))}
                    {activeActionTab === 'travel' && mockTravelPlans.map(t => (
                       <div key={t.id} onClick={() => handleSendAttachment('travel', t)} className="flex items-center gap-4 p-3 hover:bg-[#8BAB70]/5 rounded-2xl cursor-pointer transition-colors border border-transparent">
                          <img src={t.image} className="w-11 h-11 rounded-xl object-cover border border-[#4C3322]/10 shadow-sm" alt="" />
                          <div className="flex-grow">
                             <p className="text-xs font-bold text-[#4C3322]">{t.name}</p>
                             <p className="text-[9px] text-[#4C3322]/60 mt-0.5">{t.location}</p>
                          </div>
                       </div>
                    ))}
                    {activeActionTab === 'events' && mockEvents.map(e => (
                       <div key={e.id} onClick={() => handleSendAttachment('event', e)} className="flex items-center gap-4 p-3 hover:bg-[#DE7A49]/5 rounded-2xl cursor-pointer transition-colors border border-transparent">
                          <img src={e.image} className="w-11 h-11 rounded-xl object-cover border border-[#4C3322]/10 shadow-sm" alt="" />
                          <div className="flex-grow">
                             <p className="text-xs font-bold text-[#4C3322]">{e.name}</p>
                             <p className="text-[9px] text-[#4C3322]/60 mt-0.5">{new Date(e.date).toLocaleDateString()}</p>
                          </div>
                       </div>
                    ))}
                    {activeActionTab === 'groups' && mockGroups.map(g => (
                       <div key={g.id} onClick={() => handleSendAttachment('group', g)} className="flex items-center gap-4 p-3 hover:bg-[#8BAB70]/5 rounded-2xl cursor-pointer transition-colors border border-transparent">
                          <img src={g.image} className="w-11 h-11 rounded-xl object-cover border border-[#4C3322]/10 shadow-sm" alt="" />
                          <div className="flex-grow">
                             <p className="text-xs font-bold text-[#4C3322]">{g.name}</p>
                             <p className="text-[9px] text-[#4C3322]/60 mt-0.5">{g.members.length} members</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </div>
      )}

      {/* 4. Action Input Bar */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-[#4C3322]/10 flex items-center gap-3 relative z-40">
        <button
           type="button"
           onClick={() => setShowActions(!showActions)}
           className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm flex-shrink-0 cursor-pointer ${
             showActions 
               ? 'bg-[#4C3322] text-[#FAF7F2] rotate-45' 
               : 'bg-[#4C3322]/5 text-[#4C3322] hover:bg-[#4C3322]/10'
           }`}
        >
           <i className="fas fa-plus text-lg"></i>
        </button>
        
        <div className="flex-grow relative">
           <input
             type="text"
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="Type a dialogue message..."
             className="w-full pl-6 pr-12 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] focus:ring-1 focus:ring-[#8BAB70] text-[#4C3322] placeholder-[#4C3322]/40 text-sm transition-all font-outfit"
           />
           <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4C3322]/40 hover:text-[#4C3322] transition-colors cursor-pointer">
              <i className="far fa-smile text-lg"></i>
           </button>
        </div>
        
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-12 h-12 bg-[#4C3322] hover:bg-[#8BAB70] text-white rounded-2xl shadow-md transition-all flex-shrink-0 flex items-center justify-center disabled:opacity-50 disabled:scale-100 disabled:shadow-none cursor-pointer"
        >
          <i className="fas fa-paper-plane text-sm ml-0.5"></i>
        </button>
      </form>
    </div>
  );
};