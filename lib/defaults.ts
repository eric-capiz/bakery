/**
 * Branch default CMS content for the "Sweet Dreams Bakery" theme.
 *
 * Converted from the legacy getDefaultContent() shape in
 * pages/api/content/get.ts into the shared SiteContent schema (lib/content.ts).
 * Do NOT change the schema here — edit lib/content.ts if new fields are needed.
 */

import type { SiteContent } from './content';

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: 'Sweet Dreams Bakery',
    title: 'The More',
    titleAccent: 'Cake',
    titleEnd: 'The Batter',
    subtitle: 'Contact me for all your sweet tooth needs!',
    ctaPrimary: 'Book a Consultation',
    ctaPrimaryHref: '/contact',
    ctaSecondary: 'View Gallery',
    ctaSecondaryHref: '/sample-cakes',
    image: '/img/home/hero-pastry.png',
    imageAlt: 'Signature celebration cake',
    caption: 'Hand finished · Made to order',
  },
  features: [
    {
      icon: '⚡',
      title: 'Fast Service',
      description: 'Within 24hrs in most cases!',
    },
    {
      icon: '💰',
      title: 'Affordable',
      description:
        'Competitive pricing with promotional discounts available!',
    },
    {
      icon: '🎨',
      title: 'Custom Made',
      description: 'Dream big! We bring your vision to life.',
    },
    {
      icon: '👨‍🍳',
      title: 'Professional',
      description: '8+ years of professional baking experience.',
    },
  ],
  services: [
    {
      title: 'Birthday Cakes',
      description:
        'Make every birthday unforgettable with our custom designs.',
    },
    {
      title: 'Wedding Cakes',
      description: 'Elegant and delicious cakes for your special day.',
    },
    {
      title: 'Anniversary Cakes',
      description: 'Celebrate your milestones with style.',
    },
    {
      title: 'Corporate Events',
      description: 'Professional cakes for your business occasions.',
    },
  ],
  about: {
    intro:
      "Hi, I'm Eric! I've been passionate about baking since I was young, and I've been creating custom cakes professionally for over 8 years. What started as a childhood hobby has grown into a dedicated craft where I bring your sweetest dreams to life, one cake at a time.",
    highlights: [
      'Custom Cakes',
      'Cupcakes',
      'Cookies',
      'Brownies',
      'Pies & Tarts',
      'Cheesecakes',
      'Birthday Cakes',
      'Wedding Cakes',
      'Anniversary Cakes',
      'Corporate Cakes',
    ],
    email: 'info@sweetdreamsbakery.com',
    phone: '(555) 123-4567',
    address: 'Denver, Colorado',
    hours: [
      { day: 'Monday', time: '9:00 AM - 6:00 PM' },
      { day: 'Tuesday', time: '9:00 AM - 6:00 PM' },
      { day: 'Wednesday', time: '9:00 AM - 6:00 PM' },
      { day: 'Thursday', time: '9:00 AM - 6:00 PM' },
      { day: 'Friday', time: '9:00 AM - 6:00 PM' },
      { day: 'Saturday', time: '10:00 AM - 4:00 PM' },
      { day: 'Sunday', time: 'Closed' },
    ],
  },
  faq: [
    {
      question: 'How Long Does Delivery Take?',
      answer: 'Delivery is available within 24hrs in most cases!',
    },
    {
      question: "What's Your Specialty?",
      answer: 'I specialize in custom cakes for any occasion!',
    },
    {
      question: 'What Forms Of Payment Do You Accept?',
      answer: 'Cash, Venmo, Zelle, and Cash App.',
    },
    {
      question: 'Do You Deliver?',
      answer: 'Yes! Delivery is available within a 25 mile radius.',
    },
  ],
  notice: '',
  gallery: [
    '/img/Cakes/cake2.jpg',
    '/img/Cakes/cake5.jpg',
    '/img/Cakes/cake8.jpg',
    '/img/Cakes/cake11.jpg',
    '/img/Cakes/cake14.jpg',
    '/img/Cakes/cake16.jpg',
  ],
  marquee: [
    'Custom Cakes',
    'Weddings',
    'Birthdays',
    'Cupcakes',
    'Anniversaries',
    'Private Events',
    'Sugar Art',
    'Consultations',
  ],
};
