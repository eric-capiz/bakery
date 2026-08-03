import type { NextApiRequest, NextApiResponse } from 'next';
import { getData, setData } from '../../../lib/kv';

const CONTENT_KEY = 'content';

// Initialize content.json with default values
function getDefaultContent() {
    
    const defaultContent = {
      home: {
        hero: {
          tagline: "Blooms shaped",
          taglineAccent: "with intention",
          taglineEnd: "",
          subtitle: "Luxurious botanical design for weddings, seasons, and quiet celebrations."
        },
        features: [
          {
            icon: "🌿",
            title: "Seasonal First",
            description: "Every stem is chosen for peak season beauty and lasting presence."
          },
          {
            icon: "✨",
            title: "Bespoke Design",
            description: "Arrangements composed around your palette, space, and story."
          },
          {
            icon: "🪴",
            title: "Studio Craft",
            description: "Quiet precision from sketch to finished botanical form."
          },
          {
            icon: "💐",
            title: "Thoughtful Care",
            description: "Guidance on longevity, placement, and seasonal refresh."
          }
        ],
        specialties: [
          {
            title: "Wedding Florals",
            description: "Ceremony and reception designs that feel intentional, soft, and unforgettable."
          },
          {
            title: "Seasonal Bouquets",
            description: "Hand-tied arrangements that celebrate what the garden offers now."
          },
          {
            title: "Event Installations",
            description: "Architectural blooms for dinners, launches, and private gatherings."
          },
          {
            title: "Editorial Styling",
            description: "Botanical direction for photography, brand stories, and intimate sets."
          }
        ]
      },
      about: {
        baker: {
          intro: "Hi, I'm the floral designer behind Liora Atelier. For over a decade I've composed botanical work for weddings, private homes, and editorial spaces — always guided by seasonality, restraint, and the quiet luxury of well-chosen stems.",
          experience: {
            main: "With over 10 years of professional floral design experience, I've dedicated my practice to refined botanical composition for celebrations and everyday beauty.",
            education: "Floral Design Institute, Advanced Botanical Composition Certificate",
            specialization: "Wedding Florals, Seasonal Arrangements, Event Installations",
            years: "10+ years professional floral design",
            certifications: "Certified Floral Designer, Sustainable Sourcing Practices"
          },
          whatIBake: [
            "Wedding Florals",
            "Bridal Bouquets",
            "Seasonal Arrangements",
            "Event Installations",
            "Centerpieces",
            "Editorial Styling",
            "Sympathy Tributes",
            "Subscription Blooms",
            "Workshop Experiences",
            "Private Consultations"
          ],
          hours: {
            monday: "9:00 AM - 5:00 PM",
            tuesday: "9:00 AM - 5:00 PM",
            wednesday: "9:00 AM - 5:00 PM",
            thursday: "9:00 AM - 5:00 PM",
            friday: "9:00 AM - 5:00 PM",
            saturday: "10:00 AM - 3:00 PM",
            sunday: "Closed"
          },
          contact: {
            email: "hello@lioraatelier.com",
            phone: "(555) 014-8820"
          }
        },
        faq: [
          {
            question: "How far in advance should I book?",
            answer: "Weddings and large events are best booked 4–8 weeks ahead. Everyday bouquets can often be arranged within a few days."
          },
          {
            question: "What's your specialty?",
            answer: "Seasonal, bespoke floral design — from intimate bouquets to full wedding and event installations."
          },
          {
            question: "What forms of payment do you accept?",
            answer: "Cash, Venmo, Zelle, and major cards."
          },
          {
            question: "Do you deliver?",
            answer: "Yes. Local delivery is available within a 25 mile radius, with studio pickup by arrangement."
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
    // Read content from Redis
    let contentStr = await getData(CONTENT_KEY);
    
    if (!contentStr) {
      // Initialize with defaults
      const defaultContent = getDefaultContent();
      contentStr = JSON.stringify(defaultContent);
      try {
        await setData(CONTENT_KEY, contentStr);
      } catch (saveError) {
        console.error('Failed to save default content to Redis:', saveError);
        // Continue with default content even if save fails
      }
    }
    
    let content;
    try {
      content = JSON.parse(contentStr);
    } catch (parseError) {
      console.error('Failed to parse content:', parseError);
      // Return default content if parse fails
      content = getDefaultContent();
    }

    // Migrate leftover bakery CMS payloads to florist defaults
    const accent = content?.home?.hero?.taglineAccent;
    const subtitle = content?.home?.hero?.subtitle || '';
    const intro = content?.about?.baker?.intro || '';
    const looksLikeBakery =
      accent === 'Cake' ||
      /sweet tooth|custom cakes|baking/i.test(subtitle) ||
      /Eric!|baking since|custom cakes/i.test(intro);

    if (looksLikeBakery) {
      content = getDefaultContent();
      try {
        await setData(CONTENT_KEY, JSON.stringify(content));
      } catch (saveError) {
        console.error('Failed to migrate bakery content to florist defaults:', saveError);
      }
    }

    return res.status(200).json(content);
  } catch (error) {
    console.error('Get content error:', error);
    // Return default content on error
    try {
      const defaultContent = getDefaultContent();
      return res.status(200).json(defaultContent);
    } catch (defaultError) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
