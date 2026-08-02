// Complete Help Center & FAQ Multilingual Data Module
// Supports English (en), Norwegian (no), Polish (pl), German (de), French (fr), Spanish (es), and Italian (it).

export interface HelpCategory {
  id: string;
  icon: string; // Lucide icon identifier
  title: Record<string, string>;
  description: Record<string, string>;
}

export interface HelpArticle {
  id: string;
  categoryId: string;
  title: Record<string, string>;
  content: Record<string, string>;
}

export const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    icon: 'Sparkles',
    title: {
      en: 'Getting Started',
      no: 'Kom i gang',
      pl: 'Pierwsze Kroki',
      de: 'Erste Schritte',
      fr: 'Mise en Route',
      es: 'Empezando',
      it: 'Guida Iniziale'
    },
    description: {
      en: 'Learn how to configure your account, verify your identity, and set your preferences.',
      no: 'Lær hvordan du setter opp kontoen din, verifiserer identiteten din og velger preferanser.',
      pl: 'Dowiedz się jak skonfigurować konto, zweryfikować tożsamość i ustawić preferencje.',
      de: 'Erfahren Sie, wie Sie Ihr Konto einrichten, Ihre Identität verifizieren und Präferenzen festlegen.',
      fr: 'Apprenez à configurer votre compte, vérifier votre identité et définir vos préférences.',
      es: 'Aprenda a configurar su cuenta, verificar su identidad y definir sus preferencias.',
      it: 'Scopri come configurare il tuo account, verificare la tua identità e impostare le tue preferenze.'
    }
  },
  {
    id: 'compatibility',
    icon: 'Heart',
    title: {
      en: 'Matching & Compatibility',
      no: 'Matching & Kompatibilitet',
      pl: 'Dopasowanie i Zgodność',
      de: 'Matching & Kompatibilität',
      fr: 'Matching & Compatibilité',
      es: 'Emparejamiento y Compatibilidad',
      it: 'Matching e Compatibilità'
    },
    description: {
      en: 'Understanding our deterministic matching algorithm, category weights, and score calculations.',
      no: 'Forstå vår deterministiske matchingsalgoritme, kategorivekter og scoreberegninger.',
      pl: 'Zrozumienie naszego deterministycznego algorytmu dopasowania, wag kategorii i kalkulacji wyników.',
      de: 'Erklärung unseres deterministischen Matching-Algorithmus, der Kategoriegewichtung und der Score-Berechnung.',
      fr: 'Comprendre notre algorithme de matching déterministe, les coefficients de catégories et les calculs.',
      es: 'Entienda nuestro algoritmo de emparejamiento determinista, pesos de categorías y cálculos de puntuación.',
      it: 'Comprendere il nostro algoritmo di abbinamento deterministico, i pesi delle categorie e i calcoli del punteggio.'
    }
  },
  {
    id: 'billing-safety',
    icon: 'ShieldCheck',
    title: {
      en: 'Billing, Safety & Privacy',
      no: 'Fakturering, Sikkerhet & Personvern',
      pl: 'Rozliczenia, Bezpieczeństwo i Prywatność',
      de: 'Rechnung, Sicherheit & Datenschutz',
      fr: 'Facturation, Sécurité & Confidentialité',
      es: 'Facturación, Seguridad y Privacidad',
      it: 'Fatturazione, Sicurezza e Privacy'
    },
    description: {
      en: 'Manage Paddle subscriptions, learn about ID verifications, and safety tips.',
      no: 'Administrer Paddle-abonnementer, lær om ID-verifisering og sikkerhetstips.',
      pl: 'Zarządzanie subskrypcjami Paddle, informacje o weryfikacji tożsamości i bezpieczeństwie.',
      de: 'Verwalten Sie Paddle-Abonnements, erfahren Sie mehr über ID-Verifizierungen und Sicherheitstipps.',
      fr: 'Gérez les abonnements Paddle, informez-vous sur les vérifications d\'identité et la sécurité.',
      es: 'Gestione las suscripciones de Paddle, obtenga información sobre la verificación de identidad y consejos de seguridad.',
      it: 'Gestisci gli abbonamenti Paddle, scopri le verifiche dell\'ID e i consigli sulla sicurezza.'
    }
  }
];

export const helpArticles: HelpArticle[] = [
  {
    id: 'create-account',
    categoryId: 'getting-started',
    title: {
      en: 'Creating your Love Sync Account',
      no: 'Opprette Love Sync-kontoen din',
      pl: 'Zakładanie konta Love Sync',
      de: 'Erstellung Ihres Love Sync-Kontos',
      fr: 'Création de votre compte Love Sync',
      es: 'Creando su cuenta de Love Sync',
      it: 'Creazione del tuo account Love Sync'
    },
    content: {
      en: 'To maintain a premium and safe space, Love Sync requires registration using a valid email address and profile compilation. We do not support anonymous browsing. Every profile is subjected to Turnstile verification to prevent bot registrations.',
      no: 'For å opprettholde et førsteklasses og trygt miljø, krever Love Sync registrering med en gyldig e-postadresse og en fullført profil. Vi tillater ikke anonym surfing. Alle profiler verifiseres med Turnstile for å forhindre roboter.',
      pl: 'Aby utrzymać bezpieczną przestrzeń klasy premium, Love Sync wymaga rejestracji przy użyciu prawidłowego adresu e-mail oraz uzupełnienia profilu. Nie obsługujemy anonimowego przeglądania. Każdy profil przechodzi weryfikację Turnstile.',
      de: 'Um eine sichere und erstklassige Plattform zu gewähren, erfordert Love Sync eine Registrierung mit einer gültigen E-Mail-Adresse und Profilerstellung. Wir unterstützen kein anonymes Surfen. Jedes Profil wird per Turnstile verifiziert.',
      fr: 'Pour maintenir un espace premium et sécurisé, Love Sync exige une inscription avec une adresse e-mail valide et la création complète de votre profil. La navigation anonyme n\'est pas autorisée. Chaque profil passe par Turnstile.',
      es: 'Para mantener un espacio seguro y premium, Love Sync requiere registrarse con un correo electrónico válido y completar el perfil. No permitimos la navegación anónima. Cada perfil pasa por la verificación Turnstile.',
      it: 'Per mantenere uno spazio sicuro e di alta qualità, Love Sync richiede la registrazione con un indirizzo email valido e la compilazione del profilo. Non supportiamo la navigazione anonima. Ogni profilo è sottoposto a Turnstile.'
    }
  },
  {
    id: 'profile-guide',
    categoryId: 'getting-started',
    title: {
      en: 'Profile Guidelines & Expectations',
      no: 'Retningslinjer for profil og forventninger',
      pl: 'Wytyczne dotyczące profilu i oczekiwań',
      de: 'Profil-Richtlinien & Erwartungen',
      fr: 'Directives relatives aux profils',
      es: 'Pautas de perfil y expectativas',
      it: 'Linee guida del profilo e aspettative'
    },
    content: {
      en: 'A complete profile consists of a short biography, values specification, lifestyle details, and relationship goals. Uploading clear photos is recommended. We enforce strict moderation to block inappropriate media or scam content immediately.',
      no: 'En fullstendig profil består av en kort biografi, verdivalg, livsstilsdetaljer og forholdsmål. Det anbefales å laste opp klare bilder. Vi har streng moderering som umiddelbart blokkerer upassende innhold eller forsøk på svindel.',
      pl: 'Kompletny profil składa się z krótkiego życiorysu, wyboru wartości, szczegółów stylu życia oraz celów partnerskich. Zaleca się dodanie wyraźnych zdjęć. Stosujemy restrykcyjną moderację w celu blokowania nadużyć.',
      de: 'Ein vollständiges Profil besteht aus einer kurzen Biografie, Werten, Lebensstil-Details und Beziehungszielen. Das Hochladen klarer Fotos wird empfohlen. Wir führen strenge Kontrollen durch, um Spam sofort zu blockieren.',
      fr: 'Un profil complet comprend une courte biographie, vos valeurs, des détails sur votre style de vie et vos objectifs relationnels. Des photos claires sont requises. Notre modération stricte supprime instantanément le contenu abusif.',
      es: 'Un perfil completo consta de una breve biografía, valores, estilo de vida y objetivos de relación. Se recomienda subir fotos claras. Aplicamos una moderación estricta para bloquear contenido inapropiado o fraudulento.',
      it: 'Un profilo completo include una breve biografia, valori, dettagli sullo stile di vita e obiettivi di relazione. Si consiglia di caricare foto nitide. Applichiamo una moderazione rigorosa per bloccare subito i contenuti truffaldini.'
    }
  },
  {
    id: 'matching-engine',
    categoryId: 'compatibility',
    title: {
      en: 'How the Compatibility Engine Works',
      no: 'Slik fungerer kompatibilitetsmotoren',
      pl: 'Jak działa silnik zgodności',
      de: 'Wie die Kompatibilitäts-Engine funktioniert',
      fr: 'Fonctionnement du moteur de compatibilité',
      es: 'Cómo funciona el motor de compatibilidad',
      it: 'Come funziona il motore di compatibilità'
    },
    content: {
      en: 'Love Sync calculates compatibility scores dynamically based on category weights you define: Family Goals, Lifestyle, Personality, Values, Interests, Distance, and Age. Changing these sliders recalculates scores instantly in <1ms without AI bias.',
      no: 'Love Sync beregner kompatibilitetspoeng dynamisk basert på kategorivekter du selv definerer: Forholdsmål, Livsstil, Personlighet, Verdier, Interesser, Avstand og Alder. Endring av gliderne rekkberegner poengene umiddelbart på <1ms.',
      pl: 'Love Sync oblicza wskaźnik dopasowania na podstawie wag zdefiniowanych przez Ciebie: Cele rodzinne, Styl życia, Osobowość, Wartości, Zainteresowania, Odległość oraz Wiek. Zmiana suwaków przelicza wyniki natychmiast w czasie <1ms.',
      de: 'Love Sync berechnet Kompatibilitätswerte dynamisch auf Basis von Ihnen festgelegter Gewichtungen: Familienziele, Lebensstil, Persönlichkeit, Werte, Interessen, Entfernung und Alter. Das Ändern dieser Regler berechnet die Werte sofort in <1ms.',
      fr: 'Love Sync calcule des scores de compatibilité dynamiques basés sur les coefficients que vous attribuez : Objectifs de vie, Style de vie, Personnalité, Valeurs, Intérêts, Distance et Âge. Le curseur recalcule les scores en <1ms.',
      es: 'Love Sync calcula las puntuaciones de compatibilidad en función de los pesos que defina: Objetivos de familia, Estilo de vida, Personalidad, Valores, Intereses, Distancia y Edad. Al cambiar los controles se recalcula la puntuación en <1ms.',
      it: 'Love Sync calcola i punteggi di compatibilità in base ai pesi impostati: Obiettivi familiari, Stile di vita, Personalità, Valori, Interessi, Distanza ed Età. La modifica dei cursori ricalcola i punteggi all\'istante in <1ms.'
    }
  },
  {
    id: 'paddle-billing',
    categoryId: 'billing-safety',
    title: {
      en: 'Paddle Subscriptions & Receipts',
      no: 'Paddle-abonnementer og kvitteringer',
      pl: 'Subskrypcje i Faktury Paddle',
      de: 'Paddle-Abonnements & Quittungen',
      fr: 'Abonnements et Factures Paddle',
      es: 'Suscripciones y Recibos de Paddle',
      it: 'Abbonamenti e Ricevute Paddle'
    },
    content: {
      en: 'All payments are securely processed by Paddle, our primary Merchant of Record. Subscriptions renew automatically. You can retrieve invoice histories, update payment methods, or cancel your premium subscription directly in the Billing panel.',
      no: 'Alle betalinger behandles sikkert av Paddle, vår primære forhandler. Abonnementer fornyes automatisk. Du kan hente fakturahistorikk, oppdatere betalingsmetoder eller avslutte premium-abonnementet direkte i faktureringspanelet.',
      pl: 'Wszystkie płatności są bezpiecznie obsługiwane przez Paddle, naszego licencjonowanego sprzedawcę (Merchant of Record). Subskrypcje odnawiają się automatycznie. Faktury i historię płatności znajdziesz w panelu premium.',
      de: 'Alle Zahlungen werden sicher über Paddle abgewickelt. Abonnements verlängern sich automatisch. Sie können den Rechnungsverlauf einsehen, Zahlungsdaten aktualisieren oder Ihr Premium-Abonnement im Dashboard kündigen.',
      fr: 'Tous les paiements sont sécurisés par Paddle, notre marchand agréé. Les abonnements se renouvellent automatiquement. Vous pouvez consulter l\'historique des factures et résilier votre offre premium depuis la page Facturation.',
      es: 'Todos los pagos se procesan de forma segura a través de Paddle. Las suscripciones se renuevan automáticamente. Puede recuperar el historial de facturas, actualizar los métodos de pago o cancelar su suscripción premium en el panel.',
      it: 'Tutti i pagamenti sono elaborati in modo sicuro da Paddle, il nostro Merchant of Record principale. Gli abbonamenti si rinnovano automaticamente. Puoi consultare lo storico delle fatture o annullare l\'abbonamento nel pannello.'
    }
  },
  {
    id: 'id-verification',
    categoryId: 'billing-safety',
    title: {
      en: 'Government ID & Photo Verifications',
      no: 'Offentlig ID- og fotoverifisering',
      pl: 'Weryfikacja Tożsamości i Dokumentu ID',
      de: 'ID- und Foto-Verifizierungen',
      fr: 'Vérifications d\'identité et de photos',
      es: 'Verificación de foto y documento de identidad',
      it: 'Verifica dell\'ID statale e della foto'
    },
    content: {
      en: 'We offer secure multi-level verification (Email, Phone, Photo, and Government ID). Completing these verification checks builds trust, certifies your identity, and grants the Verified Member badge on your profile card.',
      no: 'Vi tilbyr sikker flertrinns verifisering (E-post, Telefon, Foto og Offentlig ID). Gjennomføring av disse kontrollene bygger tillit, bekrefter identiteten din og gir deg det verifiserte medlemsmerket på profilen din.',
      pl: 'Oferujemy bezpieczną weryfikację wieloetapową (E-mail, Telefon, Zdjęcie profilowe oraz Dokument tożsamości). Ukończenie weryfikacji buduje zaufanie społeczności i dodaje odznakę Zweryfikowanego Członka na Twoim profilu.',
      de: 'Wir bieten eine sichere, mehrstufige Verifizierung (E-Mail, Telefon, Foto und Ausweis). Das Abschließen dieser Prüfungen baut Vertrauen auf, bestätigt Ihre Identität und verleiht Ihrem Profil den Status "Verifiziertes Mitglied".',
      fr: 'Nous proposons une vérification sécurisée à plusieurs niveaux (Email, Téléphone, Photo et Pièce d\'identité). Ces vérifications renforcent la confiance et affichent le badge Membre Vérifié sur votre carte de profil.',
      es: 'Ofrecemos una verificación segura de varios niveles (correo electrónico, teléfono, foto y documento de identidad). Completar estas verificaciones genera confianza y otorga la insignia de Miembro Verificado.',
      it: 'Offriamo una verifica sicura a più livelli (Email, Telefono, Foto e ID statale). Il completamento di questi controlli crea fiducia, certifica la tua identità e assegna il badge di Membro Verificato sul tuo profilo.'
    }
  },
  {
    id: 'safety-guidelines',
    categoryId: 'billing-safety',
    title: {
      en: 'Online Safety & Scam Protection',
      no: 'Sikkerhetsretningslinjer og svindelbeskyttelse',
      pl: 'Bezpieczeństwo Online i Ochrona przed Oszustwami',
      de: 'Online-Sicherheit & Schutz vor Betrug',
      fr: 'Sécurité en ligne et protection contre les fraudes',
      es: 'Seguridad en línea y protección contra estafas',
      it: 'Sicurezza online e protezione dalle truffe'
    },
    content: {
      en: 'Your safety is our priority. Never share financial data, home addresses, or credentials in early conversations. Keep chats on Love Sync until mutual trust is established. Report any suspicious profiles immediately for security review.',
      no: 'Sikkerheten din er vår prioritet. Del aldri økonomisk informasjon, hjemmeadresser eller påloggingsdetaljer tidlig i praten. Hold samtalene på Love Sync til dere har opparbeidet tillit. Rapporter mistenkelige profiler umiddelbart.',
      pl: 'Twoje bezpieczeństwo jest naszym priorytetem. Nigdy nie udostępniaj danych finansowych, adresów zamieszkania ani haseł na wczesnym etapie rozmowy. Zgłaszaj podejrzane profile natychmiast do naszego zespołu bezpieczeństwa.',
      de: 'Ihre Sicherheit steht an erster Stelle. Teilen Sie niemals Finanzdaten, Privatadressen oder Zugangsdaten in den ersten Chats. Behalten Sie Gespräche auf Love Sync, bis Vertrauen besteht. Melden Sie verdächtige Profile sofort.',
      fr: 'Votre sécurité est notre priorité. Ne partagez jamais vos coordonnées bancaires, votre adresse ou vos mots de passe. Conservez vos échanges sur Love Sync et signalez tout profil suspect aux modérateurs.',
      es: 'Su seguridad es nuestra prioridad. No comparta información financiera ni direcciones al inicio. Mantenga las conversaciones dentro de Love Sync. Denuncie cualquier perfil sospechoso para su revisión inmediata.',
      it: 'La tua sicurezza è la nostra priorità. Non condividere mai dati finanziari, indirizzi o credenziali nelle prime chat. Mantieni i contatti su Love Sync finché non c\'è fiducia. Segnala subito i profili sospetti.'
    }
  }
];

export const faqData = [
  {
    category: 'General',
    question: {
      en: 'What is Love Sync?',
      no: 'Hva er Love Sync?',
      pl: 'Czym jest Love Sync?',
      de: 'Was ist Love Sync?',
      fr: 'Qu\'est-ce que Love Sync ?',
      es: '¿Qué es Love Sync?',
      it: 'Cos\'è Love Sync?'
    },
    answer: {
      en: 'Love Sync is a premium, secure relationship platform designed to help serious people build meaningful, long-term relationships through compatibility weighting and identity verification.',
      no: 'Love Sync er en premium, sikker forholdsplattform designet for å hjelpe seriøse mennesker med å bygge varige forhold gjennom kompatibilitetsvekting og identitetsverifisering.',
      pl: 'Love Sync to bezpieczna platforma relacyjna klasy premium, zaprojektowana by pomagać poważnym ludziom budować trwałe związki za pomocą wag zgodności oraz weryfikacji tożsamości.',
      de: 'Love Sync ist eine sichere Premium-Plattform, die ernsthaften Menschen hilft, langfristige Beziehungen aufzubauen, gestützt auf Kompatibilitätsgewichtung und Ausweisprüfung.',
      fr: 'Love Sync est une plateforme relationnelle sécurisée haut de gamme conçue pour aider les personnes sérieuses à nouer des relations durables basées sur la compatibilité.',
      es: 'Love Sync es una plataforma de relaciones segura y premium diseñada para ayudar a personas comprometidas a construir relaciones duraderas a través de la compatibilidad.',
      it: 'Love Sync è una piattaforma di relazioni premium e sicura, progettata per aiutare persone serie a creare relazioni durature basate su compatibilità e identità verificate.'
    }
  },
  {
    category: 'Billing',
    question: {
      en: 'How much does Love Sync cost?',
      no: 'Hva koster Love Sync?',
      pl: 'Ile kosztuje korzystanie z Love Sync?',
      de: 'Wie viel kostet Love Sync?',
      fr: 'Combien coûte Love Sync ?',
      es: '¿Cuánto cuesta Love Sync?',
      it: 'Quanto costa Love Sync?'
    },
    answer: {
      en: 'We offer two simple subscription models: Premium Monthly at $19.00 USD/month, and Premium Yearly at $144.00 USD/year (which averages to $12.00/month). There is no free tier or advertising.',
      no: 'Vi tilbyr to enkle abonnementsmodeller: Premium Månedlig for 190 kr/måned, og Premium Årlig for 1440 kr/år (tilsvarer 120 kr/måned). Vi har ingen gratisversjon eller reklame.',
      pl: 'Oferujemy dwa proste modele subskrypcji: Premium Miesięczny za 79 zł/miesiąc oraz Premium Roczny za 790 zł/rok (co daje średnio 65 zł/miesiąc). Brak darmowych opcji i reklam.',
      de: 'Wir bieten zwei einfache Abonnements an: Premium Monatlich für 19,00 USD/Monat und Premium Jährlich für 144,00 USD/Jahr. Es gibt keine kostenlose Version oder Werbung.',
      fr: 'Nous proposons deux formules d\'abonnement claires : Premium Mensuel à 19,00 USD/mois, et Premium Annuel à 144,00 USD/an (soit 12,00 USD/mois). Pas d\'offre gratuite ni de publicité.',
      es: 'Ofrecemos dos modelos de suscripción sencillos: Premium Mensual a 19,00 USD/mes y Premium Anual a 144,00 USD/año. No existe nivel gratuito ni anuncios publicitarios.',
      it: 'Offriamo due modelli di abbonamento semplici: Premium Mensile a $19,00 USD/mese e Premium Annuale a $144,00 USD/anno. Non esiste un piano gratuito né pubblicità.'
    }
  },
  {
    category: 'Privacy',
    question: {
      en: 'Is Love Sync GDPR compliant?',
      no: 'Er Love Sync GDPR-kompatibel?',
      pl: 'Czy Love Sync jest zgodny z RODO (GDPR)?',
      de: 'Ist Love Sync DSGVO-konform?',
      fr: 'Love Sync est-il conforme au RGPD ?',
      es: '¿Cumple Love Sync con el RGPD?',
      it: 'Love Sync è conforme al GDPR?'
    },
    answer: {
      en: 'Yes. We protect user privacy strictly under GDPR guidelines. We do not integrate with advertising trackers or sell data. Users can request complete profile deletions instantly.',
      no: 'Ja. Vi beskytter personvernet ditt strengt i henhold til GDPR-regelverket. Vi bruker ikke sporingsteknologi for reklame og selger aldri data. Du kan slette profilen din helt når som helst.',
      pl: 'Tak. W pełni przestrzegamy wytycznych RODO (GDPR). Nie korzystamy ze skryptów śledzących ani nie sprzedajemy danych. Możesz usunąć swój profil natychmiast w ustawieniach.',
      de: 'Ja. Wir schützen die Privatsphäre unserer Nutzer streng nach DSGVO-Richtlinien. Wir verwenden keine Werbe-Tracker und verkaufen keine Daten. Die Löschung des Profils ist jederzeit möglich.',
      fr: 'Oui. Nous protégeons strictement votre vie privée conformément aux directives du RGPD. Nous ne vendons pas vos données. Vous pouvez supprimer définitivement votre profil à tout moment.',
      es: 'Sí. Protegemos rigurosamente la privacidad de los usuarios bajo el RGPD. No integramos rastreadores publicitarios ni vendemos datos. Puede eliminar su perfil de forma inmediata.',
      it: 'Sì. Proteggiamo rigorosamente la privacy degli utenti secondo il GDPR. Non integriamo tracciatori pubblicitari né vendiamo dati. Puoi cancellare del tutto il tuo profilo all\'istante.'
    }
  }
];
