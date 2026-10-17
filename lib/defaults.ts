import type { SiteContent } from "./content";

/**
 * ELLIS (landscape branch) — default site content for the CMS.
 * Extracted from the branch's hardcoded pages (Home, Work, About,
 * Consultation). Admin edits via /admin/content override these; they are
 * also the SSR fallback when Redis is unconfigured.
 */
export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: "Outdoor care",
    title: "Ellis",
    titleAccent: "Property,",
    titleEnd: "finished.",
    subtitle:
      "Refined lawn care, exterior washing, and mobile detailing with quiet standards for the modern property.",
    ctaPrimary: "Reserve a visit",
    ctaPrimaryHref: "/book",
    ctaSecondary: "View services",
    ctaSecondaryHref: "/services",
    image: "/img/ellis/home/hero.jpg",
    imageAlt: "Modern residence with composed landscape",
    caption: "",
  },
  features: [
    {
      icon: "◇",
      title: "Clarity",
      description: "A range before we begin. No surprises after the visit.",
    },
    {
      icon: "◇",
      title: "Pace",
      description:
        "We arrive when we say, and move through the property with care.",
    },
    {
      icon: "◇",
      title: "Finish",
      description: "Blow-off, rinse, and a last look before we leave the curb.",
    },
  ],
  services: [
    {
      title: "Grounds",
      description:
        "Lawn and garden care so the property stays composed.\n\nLawn cut & edge — from $55 (up to ¼ acre) · Bed cleanup & mulch — from $180 (priced by area) · Hedge shaping — from $120 (by length) · Seasonal cleanup — from $200 (spring or fall)",
    },
    {
      title: "Exterior wash",
      description:
        "Pressure and soft washing for driveways, stone, and the house.\n\nDriveway wash — from $175 (up to two-car pad) · Patio & stone — from $150 (by size) · House soft wash — from $350 (one-story starting rate)",
    },
    {
      title: "Mobile detailing",
      description:
        "We come to you for hand wash and interior detail in your driveway.\n\nHand wash — from $45 (at your address) · Interior detail — from $129 (SUV +$20) · Full detail — from $219 (wash, cabin, and wax)",
    },
  ],
  about: {
    intro:
      "We built Ellis around a simple idea: the lawn, the stone, and the car should feel like one finished place, tended by people who notice the edges.\n\nAppointments are paced. Pricing is spoken plainly. The work leaves quietly.",
    highlights: [
      "Grounds, wash, and detailing under one quiet standard",
      "A clear range before we begin — no surprises after",
      "Insured, punctual, and easy to reach",
    ],
    email: "hello@ellisoutdoor.com",
    phone: "(555) 014-3390",
    address: "City & nearby",
    hours: [
      { day: "Monday – Saturday", time: "7:00 AM – 5:00 PM" },
      { day: "Sunday", time: "Closed" },
    ],
  },
  faq: [
    {
      question: "How do visits work?",
      answer:
        "Share what you need. We confirm timing and a clear range before we arrive.",
    },
    {
      question: "Can grounds and detailing be combined?",
      answer:
        "Yes. Combined visits are common. We sequence the work so both finish cleanly.",
    },
    {
      question: "What payments do you accept?",
      answer: "Cards, Venmo, Zelle, and cash.",
    },
    {
      question: "Where do you serve?",
      answer:
        "The city and nearby neighborhoods. Farther travel is noted up front if needed.",
    },
  ],
  notice: "",
  gallery: [
    "/img/ellis/home/hero.jpg",
    "/img/ellis/home/grounds.jpg",
    "/img/ellis/work/06.jpg",
    "/img/ellis/work/05.jpg",
    "/img/ellis/work/04.jpg",
  ],
  marquee: [],
};
