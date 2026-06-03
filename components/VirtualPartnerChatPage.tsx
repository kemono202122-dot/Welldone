import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { VirtualPartnerChatMessage } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { getVirtualPartnerWelcome } from '../services/geminiService'; 

// --- Audio Helper Functions (Gemini Live API Standards) ---
function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    const s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return {
    data: uint8ArrayToBase64(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const VirtualPartnerChatPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!context) {
    throw new Error('AppContext must be used within an AppContext.Provider');
  }

  const {
    currentUser,
    virtualPartner,
    virtualPartnerChatHistory,
    sendVirtualPartnerMessage,
    errorVirtualPartner,
    isDarkMode, 
    updateVirtualPartner
  } = context;

  const [inputText, setInputText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // --- Voice Call State ---
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnectingCall, setIsConnectingCall] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'listening' | 'speaking'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  
  // Refs for Audio Handling
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const scheduledSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null); 

  // Redirect if no user or virtual partner is logged in/created
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (!virtualPartner) {
      navigate('/virtual-partner/create');
    }
  }, [currentUser, virtualPartner, navigate]);

  // Automatic Welcome Message
  useEffect(() => {
      const initChat = async () => {
          if (virtualPartner && currentUser && virtualPartnerChatHistory.length === 0 && !isInitializing) {
              setIsInitializing(true);
              await sendVirtualPartnerMessage("Say a warm, realistic welcome message to me based on your persona.");
              setIsInitializing(false);
          }
      };
      
      initChat();
  }, [virtualPartner, currentUser, virtualPartnerChatHistory.length]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [virtualPartnerChatHistory, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endVoiceCall();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const sendMessage = async (text: string) => {
      if (text.trim() && sendVirtualPartnerMessage && !isSendingMessage) {
        setIsSendingMessage(true);
        try {
          await sendVirtualPartnerMessage(text);
        } catch (error) {
          // Error handled by App.tsx
        } finally {
          setIsSendingMessage(false);
        }
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = inputText;
    setInputText('');
    sendMessage(msg);
  };

  const handleQuickAction = (action: string) => {
      let prompt = "";
      switch(action) {
          case 'game':
              prompt = "I want to play a game! Suggest something fun like 20 Questions, Trivia, or a Roleplay scenario.";
              break;
          case 'hobbies':
              prompt = "Let's talk about our hobbies. What are you into lately? Here's what I like...";
              break;
          case 'health':
              prompt = "Can we do a quick health and wellness check-in? Ask me about my sleep, water, and mood.";
              break;
          case 'advice':
              prompt = "I need some advice regarding a family or personal problem. Can you listen and help me think it through?";
              break;
      }
      if(prompt) sendMessage(prompt);
  };

  const getProgressBarColor = (value: number) => {
    if (value > 75) return 'bg-[#8BAB70]';
    if (value > 45) return 'bg-[#DE7A49]';
    return 'bg-[#DE7A49]/70';
  }

  // --- Voice Call Logic ---
  const startVoiceCall = async () => {
    if (!virtualPartner) return;
    setIsCallActive(true);
    setIsConnectingCall(true);
    setCallStatus('connecting');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const systemInstruction = `
        You are ${virtualPartner.name}. 
        Role: ${virtualPartner.relationshipType || 'Wellness Partner'}.
        Personality Traits: ${virtualPartner.personalityTraits.join(', ')}.
        Communication Style: ${virtualPartner.communicationStyle || 'Supportive and Kind'}.
        Bio: ${virtualPartner.bio}.
        Current Scenario: ${virtualPartner.currentScenario || 'None'}.
        
        Act as a voice companion. Keep responses relatively concise and conversational, suitable for spoken dialogue. 
        Be warm, engaging, and react to the user's emotions.
      `;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, 
          },
          systemInstruction: systemInstruction,
        },
        callbacks: {
          onopen: () => {
            console.log('Voice session connected');
            setCallStatus('listening');
            setIsConnectingCall(false);

            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                 session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setCallStatus('speaking'); 
              
              const ctx = outputAudioContextRef.current;
              if (ctx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                  base64ToUint8Array(base64Audio),
                  ctx,
                  24000,
                  1
                );

                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                
                source.addEventListener('ended', () => {
                   scheduledSourcesRef.current.delete(source);
                   if (scheduledSourcesRef.current.size === 0) {
                       setCallStatus('listening'); 
                   }
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                scheduledSourcesRef.current.add(source);
              }
            }

            if (message.serverContent?.interrupted) {
                console.log("Model interrupted");
                scheduledSourcesRef.current.forEach(src => {
                    src.stop();
                });
                scheduledSourcesRef.current.clear();
                if (outputAudioContextRef.current) {
                    nextStartTimeRef.current = outputAudioContextRef.current.currentTime;
                }
                setCallStatus('listening');
            }
          },
          onclose: () => {
            console.log('Voice session closed');
            endVoiceCall();
          },
          onerror: (err) => {
            console.error('Voice session error:', err);
            endVoiceCall();
          }
        }
      });

      sessionPromise.then(session => {
          sessionRef.current = session;
      });

    } catch (err) {
      console.error("Failed to start voice call", err);
      setIsCallActive(false);
      setIsConnectingCall(false);
      alert("Could not start voice call. Please check microphone permissions.");
    }
  };

  const endVoiceCall = () => {
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    if (inputAudioContextRef.current) {
        inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
        outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }
    scheduledSourcesRef.current.clear();
    if (sessionRef.current) {
        sessionRef.current = null;
    }

    setIsCallActive(false);
    setCallStatus('connecting');
  };

  if (!currentUser || !virtualPartner) {
    return null;
  }

  const isTyping = virtualPartnerChatHistory.length > 0 && virtualPartnerChatHistory[virtualPartnerChatHistory.length - 1].text === '...' && virtualPartnerChatHistory[virtualPartnerChatHistory.length - 1].isVirtualPartner;
  
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden select-none selection:bg-[#8BAB70] selection:text-white">
      
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 mb-6 border-b border-[#4C3322]/5 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/virtual-partner/create')}
            className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Back to Setup Profile"
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

        {/* Dynamic header items */}
        <div className="flex items-center gap-3">
          <button 
            onClick={startVoiceCall}
            className="w-9 h-9 rounded-full border border-[#4C3322]/15 bg-white/60 hover:bg-[#8BAB70] hover:text-[#FAF7F2] hover:border-[#8BAB70] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Start Solfeggio Voice Call"
          >
            <i className="fas fa-phone-alt text-xs"></i>
          </button>
          
          <div className="hidden sm:flex items-center gap-2.5 bg-white/55 border border-[#4C3322]/10 rounded-full px-4 py-1.5 shadow-sm text-xs font-bold text-[#4C3322]">
            <span>Relationship:</span>
            <div className="w-16 bg-[#FAF7F2] border border-[#4C3322]/5 rounded-full h-2 overflow-hidden">
              <div className="bg-[#8BAB70] h-full rounded-full" style={{ width: `${virtualPartner.relationshipMeter}%` }} />
            </div>
            <span className="text-[#8BAB70]">{virtualPartner.relationshipMeter}%</span>
          </div>
        </div>
      </header>

      {/* CORE CHAT CONTAINER (Max-w 7xl matching circles & wellness) */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-grow z-10 h-[calc(100vh-170px)]">
        
        {/* VOICE CALL OVERLAY BACKDROP */}
        {isCallActive && (
          <div className="fixed inset-0 z-50 bg-[#2E1F14]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-[#FAF7F2] animate-fade-in select-none">
            {/* Header info */}
            <div className="absolute top-6 left-8 right-8 flex justify-between items-center">
              <div className="flex items-center gap-2 bg-[#DE7A49]/10 border border-[#DE7A49]/20 px-3.5 py-1.5 rounded-full text-[#DE7A49]">
                <span className="w-1.5 h-1.5 bg-[#DE7A49] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider uppercase">Live Solfeggio Audio</span>
              </div>
              <button onClick={endVoiceCall} className="w-8 h-8 rounded-full border border-white/10 hover:bg-white/5 flex items-center justify-center transition-all">
                <i className="fas fa-compress-alt text-xs"></i>
              </button>
            </div>

            {/* Avatar Glowing Circles */}
            <div className="relative mb-8">
              {callStatus === 'speaking' && (
                <>
                  <div className="absolute inset-[-15px] rounded-full border-2 border-[#8BAB70]/30 animate-pulse pointer-events-none" />
                  <div className="absolute inset-[-30px] rounded-full border border-[#8BAB70]/10 animate-ping pointer-events-none" />
                </>
              )}
              {callStatus === 'listening' && (
                <div className="absolute inset-0 rounded-full bg-[#DE7A49]/10 blur-2xl animate-pulse pointer-events-none" />
              )}

              <img 
                src={virtualPartner.avatar} 
                alt={virtualPartner.name} 
                className="w-48 h-48 rounded-full object-cover border-4 border-white/10 shadow-2xl relative z-10" 
              />
              
              {isConnectingCall && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full z-20 backdrop-blur-sm">
                  <LoadingSpinner />
                </div>
              )}
            </div>

            {/* Companion information */}
            <h2 className="font-serif text-3xl font-black">{virtualPartner.name}</h2>
            <p className="text-sm font-semibold tracking-widest uppercase text-white/50 animate-pulse mt-2 mb-12">
              {isConnectingCall ? 'Connecting Session...' : 
               callStatus === 'speaking' ? 'Speaking...' : 
               callStatus === 'listening' ? 'Listening...' : 'Connected'}
            </p>

            {/* controls */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  const newMuted = !isMuted;
                  setIsMuted(newMuted);
                  // Mute/unmute actual mic tracks on the stream
                  if (mediaStreamRef.current) {
                    mediaStreamRef.current.getAudioTracks().forEach(track => {
                      track.enabled = !newMuted;
                    });
                  }
                }}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  isMuted
                    ? 'bg-[#DE7A49] border-[#DE7A49] text-white'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'} text-sm`}></i>
              </button>
              <button 
                onClick={endVoiceCall}
                className="w-20 h-20 rounded-full bg-[#DE7A49] hover:bg-[#DE7A49]/80 text-[#FAF7F2] shadow-2xl shadow-[#DE7A49]/20 flex items-center justify-center transition-all transform hover:scale-105"
              >
                <i className="fas fa-phone-slash text-2xl"></i>
              </button>
              <button
                onClick={() => setIsSpeakerOff(s => !s)}
                title={isSpeakerOff ? 'Enable Speaker' : 'Disable Speaker'}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  isSpeakerOff
                    ? 'bg-white/20 border-white/20 text-white/50'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                <i className={`fas ${isSpeakerOff ? 'fa-volume-mute' : 'fa-volume-up'} text-sm`}></i>
              </button>
            </div>
          </div>
        )}

        {/* CHAT DISPLAY SCREEN (8 Cols) */}
        <main className="lg:col-span-8 flex flex-col bg-white border border-[#4C3322]/10 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[500px]">
          
          {/* Quick actions panel */}
          <div className="bg-[#FAF7F2]/60 border-b border-[#4C3322]/5 px-4 py-2.5 flex gap-2 overflow-x-auto no-scrollbar select-none">
            <button onClick={() => handleQuickAction('game')} className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-[#4C3322]/10 text-[10px] font-bold uppercase tracking-wider text-[#4C3322] hover:bg-[#8BAB70]/10 hover:border-[#8BAB70] hover:text-[#8BAB70] transition-colors flex items-center gap-1.5">
              <i className="fas fa-gamepad text-xs"></i> Play Game
            </button>
            <button onClick={() => handleQuickAction('hobbies')} className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-[#4C3322]/10 text-[10px] font-bold uppercase tracking-wider text-[#4C3322] hover:bg-[#8BAB70]/10 hover:border-[#8BAB70] hover:text-[#8BAB70] transition-colors flex items-center gap-1.5">
              <i className="fas fa-puzzle-piece text-xs"></i> Hobbies
            </button>
            <button onClick={() => handleQuickAction('health')} className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-[#4C3322]/10 text-[10px] font-bold uppercase tracking-wider text-[#4C3322] hover:bg-[#8BAB70]/10 hover:border-[#8BAB70] hover:text-[#8BAB70] transition-colors flex items-center gap-1.5">
              <i className="fas fa-heartbeat text-xs"></i> Wellness Check
            </button>
            <button onClick={() => handleQuickAction('advice')} className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-[#4C3322]/10 text-[10px] font-bold uppercase tracking-wider text-[#4C3322] hover:bg-[#8BAB70]/10 hover:border-[#8BAB70] hover:text-[#8BAB70] transition-colors flex items-center gap-1.5">
              <i className="fas fa-comments text-xs"></i> Life Advice
            </button>
          </div>

          {/* Messages feed */}
          <div className="flex-grow p-6 overflow-y-auto space-y-4 pr-3 custom-scrollbar scroll-smooth">
            {virtualPartnerChatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                 {isInitializing ? (
                   <div className="flex flex-col items-center gap-3">
                     <LoadingSpinner />
                     <span className="text-xs text-[#8BAB70] uppercase font-bold tracking-widest">Opening connection...</span>
                   </div>
                 ) : (
                   <p className="text-xs font-semibold uppercase tracking-wider text-[#4C3322]/40">Start the mindfulness conversation with {virtualPartner.name}!</p>
                 )}
              </div>
            ) : (
              virtualPartnerChatHistory.map((message) => {
                  if (!message.isVirtualPartner && message.text.includes("Say a warm, realistic welcome message")) return null;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.isVirtualPartner ? 'justify-start' : 'justify-end'} animate-fade-in`}
                    >
                      {message.isVirtualPartner && (
                        <img
                          src={virtualPartner.avatar}
                          alt={virtualPartner.name}
                          className="w-8 h-8 rounded-full mr-2 object-cover self-end border border-[#4C3322]/15 shadow-sm"
                        />
                      )}
                      <div
                        className={`max-w-xs md:max-w-md p-4 rounded-3xl text-sm leading-relaxed ${
                          message.isVirtualPartner
                            ? 'bg-[#FAF7F2]/60 border border-[#4C3322]/10 text-[#4C3322] rounded-bl-none shadow-sm'
                            : 'bg-[#4C3322] text-[#FAF7F2] rounded-br-none shadow-md'
                        }`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1 select-none opacity-50">
                          {message.isVirtualPartner ? virtualPartner.name : currentUser.name.split(' ')[0]}
                        </p>
                        <p className="font-light">{message.text}</p>
                        <span className="block text-[9px] text-right opacity-40 mt-1 select-none font-bold">
                          {message.text !== '...' ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      {!message.isVirtualPartner && (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-8 h-8 rounded-full ml-2 object-cover self-end border border-[#4C3322]/15 shadow-sm"
                        />
                      )}
                    </div>
                  );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {errorVirtualPartner && (
            <div className="bg-[#DE7A49]/10 border border-[#DE7A49]/20 text-[#DE7A49] text-xs font-bold px-5 py-3 rounded-2xl mx-6 mb-3 shadow-inner flex items-center gap-2">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{errorVirtualPartner}</span>
            </div>
          )}

          {/* Form input field */}
          <form onSubmit={handleSubmit} className="p-4 bg-[#FAF7F2]/40 border-t border-[#4C3322]/5 flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={`Message ${virtualPartner.name} guides...`}
              className="flex-grow px-5 py-3.5 border border-[#4C3322]/10 rounded-full focus:outline-none focus:border-[#8BAB70] focus:bg-white bg-white text-sm text-[#4C3322] placeholder-[#4C3322]/40 shadow-inner transition-all"
              disabled={isSendingMessage || isTyping}
              aria-label={`Message ${virtualPartner.name}`}
            />
            <button
              type="submit"
              className="w-12 h-12 bg-[#4C3322] text-[#FAF7F2] rounded-full hover:bg-[#8BAB70] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-300 shadow disabled:opacity-30 disabled:pointer-events-none cursor-pointer shrink-0"
              disabled={!inputText.trim() || isSendingMessage || isTyping}
            >
              {isSendingMessage ? <LoadingSpinner /> : <i className="fas fa-paper-plane text-xs"></i>}
            </button>
          </form>
        </main>

        {/* GAMEPLAY DYNAMICS SIDEBAR (4 Cols - Hidden on mobile) */}
        <aside className="lg:col-span-4 bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm flex flex-col justify-between hidden lg:flex select-none">
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-black text-[#4C3322] border-b border-[#4C3322]/5 pb-3">Dynamics Index</h3>

            {/* Current Scenario Context */}
            <div className="bg-[#FAF7F2]/60 border border-[#4C3322]/10 p-4 rounded-3xl shadow-inner space-y-1">
              <span className="text-[9px] font-bold text-[#4C3322]/40 uppercase tracking-wide">Current Context</span>
              <p className="text-xs text-[#4C3322]/80 leading-relaxed font-light italic">
                {virtualPartner.currentScenario || "Observing mindfulness breathing sessions."}
              </p>
            </div>

            {/* Emotional indices */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-bold text-[#4C3322]/40 uppercase tracking-wide ml-1 block">Emotional Indices</span>
              <div className="space-y-3">
                {['happiness', 'motivation', 'trust'].map((emotionKey) => {
                  const value = virtualPartner.emotionalState[emotionKey as keyof typeof virtualPartner.emotionalState];
                  return (
                    <div key={emotionKey} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase text-[#4C3322]/70">
                        <span>{emotionKey}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="w-full bg-[#FAF7F2] border border-[#4C3322]/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`${getProgressBarColor(value)} h-full rounded-full transition-all duration-1000`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Goals checklists */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold text-[#4C3322]/40 uppercase tracking-wide ml-1 block">Shared Goals Progress</span>
              <ul className="text-xs text-[#4C3322] space-y-2">
                {virtualPartner.relationshipGoals.map((goal, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {goal.complete ? (
                      <i className="fas fa-check-circle text-[#8BAB70] text-sm shrink-0"></i>
                    ) : (
                      <i className="far fa-circle text-[#4C3322]/20 text-sm shrink-0"></i>
                    )}
                    <span className={`truncate font-medium ${goal.complete ? 'line-through text-[#4C3322]/40' : 'text-[#4C3322]'}`}>{goal.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick dynamic tips box */}
          <div className="bg-gradient-to-br from-[#4C3322] to-[#2E1F14] text-[#FAF7F2] rounded-3xl p-5 shadow-md relative overflow-hidden select-none">
            <span className="text-[9px] tracking-[0.25em] font-bold text-[#8BAB70] uppercase">mindful guide</span>
            <p className="text-[10px] font-light leading-relaxed italic opacity-85 mt-2">
              Discussing exercises or checking in elevates the trust index, completing the goals checklist logs.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
};
