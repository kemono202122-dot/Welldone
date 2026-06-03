import React, { useState } from 'react';
import { User, Post, Comment } from '../types';

interface StoryBoardProps {
  currentUser: User | null;
  posts: Post[];
  users: User[]; 
  onPostCreate?: (content: string, image?: string, video?: string, location?: string, feeling?: string) => void;
  onLike: (postOwnerId: string, postId: string) => void;
  onComment: (postOwnerId: string, postId: string, text: string) => void;
  onShare: (postOwnerId: string, postId: string) => void; 
  showCreateBox?: boolean;
}

export const StoryBoard: React.FC<StoryBoardProps> = ({
  currentUser,
  posts,
  users,
  onPostCreate,
  onLike,
  onComment,
  onShare,
  showCreateBox = false
}) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [location, setLocation] = useState('');
  const [feeling, setFeeling] = useState('');
  const [showExtras, setShowExtras] = useState(false);
  
  // Tagging State (Simplified mock)
  const [isTagging, setIsTagging] = useState(false);

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [visibleComments, setVisibleComments] = useState<Record<string, boolean>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim() && onPostCreate) {
      onPostCreate(newPostContent, mediaType === 'image' ? mediaUrl : undefined, mediaType === 'video' ? mediaUrl : undefined, location, feeling);
      setNewPostContent('');
      setMediaUrl('');
      setMediaType(null);
      setLocation('');
      setFeeling('');
      setShowExtras(false);
    }
  };

  const handleMediaUpload = (type: 'image' | 'video') => {
      const url = prompt(`Enter ${type} URL (e.g. https://example.com/image.jpg):`);
      if (url) {
          setMediaType(type);
          setMediaUrl(url);
          setShowExtras(true);
      }
  };

  const insertTag = (username: string) => {
      setNewPostContent(prev => prev + `@${username} `);
      setIsTagging(false);
  };

  const handleCommentChange = (postId: string, text: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: text }));
  };

  const submitComment = (post: Post) => {
    const text = commentInputs[post.id];
    if (text?.trim()) {
      onComment(post.authorId, post.id, text);
      setCommentInputs(prev => ({ ...prev, [post.id]: '' }));
      setVisibleComments(prev => ({ ...prev, [post.id]: true })); 
    }
  };

  const toggleComments = (postId: string) => {
    setVisibleComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const getAuthor = (userId: string) => users.find(u => u.id === userId) || { name: 'Cereen Reader', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80', occupation: 'Practitioner' } as User;

  // Highlight hashtags and mentions in text
  const renderRichText = (text: string) => {
      const parts = text.split(/(\s+)/);
      return parts.map((part, i) => {
          if (part.startsWith('#')) return <span key={i} className="text-[#8BAB70] font-bold">{part}</span>;
          if (part.startsWith('@')) return <span key={i} className="text-[#DE7A49] font-bold cursor-pointer">{part}</span>;
          return part;
      });
  };

  return (
    <div className="space-y-6">
      {/* 1. Create Post Box */}
      {showCreateBox && currentUser && (
        <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm">
          <div className="flex gap-4">
            <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-11 h-11 rounded-full object-cover border-2 border-[#FAF7F2] shadow"
            />
            <div className="flex-grow">
                <form onSubmit={handleCreatePost}>
                    <textarea 
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder={`Share your story, ${currentUser.name.split(' ')[0]}...`}
                        className="w-full bg-[#FAF7F2]/40 border border-[#4C3322]/10 rounded-2xl p-4 focus:outline-none focus:border-[#8BAB70] text-[#4C3322] font-light text-sm placeholder-[#4C3322]/40 resize-none h-24 mb-3 transition-colors"
                    ></textarea>
                    
                    {isTagging && (
                        <div className="flex flex-wrap gap-1.5 mb-3 bg-[#FAF7F2] border border-[#4C3322]/10 p-2.5 rounded-2xl animate-fade-in">
                            <span className="text-[10px] font-bold text-[#4C3322]/40 uppercase tracking-widest w-full mb-1">Tag a companion:</span>
                            {users.filter(u => u.id !== currentUser.id).slice(0,5).map(u => (
                                <button 
                                  key={u.id} 
                                  type="button" 
                                  onClick={() => insertTag(u.name.replace(' ',''))} 
                                  className="text-[9px] font-bold uppercase tracking-wider bg-white border border-[#4C3322]/10 px-2 py-1 rounded-full hover:bg-[#8BAB70] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                                >
                                    @{u.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Extra Inputs */}
                    {showExtras && (
                        <div className="mb-4 space-y-3 animate-fade-in">
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Add Location"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    className="flex-1 p-3 border border-[#4C3322]/10 rounded-2xl bg-[#FAF7F2]/40 text-xs focus:outline-none focus:border-[#8BAB70]"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Feeling..."
                                    value={feeling}
                                    onChange={e => setFeeling(e.target.value)}
                                    className="flex-1 p-3 border border-[#4C3322]/10 rounded-2xl bg-[#FAF7F2]/40 text-xs focus:outline-none focus:border-[#8BAB70]"
                                />
                            </div>
                            {mediaUrl && (
                                <div className="relative rounded-[2rem] overflow-hidden border border-[#4C3322]/10 mt-2">
                                    {mediaType === 'image' ? <img src={mediaUrl} alt="Preview" className="w-full h-48 object-cover" /> : <video src={mediaUrl} className="w-full h-48 object-cover" controls />}
                                    <button 
                                      type="button" 
                                      onClick={() => { setMediaUrl(''); setMediaType(null); }} 
                                      className="absolute top-2 right-2 bg-black/50 text-[#FAF7F2] rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-[#DE7A49] transition-colors cursor-pointer"
                                    >
                                      <i className="fas fa-times text-xs"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-[#4C3322]/5">
                        <div className="flex gap-4 text-[#4C3322]/50">
                            <button type="button" onClick={() => handleMediaUpload('image')} className="hover:text-[#8BAB70] transition-colors cursor-pointer" title="Add Image"><i className="fas fa-image text-sm"></i></button>
                            <button type="button" onClick={() => handleMediaUpload('video')} className="hover:text-[#DE7A49] transition-colors cursor-pointer" title="Add Video"><i className="fas fa-video text-sm"></i></button>
                            <button type="button" onClick={() => setShowExtras(!showExtras)} className="hover:text-[#DE7A49] transition-colors cursor-pointer" title="Set Location / Feeling"><i className="fas fa-map-marker-alt text-sm"></i></button>
                            <button type="button" onClick={() => setIsTagging(!isTagging)} className="hover:text-[#8BAB70] transition-colors cursor-pointer" title="Tag Friend"><i className="fas fa-user-tag text-sm"></i></button>
                        </div>
                        <button 
                          type="submit" 
                          disabled={!newPostContent.trim()} 
                          className="bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] px-6 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                          Post
                        </button>
                    </div>
                </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. Feed Stream */}
      {posts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#4C3322]/10 rounded-[2.5rem] shadow-sm">
              <p className="text-[#4C3322]/40 italic text-sm font-light">No sanctuary updates yet.</p>
          </div>
      ) : (
          posts.map(post => {
              const author = getAuthor(post.authorId);
              const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
              
              return (
                  <div key={post.id} className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-[#8BAB70]/5 to-[#DE7A49]/5 pointer-events-none"></div>
                      
                      <div className="flex items-center gap-3 mb-4 pt-1 z-10">
                          <img src={author.avatar} alt={author.name} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" />
                          <div className="flex-grow">
                              <h4 className="font-serif text-base font-black text-[#4C3322] leading-tight">{author.name}</h4>
                              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#4C3322]/40 mt-1">
                                  <span>{new Date(post.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                  {post.location && <span>• <span className="text-[#8BAB70]">{post.location}</span></span>}
                                  {post.feeling && <span>• <span className="text-[#DE7A49]">feeling {post.feeling}</span></span>}
                              </div>
                          </div>
                      </div>

                      <div className="mb-4 pl-1">
                          <p className="text-[#4C3322]/90 text-sm font-light leading-relaxed whitespace-pre-wrap">{renderRichText(post.text)}</p>
                      </div>

                      {post.image && <img src={post.image} alt="Sanctuary story update" className="w-full max-h-[400px] object-cover rounded-[2rem] border border-[#4C3322]/5 mb-4" />}
                      {post.video && <video src={post.video} controls className="w-full max-h-[400px] rounded-[2rem] border border-[#4C3322]/5 mb-4" />}

                      <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-[#4C3322]/40 pb-2 border-b border-[#4C3322]/5 mb-1.5">
                          <span>{post.likes.length} Likes</span>
                          <div className="flex gap-3">
                              <span>{post.comments.length} Comments</span>
                              <span>{post.shares} Shares</span>
                          </div>
                      </div>

                      {/* Custom rounded icons actions */}
                      <div className="flex items-center justify-between border-t border-[#4C3322]/5 pt-1.5">
                          <button 
                            onClick={() => onLike(post.authorId, post.id)} 
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${isLiked ? 'text-[#DE7A49] bg-[#DE7A49]/10' : 'text-[#4C3322]/50 hover:text-[#4C3322] hover:bg-[#FAF7F2]'}`}
                          >
                              <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-sm`}></i> Like
                          </button>
                          <button 
                            onClick={() => toggleComments(post.id)} 
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-[#4C3322]/50 hover:text-[#4C3322] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                          >
                              <i className="far fa-comment-alt text-sm"></i> Comment
                          </button>
                          <button 
                            onClick={() => onShare(post.authorId, post.id)} 
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-[#4C3322]/50 hover:text-[#4C3322] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                          >
                              <i className="fas fa-share text-sm"></i> Share
                          </button>
                      </div>

                      {visibleComments[post.id] && (
                          <div className="bg-[#FAF7F2]/50 border-t border-[#4C3322]/5 mt-4 pt-4 rounded-[2rem] p-4 flex flex-col space-y-4">
                              {post.comments.length > 0 && (
                                  <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                                      {post.comments.map(comment => (
                                          <div key={comment.id} className="flex gap-2.5 items-start">
                                              <img src={comment.userAvatar} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
                                              <div className="bg-white border border-[#4C3322]/10 px-3.5 py-2.5 rounded-2xl shadow-sm flex-grow">
                                                  <p className="text-[10px] font-bold text-[#4C3322] mb-0.5">{comment.userName}</p>
                                                  <p className="text-xs text-[#4C3322]/70 font-light leading-relaxed">{comment.text}</p>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              )}
                              
                              <div className="flex gap-2.5 items-center">
                                  <img src={currentUser?.avatar} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
                                  <div className="flex-grow relative flex items-center">
                                      <input 
                                        type="text" 
                                        value={commentInputs[post.id] || ''}
                                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                        placeholder="Write a comment..." 
                                        className="w-full bg-white border border-[#4C3322]/10 rounded-full pl-4 pr-12 py-2.5 text-xs text-[#4C3322] focus:outline-none focus:border-[#8BAB70]"
                                        onKeyDown={(e) => e.key === 'Enter' && submitComment(post)}
                                      />
                                      <button 
                                        onClick={() => submitComment(post)} 
                                        className="absolute right-1 w-8 h-8 rounded-full bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] flex items-center justify-center transition-colors shadow cursor-pointer" 
                                        disabled={!commentInputs[post.id]?.trim()}
                                      >
                                          <i className="fas fa-paper-plane text-[10px]"></i>
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
  );
};
