import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const reviewsFilePath = path.join(process.cwd(), 'data', 'reviews.json');

function initializeReviewsFile() {
  const defaultReviews = [
    {
      id: "review-1",
      title: "Absolutely Amazing!",
      description: "I ordered a custom birthday cake and it exceeded all my expectations. The design was perfect, the taste was incredible, and it arrived right on time. My guests were so impressed!",
      name: "Sarah",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      date: "2024-01-20T14:30:00Z"
    },
    {
      id: "review-2",
      title: "Best Bakery in Town",
      description: "I've ordered multiple cakes from Sweet Dreams Bakery and they never disappoint. The quality is consistently excellent and the customer service is outstanding.",
      name: null,
      image: null,
      date: "2024-01-19T10:15:00Z"
    },
    {
      id: "review-3",
      title: "Perfect Wedding Cake",
      description: "Our wedding cake was absolutely stunning! The attention to detail was incredible and it tasted as good as it looked. Thank you for making our special day even more memorable.",
      name: "Michael",
      image: "https://images.unsplash.com/photo-1519869325934-21d2f0e27f39?w=400&h=300&fit=crop",
      date: "2024-01-18T16:45:00Z"
    },
    {
      id: "review-4",
      title: "Delicious and Beautiful",
      description: "Not only did the cake look amazing, but it tasted fantastic too! Moist, flavorful, and beautifully decorated. Highly recommend!",
      name: null,
      image: "https://images.unsplash.com/photo-1565958011703-14f982595baa?w=400&h=300&fit=crop",
      date: "2024-01-17T09:20:00Z"
    },
    {
      id: "review-5",
      title: "Exceeded Expectations",
      description: "I was blown away by the quality and presentation. The cake was exactly what I envisioned and more. Will definitely be ordering again!",
      name: "Jessica",
      image: null,
      date: "2024-01-16T13:10:00Z"
    },
    {
      id: "review-6",
      title: "Fast Service, Great Quality",
      description: "I needed a cake last minute and they delivered! The cake was ready within 24 hours and it was perfect. Fast service without compromising on quality.",
      name: "David",
      image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop",
      date: "2024-01-15T11:30:00Z"
    },
    {
      id: "review-7",
      title: "Incredible Attention to Detail",
      description: "The level of detail in the cake design was incredible. Every element was perfectly executed. It was almost too beautiful to eat!",
      name: null,
      image: null,
      date: "2024-01-14T15:00:00Z"
    },
    {
      id: "review-8",
      title: "Made My Daughter's Day",
      description: "The birthday cake for my daughter was absolutely perfect. She was so excited and it tasted amazing. Thank you for making her day special!",
      name: "Emily",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
      date: "2024-01-13T08:45:00Z"
    },
    {
      id: "review-9",
      title: "Professional and Delicious",
      description: "Professional service from start to finish. The consultation was helpful, the cake was delivered on time, and it tasted incredible. Highly professional bakery!",
      name: "Robert",
      image: null,
      date: "2024-01-12T12:20:00Z"
    },
    {
      id: "review-10",
      title: "Will Order Again",
      description: "Great experience overall. The cake was beautiful, delicious, and reasonably priced. I'll definitely be ordering from Sweet Dreams Bakery again in the future.",
      name: null,
      image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=300&fit=crop",
      date: "2024-01-11T10:00:00Z"
    }
  ];

  // Create data directory if it doesn't exist
  const dataDir = path.dirname(reviewsFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write default reviews
  fs.writeFileSync(reviewsFilePath, JSON.stringify(defaultReviews, null, 2));
  return defaultReviews;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let reviews = [];

    if (fs.existsSync(reviewsFilePath)) {
      const fileContent = fs.readFileSync(reviewsFilePath, 'utf-8');
      reviews = JSON.parse(fileContent);
    } else {
      reviews = initializeReviewsFile();
    }

    // Sort by date (newest first)
    reviews.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Error reading reviews:', error);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}

