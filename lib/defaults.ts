/**
 * Branch defaults for the Brume (florist) template.
 *
 * Copy extracted from the hardcoded site pages — keep the dark, moody,
 * editorial voice in every field. These defaults seed Redis on first read
 * (see lib/content.ts) and act as the fallback when Redis is unconfigured.
 */

import type { SiteContent } from './content';

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: 'Brume',
    title: 'Florals for ',
    titleAccent: 'evenings',
    titleEnd: ' that matter.',
    subtitle:
      'Bridal bouquets and private arrangements composed in deep color — restrained, modern, sure of themselves.',
    ctaPrimary: 'Commission',
    ctaPrimaryHref: '/commission',
    ctaSecondary: 'Portfolio',
    ctaSecondaryHref: '/portfolio',
    image: '/img/brume/home/hero.jpg',
    imageAlt: 'Burgundy bridal bouquet by Brume',
    caption: '',
  },

  // Practice values — rendered on the About ("Practice") page.
  features: [
    {
      icon: '❧',
      title: 'Depth over brightness',
      description: 'We favour wine, dusk, and hush — color that holds a room.',
    },
    {
      icon: '✦',
      title: 'Bouquets as architecture',
      description:
        'Form first, then bloom. Every piece must sit well in the hand.',
    },
    {
      icon: '◈',
      title: 'Small by design',
      description:
        'Few commissions. Full attention. No theatre on the day.',
    },
  ],

  // "Selected work" strip on the home page.
  services: [
    {
      title: 'Bridal bouquets',
      description: 'Hand-tied bridal bouquets in deep, deliberate color.',
    },
    {
      title: 'Table vessels',
      description:
        'Vessels and arrangements composed for the room after dark.',
    },
    {
      title: 'Studio studies',
      description: 'Seasonal studies from the studio bench.',
    },
  ],

  about: {
    intro:
      'Brume began with a preference for florals that feel like dusk — rich without shouting, composed without stiffness.\n\nWe work with couples and hosts who want bouquets and arrangements that hold presence after the light softens. Restraint is the luxury.',
    highlights: [
      'Bridal bouquets and private arrangements',
      'Composed in deep, deliberate color',
      'Small studio — few commissions, full attention',
    ],
    email: 'hello@brume.studio',
    phone: '(555) 014-3901',
    address: 'By appointment',
    hours: [
      { day: 'Tue – Fri', time: '10am – 5pm' },
      { day: 'Saturday', time: 'By appointment' },
      { day: 'Sun – Mon', time: 'Closed' },
    ],
  },

  faq: [
    {
      question: 'How far ahead should we commission?',
      answer:
        'Weddings and full-room work are best commissioned two to three months ahead. A single bouquet can often be composed within a week, season permitting.',
    },
    {
      question: 'Do you work outside the studio?',
      answer:
        'Yes. We dress venues for weddings and private evenings — the room after dark is where our work lives. Visits are by appointment.',
    },
    {
      question: 'Can you work to a palette?',
      answer:
        'Palette is our starting point. Bring the mood — wine, dusk, hush — and we compose stems around it.',
    },
  ],

  /** Announcement banner. Empty string = hidden. */
  notice: '',

  gallery: [
    '/img/brume/home/hero.jpg',
    '/img/brume/home/secondary.jpg',
    '/img/brume/home/detail.jpg',
    '/img/brume/work/01.jpg',
    '/img/brume/work/02.jpg',
    '/img/brume/work/03.jpg',
    '/img/brume/work/04.jpg',
    '/img/brume/work/05.jpg',
    '/img/brume/work/06.jpg',
    '/img/brume/work/07.jpg',
    '/img/brume/work/08.jpg',
  ],

  marquee: [],
};

export default DEFAULT_CONTENT;
