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
  return [
    {
      id: "review-1",
      title: "On time, driveway done",
      description: "Mobile oil change in my driveway before work. Clean, on time, done.",
      name: "Marcus T.",
      image: null,
      date: "2024-01-20T14:30:00Z"
    },
    {
      id: "review-2",
      title: "Found the misfire",
      description: "Shop found a misfire two other places missed. Explained it like a person.",
      name: "Dana K.",
      image: null,
      date: "2024-01-19T10:15:00Z"
    },
    {
      id: "review-3",
      title: "Battery save",
      description: "Dead battery at the office — van was there fast. Worth it.",
      name: "Luis R.",
      image: null,
      date: "2024-01-18T16:45:00Z"
    },
    {
      id: "review-4",
      title: "Straight prices",
      description: "Posted prices matched the invoice. No surprise add-ons. Will be back.",
      name: "Kim A.",
      image: null,
      date: "2024-01-17T09:20:00Z"
    },
    {
      id: "review-5",
      title: "Brakes sorted",
      description: "Pads done in the bay same day. Texted me when ready. Easy.",
      name: "Chris P.",
      image: null,
      date: "2024-01-16T13:10:00Z"
    }
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let reviewsStr = await getData(REVIEWS_KEY);

    if (!reviewsStr) {
      const defaults = getDefaultReviews();
      reviewsStr = JSON.stringify(defaults);
      try {
        await setData(REVIEWS_KEY, reviewsStr);
      } catch (saveError) {
        console.error('Failed to save default reviews:', saveError);
      }
    }

    let reviews: Review[];
    try {
      reviews = JSON.parse(reviewsStr);
    } catch {
      reviews = getDefaultReviews();
    }

    const looksLikeFlorist = reviews.some(
      (r) =>
        /floral|atelier|bouquet|wedding florals|Liora/i.test(r.description) ||
        /floral|atelier|bouquet/i.test(r.title)
    );

    if (looksLikeFlorist) {
      reviews = getDefaultReviews();
      try {
        await setData(REVIEWS_KEY, JSON.stringify(reviews));
      } catch (saveError) {
        console.error('Failed to migrate reviews:', saveError);
      }
    }

    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Reviews get error:', error);
    return res.status(200).json(getDefaultReviews());
  }
}
