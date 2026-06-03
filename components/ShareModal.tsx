import React, { useState } from 'react';
import { ShareContentResult } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  content: ShareContentResult | null;
  error: string | null;
  title: string;
}

type Platform = 'facebook' | 'instagram' | 'threads' | 'whatsapp' | 'linkedin';

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, loading, content, error, title }) => {
  const [activeTab, setActiveTab] = useState<Platform>('whatsapp');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareExternal = () => {
    if (!content) return;
    
    const text = encodeURIComponent(content[activeTab]);
    const url = encodeURIComponent(window.location.href); 
    let shareUrl = '';

    switch (activeTab) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'threads':
            shareUrl = `https://threads.net/intent/post?text=${text}%20${url}`;
            break;
        case 'instagram':
            handleCopy();
            alert("Content copied! Opening Instagram...");
            shareUrl = 'https://instagram.com';
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=500');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'fab fa-facebook-f';
      case 'instagram': return 'fab fa-instagram';
      case 'threads': return 'fab fa-threads';
      case 'whatsapp': return 'fab fa-whatsapp';
      case 'linkedin': return 'fab fa-linkedin-in';
      default: return 'fas fa-share-alt';
    }
  };

  const getPlatformColor = (platform: string) => {
      switch(platform) {
          case 'facebook': return 'bg-[#1877F2] text-white';
          case 'whatsapp': return 'bg-[#25D366] text-white';
          case 'linkedin': return 'bg-[#0A66C2] text-white';
          case 'instagram': return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white';
          case 'threads': return 'bg-black text-white';
          default: return 'bg-gray-100 text-[#4C3322]';
      }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#4C3322]/50 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up font-outfit text-[#4C3322]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#4C3322]/10 flex justify-between items-center bg-[#FAF7F2]">
          <h3 className="text-xl font-serif font-black text-[#4C3322] flex items-center gap-2">
              <i className="fas fa-share-alt text-[#8BAB70]"></i> {title}
          </h3>
          <button onClick={onClose} className="hover:bg-[#4C3322]/5 rounded-full w-8 h-8 flex items-center justify-center text-[#4C3322]/50 hover:text-[#4C3322] transition-colors cursor-pointer border border-[#4C3322]/10 bg-white">
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner />
              <p className="mt-6 text-sm text-[#4C3322]/60 animate-pulse font-light">
                Advisory AI is crafting the alignment caption...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-center">
              <i className="fas fa-exclamation-triangle mb-2 text-xl"></i>
              <p className="text-sm">{error}</p>
            </div>
          ) : content ? (
            <>
              {/* Platform Selector Buttons */}
              <div className="flex justify-center flex-wrap gap-3 mb-6">
                {(['whatsapp', 'facebook', 'instagram', 'linkedin', 'threads'] as const).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => { setActiveTab(platform); setCopied(false); }}
                    className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 shadow-sm cursor-pointer ${
                      activeTab === platform
                        ? `${getPlatformColor(platform)} ring-2 ring-[#4C3322]/20 transform scale-[1.05]`
                        : 'bg-[#FAF7F2] border border-[#4C3322]/10 text-[#4C3322]/50 hover:text-[#4C3322]'
                    }`}
                    title={platform}
                  >
                    <i className={`${getPlatformIcon(platform)} text-base`}></i>
                  </button>
                ))}
              </div>

              {/* Caption Text Box */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#4C3322]/10 mb-6 relative min-h-[100px] shadow-inner">
                <p className="text-[#4C3322] text-sm leading-relaxed whitespace-pre-wrap font-light italic">
                  "{content[activeTab]}"
                </p>
                <div className="absolute top-2.5 right-2.5">
                    <button onClick={handleCopy} className="text-[#4C3322]/40 hover:text-[#8BAB70] transition-colors p-1.5 cursor-pointer">
                        <i className={`fas ${copied ? 'fa-check text-[#8BAB70]' : 'fa-copy'}`}></i>
                    </button>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCopy}
                    className="py-3.5 border border-[#4C3322]/20 hover:bg-[#4C3322]/5 text-[#4C3322] font-bold text-xs uppercase tracking-wider rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-copy"></i> Copy Caption
                  </button>
                  
                  <button
                    onClick={handleShareExternal}
                    className="py-3.5 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-external-link-alt"></i> Open {activeTab === 'whatsapp' ? 'WhatsApp' : 'Platform'}
                  </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
