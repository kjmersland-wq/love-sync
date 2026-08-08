import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CancelPage({ params }: PageProps) {
  const { locale } = await params;

  const content: Record<string, { title: string; subtitle: string; body: string; button: string }> = {
    en: {
      title: 'Checkout Cancelled',
      subtitle: 'No payment was processed.',
      body: 'If you encountered an issue or changed your mind, you can try again anytime. Love Sync Premium is ready to help you find your perfect match with advanced features.',
      button: 'Try Again / View Plans'
    },
    no: {
      title: 'Betaling avbrutt',
      subtitle: 'Ingen transaksjon ble gjennomført.',
      body: 'Hvis du opplevde problemer eller ombestemte deg, kan du prøve igjen når som helst. Love Sync Premium står klar til å hjelpe deg med å finne din perfekte partner.',
      button: 'Prøv igjen / Se priser'
    },
    pl: {
      title: 'Płatność anulowana',
      subtitle: 'Transakcja nie została zrealizowana.',
      body: 'Jeśli napotkałeś problem lub zmieniłeś zdanie, możesz spróbować ponownie w każdej chwili. Love Sync Premium pomoże Ci znaleźć idealną parę.',
      button: 'Spróbuj ponownie / Zobacz plany'
    },
    de: {
      title: 'Zahlung abgebrochen',
      subtitle: 'Es wurde keine Zahlung verarbeitet.',
      body: 'Falls Probleme aufgetreten sind oder Sie Ihre Meinung geändert haben, können Sie es jederzeit erneut versuchen. Love Sync Premium hilft Ihnen gerne weiter.',
      button: 'Erneut versuchen / Pläne ansehen'
    },
    fr: {
      title: 'Paiement annulé',
      subtitle: 'Aucun paiement n\'a été traité.',
      body: 'Si vous avez rencontré un problème ou si vous avez changé d\'avis, vous pouvez réessayer à tout moment. Love Sync Premium est prêt à vous aider.',
      button: 'Réessayer / Voir les offres'
    },
    es: {
      title: 'Pago Cancelado',
      subtitle: 'No se procesó ningún pago.',
      body: 'Si tuviste algún problema o cambiaste de opinión, puedes volver a intentarlo en cualquier momento. Love Sync Premium te espera.',
      button: 'Intentar de nuevo / Ver planes'
    },
    it: {
      title: 'Pagamento Annullato',
      subtitle: 'Nessun pagamento è stato elaborato.',
      body: 'Se hai riscontrato un problema o hai cambiato idea, puoi riprovare in qualsiasi momento. Love Sync Premium è pronto ad aiutarti.',
      button: 'Riprova / Vedi i piani'
    }
  };

  const text = content[locale] || content.en;

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl transition-all duration-300 hover:shadow-rose-500/10">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-rose-500/10 p-3 text-rose-500 animate-pulse">
            <XCircle size={48} />
          </div>
        </div>
        
        <h1 className="mb-2 font-serif text-3xl font-bold tracking-tight text-foreground">
          {text.title}
        </h1>
        <p className="mb-4 text-lg font-medium text-rose-500">
          {text.subtitle}
        </p>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          {text.body}
        </p>
        
        <Link 
          href={`/${locale}/pricing`}
          className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-3 font-semibold text-foreground transition-all duration-200 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
          {text.button}
        </Link>
      </div>
    </div>
  );
}
