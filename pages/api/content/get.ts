import type { NextApiRequest, NextApiResponse } from 'next';
import { getData, setData } from '../../../lib/kv';

const CONTENT_KEY = 'content';

function getDefaultContent() {
  const defaultContent = {
    home: {
      hero: {
        tagline: "Bay work.",
        taglineAccent: "Driveway saves.",
        taglineEnd: "",
        subtitle: "Shop lift or mobile van — posted prices, straight answers, no mystery invoice."
      },
      features: [
        {
          icon: "🔧",
          title: "Shop Bay",
          description: "Full lift, deep diagnostics, and the jobs that need the floor."
        },
        {
          icon: "🚐",
          title: "Mobile Van",
          description: "Oil, batteries, pads, and roadside saves — priced by zone."
        },
        {
          icon: "📋",
          title: "Posted Prices",
          description: "Shop and mobile rates on the board before we turn a wrench."
        },
        {
          icon: "⏱️",
          title: "On Time",
          description: "Book a slot. We show up. Text when it's ready."
        }
      ],
      specialties: [
        {
          title: "Oil & Filter",
          description: "Blend oil, new filter, top-offs, quick walkaround."
        },
        {
          title: "Brakes",
          description: "Pads, hardware check, rotor measure — quote before work."
        },
        {
          title: "Diagnostics",
          description: "Scan, live data, plain-English write-up."
        },
        {
          title: "Battery & Electrical",
          description: "Test, swap, clean terminals. Parts billed at cost."
        }
      ]
    },
    about: {
      baker: {
        intro: "PIT runs a real bay and a mobile van for people tired of waiting rooms and vague invoices. Clear diagnosis, price before the work, text when it's ready.",
        experience: {
          main: "Years on the floor and on the road — shop jobs that need a lift, mobile jobs that shouldn't wreck your day.",
          education: "ASE-minded shop practice, manufacturer service info",
          specialization: "Maintenance, brakes, diagnostics, mobile service",
          years: "10+ years turning wrenches",
          certifications: "Shop bay + mobile fleet service"
        },
        whatIBake: [
          "Oil & Filter",
          "Brake Service",
          "Battery Install",
          "Full Diagnostic",
          "Coolant Flush",
          "Spark Plugs",
          "A/C Recharge",
          "Tire Rotate & Balance",
          "Pre-Purchase Inspect",
          "Mobile Roadside"
        ],
        hours: {
          monday: "8:00 AM - 6:00 PM",
          tuesday: "8:00 AM - 6:00 PM",
          wednesday: "8:00 AM - 6:00 PM",
          thursday: "8:00 AM - 6:00 PM",
          friday: "8:00 AM - 6:00 PM",
          saturday: "8:00 AM - 6:00 PM",
          sunday: "Closed"
        },
        contact: {
          email: "hello@pitgarage.com",
          phone: "(555) 014-4820"
        }
      },
      faq: [
        {
          question: "How far in advance should I book?",
          answer: "Same-week slots are common. Mobile zones fill faster — book early if you need a driveway visit."
        },
        {
          question: "What's your specialty?",
          answer: "Honest maintenance and diagnostics — shop bay for lift work, mobile for the quick saves."
        },
        {
          question: "What forms of payment do you accept?",
          answer: "Cash, Venmo, Zelle, and major cards."
        },
        {
          question: "Do you come to me?",
          answer: "Yes. Mobile covers Zone A–C with trip fees listed on the services page."
        }
      ]
    }
  };

  return defaultContent;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let contentStr = await getData(CONTENT_KEY);

    if (!contentStr) {
      const defaultContent = getDefaultContent();
      contentStr = JSON.stringify(defaultContent);
      try {
        await setData(CONTENT_KEY, contentStr);
      } catch (saveError) {
        console.error('Failed to save default content to Redis:', saveError);
      }
    }

    let content;
    try {
      content = JSON.parse(contentStr);
    } catch (parseError) {
      console.error('Failed to parse content:', parseError);
      content = getDefaultContent();
    }

    const accent = content?.home?.hero?.taglineAccent;
    const subtitle = content?.home?.hero?.subtitle || '';
    const intro = content?.about?.baker?.intro || '';
    const looksLikeOld =
      accent === 'Cake' ||
      accent === 'with intention' ||
      /sweet tooth|custom cakes|baking|botanical|florist|atelier/i.test(subtitle) ||
      /Eric!|baking since|custom cakes|floral designer|Liora/i.test(intro);

    if (looksLikeOld) {
      content = getDefaultContent();
      try {
        await setData(CONTENT_KEY, JSON.stringify(content));
      } catch (saveError) {
        console.error('Failed to migrate content:', saveError);
      }
    }

    return res.status(200).json(content);
  } catch (error) {
    console.error('Content get error:', error);
    return res.status(200).json(getDefaultContent());
  }
}
