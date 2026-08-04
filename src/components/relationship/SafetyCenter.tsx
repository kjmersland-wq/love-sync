'use client';

import React, { useState } from 'react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { RelationshipProfile } from '../../data/mockDb';
import { ShieldAlert, AlertTriangle, Info, Check, Send, Loader2 } from 'lucide-react';

interface SafetyCenterProps {
  activeProfile: RelationshipProfile;
  locale: string;
}

export const SafetyCenter: React.FC<SafetyCenterProps> = ({ activeProfile, locale }) => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reported, setReported] = useState(false);

  const safetyTips = [
    "Keep conversations on Love Sync until full trust is established.",
    "Never send money or share bank account details under any circumstances.",
    "Be cautious if a match pressures you for immediate external contact info.",
    "Use our built-in video verification calls to verify identity before meeting in person."
  ];

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setLoading(true);
    
    // Simulate report submission
    setTimeout(() => {
      setReported(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-foreground">Safety & Moderation Center</h2>
          <p className="text-xs text-muted-foreground font-light">Verify automated risk assessments and access the report center.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scam & Fake detection indicators */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider">
            <ShieldAlert className="h-4 w-4 text-green-500" />
            <span>AI Risk Assessment</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Scam Probability</span>
              <span className="font-bold text-green-500 font-mono">0.02% (Very Low)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Behavioral Anomaly Check</span>
              <span className="font-bold text-green-500 font-mono">Passed</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Moderation Warning Flag</span>
              <span className="font-bold text-green-500 font-mono">None</span>
            </div>
          </div>
        </div>

        {/* Safety Education */}
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider">
            <Info className="h-4 w-4 text-amber-500" />
            <span>Safety Education Guide</span>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground font-light leading-relaxed">
            {safetyTips.map((tip, idx) => (
              <li key={idx} className="flex gap-2 items-start">
                <span className="text-amber-500 font-mono font-bold shrink-0">{idx + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Report Center Form */}
      <div className="border-t border-border/40 pt-6 space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase font-mono tracking-wider">Report Match</h3>
        {reported ? (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-xl p-4 flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>Thank you. Your report has been submitted to the moderation queue for immediate background review.</span>
          </div>
        ) : (
          <form onSubmit={handleReport} className="bg-secondary/15 rounded-3xl p-6 border border-border/40 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Report Reason / Event logs</label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe details of scam, fake behavior, policy breach, or inappropriate comments..."
                rows={3}
                className="w-full bg-background border border-border px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !reportReason.trim()}
              className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-xs disabled:opacity-40 flex items-center gap-1.5 shadow"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <AlertTriangle className="h-3.5 w-3.5" />}
              <span>Submit Incident Report</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
