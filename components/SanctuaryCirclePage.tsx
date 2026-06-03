import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { User, Post } from '../types';

export const SanctuaryCirclePage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  // Reflection Input States
  const [reflectionText, setReflectionText] = useState('');
  const [focusTag, setFocusTag] = useState<string>('Gratitude');
  const [location, setLocation] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showAttachInput, setShowAttachInput] = useState(false);

  // Comments Thread States
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [visibleReplies, setVisibleReplies] = useState<Record<string, boolean>>({});

  // Share Notification Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!context) return null;
  const { 
    currentUser, allUsers, createPost, likePost, commentOnPost, sharePost 
  } = context;

  // Security Redirect: Return user if not logged in
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // Auto-dismiss share toast
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Prepend and sort all posts from all users to show the global feed
  const reflectionsList = allUsers
    .flatMap(user => user.posts || [])
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Match Author of post
  const getPostAuthor = (authorId: string) => {
    return allUsers.find(u => u.id === authorId) || {
      name: 'Cereen Reader',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      occupation: 'Practitioner'
    } as User;
  };

  // Handle Publish Reflection
  const handlePublishReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    if (createPost) {
      // Map focusTag to 'feeling' parameter and create post globally
      createPost(
        reflectionText, 
        mediaUrl.trim() ? mediaUrl : undefined, 
        undefined, 
        location.trim() ? location : undefined, 
        focusTag
      );

      // Reset Inputs
      setReflectionText('');
      setLocation('');
      setMediaUrl('');
      setShowAttachInput(false);
      triggerToast("Reflection published successfully to the Sanctuary Circle.");
    }
  };

  // Handle Comments Submission
  const handleAddReply = (post: Post) => {
    const text = replyInputs[post.id];
    if (text?.trim() && commentOnPost) {
      commentOnPost(post.authorId, post.id, text);
      setReplyInputs(prev => ({ ...prev, [post.id]: '' }));
      setVisibleReplies(prev => ({ ...prev, [post.id]: true }));
    }
  };

  // Handle Share Click
  const handleShareClick = (postOwnerId: string, postId: string) => {
    if (sharePost) {
      sharePost(postOwnerId, postId);
      triggerToast("Link copied! Reflection shared within Cereen library.");
    }
  };

  // Presets of focus tags
  const focusOptions = ['Gratitude', 'Breathwork', 'Stillness', 'Nature', 'Hydration'];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4C3322] font-outfit p-4 md:p-6 lg:p-8 flex flex-col relative overflow-hidden select-none selection:bg-[#8BAB70] selection:text-white">
      
      {/* Background blur nodes */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8BAB70]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#DE7A49]/5 blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 mb-6 border-b border-[#4C3322]/5 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 rounded-full border border-[#4C3322]/10 hover:bg-[#4C3322] hover:text-[#FAF7F2] flex items-center justify-center transition-all cursor-pointer"
            title="Back to Dashboard"
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

        {/* User Badge */}
        <div className="flex items-center gap-3 bg-white/50 border border-[#4C3322]/10 rounded-full px-4 py-1.5 shadow-sm">
          <img 
            src={currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"} 
            className="w-7 h-7 rounded-full border border-[#4C3322]/10 object-cover shadow-sm"
            alt="Avatar"
          />
          <span className="text-xs font-semibold hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
        </div>
      </header>

      {/* CORE GRID LAYOUT */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1 z-10">
        
        {/* LEFT COLUMN: REFLECTIONS FEED (8 Cols) */}
        <main className="lg:col-span-8 space-y-6">
          
          {/* Sanctuary Banner */}
          <div className="bg-white/40 border border-[#4C3322]/10 rounded-[2rem] p-6 shadow-sm">
            <h2 className="font-serif text-2xl md:text-3xl font-black text-[#4C3322]">The Sanctuary Circle</h2>
            <p className="text-sm text-[#4C3322]/70 font-light mt-1">A quiet community workspace to share gratitude logs, focus tracks, and mindful stories.</p>
          </div>

          {/* Publish reflection card */}
          <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm space-y-4">
            <div className="flex gap-4 items-start">
              <img 
                src={currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"} 
                className="w-10 h-10 rounded-full border border-[#4C3322]/10 object-cover"
                alt="My Avatar"
              />
              <div className="flex-grow">
                <form onSubmit={handlePublishReflection} className="space-y-4">
                  <textarea 
                    placeholder={`Share a daily reflection or mindfulness logs, ${currentUser.name.split(' ')[0]}...`}
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    required
                    className="w-full bg-[#FAF7F2]/60 border border-[#4C3322]/10 rounded-2xl p-4 focus:outline-none focus:border-[#8BAB70] focus:bg-white text-sm text-[#4C3322] placeholder-[#4C3322]/40 resize-none h-24 shadow-inner"
                  />

                  {/* Extra inputs (media & location) */}
                  {showAttachInput && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#4C3322]/60 uppercase ml-2">Attach Image URL</label>
                        <input 
                          type="url" 
                          placeholder="https://example.com/image.png"
                          value={mediaUrl}
                          onChange={(e) => setMediaUrl(e.target.value)}
                          className="w-full px-4 py-2 rounded-full border border-[#4C3322]/15 bg-[#FAF7F2]/40 text-xs focus:outline-none focus:border-[#8BAB70]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#4C3322]/60 uppercase ml-2">Add Location</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Kyoto Sanctuary"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full px-4 py-2 rounded-full border border-[#4C3322]/15 bg-[#FAF7F2]/40 text-xs focus:outline-none focus:border-[#8BAB70]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Bottom Panel */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#4C3322]/5">
                    {/* Presets Focus Selectors */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#4C3322]/50 tracking-wider mr-1">FOCUS:</span>
                      {focusOptions.map(tag => (
                        <button 
                          key={tag}
                          type="button"
                          onClick={() => setFocusTag(tag)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${focusTag === tag ? 'bg-[#4C3322] border-[#4C3322] text-[#FAF7F2]' : 'border-[#4C3322]/10 text-[#4C3322]/60 hover:bg-[#4C3322]/5'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Action Triggers */}
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => setShowAttachInput(!showAttachInput)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${showAttachInput ? 'bg-[#8BAB70]/10 border-[#8BAB70] text-[#8BAB70]' : 'border-[#4C3322]/10 text-[#4C3322]/60 hover:bg-[#4C3322]/5'}`}
                        title="Add image or location details"
                      >
                        <i className="fas fa-paperclip text-xs"></i>
                      </button>
                      <button 
                        type="submit"
                        disabled={!reflectionText.trim()}
                        className="px-5 py-2 bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] font-semibold text-xs rounded-full shadow transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        Publish Reflection
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* REFLECTIONS STREAM LIST */}
          <div className="space-y-6">
            {reflectionsList.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#4C3322]/10 rounded-[2.5rem] shadow-sm select-none">
                <p className="text-sm text-[#4C3322]/50 font-semibold tracking-wider">No reflections shared yet. Be the first to start the circle.</p>
              </div>
            ) : (
              reflectionsList.map((post) => {
                const author = getPostAuthor(post.authorId);
                const hasAppreciated = post.likes.includes(currentUser.id);

                return (
                  <div key={post.id} className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow transition-all duration-300 flex flex-col animate-fade-in">
                    
                    {/* User profile layout */}
                    <div className="p-6 flex justify-between items-start gap-4">
                      <div className="flex gap-3">
                        <img 
                          src={author.avatar} 
                          className="w-11 h-11 rounded-full object-cover border border-[#4C3322]/10 shadow-sm"
                          alt="Author"
                        />
                        <div>
                          <h4 className="font-bold text-sm leading-tight">{author.name}</h4>
                          <p className="text-[10px] text-[#4C3322]/50 uppercase tracking-wider font-semibold mt-0.5">{author.occupation || "Practitioner"}</p>
                        </div>
                      </div>

                      {/* Header tags (Focus, location, date) */}
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className="text-[9px] text-[#4C3322]/40 tracking-wider font-semibold">
                          {new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {post.feeling && (
                            <span className="px-2 py-0.5 rounded-full border border-[#8BAB70]/20 bg-[#8BAB70]/10 text-[#8BAB70] text-[9px] font-bold">
                              Focus: {post.feeling}
                            </span>
                          )}
                          {post.location && (
                            <span className="px-2 py-0.5 rounded-full border border-[#DE7A49]/20 bg-[#DE7A49]/10 text-[#DE7A49] text-[9px] font-bold">
                              <i className="fas fa-map-marker-alt mr-1"></i>{post.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="px-6 pb-4">
                      <p className="text-sm text-[#4C3322]/90 leading-relaxed whitespace-pre-wrap font-light">
                        {post.text}
                      </p>
                    </div>

                    {/* Optional Attach Image */}
                    {post.image && (
                      <div className="border-y border-[#4C3322]/5 bg-[#FAF7F2]/40 max-h-[450px] overflow-hidden flex items-center justify-center select-none">
                        <img 
                          src={post.image} 
                          className="w-full object-cover max-h-[450px] transition-transform duration-700 hover:scale-105" 
                          alt="Attachment" 
                        />
                      </div>
                    )}

                    {/* Stat counts */}
                    <div className="px-6 py-2.5 flex justify-between items-center text-[10px] font-bold text-[#4C3322]/40 border-b border-[#4C3322]/5 bg-[#FAF7F2]/10 select-none">
                      <span>{post.likes.length} Appreciated</span>
                      <div className="flex gap-4">
                        <span>{post.comments.length} Replies</span>
                        <span>{post.shares} Shared</span>
                      </div>
                    </div>

                    {/* Action trigger row */}
                    <div className="px-3 py-1 flex justify-between items-center select-none border-b border-[#4C3322]/5">
                      <button 
                        onClick={() => likePost(post.authorId, post.id)}
                        className={`flex-1 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${hasAppreciated ? 'text-[#8BAB70] bg-[#8BAB70]/5' : 'text-[#4C3322]/60 hover:bg-[#4C3322]/5'}`}
                      >
                        <i className={`fas fa-heart text-xs`}></i> Appreciate
                      </button>
                      <button 
                        onClick={() => setVisibleReplies(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 text-[#4C3322]/60 hover:bg-[#4C3322]/5 transition-all"
                      >
                        <i className="far fa-comment-alt text-xs"></i> Reply
                      </button>
                      <button 
                        onClick={() => handleShareClick(post.authorId, post.id)}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 text-[#4C3322]/60 hover:bg-[#4C3322]/5 transition-all"
                      >
                        <i className="fas fa-share text-xs"></i> Share
                      </button>
                    </div>

                    {/* Expandable replies list */}
                    {visibleReplies[post.id] && (
                      <div className="bg-[#FAF7F2]/40 border-t border-[#4C3322]/5 p-6 space-y-4">
                        {post.comments.length > 0 && (
                          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                            {post.comments.map(c => (
                              <div key={c.id} className="flex gap-3 items-start animate-fade-in">
                                <img src={c.userAvatar} className="w-8 h-8 rounded-full object-cover border border-[#4C3322]/10" alt="" />
                                <div className="bg-white border border-[#4C3322]/10 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm flex-grow">
                                  <div className="flex justify-between items-center text-[9px] text-[#4C3322]/50 font-bold mb-0.5">
                                    <span>{c.userName}</span>
                                    <span>Just now</span>
                                  </div>
                                  <p className="text-xs font-light leading-relaxed text-[#4C3322]">{c.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Input Box to reply */}
                        <div className="flex gap-2 items-center">
                          <img src={currentUser.avatar} className="w-8 h-8 rounded-full object-cover border border-[#4C3322]/10" alt="" />
                          <div className="flex-grow relative">
                            <input 
                              type="text"
                              placeholder="Write a mindful reply..."
                              value={replyInputs[post.id] || ''}
                              onChange={(e) => setReplyInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post)}
                              className="w-full px-5 py-2 rounded-full border border-[#4C3322]/15 bg-white text-xs focus:outline-none focus:border-[#8BAB70] shadow-sm text-[#4C3322] pr-10"
                            />
                            <button 
                              onClick={() => handleAddReply(post)} 
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#4C3322] text-[#FAF7F2] flex items-center justify-center hover:bg-[#8BAB70] transition-colors"
                              disabled={!replyInputs[post.id]?.trim()}
                            >
                              <i className="fas fa-paper-plane text-[9px]"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* RIGHT COLUMN: CIRCLE GUIDELINES & STATS (4 Cols) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Daily Quote Box */}
          <div className="bg-gradient-to-br from-[#4C3322] to-[#2E1F14] text-[#FAF7F2] rounded-[2.5rem] p-6 shadow-lg relative overflow-hidden select-none">
            <h4 className="font-serif text-lg font-black tracking-tight mb-2">Daily Alignment</h4>
            <p className="text-xs font-light leading-relaxed italic opacity-85">"Silence is not empty. It is full of answers. Take three deep breaths and ask yourself what you truly need today."</p>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#8BAB70]/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Sanctuary Guidelines Card */}
          <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm space-y-4 select-none">
            <h4 className="font-serif text-lg font-black tracking-tight flex items-center gap-2 text-[#4C3322]">
              <i className="fas fa-feather-alt text-xs text-[#8BAB70]"></i> Circle Guidelines
            </h4>
            <ul className="space-y-3 text-xs font-light text-[#4C3322]/70 leading-relaxed list-disc list-inside">
              <li>**Speak with Intention**: Post thoughtful journal notes and reflections. Avoid spam.</li>
              <li>**Appreciate Deeply**: Hit appreciate on stories that brought alignment to your day.</li>
              <li>**Focus Matters**: Classify your posts with relevant focus tag headers.</li>
            </ul>
          </div>

          {/* Community Stats Widget */}
          <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm space-y-4 select-none">
            <h4 className="font-serif text-lg font-black tracking-tight text-[#4C3322]">Community Focus Grids</h4>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[#4C3322]/80">Gratitude</span>
                <span className="bg-[#8BAB70]/10 text-[#8BAB70] font-bold px-2 py-0.5 rounded">42 Posts</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[#4C3322]/80">Breathwork</span>
                <span className="bg-[#8BAB70]/10 text-[#8BAB70] font-bold px-2 py-0.5 rounded">24 Posts</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[#4C3322]/80">Stillness</span>
                <span className="bg-[#8BAB70]/10 text-[#8BAB70] font-bold px-2 py-0.5 rounded">19 Posts</span>
              </div>
            </div>
          </div>

        </aside>
      </div>

      {/* Shared Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in bg-[#4C3322] text-[#FAF7F2] px-6 py-3.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-3">
          <svg className="w-5 h-5 text-[#8BAB70] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs md:text-sm font-semibold tracking-wide">{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
