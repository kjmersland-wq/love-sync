import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function SuccessPage({ params }: PageProps) {
  const { locale } = await params;

  const content: Record<string, { title: string; subtitle: string; body: string; button: string }> = {
    en: {
      title: 'Welcome to Love Sync Premium!',
      subtitle: 'Your subscription is now active.',
      body: 'Thank you for upgrading! You now have full access to premium compatibility matching, private photo sharing, video profiles, and unlimited encrypted chat threads.',
      button: 'Go to Dashboard'
    },
    no: {
      title: 'Velkommen til Love Sync Premium!',
      subtitle: 'Abonnementet ditt er nå aktivt.',
      body: 'Takk for at du oppgraderte! Du har nå full tilgang til premium kompatibilitetsmatching, deling av private bilder, videoprofiler og ubegrensede krypterte chat-tråder.',
      button: 'Gå til Dashboard'
    },
    pl: {
      title: 'Witamy w Love Sync Premium!',
      subtitle: 'Twoja subskrypcja jest teraz aktywna.',
      body: 'Dziękujemy za ulepszenie konta! Masz teraz pełny dostęp do dopasowań premium, udostępniania prywatnych zdjęć, profili wideo i nieograniczonych szyfrowanych czatów.',
      button: 'Przejdź do panelu'
    },
    de: {
      title: 'Willkommen bei Love Sync Premium!',
      subtitle: 'Ihr Abonnement ist jetzt aktiv.',
      body: 'Vielen Dank für Ihr Upgrade! Sie haben jetzt vollen Zugriff auf Premium-Kompatibilitätsmatching, private Freigabe von Fotos, Videoprofile und unbegrenzten verschlüsselten Chat.',
      button: 'Zum Dashboard'
    },
    fr: {
      title: 'Bienvenue sur Love Sync Premium !',
      subtitle: 'Votre abonnement est désormais actif.',
      body: 'Merci pour votre abonnement ! Vous avez désormais un accès complet aux correspondances de compatibilité premium, au partage de photos privées, aux profils vidéo et aux fils de discussion chiffrés illimités.',
      button: 'Aller au Tableau de bord'
    },
    es: {
      title: '¡Bienvenido a Love Sync Premium!',
      subtitle: 'Tu suscripción ya está activa.',
      body: '¡Gracias por mejorar tu cuenta! Ahora tienes acceso completo a la compatibilidad premium, uso compartido de fotos privadas, perfiles de video e hilos de chat cifrados ilimitados.',
      button: 'Ir al Panel'
    },
    it: {
      title: 'Benvenuto in Love Sync Premium!',
      subtitle: 'Il tuo abbonamento è ora attivo.',
      body: 'Grazie per l\'aggiornamento! Ora hai accesso completo alla compatibilità premium, alla condivisione di foto private, ai profili video e alle chat crittografate illimitate.',
      button: 'Vai alla Dashboard'
    }
  };

  const text = content[locale] || content.en;

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl transition-all duration-300 hover:shadow-indigo-500/10">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500 animate-bounce">
            <CheckCircle2 size={48} />
          </div>
        </div>
        
        <h1 className="mb-2 font-serif text-3xl font-bold tracking-tight text-foreground">
          {text.title}
        </h1>
        <p className="mb-4 text-lg font-medium text-emerald-500">
          {text.subtitle}
        </p>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          {text.body}
        </p>
        
        <Link 
          href={`/${locale}/dashboard`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-rose-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
          {text.button}
        </Link>
      </div>
    </div>
  );
}
