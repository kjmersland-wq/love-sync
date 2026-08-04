'use client';

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { useI18n } from '../../../lib/i18n/I18nContext';
import { PaymentProviderName, WebhookEventType } from '../../../lib/payments/types';
import { 
  Users, Star, ShieldAlert, Cpu, Check, 
  Trash, Eye, Activity, Database, Cloud, 
  UserCheck, AlertTriangle, CreditCard, Send, 
  RefreshCw 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Admin() {
  const { locale, t } = useI18n();
  const { 
    profiles, 
    reports, 
    verificationsQueue, 
    resolveReport, 
    approveVerification,
    systemMetrics,
    activePaymentProvider,
    setActivePaymentProvider,
    generateMockWebhook
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'moderation' | 'verification' | 'health' | 'payments'>('users');
  const [selectedWebhookType, setSelectedWebhookType] = useState<WebhookEventType>('subscription.created');
  const [dispatchFeedback, setDispatchFeedback] = useState(false);

  const activeReportsCount = reports.filter(r => r.status === 'Pending').length;
  const activeVerificationsCount = verificationsQueue.filter(v => v.status === 'Pending').length;

  const paymentProviders: PaymentProviderName[] = ['stripe', 'paddle', 'adyen', 'mollie', 'paypal', 'checkout'];

  const handleDispatchWebhook = () => {
    generateMockWebhook(selectedWebhookType);
    setDispatchFeedback(true);
    setTimeout(() => setDispatchFeedback(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-background min-h-screen">
      
      {/* Title */}
      <div className="border-b border-border/40 pb-6 mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">{t('admin.title')}</h1>
        <p className="text-muted-foreground font-light text-sm mt-1">{t('admin.subtitle')}</p>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Stat 1 */}
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">{t('admin.totalUsers')}</span>
            <Users className="h-4.5 w-4.5 text-muted-foreground/60" />
          </div>
          <div className="text-2xl font-bold text-foreground font-serif">{profiles.length + 125}</div>
          <p className="text-[10px] text-green-500 font-medium">+14 new today</p>
        </div>

        {/* Stat 2 */}
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">{t('admin.premiumSubs')}</span>
            <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500/10" />
          </div>
          <div className="text-2xl font-bold text-foreground font-serif">{profiles.length + 65}</div>
          <p className="text-[10px] text-muted-foreground font-light">MRR: $1,349.00</p>
        </div>

        {/* Stat 3 */}
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Pending Verif</span>
            <UserCheck className="h-4.5 w-4.5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground font-serif">{activeVerificationsCount}</div>
          <p className="text-[10px] text-muted-foreground font-light font-mono">Verif queue size</p>
        </div>

        {/* Stat 4 */}
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Active Gateway</span>
            <CreditCard className="h-4.5 w-4.5 text-indigo-500" />
          </div>
          <div className="text-lg font-bold text-foreground font-mono uppercase truncate pt-1">{activePaymentProvider}</div>
          <p className="text-[10px] text-muted-foreground font-light">Provider-agnostic active</p>
        </div>

      </div>

      {/* Admin Tab Selectors */}
      <div className="flex border-b border-border/40 mb-8 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'users' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Users Registry
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'verification' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Verification Queue</span>
          {activeVerificationsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'moderation' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Moderation Queue</span>
          {activeReportsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'payments' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Payments Config
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'health' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Edge Health metrics
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Panel: Users */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono border-b border-border/40 pb-3">Platform Members</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-muted-foreground">
                <thead className="text-[10px] text-foreground uppercase tracking-wider bg-secondary/35 border-b border-border/30">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Details</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Verifications</th>
                    <th className="px-4 py-3 text-right">Subscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {profiles.map(profile => (
                    <tr key={profile.id} className="hover:bg-secondary/15 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-background p-0.5 border border-border flex items-center justify-center shrink-0" dangerouslySetInnerHTML={{ __html: profile.image }} />
                        <span>{profile.name}</span>
                      </td>
                      <td className="px-4 py-3 font-mono">{profile.gender}, {profile.age} yrs &bull; {profile.occupation}</td>
                      <td className="px-4 py-3">{profile.location}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 text-foreground">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${profile.verification.email ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>Email</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${profile.verification.phone ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>SMS</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${profile.verification.photo ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>Photo</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${profile.verification.id ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>Gov ID</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${profile.verification.id ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-secondary text-muted-foreground'}`}>
                          {profile.verification.id ? 'Premium' : 'Not Subscribed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Panel: Verification Queue */}
        {activeTab === 'verification' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono border-b border-border/40 pb-3">{t('admin.verifQueue')}</h2>
            
            {verificationsQueue.filter(v => v.status === 'Pending').length === 0 ? (
              <div className="py-12 text-center text-muted-foreground font-light text-xs">
                No verifications pending. Database is fully synced.
              </div>
            ) : (
              <div className="space-y-4">
                {verificationsQueue.filter(v => v.status === 'Pending').map((req) => (
                  <div key={req.id} className="p-4 bg-secondary/15 border border-border/40 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{req.name}</span>
                        <span className="text-[10px] font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded font-semibold">{req.type} Verification</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-light">Requested on {new Date(req.timestamp).toLocaleDateString()} &bull; Selfie match check required.</p>
                    </div>

                    <button
                      onClick={() => approveVerification(req.id)}
                      className="px-4 py-1.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{t('admin.verifApprove')}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Panel: Moderation */}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono border-b border-border/40 pb-3">{t('admin.moderationQueue')}</h2>
            
            {reports.filter(r => r.status === 'Pending').length === 0 ? (
              <div className="py-12 text-center text-muted-foreground font-light text-xs">
                No active abuse or scam reports. Clean safety index.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.filter(r => r.status === 'Pending').map((rep) => (
                  <div key={rep.id} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{rep.user}</span>
                        <span className="text-[10px] font-semibold bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded">Flagged</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-light">Reported by <span className="font-semibold">{rep.reporter}</span> on {new Date(rep.timestamp).toLocaleTimeString()}</p>
                      <p className="text-xs text-foreground font-light pt-1.5 italic">Reason: "{rep.reason}"</p>
                    </div>

                    <button
                      onClick={() => resolveReport(rep.id)}
                      className="px-4 py-1.5 rounded-xl border border-border hover:bg-secondary text-xs font-semibold text-foreground transition-colors"
                    >
                      {t('admin.moderationResolve')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Panel: Payments Configuration */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono border-b border-border/40 pb-3">
                Provider-Agnostic Payment Manager
              </h2>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Love Sync's subscription facade abstracts all API operations. Select the active gateway used for client-side checkouts below. Switching occurs instantly with zero code changes.
              </p>
            </div>

            {/* Provider Switcher Selector */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">Select Active Payment Provider</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {paymentProviders.map(prov => {
                  const isActive = activePaymentProvider === prov;
                  return (
                    <button
                      key={prov}
                      onClick={() => setActivePaymentProvider(prov)}
                      className={`py-3 px-4 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-2 ${
                        isActive
                          ? 'bg-foreground border-foreground text-background shadow-lg'
                          : 'bg-background border-border text-muted-foreground hover:bg-secondary/40'
                      }`}
                    >
                      <CreditCard className="h-4.5 w-4.5" />
                      <span>{prov}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mock Webhook Simulator */}
            <div className="p-6 bg-secondary/15 border border-border/40 rounded-3xl space-y-4 max-w-xl">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs font-mono uppercase tracking-wider">
                <Send className="h-4.5 w-4.5 text-indigo-500" />
                <span>Simulate Webhook Delivery to Edge</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-light">
                Triggers a simulated JSON webhook payload originating from the active payment provider (<strong>{activePaymentProvider.toUpperCase()}</strong>) directly to the application webhook parser, bypassing user interaction.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <select
                  value={selectedWebhookType}
                  onChange={(e) => setSelectedWebhookType(e.target.value as WebhookEventType)}
                  className="bg-background border border-border px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-foreground flex-grow"
                >
                  <option value="subscription.created">subscription.created (New Subscription)</option>
                  <option value="subscription.renewed">subscription.renewed (Invoice Succeeded)</option>
                  <option value="subscription.cancelled">subscription.cancelled (User Cancelled)</option>
                </select>

                <button
                  onClick={handleDispatchWebhook}
                  disabled={dispatchFeedback}
                  className="px-6 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center justify-center gap-1.5"
                >
                  {dispatchFeedback ? <Check className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                  <span>{dispatchFeedback ? 'Dispatched' : 'Dispatch Webhook'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Panel: System Health */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono border-b border-border/40 pb-3">{t('admin.healthTitle')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Latency card */}
              <div className="bg-secondary/15 border border-border/40 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                  <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                  <span>{t('admin.workerLatency')}</span>
                </div>
                <div className="text-3xl font-bold font-serif text-foreground font-mono">{systemMetrics.latency} ms</div>
                <p className="text-[10px] text-muted-foreground font-light">Cloudflare Workers Edge routing active globally.</p>
              </div>

              {/* Database usage card */}
              <div className="bg-secondary/15 border border-border/40 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span>{t('admin.databaseUsage')}</span>
                </div>
                <div className="text-3xl font-bold font-serif text-foreground font-mono">{systemMetrics.dbOps} ops</div>
                <p className="text-[10px] text-muted-foreground font-light">Neon PostgreSQL cached database reads.</p>
              </div>

              {/* R2 storage card */}
              <div className="bg-secondary/15 border border-border/40 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                  <Cloud className="h-4 w-4 text-purple-500" />
                  <span>{t('admin.storageUsage')}</span>
                </div>
                <div className="text-3xl font-bold font-serif text-foreground font-mono">{(systemMetrics.r2Bytes / 1000000).toFixed(1)} MB</div>
                <p className="text-[10px] text-muted-foreground font-light">Cloudflare R2 Encrypted User Media.</p>
              </div>

            </div>

            {/* Cloudflare Turnstile stats */}
            <div className="p-4 bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Check className="text-green-500 h-4.5 w-4.5" />
                <span>Cloudflare Turnstile Active</span>
              </div>
              <span>100% spam registrations caught at edge.</span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
