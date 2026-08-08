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
      en: 'Manage Stripe subscriptions, learn about ID verifications, and safety tips.',
      no: 'Administrer Stripe-abonnementer, lær om ID-verifisering og sikkerhetstips.',
      pl: 'Zarządzanie subskrypcjami Stripe, informacje o weryfikacji tożsamości i bezpieczeństwie.',
      de: 'Verwalten Sie Stripe-Abonnements, erfahren Sie mehr über ID-Verifizierungen und Sicherheitstipps.',
      fr: 'Gerez les abonnements Stripe, informez-vous sur les vérifications d\'identité et la sécurité.',
      es: 'Gestione las suscripciones de Stripe, obtenga información sobre la verificación de identidad y consejos de seguridad.',
      it: 'Gestisci gli abbonamenti Stripe, scopri le verifiche dell\'ID e i consigli sulla sicurezza.'
    }
  },
  {
    id: 'relocation',
    icon: 'Compass',
    title: {
      en: 'Relocation & Expat Planning',
      no: 'Flytting & Expat-planlegging',
      pl: 'Relokacja i Planowanie',
      de: 'Umzug & Expat-Planung',
      fr: 'Relocalisation & Expatriation',
      es: 'Relocalización y Expatriados',
      it: 'Trasferimento e Pianificazione'
    },
    description: {
      en: 'Guides on neighborhood selection, cost of living comparison, and visa lists.',
      no: 'Guider om valg av nabolag, sammenligning av levekostnader og visumlister.',
      pl: 'Przewodniki po wyborze dzielnic, porównania kosztów życia i dokumenty.',
      de: 'Leitfäden zur Nachbarschaftswahl, Lebenshaltungskosten und Visa-Checklisten.',
      fr: 'Guides sur le choix des quartiers, le coût de la vie et les visas.',
      es: 'Guías sobre selección de vecindarios, coste de vida y visas.',
      it: 'Guide sulla scelta dei quartieri, costo della vita e visti.'
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
      pl: 'Kompletny profil składa się z krótkiego życiorysu, wyboru wartości, szczegółów stylu życia oraz celów partnerskich. Zaleca się dodanie wyraźnych zdjęć. Stosujemy restrykcyjną moderację w celu blokowania nadużycia.',
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
      it: 'Come funziona le motore di compatibilità'
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
    id: 'relationship-journey',
    categoryId: 'relocation',
    title: {
      en: 'Relationship Journey & Relocation Timelines',
      no: 'Relasjonsreise og flyttetidslinjer',
      pl: 'Oś Czasu Relacji i Relokacja',
      de: 'Beziehungsreise & Umzugs-Zeitpläne',
      fr: 'Parcours relationnel & Calendrier de déménagement',
      es: 'Viaje de relación y plazos de mudanza',
      it: 'Percorso di relazione e tempistiche di trasferimento'
    },
    content: {
      en: 'The Relationship Journey tracks milestones from initial match and conversation to video calling, physical meetings, relocation, and commitment. Partners share a board containing dynamic visa checklists, housing shortlists, and budgeting tables to navigate migration safely.',
      no: 'Relasjonsreisen sporer milepæler fra første match og samtale, til videosamtaler, fysiske møter, flytteplanlegging og forpliktelse. Partnere deler et brett med dynamiske visumsjekklister, boliglister og felles reisebudsjett.',
      pl: 'Oś Czasu Relacji śledzi kamienie milowe: od pierwszego dopasowania i rozmowy, po rozmowy wideo, spotkania, przeprowadzkę i małżeństwo. Partnerzy dzielą przestrzeń z listami dokumentów wizowych, mieszkaniami i budżetem.',
      de: 'Die Beziehungsreise verfolgt Meilensteine vom ersten Match bis zum physischen Treffen, Umzug und Ehe. Partner teilen ein Dashboard mit Visa-Checklisten, Wohnungslisten und Budget-Tabellen, um den Umzug abzustimmen.',
      fr: 'Le parcours relationnel suit les étapes clés : premier match, appels vidéo, rencontres, installation et mariage. Les partenaires partagent un tableau de bord contenant des listes de visa, logements et budgets.',
      es: 'El Viaje de Relación realiza un seguimiento de los hitos desde el emparejamiento hasta las llamadas de video, reuniones, mudanza y compromiso. Los socios comparten listas de visa, viviendas y presupuestos conjuntos.',
      it: 'Il Percorso di Relazione traccia le tappe fondamentali dal primo contatto alle chiamate video, incontri, pianificazione del trasferimento e matrimonio. I partner condividono visti, alloggi e tabelle di budget.'
    }
  },
  {
    id: 'stripe-billing',
    categoryId: 'billing-safety',
    title: {
      en: 'Stripe Subscriptions & Receipts',
      no: 'Stripe-abonnementer og kvitteringer',
      pl: 'Subskrypcje i Faktury Stripe',
      de: 'Stripe-Abonnements & Quittungen',
      fr: 'Abonnements et Factures Stripe',
      es: 'Suscripciones y Recibos de Stripe',
      it: 'Abbonamenti e Ricevute Stripe'
    },
    content: {
      en: 'All payments are securely processed by Stripe. Subscriptions renew automatically. You can retrieve invoice histories, update payment methods, or cancel your premium subscription directly in the Billing panel.',
      no: 'Alle betalinger behandles sikkert av Stripe. Abonnementer fornyes automatisk. Du kan hente fakturahistorikk, oppdatere betalingsmetoder eller avslutte premium-abonnementet direkte i faktureringspanelet.',
      pl: 'Wszystkie płatności są bezpiecznie obsługiwane przez Stripe. Subskrypcje odnawiają się automatycznie. Faktury i historię płatności znajdziesz w panelu premium.',
      de: 'Alle Zahlungen werden sicher über Stripe abgewickelt. Abonnements verlängern sich automatisch. Sie können den Rechnungsverlauf einsehen, Zahlungsdaten aktualisieren oder Ihr Premium-Abonnement im Dashboard kündigen.',
      fr: 'Tous les paiements sont sécurisés par Stripe. Les abonnements se renouvellent automatiquement. Vous pouvez consulter l\'historique des factures et résilier votre offre premium depuis la page Facturation.',
      es: 'Todos los pagos se procesan de forma segura a través de Stripe. Las suscripciones se renuevan automáticamente. Puede recuperar el historial de facturas, actualizar los métodos de pago o cancelar su suscripción premium en el panel.',
      it: 'Tutti i pagamenti sono elaborati in modo sicuro da Stripe. Gli abbonamenti si rinnovano automaticamente. Puoi consultare lo storico delle fatture o annullare l\'abbonamento nel pannello.'
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
      it: 'Obbiettivo di Love Sync è offrire una verifica sicura a più livelli (Email, Telefono, Foto e ID statale). Il completamento di questi controlli crea fiducia, certifica la tua identità e assegna il badge di Membro Verificato sul tuo profilo.'
    }
  },
  {
    id: 'photo-gating',
    categoryId: 'billing-safety',
    title: {
      en: 'Private Photo Exchange Security Gates',
      no: 'Sikkerhetsgating for deling av private bilder',
      pl: 'Ograniczenia Wymiany Prywatnych Zdjęć',
      de: 'Sicherheitsgatter für privaten Fotoaustausch',
      fr: 'Sécurisation de l\'échange de photos privées',
      es: 'Gateras de seguridad de fotos privadas',
      it: 'Limitazioni per lo scambio di foto private'
    },
    content: {
      en: 'To prevent catfishing, random spamming, and romance scams, users must establish initial contact (exchange at least one chat message) before unlocking private photo exchange request buttons. This gating protects your privacy and identity.',
      no: 'For å unngå catfishing og kjærlighetsforbrytelser må partnere ha oppnådd kontakt (skrevet minst én melding i chatten) før deling av private profilbilder kan forespørres. Dette personvernsgitteret beskytter identiteten din.',
      pl: 'Aby uniknąć fałszywych profili (catfishing) oraz oszustw matrymonialnych, użytkownicy muszą nawiązać kontakt (wymienić przynajmniej jedną wiadomość) przed odblokowaniem przesyłania prywatnych zdjęć.',
      de: 'Um Fake-Profile und Romance Scamming zu verhindern, müssen Nutzer zunächst Kontakt herstellen (mindestens eine Nachricht senden), bevor sie private Fotoanfragen freischalten können. Dies schützt Ihre Privatsphäre.',
      fr: 'Pour prévenir l\'usurpation d\'identité et les arnaques sentimentales, les utilisateurs doivent établir un premier contact (envoyer au moins un message) avant d\'autoriser l\'échange de photos privées.',
      es: 'Para evitar el engaño y las estafas sentimentales, los usuarios deben entablar contacto (enviar al menos un mensaje) antes de poder solicitar fotos privadas. Esta gatera protege su privacidad.',
      it: 'Per prevenire profili falsi e truffe romantiche, gli utenti devono stabilire un primo contatto (scambiare almeno un messaggio) prima di sbloccare lo scambio di foto private.'
    }
  }
];

export const faqData = [
  {
    category: 'General',
    question: {
      en: 'How does the Compatibility Score work?',
      no: 'Hvordan fungerer kompatibilitetsscoren?',
      pl: 'Jak działa wskaźnik dopasowania?',
      de: 'Wie funktioniert der Kompatibilitätswert?',
      fr: 'Comment fonctionne le score de compatibilité ?',
      es: '¿Cómo funciona la puntuación de compatibilidad?',
      it: 'Come funziona il punteggio di compatibilità?'
    },
    answer: {
      en: 'Unlike other sites that use mysterious black-box AI logic, Love Sync uses deterministic mathematical calculations. We apply weighted Euclidean distance formulas to categories you prioritize, combined with exponential geographic distance decay and trust score multipliers.',
      no: 'I motsetning til andre nettsteder som bruker ugjennomsiktig AI-logikk, bruker Love Sync deterministiske matematiske formler. Vi anvender vektet Euclidsk avstand på dine prioriterte kategorier, kombinert med geografisk avfallsdemping og verifiseringsmultiplikator.',
      pl: 'W przeciwieństwie do innych portali używających czarnej skrzynki AI, Love Sync opiera się na deterministycznej matematyce. Używamy wskaźników odległości euklidesowej dla wybranych kategorii oraz eksponencjalnego spadku znaczenia odległości.',
      de: 'Im Gegensatz zu anderen Plattformen, die undurchsichtige KI nutzen, verwendet Love Sync deterministische Mathematik. Wir berechnen die gewichtete euklidische Distanz Ihrer Präferenzen, kombiniert mit geografischer Dämpfung.',
      fr: 'Contrairement aux algorithmes IA opaques, Love Sync utilise des mathématiques déterministes. Nous calculons la distance euclidienne pondérée de vos préférences, combinée à une décroissance géographique exponentielle.',
      es: 'A diferencia de otras plataformas que usan IA de caja negra, Love Sync utiliza cálculos matemáticos deterministas. Aplicamos fórmulas de distancia euclidiana ponderada combinadas con atenuación geográfica.',
      it: 'A differenza di altre app che usano algoritmi IA opachi, Love Sync si basa su calcoli matematici deterministici. Usiamo la formula della distanza euclidea pesata combinata con il decadimento geografico esponenziale.'
    }
  },
  {
    category: 'General',
    question: {
      en: 'Can I exchange private photos before chat contact is established?',
      no: 'Kan jeg dele private bilder før vi har oppnådd kontakt i chatten?',
      pl: 'Czy mogę wymienić się prywatnymi zdjęciami przed nawiązaniem kontaktu?',
      de: 'Kann ich private Fotos austauschen, bevor Kontakt hergestellt wurde?',
      fr: 'Puis-je échanger des photos privées avant d\'avoir discuté ?',
      es: '¿Puedo intercambiar fotos privadas antes de establecer contacto?',
      it: 'Posso scambiare foto private prima di aver stabilito un contatto?'
    },
    answer: {
      en: 'No. To protect users from romance scams and catfishing, the private photo request feature is gated. You must exchange at least one chat message before the system allows you to request or unlock high-resolution watermarked private images.',
      no: 'Nei. For å beskytte brukerne mot svindel og falske profiler, er privat bildedeling stengt. Dere må ha utvekslet minst én chatmelding før systemet lar dere be om eller låse opp vannmerkede, private album.',
      pl: 'Nie. Aby chronić użytkowników przed oszustwami, funkcja ta jest zablokowana. Musicie wymienić przynajmniej jedną wiadomość czatu, zanim system pozwoli na odblokowanie zdjęć z bezpiecznym znakiem wodnym.',
      de: 'Nein. Zum Schutz vor Romance Scamming ist diese Funktion gesperrt. Sie müssen mindestens eine Nachricht ausgetauscht haben, bevor das System das Anfordern oder Freischalten von wasserzeichengeschützten Alben erlaubt.',
      fr: 'Non. Pour vous protéger des arnaques, cette fonction est verrouillée. Vous devez avoir échangé au moins un message de chat avant que le système ne vous permette de demander l\'accès aux photos filigranées.',
      es: 'No. Para proteger a los usuarios de estafas sentimentales, la función está bloqueada. Debe intercambiar al menos un mensaje de chat antes de poder solicitar o desbloquear imágenes privadas con marca de agua.',
      it: 'No. Per proteggere gli utenti da truffe e catfishing, questa funzione è bloccata. Devi scambiare almeno un messaggio prima che il sistema consenta di sbloccare foto private protette da watermark.'
    }
  },
  {
    category: 'Billing',
    question: {
      en: 'Why is Love Sync a Premium-only platform?',
      no: 'Hvorfor er Love Sync en plattform kun for Premium-medlemmer?',
      pl: 'Dlaczego Love Sync wymaga posiadania konta Premium?',
      de: 'Warum ist Love Sync eine reine Premium-Plattform?',
      fr: 'Pourquoi Love Sync est-il réservé aux membres Premium ?',
      es: '¿Por qué Love Sync es una plataforma solo para Premium?',
      it: 'Perché Love Sync è riservato solo a utenti Premium?'
    },
    answer: {
      en: 'By charging a subscription and removing free tiers, we eliminate scammers, bots, and unserious users. We do not show ads, sell data, or trick you into maximizing screen time. Premium covers cost-efficient secure messaging, ID verification audits, and relocation dashboards.',
      no: 'Ved å ta betalt og fjerne gratisversjoner luker vi ut svindlere, roboter og useriøse profiler. Vi har ikke reklame, selger ikke data, og prøver ikke å holde deg avhengig. Abonnementet dekker meldingsformidling, ID-verifisering og flytteverktøy.',
      pl: 'Wymóg opłaty abonamentowej eliminuje boty, oszustów i niezaangażowanych użytkowników. Nie wyświetlamy reklam ani nie sprzedajemy danych. Premium pokrywa koszty weryfikacji tożsamości oraz paneli relokacyjnych.',
      de: 'Durch die Kündigung kostenloser Konten eliminieren wir Betrüger und Bots. Wir schalten keine Werbung und verkaufen keine Daten. Die Premium-Mitgliedschaft deckt die Kosten für Ausweisprüfungen und Umzugstools.',
      fr: 'En éliminant l\'offre gratuite, nous excluons les bots et les faux profils. Nous n\'affichons pas de publicité et ne vendons pas vos données. L\'abonnement finance les vérifications d\'identité et les outils d\'installation.',
      es: 'Al cobrar una suscripción y eliminar las cuentas gratuitas, eliminamos estafadores y bots. No mostramos anuncios ni vendemos datos. Premium cubre los costos de la verificación de identidad y paneles de mudanza.',
      it: 'Richiedendo un abbonamento eliminiamo truffatori, bot e utenti poco seri. Non mostriamo pubblicità né vendiamo dati. L\'abbonamento copre i costi delle verifiche dell\'ID e degli strumenti di trasferimento.'
    }
  },
  {
    category: 'General',
    question: {
      en: 'How does identity verification work?',
      no: 'Hvordan fungerer identitetsverifiseringen?',
      pl: 'Jak działa weryfikacja tożsamości?',
      de: 'Wie funktioniert die Identitätsprüfung?',
      fr: 'Comment fonctionne la vérification d\'identité ?',
      es: '¿Cómo funciona la verificación de identidad?',
      it: 'Come funziona la verifica dell\'identità?'
    },
    answer: {
      en: 'Users verify their profiles in four steps: Email code confirmation, SMS phone verification, real-time live selfie capture (photo matching), and government-issued ID checks (background/passport validation) to grant the Verified Member status.',
      no: 'Brukere verifiserer profilene sine i fire trinn: Bekreftelse av e-postkode, SMS-telefonverifisering, sanntids selfie-analyse og innsending av offentlig ID (pass/førerkort) for å oppnå verifisert status.',
      pl: 'Weryfikacja składa się z czterech etapów: potwierdzenia e-mail, kodu SMS, wykonania zdjęcia selfie w czasie rzeczywistym oraz przesłania dokumentu tożsamości w celu nadania statusu Zweryfikowanego Członka.',
      de: 'Nutzer verifizieren ihr Profil in vier Schritten: E-Mail-Bestätigung, SMS-Handyverifizierung, Echtzeit-Selfie und Prüfung eines behördlichen Ausweises (Reisepass/Führerschein) zur Erlangung des Verifizierungsstatus.',
      fr: 'Les utilisateurs valident leur profil en quatre étapes : confirmation d\'e-mail, code SMS, selfie en temps réel et vérification de la pièce d\'identité officielle pour obtenir le badge Membre Vérifié.',
      es: 'Los usuarios verifican su perfil en cuatro pasos: confirmación de correo, código SMS, selfie en tiempo real y verificación de documento de identidad oficial para obtener la insignia de Miembro Verificado.',
      it: 'Gli utenti verificano il profilo in quattro fasi: conferma dell\'email, codice SMS, selfie in tempo reale e controllo del documento d\'identità statale per ottenere lo status di Membro Verificato.'
    }
  },
  {
    category: 'General',
    question: {
      en: 'How is my private data protected?',
      no: 'Hvordan er mine private data beskyttet?',
      pl: 'Jak chronione są moje prywatne dane?',
      de: 'Wie werden meine privaten Daten geschützt?',
      fr: 'Comment mes données privées sont-elles protégées ?',
      es: '¿Cómo se protegen mis datos privados?',
      it: 'Come sono protetti i miei dati privati?'
    },
    answer: {
      en: 'We store all profile records securely inside encrypted Cloudflare D1 databases. Passwords and uploads are hashed. Private photos are watermarked on the Edge. We strictly comply with GDPR regulations, and we never share data with third-party advertisers.',
      no: 'Vi lagrer alle profilinformasjon trygt i krypterte Cloudflare D1-databaser. Passord og opplastinger er hashet. Private bilder påføres vannmerke på Edge-servere. Vi følger GDPR strengt og deler aldri data med annonsører.',
      pl: 'Wszystkie dane przechowujemy w bezpiecznych, szyfrowanych bazach danych Cloudflare D1. Hasła są haszowane. Prywatne zdjęcia mają nakładany znak wodny. Przestrzegamy RODO i nigdy nie udostępniamy danych reklamodawcom.',
      de: 'Wir speichern alle Profildaten sicher in verschlüsselten Cloudflare D1-Datenbanken. Passwörter sind gehasht. Private Fotos werden direkt auf den Edge-Servern mit Wasserzeichen versehen. Wir arbeiten streng nach DSGVO.',
      fr: 'Nous stockons toutes les données de profil de manière sécurisée dans des bases de données chiffrées Cloudflare D1. Les mots de passe sont hachés. Les photos privées sont filigranées. Nous respectons le RGPD.',
      es: 'Almacenamos los datos de perfil de forma segura en bases de datos cifradas de Cloudflare D1. Las contraseñas están hasheadas. Las fotos privadas tienen marca de agua. Cumplimos con el RGPD.',
      it: 'Archiviamo tutti i dati del profilo in database crittografati Cloudflare D1. Le password sono protette da hash. Le foto private sono protette da watermark a livello Edge. Rispettiamo rigorosamente il GDPR.'
    }
  },
  {
    category: 'Billing',
    question: {
      en: 'Can I cancel my subscription at any time?',
      no: 'Kan jeg avslutte abonnementet mitt når som helst?',
      pl: 'Czy mogę anulować subskrypcję w dowolnym momencie?',
      de: 'Kann ich mein Abonnement jederzeit kündigen?',
      fr: 'Puis-je résilier mon abonnement à tout moment ?',
      es: '¿Puedo cancelar mi suscripción en cualquier momento?',
      it: 'Posso annullare l\'abbonamento in qualsiasi momento?'
    },
    answer: {
      en: 'Yes. You can cancel your Premium subscription with one click through the Billing dashboard. Access continues until the end of your current billing period. Cancellation takes effect immediately at expiration.',
      no: 'Ja. Du kan avslutte ditt Premium-abonnement med ett klikk i faktureringspanelet. Du beholder tilgangen ut den inneværende betalingsperioden, og ingen flere trekk vil bli foretatt.',
      pl: 'Tak. Możesz anulować subskrypcję Premium jednym kliknięciem w panelu rozliczeń. Dostęp pozostaje aktywny do końca bieżącego okresu rozliczeniowego, po czym wygasa.',
      de: 'Ja. Sie können Ihr Premium-Abonnement mit einem Klick im Abrechnungsbereich kündigen. Der Zugriff bleibt bis zum Ende des aktuellen Abrechnungszeitraums bestehen.',
      fr: 'Oui. Vous pouvez résilier votre abonnement Premium en un clic dans la section Facturation. Votre accès reste actif jusqu\'à la fin de la période de facturation en cours.',
      es: 'Sí. Puede cancelar su suscripción Premium con un clic a través del panel de facturación. El acceso continúa hasta el final del período de facturación actual.',
      it: 'Sì. Puoi annullare l\'abbonamento Premium con un clic nel pannello di fatturazione. L\'accesso rimane attivo fino al termine del periodo di fatturazione corrente.'
    }
  },
  {
    category: 'General',
    question: {
      en: 'How are translations handled in secure messaging?',
      no: 'Hvordan håndteres oversettelser i meldinger?',
      pl: 'Jak są obsługiwane tłumaczenia w wiadomościach?',
      de: 'Wie werden Übersetzungen in Nachrichten gehandhabt?',
      fr: 'Comment les traductions sont-elles gérées dans les messages ?',
      es: '¿Cómo se manejan las traducciones en los mensajes?',
      it: 'Come sono gestite le traduzioni nei messaggi?'
    },
    answer: {
      en: 'Translations are executed in real-time directly on Cloudflare Edge servers. The translation processing is temporary and does not store copies of your conversations in plain text on external services, ensuring high-speed delivery and strict privacy.',
      no: 'Oversettelser utføres i sanntid direkte på Cloudflares Edge-servere. Behandlingen skjer midlertidig og lagrer ingen ukryptert logg på eksterne tjenester, noe som sikrer rask levering og strengt personvern.',
      pl: 'Tłumaczenia są realizowane w czasie rzeczywistym bezpośrednio na serwerach Cloudflare Edge. Proces ten jest tymczasowy i nie zapisuje rozmów otwartym tekstem na zewnętrznych serwisach, dbając o pełną poufność.',
      de: 'Übersetzungen werden in Echtzeit auf den Cloudflare Edge-Servern durchgeführt. Die Verarbeitung erfolgt temporär und speichert keine unverschlüsselten Logs auf externen Servern.',
      fr: 'Les traductions sont exécutées en temps réel sur les serveurs Cloudflare Edge. Les échanges temporaires ne sont pas stockés en clair sur des services externes pour garantir la confidentialité.',
      es: 'Las traducciones se ejecutan en tiempo real en los servidores Edge de Cloudflare. El procesamiento es temporal y no almacena copias de sus chats en texto plano.',
      it: 'Le traduzioni avvengono in tempo reale a livello Cloudflare Edge. La gestione è temporanea e non memorizza conversazioni in chiaro su server esterni.'
    }
  },
  {
    category: 'General',
    question: {
      en: 'How does the Relationship Journey™ relocation timeline work?',
      no: 'Hvordan fungerer Relasjonsreisen™ og flyttetidslinjen?',
      pl: 'Jak działa Oś Czasu Relacji™ oraz plan przeprowadzki?',
      de: 'Wie funktioniert die Beziehungsreise™ & Umzugsplanung?',
      fr: 'Comment fonctionne le parcours relationnel™ et le déménagement ?',
      es: '¿Cómo funciona el Viaje de Relación™ y la mudanza?',
      it: 'Come funziona il Percorso di Relazione™ e il trasferimento?'
    },
    answer: {
      en: 'It is a structured planner helping international couples coordinate their future. It lists milestones (first meetings, video calls, relocation lists) and provides shared checklists for visas, local housing, budgets, and expat documentation.',
      no: 'Det er et strukturert planleggingsverktøy som hjelper internasjonale par med å koordinere fremtiden. Verktøyet sporer milepæler (første møter, videosamtaler, flytting) og gir felles sjekklister for visum, bolig, budsjett og dokumenter.',
      pl: 'To ustrukturyzowany planer pomagający parom międzynarodowym koordynować wspólną przyszłość. Zawiera listy kontrolne dla wiz, mieszkań, wspólnego budżetu i dokumentacji.',
      de: 'Ein strukturierter Planer für internationale Paare. Er zeigt Meilensteine (erste Treffen, Video-Telefonie, Umzugslisten) und bietet Checklisten für Visa, Wohnraum und Umzugsunterlagen.',
      fr: 'Il s\'agit d\'un outil de planification structuré pour les couples internationaux. Il liste les jalons (rencontres, visas, logements, budgets) et propose des check-lists partagées pour l\'expatriation.',
      es: 'Es un planificador estructurado para parejas internacionales. Muestra hitos (primeras citas, videollamadas) y proporciona listas compartidas de visas, presupuestos y viviendas.',
      it: 'È uno strumento per aiutare le copie internazionali. Indica le scadenze (incontri, videochiamate, traslochi) e offre liste condivise per visti, alloggi e documenti.'
    }
  },
  {
    category: 'Privacy',
    question: {
      en: 'What happens if I delete my account?',
      no: 'Hva skjer om jeg sletter kontoen min?',
      pl: 'Co się dzieje po usunięciu konta?',
      de: 'Was passiert, wenn ich mein Konto lösche?',
      fr: 'Que se passe-t-il si je supprime mon compte ?',
      es: '¿Qué ocurre si elimino mi cuenta?',
      it: 'Cosa succede se cancello il mio account?'
    },
    answer: {
      en: 'Under GDPR right to erasure rules, we purge all database records, chat histories, verification logs, and private photos from D1 storage immediately. There are no residual backups kept of deleted profiles.',
      no: 'Under GDPR-reglene for sletting, fjerner vi alle databasedokumenter, chatlogger, verifiseringsbevis og private bilder fra D1-lageret umiddelbart. Ingen gjenværende sikkerhetskopier lagres.',
      pl: 'Zgodnie z wytycznymi RODO (GDPR), natychmiast usuwamy wszystkie wpisy w bazie danych, historie czatów, dokumenty weryfikacji i prywatne zdjęcia. Nie przechowujemy żadnych kopii zapasowych.',
      de: 'Unter Einhaltung der DSGVO löschen wir sämtliche Datenbankeinträge, Chat-Verläufe, Verifizierungsdaten und private Fotos sofort aus dem Speicher. Es verbleiben keine Backups.',
      fr: 'Conformément au RGPD, nous supprimons immédiatement toutes les données, messages, historiques et photos de nos serveurs. Aucune copie de sauvegarde n\'est conservée.',
      es: 'Bajo las normas del RGPD, eliminamos todos los registros, chats, datos de verificación y fotos privadas de inmediato. No se conservan copias de seguridad de perfiles eliminados.',
      it: 'Secondo le regole del GDPR, eliminiamo natychmiast tutti i dati, messaggi, verifiche e foto private dai nostri server. Non conserviamo copie di backup residue.'
    }
  }
];
