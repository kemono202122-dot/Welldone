import React, { useState } from 'react';
import { User } from '../types';
import { mockInterests, mockUsers, COUNTRIES, CITIES_BY_COUNTRY, LANGUAGES, RELIGIONS, POLITICAL_VIEWS, PHILOSOPHIES } from '../constants';

interface OnboardingModalProps {
  user: User;
  onComplete: (updatedData: Partial<User>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [locationData, setLocationData] = useState({
    country: '',
    city: '',
    language: '',
    religion: '',
    politicalView: '',
    philosophy: ''
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [friendsToAdd, setFriendsToAdd] = useState<string[]>([]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleComplete = () => {
    onComplete({
      ...locationData,
      interests: selectedInterests,
      friends: [...user.friends, ...friendsToAdd],
      hasCompletedOnboarding: true
    });
  };

  const toggleInterest = (name: string) => {
    if (selectedInterests.includes(name)) {
      setSelectedInterests(selectedInterests.filter(i => i !== name));
    } else {
      setSelectedInterests([...selectedInterests, name]);
    }
  };

  const toggleFriend = (id: string) => {
    if (friendsToAdd.includes(id)) {
      setFriendsToAdd(friendsToAdd.filter(f => f !== id));
    } else {
      setFriendsToAdd([...friendsToAdd, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4C3322]/50 backdrop-blur-md p-4 select-none">
      <div className="bg-white border border-[#4C3322]/10 rounded-[2.5rem] shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] font-outfit text-[#4C3322] animate-fade-in-up">
        
        {/* Progress Bar */}
        <div className="w-full bg-[#4C3322]/10 h-1.5">
          <div className="bg-[#8BAB70] h-1.5 transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
          {/* Step 1: Welcome & Location */}
          {step === 1 && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="mb-4">
                <div className="w-16 h-16 bg-[#8BAB70]/10 rounded-full flex items-center justify-center mx-auto text-[#8BAB70] text-2xl">
                  <i className="fas fa-hand-sparkles"></i>
                </div>
              </div>
              <h2 className="text-3xl font-serif font-black">Welcome to Cereen</h2>
              <p className="text-xs text-[#4C3322]/65 font-light leading-relaxed">Let's initialize your localized settings to match with sanctuary events and buddies.</p>
              
              <div className="space-y-4 text-left mt-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Country</label>
                  <select 
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm cursor-pointer transition-all"
                    value={locationData.country}
                    onChange={(e) => setLocationData({...locationData, country: e.target.value, city: ''})}
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">City</label>
                  <select 
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm cursor-pointer transition-all disabled:opacity-50"
                    value={locationData.city}
                    onChange={(e) => setLocationData({...locationData, city: e.target.value})}
                    disabled={!locationData.country}
                  >
                    <option value="">Select City</option>
                    {locationData.country && CITIES_BY_COUNTRY[locationData.country]?.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Primary Language</label>
                  <select 
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm cursor-pointer transition-all"
                    value={locationData.language}
                    onChange={(e) => setLocationData({...locationData, language: e.target.value})}
                  >
                    <option value="">Select Language</option>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Identity & Views */}
          {step === 2 && (
            <div className="space-y-6 text-center animate-fade-in">
              <h2 className="text-3xl font-serif font-black">Your Identity</h2>
              <p className="text-xs text-[#4C3322]/65 font-light leading-relaxed">Customize belief outlines to help align your cosmic match criteria.</p>
              
              <div className="space-y-4 text-left mt-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Religion / Spirituality</label>
                  <select 
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm cursor-pointer"
                    value={locationData.religion}
                    onChange={(e) => setLocationData({...locationData, religion: e.target.value})}
                  >
                    <option value="">Select Belief System</option>
                    {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Political Outlook</label>
                  <select 
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm cursor-pointer"
                    value={locationData.politicalView}
                    onChange={(e) => setLocationData({...locationData, politicalView: e.target.value})}
                  >
                    <option value="">Select Political View</option>
                    {POLITICAL_VIEWS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2">Philosophical outlook</label>
                  <select 
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#4C3322]/15 focus:outline-none focus:border-[#8BAB70] text-sm cursor-pointer"
                    value={locationData.philosophy}
                    onChange={(e) => setLocationData({...locationData, philosophy: e.target.value})}
                  >
                    <option value="">Select Philosophy</option>
                    {PHILOSOPHIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-6 text-center animate-fade-in">
              <h2 className="text-3xl font-serif font-black">What moves you?</h2>
              <p className="text-xs text-[#4C3322]/65 font-light leading-relaxed">Select wellness interests to feature on your companion card.</p>
              
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {mockInterests.map(interest => {
                  const isSelected = selectedInterests.includes(interest.name);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.name)}
                      className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-[#4C3322] text-[#FAF7F2] shadow-sm'
                          : 'bg-[#FAF7F2] border border-[#4C3322]/10 text-[#4C3322]/70 hover:bg-[#4C3322]/5'
                      }`}
                    >
                      {interest.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Add Friends */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-fade-in">
              <h2 className="text-3xl font-serif font-black">Build your Circle</h2>
              <p className="text-xs text-[#4C3322]/65 font-light leading-relaxed">Link up with suggested companions aligned to your wellness paths.</p>
              
              <div className="space-y-3 mt-6 text-left max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {mockUsers.filter(u => u.id !== user.id).map(u => {
                  const isFriend = friendsToAdd.includes(u.id);
                  return (
                    <div key={u.id} className="flex items-center justify-between p-3.5 bg-[#FAF7F2]/50 border border-[#4C3322]/5 rounded-2xl shadow-sm">
                      <div className="flex items-center space-x-3.5">
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-[#4C3322]/10" />
                        <div>
                          <p className="font-bold text-sm text-[#4C3322]">{u.name}</p>
                          <p className="text-[10px] text-[#4C3322]/50 font-light mt-0.5">{u.occupation || 'Sanctuary Member'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFriend(u.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isFriend ? 'bg-[#8BAB70] text-[#FAF7F2]' : 'bg-[#4C3322]/5 text-[#4C3322]/60 hover:bg-[#4C3322]/10'
                        }`}
                      >
                        <i className={`fas ${isFriend ? 'fa-check' : 'fa-plus'}`}></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Tour & Complete */}
          {step === 5 && (
            <div className="space-y-6 text-center animate-fade-in">
              <h2 className="text-3xl font-serif font-black">You're All Set!</h2>
              <p className="text-xs text-[#4C3322]/65 font-light leading-relaxed">Here is a quick look at your sanctuary modules:</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-[#FAF7F2]/80 border border-[#4C3322]/10 rounded-2xl text-center">
                  <i className="fas fa-plane text-xl text-[#8BAB70] mb-2"></i>
                  <h3 className="font-bold text-xs">Travel Diary</h3>
                  <p className="text-[10px] text-[#4C3322]/60 font-light mt-0.5">Document journeys.</p>
                </div>
                <div className="p-4 bg-[#FAF7F2]/80 border border-[#4C3322]/10 rounded-2xl text-center">
                  <i className="fas fa-bullseye text-xl text-[#DE7A49] mb-2"></i>
                  <h3 className="font-bold text-xs">Wellness Goals</h3>
                  <p className="text-[10px] text-[#4C3322]/60 font-light mt-0.5">Track your metrics.</p>
                </div>
                <div className="p-4 bg-[#FAF7F2]/80 border border-[#4C3322]/10 rounded-2xl text-center">
                  <i className="fas fa-robot text-xl text-[#8BAB70] mb-2"></i>
                  <h3 className="font-bold text-xs">AI Companion</h3>
                  <p className="text-[10px] text-[#4C3322]/60 font-light mt-0.5">Get advice.</p>
                </div>
                <div className="p-4 bg-[#FAF7F2]/80 border border-[#4C3322]/10 rounded-2xl text-center">
                  <i className="fas fa-users text-xl text-[#DE7A49] mb-2"></i>
                  <h3 className="font-bold text-xs">Sanctuary Circle</h3>
                  <p className="text-[10px] text-[#4C3322]/60 font-light mt-0.5">Connect & Share.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4.5 bg-[#FAF7F2] border-t border-[#4C3322]/10 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={handleBack} className="px-5 py-3 text-[#4C3322]/70 hover:text-[#4C3322] font-bold text-xs uppercase tracking-wider cursor-pointer">Back</button>
          ) : (
            <div className="w-12"></div>
          )}
          
          {step < 5 ? (
            <button onClick={handleNext} className="bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer">Next</button>
          ) : (
            <button onClick={handleComplete} className="bg-[#4C3322] hover:bg-[#8BAB70] text-[#FAF7F2] px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer">Get Started</button>
          )}
        </div>
      </div>
    </div>
  );
};
