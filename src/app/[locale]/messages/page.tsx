'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useI18n } from '../../../lib/i18n/I18nContext';
import { RelationshipProfile, MessageItem } from '../../../data/mockDb';
import { 
  Send, ShieldAlert, Sparkles, Languages, Image, 
  MapPin, Check, CheckCheck, Smile, HelpCircle, Heart, MessageSquare, Clock, Video, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Relationship platform components
import { RelationshipJourney } from '../../../components/relationship/RelationshipJourney';
import { CouplesPlanning } from '../../../components/relationship/CouplesPlanning';
import { CompatibilityAnalytics } from '../../../components/relationship/CompatibilityAnalytics';
import { MediaPortal } from '../../../components/relationship/MediaPortal';
import { SafetyCenter } from '../../../components/relationship/SafetyCenter';
import { PremiumLockOverlay } from '../../../components/relationship/PremiumLockOverlay';

export default function Messages() {
  const { locale, t } = useI18n();
  const { 
    profiles, 
    chatThreads, 
    activeChatId, 
    setActiveChatId, 
    sendMessage, 
    translateMessage, 
    getConversationStarter, 
    isTyping,
    calculateOverallScore,
    triggerModal,
    userProfile
  } = useApp();

  if (userProfile.subscription !== 'Premium') {
    return <PremiumLockOverlay featureKey="messages" />;
  }

  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'journey' | 'planning' | 'analytics' | 'media' | 'safety'>('chat');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveTab('chat');
  }, [activeChatId]);

  // Active profile details
  const activeProfile = profiles.find(p => p.id === activeChatId) || null;
  const currentMessages = activeChatId ? (chatThreads[activeChatId] || []) : [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isTyping, activeChatId]);

  // Mark messages in active chat as read
  useEffect(() => {
    if (activeChatId && currentMessages.length > 0) {
      // Simulate reading messages (normally done on backend, but client-side we can just toggle them in state)
      const lastMsg = currentMessages[currentMessages.length - 1];
      if (lastMsg && lastMsg.senderId !== 'user') {
        lastMsg.read = true;
      }
    }
  }, [activeChatId, currentMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    sendMessage(activeChatId, inputText);
    setInputText('');
  };

  const handleUseStarter = () => {
    if (!activeChatId) return;
    const starter = getConversationStarter(activeChatId, locale);
    setInputText(starter);
  };

  const formatTime = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // List of profiles we have a conversation history with, or that are high match
  // To keep it simple, we show all profiles, but highlight ones with active conversations
  const sortedProfiles = [...profiles].sort((a, b) => {
    const threadA = chatThreads[a.id] || [];
    const threadB = chatThreads[b.id] || [];
    if (threadA.length > 0 && threadB.length === 0) return -1;
    if (threadB.length > 0 && threadA.length === 0) return 1;
    return 0; // maintain original alignment
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-background min-h-[calc(100vh-4rem)] flex flex-col">
      
      {/* Messaging Layout Container */}
      <div className="flex-1 border border-border/60 bg-card rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row h-[78vh] glass">
        
        {/* Left Side: Match List */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border/40 flex flex-col h-1/3 md:h-full bg-secondary/10">
          <div className="p-4 border-b border-border/40 bg-secondary/20">
            <h2 className="font-serif text-lg font-bold text-foreground">Conversations</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-mono mt-0.5">Verified Channels</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/20">
            {sortedProfiles.map((profile) => {
              const thread = chatThreads[profile.id] || [];
              const lastMessage = thread[thread.length - 1];
              const hasUnread = thread.some(m => m.senderId !== 'user' && !m.read);
              const isActive = profile.id === activeChatId;
              const matchScore = calculateOverallScore(profile);

              return (
                <button
                  key={profile.id}
                  onClick={() => setActiveChatId(profile.id)}
                  className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                    isActive 
                      ? 'bg-secondary/60' 
                      : 'hover:bg-secondary/30'
                  }`}
                >
                  {/* SVG Avatar */}
                  <div 
                    className="w-11 h-11 rounded-xl border border-border bg-background p-0.5 flex items-center justify-center shrink-0"
                    dangerouslySetInnerHTML={{ __html: profile.image }}
                  />

                  {/* Name, last text, unread dot */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-foreground truncate">{profile.name}</span>
                        {profile.verification.photo && (
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]" title="Verified Profile">
                            <Check className="h-2 w-2 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-red-500 font-bold font-mono shrink-0">{matchScore}% Match</span>
                    </div>

                    <p className={`text-xs truncate mt-1 ${hasUnread ? 'text-foreground font-semibold' : 'text-muted-foreground font-light'}`}>
                      {lastMessage ? lastMessage.text : "No messages yet"}
                    </p>
                  </div>

                  {/* Unread indicator dot */}
                  {hasUnread && (
                    <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat Area */}
        <div className="flex-1 flex flex-col h-2/3 md:h-full bg-background/40">
          
          <AnimatePresence mode="wait">
            {activeProfile ? (
              <motion.div
                key={activeProfile.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col h-full overflow-hidden"
              >
                {/* Active Chat Header */}
                <div className="p-4 border-b border-border/40 bg-secondary/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl border border-border bg-background p-0.5 flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: activeProfile.image }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-foreground">{activeProfile.name}</span>
                        <span className="text-muted-foreground text-xs">{activeProfile.age}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 font-light">
                        <MapPin className="h-2.5 w-2.5" />
                        <span>{activeProfile.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                      {calculateOverallScore(activeProfile)}% Compatibility
                    </span>
                  </div>
                </div>

                {/* Relationship Workspace Tab Bar */}
                <div className="flex border-b border-border/40 bg-secondary/10 overflow-x-auto text-[11px] font-semibold text-muted-foreground select-none shrink-0 scrollbar-none">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2.5 transition-colors border-b-2 flex items-center gap-1 shrink-0 ${
                      activeTab === 'chat' ? 'border-foreground text-foreground bg-secondary/20' : 'border-transparent hover:text-foreground'
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('journey')}
                    className={`px-4 py-2.5 transition-colors border-b-2 flex items-center gap-1 shrink-0 ${
                      activeTab === 'journey' ? 'border-foreground text-foreground bg-secondary/20' : 'border-transparent hover:text-foreground'
                    }`}
                  >
                    <Heart className="h-3.5 w-3.5" />
                    <span>{t('relationshipPlatform.journeyTitle')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('planning')}
                    className={`px-4 py-2.5 transition-colors border-b-2 flex items-center gap-1 shrink-0 ${
                      activeTab === 'planning' ? 'border-foreground text-foreground bg-secondary/20' : 'border-transparent hover:text-foreground'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{t('relationshipPlatform.planningTogether')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-2.5 transition-colors border-b-2 flex items-center gap-1 shrink-0 ${
                      activeTab === 'analytics' ? 'border-foreground text-foreground bg-secondary/20' : 'border-transparent hover:text-foreground'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Compatibility & Trust</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('media')}
                    className={`px-4 py-2.5 transition-colors border-b-2 flex items-center gap-1 shrink-0 ${
                      activeTab === 'media' ? 'border-foreground text-foreground bg-secondary/20' : 'border-transparent hover:text-foreground'
                    }`}
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Media Portal</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('safety')}
                    className={`px-4 py-2.5 transition-colors border-b-2 flex items-center gap-1 shrink-0 ${
                      activeTab === 'safety' ? 'border-foreground text-foreground bg-secondary/20' : 'border-transparent hover:text-foreground'
                    }`}
                  >
                    <Info className="h-3.5 w-3.5" />
                    <span>Safety Center</span>
                  </button>
                </div>

                {/* Tab content renders */}
                {activeTab === 'chat' && (
                  <>
                    {/* Safety Alert Banner */}
                    <div className="bg-amber-500/5 dark:bg-amber-500/10 border-b border-amber-500/10 px-4 py-2.5 flex items-start gap-2 text-amber-600 dark:text-amber-500 text-xs animate-fadeIn">
                      <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                      <p className="font-light leading-relaxed">{t('messaging.safetyAlert')}</p>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                      {currentMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground text-xs space-y-3 p-8">
                          <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
                          <p>Start a quiet, meaningful chat. No pressure.</p>
                          
                          <button
                            onClick={handleUseStarter}
                            className="px-4 py-2 rounded-xl border border-border bg-card text-foreground hover:bg-secondary transition-all text-[11px] font-semibold flex items-center gap-1"
                          >
                            <HelpCircle className="h-3 w-3 text-red-500" />
                            <span>{t('messaging.starterButton')}</span>
                          </button>
                        </div>
                      ) : (
                        currentMessages.map((msg) => {
                          const isMe = msg.senderId === 'user';
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                              <div className="max-w-[75%] space-y-1">
                                {/* Message box */}
                                <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                                  isMe
                                    ? 'bg-foreground text-background rounded-tr-sm'
                                    : 'bg-secondary border border-border/40 text-foreground rounded-tl-sm'
                                }`}>
                                  <p className="font-light">{msg.text}</p>
                                  
                                  {/* Translated block */}
                                  {msg.translatedText && (
                                    <p className="text-[10px] mt-1.5 pt-1.5 border-t border-border/40 italic font-mono text-muted-foreground">
                                      {msg.translatedText}
                                    </p>
                                  )}
                                </div>

                                {/* Metadata */}
                                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground px-1 select-none">
                                  <span>{formatTime(msg.timestamp)}</span>
                                  {!isMe && (
                                    <button 
                                      onClick={() => translateMessage(activeProfile.id, msg.id)}
                                      className="hover:text-foreground hover:underline flex items-center gap-0.5 font-semibold font-mono"
                                    >
                                      <Languages className="h-2 w-2" />
                                      <span>{msg.translatedText ? "Original" : t('messaging.translateToggle')}</span>
                                    </button>
                                  )}
                                  {isMe && (
                                    <span>
                                      {msg.read ? (
                                        <CheckCheck className="h-3 w-3 text-blue-500 inline" />
                                      ) : (
                                        <Check className="h-3 w-3 inline" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}

                      {/* Typing Indicator */}
                      {isTyping[activeProfile.id] && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-8 h-8 rounded-lg bg-secondary border border-border p-0.5 flex items-center justify-center shrink-0" dangerouslySetInnerHTML={{ __html: activeProfile.image }} />
                          <div className="bg-secondary px-3.5 py-2 rounded-xl rounded-tl-sm border border-border/40 flex items-center gap-1.5">
                            <span className="font-light">{activeProfile.name} is writing</span>
                            <div className="flex gap-0.5 items-center">
                              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.3s]" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions and Starters bar */}
                    {currentMessages.length > 0 && (
                      <div className="px-4 py-2 border-t border-border/40 bg-secondary/10 flex items-center justify-between text-xs text-muted-foreground shrink-0 select-none">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
                          <span>Stuck? Try a compatibility starter</span>
                        </span>
                        <button
                          onClick={handleUseStarter}
                          className="px-2.5 py-1 text-[10px] font-semibold border border-border rounded-lg bg-background hover:bg-secondary transition-colors text-foreground"
                        >
                          Use Suggestion
                        </button>
                      </div>
                    )}

                    {/* Chat Footer / Input Form */}
                    <form onSubmit={handleSend} className="p-4 border-t border-border/40 bg-secondary/20 flex gap-2 items-center shrink-0">
                      {/* Mock image sharing button */}
                      <button 
                        type="button" 
                        onClick={() => triggerModal(
                          "Cloudflare R2 Image Upload",
                          "File picker active. Under our v1.0 architecture, user media images are stored in a private Cloudflare R2 bucket with automated AES-256 edge-level key encryption to enforce GDPR conformity.",
                          "info"
                        )}
                        className="p-2.5 rounded-xl border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        title="Share private image (R2 encrypted)"
                      >
                        <Image className="h-4 w-4" />
                      </button>

                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t('messaging.typePlaceholder')}
                        className="flex-grow bg-background border border-border px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-foreground transition-colors"
                      />

                      <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="p-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:hover:bg-foreground transition-colors flex items-center justify-center shadow"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                )}

                {activeTab === 'journey' && (
                  <RelationshipJourney activeProfile={activeProfile} locale={locale} />
                )}

                {activeTab === 'planning' && (
                  <CouplesPlanning activeProfile={activeProfile} locale={locale} />
                )}

                {activeTab === 'analytics' && (
                  <CompatibilityAnalytics activeProfile={activeProfile} locale={locale} />
                )}

                {activeTab === 'media' && (
                  <MediaPortal activeProfile={activeProfile} locale={locale} />
                )}

                {activeTab === 'safety' && (
                  <SafetyCenter activeProfile={activeProfile} locale={locale} />
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-12">
                <div className="w-12 h-12 rounded-full border border-border/80 flex items-center justify-center mb-4 bg-secondary/20">
                  <MessageSquare className="h-5 w-5 text-muted-foreground/60" />
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground">Select a Conversation</h3>
                <p className="text-xs text-muted-foreground font-light max-w-sm mt-1">
                  {t('messaging.noActiveChat')}
                </p>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
