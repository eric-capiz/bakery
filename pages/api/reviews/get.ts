import { NextApiRequest, NextApiResponse } from 'next';
import { getData, setData } from '../../../lib/kv';

interface Review {
  id: string;
  title: string;
  description: string;
  name: string | null;
  image: string | null;
  date: string;
}

const REVIEWS_KEY = 'reviews';

function getDefaultReviews(): Review[] {
  const defaultReviews = [
    {
      id: "review-1",
      title: "Absolutely Stunning",
      description: "Our wedding florals exceeded every expectation. Soft, seasonal, and perfectly in tune with the venue. Guests are still talking about the arrangements.",
      name: "Sarah",
      image: "rev1.jpg",
      date: "2024-01-20T14:30:00Z"
    },
    {
      id: "review-2",
      title: "Quiet Luxury",
      description: "I've ordered several arrangements from Liora Atelier and each one feels considered and personal. Beautiful stems, thoughtful composition, and warm communication throughout.",
      name: null,
      image: null,
      date: "2024-01-19T10:15:00Z"
    },
    {
      id: "review-3",
      title: "Perfect Wedding Florals",
      description: "Our ceremony and reception florals were breathtaking. The attention to detail — from the bridal bouquet to the tables — made the day feel complete.",
      name: "Michael",
      image: "rev2.jpg",
      date: "2024-01-18T16:45:00Z"
    },
    {
      id: "review-4",
      title: "Seasonal and Beautiful",
      description: "The bouquet arrived fresh and fragrant, with a palette that felt like early spring. Exactly the mood we hoped for.",
      name: null,
      image: "rev3.jpg",
      date: "2024-01-17T09:20:00Z"
    },
    {
      id: "review-5",
      title: "Exceeded Expectations",
      description: "I was blown away by the composition and care. The arrangement was exactly what I envisioned and more. Will definitely be ordering again!",
      name: "Jessica",
      image: null,
      date: "2024-01-16T13:10:00Z"
    },
    {
      id: "review-6",
      title: "Thoughtful and Fast",
      description: "I needed a last-minute centerpiece and the studio delivered with grace. Beautiful work without feeling rushed.",
      name: "David",
      image: "rev1.jpg",
      date: "2024-01-15T11:30:00Z"
    },
    {
      id: "review-7",
      title: "Incredible Attention to Detail",
      description: "Every stem felt intentional. The installation for our dinner was almost too beautiful to disturb — a true atelier touch.",
      name: null,
      image: null,
      date: "2024-01-14T15:00:00Z"
    },
    {
      id: "review-8",
      title: "Made Her Day",
      description: "The birthday arrangement for my daughter was perfect. Soft blooms, a lovely note, and a design that felt personal. Thank you for making her day special!",
      name: "Emily",
      image: "rev2.jpg",
      date: "2024-01-13T08:45:00Z"
    },
    {
      id: "review-9",
      title: "Professional from Start to Finish",
      description: "Clear consultation, on-time delivery, and florals that photographed beautifully. Highly professional studio experience.",
      name: "Robert",
      image: null,
      date: "2024-01-12T12:20:00Z"
    },
    {
      id: "review-10",
      title: "Will Order Again",
      description: "Beautiful arrangements, kind service, and fair pricing. I'll definitely be returning to Liora Atelier for the next celebration.",
      name: null,
      image: "rev3.jpg",
      date: "2024-01-11T10:00:00Z"
    }
  ];

  return defaultReviews;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read reviews from Redis
    let reviewsStr = await getData(REVIEWS_KEY);
    let reviews: Review[];
    
    if (!reviewsStr) {
      // Initialize with defaults
      reviews = getDefaultReviews();
      reviewsStr = JSON.stringify(reviews);
      try {
        await setData(REVIEWS_KEY, reviewsStr);
      } catch (err) {
        console.error('Failed to save default reviews to Redis:', err);
        // Continue with default reviews even if save fails
      }
    } else {
      try {
        reviews = JSON.parse(reviewsStr);
        // Ensure reviews is an array
        if (!Array.isArray(reviews)) {
          reviews = getDefaultReviews();
        } else {
          // Migrate leftover bakery seed reviews to florist defaults
          const bakeryLike = reviews.some(
            (r) =>
              /cake|bakery|Sweet Dreams|pastry|dessert/i.test(
                `${r.title || ""} ${r.description || ""}`
              )
          );
          if (bakeryLike) {
            reviews = getDefaultReviews();
            try {
              await setData(REVIEWS_KEY, JSON.stringify(reviews));
            } catch (err) {
              console.error('Failed to migrate bakery reviews:', err);
            }
          }
        }
      } catch (parseError) {
        console.error('Failed to parse reviews:', parseError);
        reviews = getDefaultReviews();
      }
    }

    // Sort by date (newest first)
    reviews.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Error reading reviews:', error);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}
