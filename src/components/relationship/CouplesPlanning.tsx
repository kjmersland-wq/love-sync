'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { RelationshipProfile } from '../../data/mockDb';
import { CheckSquare, DollarSign, Home, FileText, Check, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CouplesPlanningProps {
  activeProfile: RelationshipProfile;
  locale: string;
}

export const CouplesPlanning: React.FC<CouplesPlanningProps> = ({ activeProfile, locale }) => {
  const { t } = useI18n();
  const { triggerModal } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'visa' | 'budget' | 'housing' | 'documents'>('visa');
  const [visaChecklist, setVisaChecklist] = useState<any[]>([]);
  const [budgetItems, setBudgetItems] = useState<any[]>([]);
  const [housingList, setHousingList] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch planning details from API
    const fetchPlanning = async () => {
      try {
        const res = await fetch(`/api/relationship/journey?partnerId=${activeProfile.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.journey) {
            setVisaChecklist(data.journey.visa_checklist || []);
            setBudgetItems(data.journey.budget || []);
            setHousingList(data.journey.housing_search || []);
            setDocuments(data.journey.documents || []);
          }
        }
      } catch (e) {
        console.error("Failed to load couples planning data", e);
      }
    };
    fetchPlanning();
  }, [activeProfile.id]);

  const toggleVisaTask = async (id: string) => {
    const updated = visaChecklist.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setVisaChecklist(updated);
    await savePlanningData({ visa_checklist: updated });
  };

  const savePlanningData = async (fields: any) => {
    try {
      await fetch('/api/relationship/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: activeProfile.id,
          journey: {
            visa_checklist: fields.visa_checklist || visaChecklist,
            budget: fields.budget || budgetItems,
            housing_search: fields.housing_search || housingList,
            documents: fields.documents || documents
          }
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const partners = [
    { name: "ReloGlobal Express", desc: "Specialist international movers for expats.", cat: "Logistics" },
    { name: "VisumLegal Partners", desc: "Border control & family visa attorneys.", cat: "Immigration" },
    { name: "ExpatBank International", desc: "Cross-border bank accounts and credit setup.", cat: "Finance" }
  ];

  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-foreground">{t('relationshipPlatform.planningTogether')}</h2>
          <p className="text-xs text-muted-foreground font-light">Collaborate on logistics and financial readiness together.</p>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex border-b border-border/40 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('visa')}
          className={`pb-2 transition-all flex items-center gap-1.5 ${activeSubTab === 'visa' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground'}`}
        >
          <CheckSquare className="h-4 w-4" />
          <span>{t('relationshipPlatform.checklist')}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('budget')}
          className={`pb-2 transition-all flex items-center gap-1.5 ${activeSubTab === 'budget' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground'}`}
        >
          <DollarSign className="h-4 w-4" />
          <span>{t('relationshipPlatform.budget')}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('housing')}
          className={`pb-2 transition-all flex items-center gap-1.5 ${activeSubTab === 'housing' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground'}`}
        >
          <Home className="h-4 w-4" />
          <span>{t('relationshipPlatform.housing')}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('documents')}
          className={`pb-2 transition-all flex items-center gap-1.5 ${activeSubTab === 'documents' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground'}`}
        >
          <FileText className="h-4 w-4" />
          <span>{t('relationshipPlatform.documents')}</span>
        </button>
      </div>

      {/* Content Render based on subTab */}
      <div className="space-y-4">
        {activeSubTab === 'visa' && (
          <div className="space-y-3">
            {visaChecklist.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleVisaTask(task.id)}
                className="w-full text-left bg-secondary/10 hover:bg-secondary/20 border border-border/40 rounded-xl p-3.5 flex items-center justify-between text-xs transition-colors"
              >
                <span className={task.done ? 'line-through text-muted-foreground' : 'text-foreground'}>{task.task}</span>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${task.done ? 'bg-green-500 border-green-600 text-white' : 'border-border'}`}>
                  {task.done && <Check className="h-3.5 w-3.5" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {activeSubTab === 'budget' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgetItems.map((item) => (
                <div key={item.id} className="bg-secondary/15 rounded-xl p-4 border border-border/40 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-semibold text-foreground">{item.item}</h4>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">{item.category}</span>
                  </div>
                  <span className="font-bold font-mono text-sm">${item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'housing' && (
          <div className="space-y-3">
            {housingList.map((house) => (
              <div key={house.id} className="bg-secondary/15 rounded-xl p-4 border border-border/40 text-xs">
                <div className="flex justify-between items-start">
                  <h4 className="font-serif text-sm font-bold text-foreground">{house.title}</h4>
                  <span className="font-mono text-amber-500 font-bold">{house.rent} NOK/mnd</span>
                </div>
                <p className="text-muted-foreground font-light mt-1.5 leading-relaxed">{house.notes}</p>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'documents' && (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-secondary/15 rounded-xl p-4 border border-border/40 flex justify-between items-center text-xs">
                <span className="text-foreground">{doc.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                  doc.status === 'approved' 
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}>{doc.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Relocation B2B referrals panel */}
      <div className="border-t border-border/40 pt-6 space-y-4">
        <h3 className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider">{t('relationshipPlatform.referrals')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {partners.map((partner) => (
            <div key={partner.name} className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-amber-500 font-mono uppercase font-bold">{partner.cat}</span>
                <h4 className="font-semibold text-foreground mt-0.5">{partner.name}</h4>
                <p className="text-[11px] text-muted-foreground font-light mt-1 leading-relaxed">{partner.desc}</p>
              </div>
              <button 
                onClick={() => triggerModal(
                  "Immigration Partner Referral",
                  `Establishing secure API session with our premium relocation partner ${partner.name}. You will be connected with a dedicated expat manager shortly.`,
                  "success"
                )}
                className="mt-3.5 w-full py-1.5 text-[10px] font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-foreground transition-colors"
              >
                Connect Partner
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
