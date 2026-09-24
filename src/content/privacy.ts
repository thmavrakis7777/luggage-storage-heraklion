import { business } from '@/lib/site';
import type { Block, JournalLocale } from '@/content/journal/types';

/** Bump when the policy text changes; shown on the page and in the sitemap. */
export const PRIVACY_UPDATED = '2026-09-24';

interface PrivacyContent {
  title: string;
  description: string;
  body: Block[];
  /** Shown only when Google Analytics is configured (NEXT_PUBLIC_GA_MEASUREMENT_ID). */
  analytics: Block[];
  closing: Block[];
}

/**
 * Describes what the site actually does with personal data: the booking
 * form (src/components/booking/BookingForm.tsx), Supabase in eu-west-1,
 * the Telegram notification (src/lib/telegram.ts), hosting on Vercel, the
 * in-memory rate limiter, next-intl's NEXT_LOCALE cookie, GA4 and the
 * tap-to-load map. Update it when any of those change.
 */
export const privacy: Record<JournalLocale, PrivacyContent> = {
  en: {
    title: 'Privacy Policy',
    description:
      'How Luggage Storage Heraklion City Center uses the personal data you give us when you book, visit our website or contact us.',
    body: [
      {
        type: 'p',
        text: 'This policy explains what personal data we collect when you use this website or book luggage storage with us, why we use it, who else handles it, and the rights you have under the EU General Data Protection Regulation (GDPR).',
      },
      { type: 'h2', text: 'Who we are' },
      {
        type: 'p',
        text: `${business.name}, ${business.streetAddress}, ${business.postalCode} ${business.addressLocality}, Crete, Greece, is responsible for your personal data (the “controller”). You can reach us by phone or WhatsApp on ${business.phoneDisplay}, or in person at the store.`,
      },
      { type: 'h2', text: 'What we collect when you book' },
      { type: 'p', text: 'When you book online, we ask for:' },
      {
        type: 'ul',
        items: [
          'Your name',
          'Your phone number',
          'Your drop-off and pick-up dates and times',
          'How many bags of each size you are leaving',
          'The language you booked in',
        ],
      },
      {
        type: 'p',
        text: 'We also create a booking reference and calculate the price. We do not ask for an email address, a postal address or any payment details online — you pay at the store.',
      },
      { type: 'h2', text: 'Why we use it' },
      {
        type: 'p',
        text: 'We use your booking details to hold your space, to recognise you and hand your bags back to the right person, and to contact you about your booking if we need to. The legal basis is that this is necessary to provide the storage service you asked for (Article 6(1)(b) GDPR). We do not use your details for marketing, and we never sell them.',
      },
      { type: 'h2', text: 'Who handles your data' },
      {
        type: 'p',
        text: 'We use a small number of service providers to run the website and the booking system. They process data only on our behalf:',
      },
      {
        type: 'ul',
        items: [
          'Supabase stores booking records in a database in the EU (Ireland). [Supabase privacy policy](https://supabase.com/privacy)',
          'Vercel hosts this website and processes the requests your browser sends, including your IP address. [Vercel privacy policy](https://vercel.com/legal/privacy-policy)',
          'Telegram: when you book, the booking details, including your name and phone number, are sent to our staff’s Telegram chat so we know you are coming. [Telegram privacy policy](https://telegram.org/privacy)',
        ],
      },
      {
        type: 'p',
        text: 'Some of these providers are based outside the EU or may process data outside it. Where that happens, the transfer relies on the safeguards the GDPR provides for it, such as the European Commission’s standard contractual clauses or an adequacy decision.',
      },
      { type: 'h2', text: 'How long we keep it' },
      {
        type: 'p',
        text: 'We keep booking details for as long as we need them to provide the service and to deal with any questions about your booking afterwards, and longer only where the law requires it. After that, we delete them.',
      },
      { type: 'h2', text: 'Security and abuse prevention' },
      {
        type: 'p',
        text: 'To stop automated spam, the booking system briefly counts recent requests from each IP address (held in memory for about ten minutes and never stored) and recent bookings made with the same phone number. The legal basis is our legitimate interest in keeping the booking system working (Article 6(1)(f) GDPR).',
      },
      { type: 'h2', text: 'Cookies' },
      {
        type: 'p',
        text: 'We do not use advertising cookies. The website may set a cookie called NEXT_LOCALE, which remembers the language you chose and is deleted when you close your browser.',
      },
    ],
    analytics: [
      { type: 'h2', text: 'Website statistics (Google Analytics)' },
      {
        type: 'p',
        text: 'We use Google Analytics 4 to count visits and see which pages are useful. It sets cookies (_ga and _ga_*) that last up to two years and sends information about your visit to Google — the pages you view, your type of device and browser, and your approximate location. When a booking is completed, we also record its reference and value, never your name or phone number. [Google privacy policy](https://policies.google.com/privacy)',
      },
    ],
    closing: [
      { type: 'h2', text: 'The map' },
      {
        type: 'p',
        text: 'The map in the “Location” section loads from Google Maps only when you tap “Show Map”. From then on, Google receives your IP address and browser details. [Google privacy policy](https://policies.google.com/privacy)',
      },
      { type: 'h2', text: 'Contacting us by WhatsApp or phone' },
      {
        type: 'p',
        text: 'If you message us on WhatsApp or call us, we see your number and what you send us, and use it only to answer you. WhatsApp’s own privacy policy also applies to messages sent through it.',
      },
      { type: 'h2', text: 'Your rights' },
      {
        type: 'p',
        text: 'You can ask us to show you the personal data we hold about you, to correct or delete it, to restrict or object to how we use it, or to give it to you in a portable format. Contact us by phone, on WhatsApp or at the store, and we will reply within one month.',
      },
      {
        type: 'p',
        text: 'If you think we have not handled your data properly, you can complain to the Hellenic Data Protection Authority ([www.dpa.gr](https://www.dpa.gr)).',
      },
      { type: 'h2', text: 'Changes to this policy' },
      {
        type: 'p',
        text: 'If we change how we use personal data, we will update this page and the date at the top.',
      },
    ],
  },
  el: {
    title: 'Πολιτική Απορρήτου',
    description:
      'Πώς το Luggage Storage Heraklion City Center χρησιμοποιεί τα προσωπικά δεδομένα που μας δίνετε όταν κάνετε κράτηση, επισκέπτεστε την ιστοσελίδα μας ή επικοινωνείτε μαζί μας.',
    body: [
      {
        type: 'p',
        text: 'Αυτή η πολιτική εξηγεί ποια προσωπικά δεδομένα συλλέγουμε όταν χρησιμοποιείτε αυτή την ιστοσελίδα ή κάνετε κράτηση φύλαξης αποσκευών σε εμάς, γιατί τα χρησιμοποιούμε, ποιοι άλλοι τα επεξεργάζονται και ποια δικαιώματα έχετε σύμφωνα με τον Γενικό Κανονισμό για την Προστασία Δεδομένων (ΓΚΠΔ) της ΕΕ.',
      },
      { type: 'h2', text: 'Ποιοι είμαστε' },
      {
        type: 'p',
        text: `Υπεύθυνος επεξεργασίας των προσωπικών σας δεδομένων είναι το ${business.name}, Σφακιανάκη 4, ${business.postalCode} Ηράκλειο Κρήτης. Μπορείτε να επικοινωνήσετε μαζί μας τηλεφωνικά ή μέσω WhatsApp στο ${business.phoneDisplay}, ή από κοντά στο κατάστημα.`,
      },
      { type: 'h2', text: 'Τι συλλέγουμε όταν κάνετε κράτηση' },
      { type: 'p', text: 'Όταν κάνετε κράτηση online, σας ζητάμε:' },
      {
        type: 'ul',
        items: [
          'Το όνομά σας',
          'Το τηλέφωνό σας',
          'Τις ημερομηνίες και ώρες παράδοσης και παραλαβής',
          'Πόσες αποσκευές κάθε μεγέθους αφήνετε',
          'Τη γλώσσα στην οποία κάνατε την κράτηση',
        ],
      },
      {
        type: 'p',
        text: 'Δημιουργούμε επίσης έναν κωδικό κράτησης και υπολογίζουμε την τιμή. Δεν ζητάμε online email, ταχυδρομική διεύθυνση ή στοιχεία πληρωμής — πληρώνετε στο κατάστημα.',
      },
      { type: 'h2', text: 'Γιατί τα χρησιμοποιούμε' },
      {
        type: 'p',
        text: 'Χρησιμοποιούμε τα στοιχεία της κράτησης για να κρατήσουμε τη θέση σας, για να σας αναγνωρίσουμε και να επιστρέψουμε τις αποσκευές στο σωστό άτομο, και για να επικοινωνήσουμε μαζί σας σχετικά με την κράτηση αν χρειαστεί. Νομική βάση είναι ότι η επεξεργασία είναι απαραίτητη για την παροχή της υπηρεσίας φύλαξης που ζητήσατε (άρθρο 6 παρ. 1 στοιχ. β΄ ΓΚΠΔ). Δεν χρησιμοποιούμε τα στοιχεία σας για διαφήμιση και δεν τα πουλάμε ποτέ.',
      },
      { type: 'h2', text: 'Ποιοι επεξεργάζονται τα δεδομένα σας' },
      {
        type: 'p',
        text: 'Χρησιμοποιούμε λίγους παρόχους υπηρεσιών για τη λειτουργία της ιστοσελίδας και του συστήματος κρατήσεων. Επεξεργάζονται δεδομένα μόνο για λογαριασμό μας:',
      },
      {
        type: 'ul',
        items: [
          'Η Supabase αποθηκεύει τις κρατήσεις σε βάση δεδομένων στην ΕΕ (Ιρλανδία). [Πολιτική απορρήτου της Supabase](https://supabase.com/privacy)',
          'Η Vercel φιλοξενεί την ιστοσελίδα και επεξεργάζεται τα αιτήματα που στέλνει ο browser σας, μαζί με τη διεύθυνση IP σας. [Πολιτική απορρήτου της Vercel](https://vercel.com/legal/privacy-policy)',
          'Telegram: όταν κάνετε κράτηση, τα στοιχεία της, μαζί με το όνομα και το τηλέφωνό σας, αποστέλλονται στη συνομιλία Telegram του προσωπικού μας, ώστε να ξέρουμε ότι έρχεστε. [Πολιτική απορρήτου του Telegram](https://telegram.org/privacy)',
        ],
      },
      {
        type: 'p',
        text: 'Ορισμένοι από αυτούς τους παρόχους έχουν έδρα εκτός ΕΕ ή ενδέχεται να επεξεργάζονται δεδομένα εκτός αυτής. Σε αυτή την περίπτωση, η διαβίβαση βασίζεται στις εγγυήσεις που προβλέπει ο ΓΚΠΔ, όπως οι τυποποιημένες συμβατικές ρήτρες της Ευρωπαϊκής Επιτροπής ή απόφαση επάρκειας.',
      },
      { type: 'h2', text: 'Πόσο καιρό τα κρατάμε' },
      {
        type: 'p',
        text: 'Κρατάμε τα στοιχεία της κράτησης όσο τα χρειαζόμαστε για να παρέχουμε την υπηρεσία και να απαντήσουμε σε τυχόν ερωτήματα για την κράτησή σας αργότερα, και περισσότερο μόνο όπου το απαιτεί ο νόμος. Έπειτα τα διαγράφουμε.',
      },
      { type: 'h2', text: 'Ασφάλεια και αποτροπή κατάχρησης' },
      {
        type: 'p',
        text: 'Για να σταματάμε τα αυτοματοποιημένα μηνύματα spam, το σύστημα κρατήσεων μετρά για λίγο τα πρόσφατα αιτήματα από κάθε διεύθυνση IP (κρατούνται στη μνήμη για περίπου δέκα λεπτά και δεν αποθηκεύονται) και τις πρόσφατες κρατήσεις με τον ίδιο αριθμό τηλεφώνου. Νομική βάση είναι το έννομο συμφέρον μας να λειτουργεί σωστά το σύστημα κρατήσεων (άρθρο 6 παρ. 1 στοιχ. στ΄ ΓΚΠΔ).',
      },
      { type: 'h2', text: 'Cookies' },
      {
        type: 'p',
        text: 'Δεν χρησιμοποιούμε διαφημιστικά cookies. Η ιστοσελίδα μπορεί να ορίσει ένα cookie με το όνομα NEXT_LOCALE, που θυμάται τη γλώσσα που επιλέξατε και διαγράφεται όταν κλείσετε τον browser.',
      },
    ],
    analytics: [
      { type: 'h2', text: 'Στατιστικά επισκεψιμότητας (Google Analytics)' },
      {
        type: 'p',
        text: 'Χρησιμοποιούμε το Google Analytics 4 για να μετράμε τις επισκέψεις και να βλέπουμε ποιες σελίδες είναι χρήσιμες. Ορίζει cookies (_ga και _ga_*) που διαρκούν έως δύο χρόνια και στέλνει στην Google πληροφορίες για την επίσκεψή σας — τις σελίδες που βλέπετε, τον τύπο συσκευής και browser και την κατά προσέγγιση τοποθεσία σας. Όταν ολοκληρώνεται μια κράτηση, καταγράφουμε επίσης τον κωδικό και την αξία της, ποτέ το όνομα ή το τηλέφωνό σας. [Πολιτική απορρήτου της Google](https://policies.google.com/privacy)',
      },
    ],
    closing: [
      { type: 'h2', text: 'Ο χάρτης' },
      {
        type: 'p',
        text: 'Ο χάρτης στην ενότητα «Τοποθεσία» φορτώνεται από το Google Maps μόνο όταν πατήσετε «Εμφάνιση Χάρτη». Από εκείνη τη στιγμή, η Google λαμβάνει τη διεύθυνση IP σας και στοιχεία του browser σας. [Πολιτική απορρήτου της Google](https://policies.google.com/privacy)',
      },
      { type: 'h2', text: 'Επικοινωνία μέσω WhatsApp ή τηλεφώνου' },
      {
        type: 'p',
        text: 'Αν μας στείλετε μήνυμα στο WhatsApp ή μας τηλεφωνήσετε, βλέπουμε τον αριθμό σας και ό,τι μας στέλνετε, και τα χρησιμοποιούμε μόνο για να σας απαντήσουμε. Για τα μηνύματα μέσω WhatsApp ισχύει επίσης η πολιτική απορρήτου του WhatsApp.',
      },
      { type: 'h2', text: 'Τα δικαιώματά σας' },
      {
        type: 'p',
        text: 'Μπορείτε να μας ζητήσετε να σας δείξουμε τα προσωπικά δεδομένα που έχουμε για εσάς, να τα διορθώσουμε ή να τα διαγράψουμε, να περιορίσουμε τη χρήση τους ή να αντιταχθείτε σε αυτήν, ή να σας τα δώσουμε σε φορητή μορφή. Επικοινωνήστε μαζί μας τηλεφωνικά, μέσω WhatsApp ή στο κατάστημα, και θα σας απαντήσουμε μέσα σε έναν μήνα.',
      },
      {
        type: 'p',
        text: 'Αν πιστεύετε ότι δεν χειριστήκαμε σωστά τα δεδομένα σας, μπορείτε να υποβάλετε καταγγελία στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα ([www.dpa.gr](https://www.dpa.gr)).',
      },
      { type: 'h2', text: 'Αλλαγές σε αυτή την πολιτική' },
      {
        type: 'p',
        text: 'Αν αλλάξουμε τον τρόπο που χρησιμοποιούμε τα προσωπικά δεδομένα, θα ενημερώσουμε αυτή τη σελίδα και την ημερομηνία στην κορυφή.',
      },
    ],
  },
};
