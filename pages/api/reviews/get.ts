import { NextApiRequest, NextApiResponse } from "next";
import { getData, setData } from "../../../lib/kv";

interface Review {
  id: string;
  title: string;
  description: string;
  name: string | null;
  image: string | null;
  date: string;
}

const REVIEWS_KEY = "reviews";

function getDefaultReviews(): Review[] {
  return [
    {
      id: "review-1",
      title: "Composed every week",
      description:
        "The grounds look composed every week: edges sharp, beds quiet. Exactly what we wanted.",
      name: "Amelia H.",
      image: null,
      date: "2024-01-20T14:30:00Z",
    },
    {
      id: "review-2",
      title: "Discreet and immaculate",
      description:
        "Driveway wash and a mobile detail the same morning. Discreet, on time, immaculate.",
      name: "Noah K.",
      image: null,
      date: "2024-01-19T10:15:00Z",
    },
    {
      id: "review-3",
      title: "House feels lighter",
      description:
        "Clear quote, careful work on the façade. The house feels lighter.",
      name: "Grace L.",
      image: null,
      date: "2024-01-18T16:45:00Z",
    },
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let reviewsStr = await getData(REVIEWS_KEY);
    if (!reviewsStr) {
      reviewsStr = JSON.stringify(getDefaultReviews());
      try {
        await setData(REVIEWS_KEY, reviewsStr);
      } catch (e) {
        console.error("Failed to save reviews:", e);
      }
    }

    let reviews: Review[];
    try {
      reviews = JSON.parse(reviewsStr);
    } catch {
      reviews = getDefaultReviews();
    }

    const looksLikeOld = reviews.some((r) =>
      /SWATH|PIT|Clutch|Liora|mechanic|misfire|curb looks new/i.test(
        `${r.title} ${r.description}`
      )
    );
    if (looksLikeOld) {
      reviews = getDefaultReviews();
      try {
        await setData(REVIEWS_KEY, JSON.stringify(reviews));
      } catch (e) {
        console.error("Failed to migrate reviews:", e);
      }
    }

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Reviews get error:", error);
    return res.status(200).json(getDefaultReviews());
  }
}
