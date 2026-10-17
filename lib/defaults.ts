/**
 * Pit (auto repair + mobile van) default site content.
 *
 * Extracted from the branch's hardcoded pages (Home, Services ticker/page,
 * About, Consultation). Placeholder contact details are editable in the CMS —
 * the owner should replace them with the real shop details.
 */
import type { SiteContent } from './content';

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: 'Auto repair · Shop bay + mobile van',
    title: 'Pit',
    titleAccent: '',
    titleEnd: '',
    subtitle: 'Bay work. Driveway saves.',
    ctaPrimary: 'Book a slot',
    ctaPrimaryHref: '/book',
    ctaSecondary: 'Price board',
    ctaSecondaryHref: '/services',
    image: '/img/pit/home/hero.jpg',
    imageAlt: 'Mechanic working under a vehicle in the bay',
    caption:
      'Shop lift or mobile van — posted prices, straight answers, no mystery invoice.',
  },
  features: [
    {
      icon: '🔧',
      title: 'Say it straight',
      description: 'If it can wait, we say so.',
    },
    {
      icon: '📋',
      title: 'Post the price',
      description: 'Shop and mobile, up front — before we turn a wrench.',
    },
    {
      icon: '⏱️',
      title: 'Show up',
      description: 'Bay or driveway, on the time we book.',
    },
  ],
  services: [
    {
      title: 'Oil & filter',
      description: 'Blend oil, new filter, top-offs, quick walkaround.',
    },
    {
      title: 'Brake pads / axle',
      description: 'Pads, hardware check, rotor measure. Rotors extra if needed.',
    },
    {
      title: 'Battery install',
      description: 'Test, swap, clean terminals. Battery billed at cost.',
    },
    {
      title: 'Full diagnostic',
      description: 'Scan, live data, plain-English write-up.',
    },
    {
      title: 'Rotate & balance',
      description: 'Four tires, balance, set pressures.',
    },
    {
      title: 'Coolant flush',
      description: 'Drain, flush, refill to spec.',
    },
    {
      title: 'Spark plugs (4-cyl)',
      description: 'Plugs + boot check. 6/8-cyl quoted after look.',
    },
    {
      title: 'A/C recharge',
      description: 'Leak check, vacuum, recharge.',
    },
    {
      title: 'Wiper blades',
      description: 'Front install. Blades at cost.',
    },
    {
      title: 'Pre-purchase inspect',
      description: 'Lift, scan, road notes. Shop bay only.',
    },
  ],
  about: {
    intro:
      "We built PIT for people tired of waiting rooms and vague invoices. You get a clear diagnosis, a price before the work, and a text when it's ready.\n\nShop for the jobs that need a lift. Mobile for the ones that shouldn't wreck your day.",
    highlights: [
      'Posted prices — shop and mobile rates on the board',
      'Clear diagnosis before any work starts',
      'Text updates when your job is ready',
      'Same honesty in the bay and the driveway',
    ],
    email: 'hello@pitgarage.com',
    // PLACEHOLDERS — replace with the real shop details in the CMS.
    phone: '(555) 014-4820',
    address: '418 Ironworks Ave',
    hours: [{ day: 'Mon–Sat', time: '8–6' }],
  },
  faq: [
    {
      question: 'How far in advance should I book?',
      answer:
        'Same-week slots are common. Mobile zones fill faster — book early if you need a driveway visit.',
    },
    {
      question: 'Do you come to me?',
      answer:
        'Yes. Mobile covers Zone A (0–10 mi, trip included), Zone B +$25, Zone C +$45. Parts at cost.',
    },
    {
      question: 'Will I know the price before you start?',
      answer:
        'Always. Posted prices are on the price board, and we confirm a range before we turn a wrench.',
    },
    {
      question: 'What forms of payment do you accept?',
      answer: 'Cash, Venmo, Zelle, and major cards.',
    },
  ],
  notice: '',
  gallery: [
    '/img/pit/home/hero.jpg',
    '/img/pit/home/bay.jpg',
    '/img/pit/home/mobile.jpg',
    '/img/pit/work/02.jpg',
    '/img/pit/work/03.jpg',
  ],
  marquee: [
    'Oil & filter',
    'Brakes',
    'Battery',
    'Diagnostics',
    'Coolant',
    'Spark plugs',
    'A/C',
    'Mobile service',
  ],
};
