import React, { useState, useEffect, useRef } from 'react';
import { chatWithSystemBot } from '../services/geminiService';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "What is Cereen?",
  "How can I find travel buddies?",
  "Tell me about AI companions",
  "How do I book wellness sessions?"
];

export const HomepageChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hello! I am your Cereen Wellness Assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPulse, setHasPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasPulse(false); // Stop pulsing once opened
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      // Map Message format to chatWithSystemBot format
      const history = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const responseText = await chatWithSystemBot(history, userMsg.text);

      const botMsg: Message = {
        sender: 'bot',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        sender: 'bot',
        text: "I am having trouble connecting to the network. Please check your internet connection.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-full bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] shadow-2xl flex items-center justify-center border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 group relative ${
            hasPulse ? 'animate-bounce' : ''
          }`}
          title="Chat with Cereen Assistant"
        >
          {/* Subtle Outer Glow Pulse */}
          {hasPulse && (
            <span className="absolute -inset-1 rounded-full bg-[#8BAB70]/40 animate-ping opacity-75 z-[-1]"></span>
          )}
          <i className="fas fa-comment-dots text-xl transition-transform duration-300 group-hover:rotate-6"></i>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="bg-[#FAF7F2]/95 backdrop-blur-md border border-[#4C3322]/15 rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(76,51,34,0.25)] flex flex-col w-[350px] sm:w-[380px] h-[500px] max-h-[80vh] overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-[#4C3322] px-6 py-4 flex items-center justify-between text-[#FAF7F2]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF7F2]/10 border border-[#FAF7F2]/20 flex items-center justify-center relative">
                <i className="fas fa-seedling text-sm text-[#8BAB70]"></i>
                {/* Online blinking dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#4C3322] rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold tracking-tight">Cereen Assistant</h3>
                <span className="text-[10px] text-[#FAF7F2]/60 uppercase tracking-widest font-light">Online & Ready</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>

          {/* Quick Suggestions Banner */}
          <div className="px-4 pt-3 pb-2 bg-[#FAF7F2] border-b border-[#4C3322]/5">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-[10px] font-semibold text-[#4C3322]/70 bg-white hover:bg-[#8BAB70] hover:text-white border border-[#4C3322]/10 rounded-full transition-all duration-300 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar bg-[#FAF7F2]/50">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-[1.25rem] text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-[#4C3322] text-[#FAF7F2] rounded-tr-none'
                        : 'bg-white text-[#4C3322] border border-[#4C3322]/10 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1.5 ${
                        isUser ? 'text-[#FAF7F2]/60' : 'text-[#4C3322]/40'
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-[#4C3322]/10 px-4 py-3 rounded-[1.25rem] rounded-tl-none flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#4C3322]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#4C3322]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#4C3322]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#4C3322]/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage(inputVal);
              }}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-full border border-[#4C3322]/15 bg-[#FAF7F2]/40 text-[#4C3322] placeholder-[#4C3322]/30 focus:outline-none focus:border-[#8BAB70] focus:bg-white text-xs transition-all disabled:opacity-60"
            />
            <button
              onClick={() => handleSendMessage(inputVal)}
              disabled={!inputVal.trim() || isLoading}
              className="w-9 h-9 rounded-full bg-[#4C3322] hover:bg-[#8BAB70] text-white flex items-center justify-center shadow transition-all duration-300 disabled:opacity-40 disabled:hover:bg-[#4C3322]"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
