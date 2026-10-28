import type { Locale } from './config'

/**
 * Words used by the site's own furniture (menus, labels, buttons).
 * Everything the team writes in the back end (listings, tips, films) is
 * translated there, not here. English is complete; the other languages
 * fall back to English for anything not translated yet.
 */
export const en = {
  // The index under the masthead
  nav: {
    frontPage: 'Front Page',
    soldAndRented: 'Sold and Rented',
    available: 'For Sale and For Rent',
    tip: 'Tip of the Week',
    construction: 'Construction Manager',
    neighborhoods: 'Neighborhoods',
    office: 'The Office',
    sell: 'Sell with Us',
  },
  mastheadLine: 'New York · Real Estate and Construction',
  menu: 'Sections',
  skip: 'Skip to the story',

  status: {
    'for-sale': 'For Sale',
    'for-rent': 'For Rent',
    sold: 'Sold',
    rented: 'Rented',
  },
  headlineWord: {
    'for-sale': 'Now Offered',
    'for-rent': 'Now Available',
    sold: 'Sold',
    rented: 'Rented',
  },
  propertyType: {
    apartment: 'Apartment',
    condo: 'Condominium',
    coop: 'Co-op',
    townhouse: 'Townhouse',
    rental: 'Rental apartment',
    house: 'House',
    commercial: 'Commercial property',
  },
  borough: {
    manhattan: 'Manhattan',
    brooklyn: 'Brooklyn',
    queens: 'Queens',
    bronx: 'The Bronx',
    'staten-island': 'Staten Island',
  },

  // Home facts, written as sentences
  facts: {
    room: 'room',
    rooms: 'rooms',
    bedroom: 'bedroom',
    bedrooms: 'bedrooms',
    bath: 'bath',
    baths: 'baths',
    squareFeet: 'square feet',
    in: 'in',
    asking: 'Asking',
    rentOf: 'Rent',
    soldFor: 'Sold for',
    rentedFor: 'Rented for',
    perMonth: 'a month',
    perMonthShort: '/mo',
    commonCharges: 'Common charges',
    maintenance: 'Maintenance',
    taxes: 'Taxes',
    priceOnRequest: 'Price on request',
  },

  frontPage: {
    leadFallbackHeadline: 'Real estate, built from the first day to the last.',
    leadFallbackDeck: 'Gad Realty is a boutique New York brokerage and construction management firm.',
    leadStory: 'Lead story',
    detail: 'In detail',
    brokerLine: 'Broker and construction manager, from the first plans through the finished work.',
    seeSoldRented: 'See what we have sold and rented',
    requestValuation: 'Request a valuation',
    inThisEdition: 'In this edition',
    alsoOn: 'Also listed on',
    title: 'Your next chapter starts here',
    standfirst: 'Selling, buying, renting, or creating a home of your own.',
    intro:
      'At Gad Realty, we take the time to understand what matters to you. As a boutique New York brokerage and construction management firm, we bring personal attention, honest advice, and a practical eye for what a property can become.',
    services: [
      {
        title: 'Sell with confidence',
        text: 'Your home deserves a thoughtful strategy. We guide you on pricing, preparation, and marketing, then stay personally involved through showings, negotiations, and closing.',
        label: 'Sell With Us',
        href: '/sell-with-us',
      },
      {
        title: 'Find a place that feels like home',
        text: 'We listen to how you want to live and help you explore homes that fit, with clear advice on value, condition, and possibilities you may not have considered.',
        label: 'Find Your Home',
        href: '/available#for-sale',
      },
      {
        title: 'Rent with peace of mind',
        text: 'Whether you’re looking for your next home or a tenant for your property, we coordinate the details and guide you from the search to the signed lease.',
        label: 'Let’s Talk Rentals',
        href: '/available#for-rent',
      },
      {
        title: 'Bring your vision to life',
        text: 'See the possibilities before the work begins. From initial plans to finishing touches, we manage your renovation with care for your home, budget, and time.',
        label: 'Explore Construction Management',
        href: '/construction-management',
      },
    ],
    workTitle: 'A look at our work',
    workText: 'Discover the New York properties we’ve helped our clients sell and rent.',
    workLabel: 'View Recent Sales & Rentals',
    talkTitle: 'Let’s start with a conversation',
    talkText:
      'Tell us about your home and what you have in mind. We’ll help you understand your options and decide what comes next.',
    contactLabel: 'Contact Us',
    valuationLabel: 'Request a Property Valuation',
    languagesTitle: 'Personal service, in your language',
    languagesText: 'Our team speaks English, French, Italian, Spanish, and Hebrew.',
  },
  constructionDefault:
    'Gad Realty is a boutique brokerage and construction management firm. We run a project from the first plans through the finished work, then bring the same home to market.',
  jobTypesDefault: [
    'Staging & Painting',
    'Targeted Improvements',
    'Full Gut Renovations',
    'Apartment Combinations',
    'Townhouses',
    'Retail & Commercial Spaces',
  ],

  soldRented: {
    title: 'Sold and Rented',
    standfirst: 'Every home we have sold or rented, newest first.',
    all: 'All',
    allYears: 'All years',
    allNeighborhoods: 'All neighborhoods',
    year: 'Year',
    neighborhood: 'Neighborhood',
    show: 'Show',
    nothingYet: 'Nothing has been filed under this edition yet.',
    count: 'homes',
  },
  available: {
    title: 'For Sale and For Rent',
    standfirst: 'Homes available now.',
    forSale: 'For Sale',
    forRent: 'For Rent',
    nothingForSale: 'Nothing is for sale at the moment. Please ask us about homes not yet on the market.',
    nothingForRent: 'Nothing is for rent at the moment. Please ask us about homes not yet on the market.',
    inquire: 'Inquire',
  },
  home: {
    construction: 'Construction',
    handledBy: 'Handled by',
    photographs: 'Photographs',
    askAbout: 'Ask about this home',
    askLead: 'Write to us and the agent will reply.',
    film: 'Film',
    backToList: 'Back to Sold and Rented',
    backToAvailable: 'Back to homes available now',
    closed: 'Closed',
  },
  building: {
    title: 'The building',
    disclaimer: 'Gad Realty\u2019s view, from our own work in the building. Not an official score.',
    building: 'The building',
    doorman: 'Doorman and staff',
    management: 'Management company',
    lifestyle: 'Life around the building',
    managedBy: 'Managed by',
    funFact: 'A fact about the building',
  },
  tip: {
    title: 'Tip of the Week',
    tipNo: 'Tip of the Week, No.',
    article: 'Article',
    latest: 'This week',
    earlier: 'Earlier editions',
    by: 'By',
    photograph: 'Photograph',
    noTips: 'The first tip is on its way.',
    readOn: 'Read',
  },
  factOfTheDay: 'Real estate fact of the day',
  neighborhoods: {
    title: 'Neighborhoods',
    standfirst: 'Find your little corner of New York.',
    homesIn: 'Homes in',
    askAbout: 'Ask us about homes in',
    manhattan: 'Manhattan',
    brooklyn: 'Brooklyn',
    queens: 'Queens',
    film: 'New York neighborhood film',
    filmBy: 'A film by Gad Realty',
    watch: 'Watch the film',
    more: 'More neighborhoods',
    none: 'The first neighborhood film is in production.',
    play: 'Play',
  },
  office: {
    title: 'About Gad Realty',
    standfirst: '32 years of experience. Personal attention at every price point.',
    agents: 'Agents',
    languages: 'Languages',
    phone: 'Telephone',
    homes: 'Homes closed',
    constructionTitle: 'Construction management',
    jobs: 'The work we manage',
    address: 'Find us',
    contactTitle: 'Contact Us',
    contactLead: 'Tell us about your home and what you have in mind. We will reply personally.',
    byAgent: 'Homes handled by',
    noHomes: 'No homes filed yet.',
    seeHomes: 'See their homes',
    portraitSoon: 'Portrait to come',
  },
  sell: {
    title: 'Sell with Us',
    standfirst: 'Your home deserves a thoughtful strategy and a team personally invested in your sale.',
    intro: [
      'At Gad Realty, we understand that selling your home is a significant decision. As a boutique brokerage, we offer personal attention, honest advice, and a tailored approach to presenting your property, attracting buyers, and negotiating on your behalf.',
      'Our experience in real estate and construction management helps us recognize your home’s potential and recommend improvements that may add value before listing. From preparation through closing, we manage the details so you can move forward with confidence.',
    ],
    stepsTitle: 'How we work',
    steps: [
      {
        title: 'Your home, your goals',
        text: 'We walk through your property, discuss your priorities and timing, and review comparable sales and competing listings to recommend a pricing and preparation strategy.',
      },
      {
        title: 'Prepare with purpose',
        text: 'A few thoughtful changes can make a meaningful difference. We help you decide what is worth doing and can oversee improvements with your budget and timeline in mind.',
      },
      {
        title: 'Make the right first impression',
        text: 'We create a marketing approach around what makes your home special, combining compelling presentation with targeted exposure to buyers and the brokerage community.',
      },
      {
        title: 'Personal attention through closing',
        text: 'We coordinate showings, share feedback, evaluate offers, and negotiate on your behalf. You receive clear communication and attentive guidance at every step.',
      },
    ],
    quote: 'Let’s talk about your home.',
    valuationTitle: 'Schedule a Consultation',
    valuationLead: 'Contact us for a personal consultation and a plan tailored to your sale.',
    phoneLine: 'We are a phone call away.',
  },
  form: {
    name: 'Your name',
    email: 'Email',
    phone: 'Telephone (optional)',
    propertyAddress: 'Address of the home',
    message: 'Message',
    send: 'Send',
    sending: 'Sending...',
    thanks: 'Thank you. We have your message and will reply personally.',
    error: 'Something went wrong. Please try again, or call the office.',
    required: 'Please fill in your name and a valid email.',
    disclosure:
      'After you send this, we will email you a link to the New York State Housing and Anti-Discrimination Disclosure Form, which contains information regarding the New York State Human Rights Law.',
  },
  footer: {
    fairHousing: 'Equal Housing Opportunity',
    fairHousingNotice: 'New York State Fair Housing Notice',
    disclosureForm: 'Housing and Anti-Discrimination Disclosure Form',
    teamLogin: 'Team login',
    rights: 'All rights reserved.',
    languagesLine: 'Our agents speak English, French, Italian, Spanish and Hebrew.',
    office: 'The office',
  },
  placeholder: {
    photoSoon: 'Photograph to come',
  },
  notFound: {
    title: 'This page is not in today\'s edition',
    text: 'The page you are looking for may have moved. Return to the front page.',
    back: 'Back to the Front Page',
  },
}

export type Dictionary = typeof en

type DeepPartial<T> = { [K in keyof T]?: T[K] extends readonly unknown[] ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K] }

const fr: DeepPartial<Dictionary> = {
  nav: {
    frontPage: 'Une',
    soldAndRented: 'Vendus et loués',
    available: 'À vendre et à louer',
    tip: 'Conseil de la semaine',
    neighborhoods: 'Quartiers',
    office: 'Le Cabinet',
    sell: 'Vendre avec nous',
  },
  mastheadLine: 'New York · Immobilier et construction',
  status: { 'for-sale': 'À vendre', 'for-rent': 'À louer', sold: 'Vendu', rented: 'Loué' },
  headlineWord: { 'for-sale': 'En vente', 'for-rent': 'Disponible', sold: 'Vendu', rented: 'Loué' },
  frontPage: {
    brokerLine: 'Courtier et maître d\'œuvre, des premiers plans jusqu\'aux finitions.',
    seeSoldRented: 'Voir ce que nous avons vendu et loué',
    requestValuation: 'Demander une estimation',
  },
  form: { name: 'Votre nom', email: 'E-mail', phone: 'Téléphone (facultatif)', message: 'Message', send: 'Envoyer' },
}

const it: DeepPartial<Dictionary> = {
  nav: {
    frontPage: 'Prima pagina',
    soldAndRented: 'Venduti e affittati',
    available: 'In vendita e in affitto',
    tip: 'Consiglio della settimana',
    neighborhoods: 'Quartieri',
    office: 'L\'Ufficio',
    sell: 'Vendi con noi',
  },
  mastheadLine: 'New York · Immobiliare e costruzione',
  status: { 'for-sale': 'In vendita', 'for-rent': 'In affitto', sold: 'Venduto', rented: 'Affittato' },
  headlineWord: { 'for-sale': 'In vendita', 'for-rent': 'Disponibile', sold: 'Venduto', rented: 'Affittato' },
  frontPage: {
    brokerLine: 'Agente e direttore dei lavori, dai primi progetti fino alla fine dei lavori.',
    seeSoldRented: 'Vedi cosa abbiamo venduto e affittato',
    requestValuation: 'Richiedi una valutazione',
  },
  form: { name: 'Il tuo nome', email: 'E-mail', phone: 'Telefono (facoltativo)', message: 'Messaggio', send: 'Invia' },
}

const es: DeepPartial<Dictionary> = {
  nav: {
    frontPage: 'Portada',
    soldAndRented: 'Vendidos y alquilados',
    available: 'En venta y en alquiler',
    tip: 'Consejo de la semana',
    neighborhoods: 'Barrios',
    office: 'La Oficina',
    sell: 'Venda con nosotros',
  },
  mastheadLine: 'Nueva York · Bienes raíces y construcción',
  status: { 'for-sale': 'En venta', 'for-rent': 'En alquiler', sold: 'Vendido', rented: 'Alquilado' },
  headlineWord: { 'for-sale': 'En venta', 'for-rent': 'Disponible', sold: 'Vendido', rented: 'Alquilado' },
  frontPage: {
    brokerLine: 'Corredora y gestora de obra, desde los primeros planos hasta el trabajo terminado.',
    seeSoldRented: 'Vea lo que hemos vendido y alquilado',
    requestValuation: 'Solicitar una valoración',
  },
  form: { name: 'Su nombre', email: 'Correo electrónico', phone: 'Teléfono (opcional)', message: 'Mensaje', send: 'Enviar' },
}

const he: DeepPartial<Dictionary> = {
  nav: {
    frontPage: 'עמוד ראשון',
    soldAndRented: 'נמכרו והושכרו',
    available: 'למכירה ולהשכרה',
    tip: 'הטיפ של השבוע',
    neighborhoods: 'שכונות',
    office: 'המשרד',
    sell: 'למכור איתנו',
  },
  mastheadLine: 'ניו יורק · נדל״ן ובנייה',
  status: { 'for-sale': 'למכירה', 'for-rent': 'להשכרה', sold: 'נמכר', rented: 'הושכר' },
  headlineWord: { 'for-sale': 'למכירה', 'for-rent': 'להשכרה', sold: 'נמכר', rented: 'הושכר' },
  frontPage: {
    brokerLine: 'מתווכת ומנהלת בנייה, מהתוכניות הראשונות ועד לעבודה המוגמרת.',
    seeSoldRented: 'ראו מה מכרנו והשכרנו',
    requestValuation: 'בקשו הערכת שווי',
  },
  form: { name: 'השם שלכם', email: 'אימייל', phone: 'טלפון (לא חובה)', message: 'הודעה', send: 'שלח' },
}

const overrides: Record<Exclude<Locale, 'en'>, DeepPartial<Dictionary>> = { fr, it, es, he }

function merge<T extends Record<string, unknown>>(base: T, extra: DeepPartial<T>): T {
  const out: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(extra)) {
    const baseValue = (base as Record<string, unknown>)[key]
    if (value && typeof value === 'object' && !Array.isArray(value) && baseValue && typeof baseValue === 'object') {
      out[key] = merge(baseValue as Record<string, unknown>, value as DeepPartial<Record<string, unknown>>)
    } else if (value !== undefined) {
      out[key] = value
    }
  }
  return out as T
}

export function getDictionary(locale: Locale): Dictionary {
  if (locale === 'en') return en
  return merge(en, overrides[locale])
}
