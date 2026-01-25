import type { NextApiRequest, NextApiResponse } from 'next';
import { getData, setData } from '../../../lib/kv';

const CONTENT_KEY = 'content';

// Initialize content.json with default values
function getDefaultContent() {
    
    const defaultContent = {
      home: {
        hero: {
          tagline: "The More",
          taglineAccent: "Cake",
          taglineEnd: "The Batter",
          subtitle: "Contact me for all your sweet tooth needs!"
        },
        features: [
          {
            icon: "⚡",
            title: "Fast Service",
            description: "Within 24hrs in most cases!"
          },
          {
            icon: "💰",
            title: "Affordable",
            description: "Competitive pricing with promotional discounts available!"
          },
          {
            icon: "🎨",
            title: "Custom Made",
            description: "Dream big! We bring your vision to life."
          },
          {
            icon: "👨‍🍳",
            title: "Professional",
            description: "8+ years of professional baking experience."
          }
        ],
        specialties: [
          {
            title: "Birthday Cakes",
            description: "Make every birthday unforgettable with our custom designs."
          },
          {
            title: "Wedding Cakes",
            description: "Elegant and delicious cakes for your special day."
          },
          {
            title: "Anniversary Cakes",
            description: "Celebrate your milestones with style."
          },
          {
            title: "Corporate Events",
            description: "Professional cakes for your business occasions."
          }
        ]
      },
      about: {
        baker: {
          intro: "Hi, I'm Eric! I've been passionate about baking since I was young, and I've been creating custom cakes professionally for over 8 years. What started as a childhood hobby has grown into a dedicated craft where I bring your sweetest dreams to life, one cake at a time.",
          experience: {
            main: "With over 8 years of professional baking experience, I've dedicated my career to perfecting the art of custom cake creation.",
            education: "Culinary Institute of Pastry Arts, Certificate in Advanced Baking & Pastry",
            specialization: "Custom Cake Design, Sugar Art, Fondant Work",
            years: "8+ years professional, 15+ years total",
            certifications: "ServSafe Certified, Advanced Cake Decorating Certification"
          },
          whatIBake: [
            "Custom Cakes",
            "Cupcakes",
            "Cookies",
            "Brownies",
            "Pies & Tarts",
            "Cheesecakes",
            "Birthday Cakes",
            "Wedding Cakes",
            "Anniversary Cakes",
            "Corporate Cakes"
          ],
          hours: {
            monday: "9:00 AM - 6:00 PM",
            tuesday: "9:00 AM - 6:00 PM",
            wednesday: "9:00 AM - 6:00 PM",
            thursday: "9:00 AM - 6:00 PM",
            friday: "9:00 AM - 6:00 PM",
            saturday: "10:00 AM - 4:00 PM",
            sunday: "Closed"
          },
          contact: {
            email: "info@sweetdreamsbakery.com",
            phone: "(555) 123-4567"
          }
        },
        faq: [
          {
            question: "How Long Does Delivery Take?",
            answer: "Delivery is available within 24hrs in most cases!"
          },
          {
            question: "What's Your Specialty?",
            answer: "I specialize in custom cakes for any occasion!"
          },
          {
            question: "What Forms Of Payment Do You Accept?",
            answer: "Cash, Venmo, Zelle, and Cash App."
          },
          {
            question: "Do You Deliver?",
            answer: "Yes! Delivery is available within a 25 mile radius."
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

