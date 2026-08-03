import type { NextApiRequest, NextApiResponse } from "next";
import { getData, setData } from "../../../lib/kv";

const CONTENT_KEY = "content";

function getDefaultContent() {
  return {
    home: {
      hero: {
        tagline: "Property,",
        taglineAccent: "finished.",
        taglineEnd: "",
        subtitle:
          "Refined lawn care, exterior washing, and mobile detailing for the modern property.",
      },
      features: [
        {
          icon: "◇",
          title: "Grounds",
          description: "Lawn, edge, and bed care with quiet precision.",
        },
        {
          icon: "◇",
          title: "Surface",
          description: "Driveways, stone, and façades restored with care.",
        },
        {
          icon: "◇",
          title: "Vehicle",
          description: "Hand wash and detailing at your address.",
        },
        {
          icon: "◇",
          title: "Clarity",
          description: "A clear range before work begins.",
        },
      ],
      specialties: [
        {
          title: "Lawn & Edge",
          description:
            "Regular cuts and clean lines that keep the property composed.",
        },
        {
          title: "Beds & Season",
          description: "Cleanup, mulch, and hedge shaping by measured care.",
        },
        {
          title: "Exterior Wash",
          description: "Soft wash and surface cleaning without spectacle.",
        },
        {
          title: "Mobile Detail",
          description: "Cabin and finish work completed in the driveway.",
        },
      ],
    },
    about: {
      baker: {
        intro:
          "Ellis is an outdoor care studio for properties that prefer calm execution: grounds, wash, and vehicle detailing under one quiet standard.",
        experience: {
          main: "Property care paced with clarity: clear ranges, careful finishes, and appointments kept.",
          education: "Landscape maintenance and exterior care practice",
          specialization: "Grounds, exterior washing, mobile detailing",
          years: "Local outdoor studio",
          certifications: "Insured outdoor & mobile service",
        },
        whatIBake: [
          "Lawn Cut & Edge",
          "Bed Cleanup & Mulch",
          "Hedge Shaping",
          "Seasonal Clear",
          "Driveway Wash",
          "Façade Soft Wash",
          "Mobile Hand Wash",
          "Interior Detail",
          "Complete Detail",
        ],
        hours: {
          monday: "7:00 AM - 5:00 PM",
          tuesday: "7:00 AM - 5:00 PM",
          wednesday: "7:00 AM - 5:00 PM",
          thursday: "7:00 AM - 5:00 PM",
          friday: "7:00 AM - 5:00 PM",
          saturday: "7:00 AM - 5:00 PM",
          sunday: "Closed",
        },
        contact: {
          email: "hello@ellisoutdoor.com",
          phone: "(555) 014-3390",
        },
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
    },
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let contentStr = await getData(CONTENT_KEY);
    if (!contentStr) {
      const defaultContent = getDefaultContent();
      contentStr = JSON.stringify(defaultContent);
      try {
        await setData(CONTENT_KEY, contentStr);
      } catch (e) {
        console.error("Failed to save default content:", e);
      }
    }

    let content;
    try {
      content = JSON.parse(contentStr);
    } catch {
      content = getDefaultContent();
    }

    const blob = JSON.stringify(content);
    const looksLikeOld =
      /SWATH|PIT|Clutch|Haul|Liora|florist|mechanic|Bay work|citrus|Swath/i.test(
        blob
      );

    if (looksLikeOld) {
      content = getDefaultContent();
      try {
        await setData(CONTENT_KEY, JSON.stringify(content));
      } catch (e) {
        console.error("Failed to migrate content:", e);
      }
    }

    return res.status(200).json(content);
  } catch (error) {
    console.error("Content get error:", error);
    return res.status(200).json(getDefaultContent());
  }
}
