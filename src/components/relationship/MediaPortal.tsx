'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { RelationshipProfile } from '../../data/mockDb';
import { Play, Video, Eye, EyeOff, Lock, Unlock, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MediaPortalProps {
  activeProfile: RelationshipProfile;
  locale: string;
}

export const MediaPortal: React.FC<MediaPortalProps> = ({ activeProfile, locale }) => {
  const { t } = useI18n();
  const { triggerModal, chatThreads } = useApp();
  const hasContact = !!(chatThreads[activeProfile.id] && chatThreads[activeProfile.id].length > 0);
  const [photoAccess, setPhotoAccess] = useState<'none' | 'requested' | 'approved' | 'revoked'>('none');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasContact) {
      setPhotoAccess('none');
      return;
    }
    // Fetch photo permission status
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`/api/media/private-photos?partnerId=${activeProfile.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.status) {
            setPhotoAccess(data.status);
            setExpiresAt(data.expiresAt);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchPhotos();
  }, [activeProfile.id]);

  const handlePhotoRequest = async (action: 'request' | 'approve' | 'revoke') => {
    setLoading(true);
    try {
      const res = await fetch('/api/media/private-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, partnerId: activeProfile.id, expiresHours: 24 })
      });
      if (res.ok) {
        const data = await res.json();
        setPhotoAccess(data.status);
        setExpiresAt(data.expiresAt);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-foreground">Media Portal</h2>
          <p className="text-xs text-muted-foreground font-light">Play voice and video introductions or request access to private photos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voice Introduction */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider">
            <Play className="h-4 w-4 text-red-500" />
            <span>{t('relationshipPlatform.voiceIntro')}</span>
          </div>
          <p className="text-xs text-muted-foreground italic font-light leading-relaxed">
            "Hello! Looking forward to starting this relocation journey with you. Let's chat!"
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => triggerModal(
                "Voice Introduction Playback",
                `Playing cross-border voice clip introduction from ${activeProfile.name} (15 seconds total). Real-time translation transcript rendering in messaging view.`,
                "success"
              )}
              className="px-4 py-2 bg-foreground text-background font-semibold rounded-xl text-xs hover:bg-foreground/90 transition-colors shadow flex items-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Listen</span>
            </button>
          </div>
        </div>

        {/* Video Introduction */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider">
            <Video className="h-4 w-4 text-blue-500" />
            <span>{t('relationshipPlatform.videoIntro')}</span>
          </div>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            "Hi there! Looking to connect and build a future in Oslo."
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => triggerModal(
                "Video Introduction Playback",
                `Streaming video introduction from ${activeProfile.name} (45 seconds total). Served via Cloudflare Stream edge nodes.`,
                "success"
              )}
              className="px-4 py-2 bg-foreground text-background font-semibold rounded-xl text-xs hover:bg-foreground/90 transition-colors shadow flex items-center gap-1.5"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Play Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Private photo request portal */}
      <div className="border-t border-border/40 pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-foreground uppercase font-mono tracking-wider">{t('relationshipPlatform.photoRequests')}</h3>
          {photoAccess === 'approved' && expiresAt && (
            <span className="text-[10px] text-amber-500 font-mono">Access Expires: {new Date(expiresAt).toLocaleTimeString()}</span>
          )}
        </div>

        <div className="bg-secondary/15 rounded-3xl p-6 border border-border/40 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              {!hasContact ? (
                <Lock className="h-5 w-5 text-red-500/80" />
              ) : photoAccess === 'approved' ? (
                <Unlock className="h-5 w-5 text-green-500" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="font-semibold text-foreground">
                {!hasContact
                  ? "Contact Required"
                  : photoAccess === 'approved'
                  ? "Private Album Unlocked"
                  : "Album Locked"}
              </span>
            </div>
            <div className="flex gap-2">
              {!hasContact ? (
                <span className="text-[10px] text-red-500/80 font-mono tracking-wide bg-red-500/5 border border-red-500/10 px-2.5 py-1 rounded-xl">
                  Contact Required
                </span>
              ) : (
                <>
                  {photoAccess !== 'approved' && (
                    <button
                      disabled={loading}
                      onClick={() => handlePhotoRequest('approve')}
                      className="px-3.5 py-1.5 bg-foreground text-background font-semibold rounded-xl text-xs hover:bg-foreground/90 transition-colors shadow flex items-center gap-1"
                    >
                      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                      <span>Unlock</span>
                    </button>
                  )}
                  {photoAccess === 'approved' && (
                    <button
                      disabled={loading}
                      onClick={() => handlePhotoRequest('revoke')}
                      className="px-3.5 py-1.5 border border-red-500/20 bg-red-500/5 text-red-500 font-semibold rounded-xl text-xs hover:bg-red-500/10 transition-colors flex items-center gap-1"
                    >
                      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <EyeOff className="h-3.5 w-3.5" />}
                      <span>Revoke Access</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Watermarked photo grid */}
          {!hasContact ? (
            <p className="text-xs text-red-500/60 font-light leading-relaxed text-center py-6">
              🔒 Established contact is required to exchange profile photos. Please send a message first.
            </p>
          ) : photoAccess === 'approved' ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((num) => (
                <div key={num} className="relative aspect-square rounded-2xl border border-border/60 bg-secondary/35 flex items-center justify-center overflow-hidden shadow-inner select-none">
                  {/* Mock watermarked content */}
                  <span className="text-[10px] text-muted-foreground/30 font-mono tracking-widest uppercase rotate-12 absolute inset-0 flex items-center justify-center pointer-events-none">
                    LOVE SYNC SECURE
                  </span>
                  <span className="text-2xl">📸</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground font-light leading-relaxed text-center py-6">
              Unlock or request private album to view high-resolution watermarked private images safely.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
