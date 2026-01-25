import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getData, setData } from '../../../lib/kv';
import { requireAdmin } from '../../../lib/auth';

interface Review {
  id: string;
  title: string;
  description: string;
  name: string | null;
  image: string | null;
  date: string;
}

const REVIEWS_KEY = 'reviews';
const reviewsImageDir = path.join(process.cwd(), 'public', 'img', 'reviews');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const decoded = requireAdmin(req, res);
    if (!decoded) {
      return;
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Review ID is required' });
    }

    // Read existing reviews from Redis
    const reviewsStr = await getData(REVIEWS_KEY);
    if (!reviewsStr) {
      return res.status(404).json({ error: 'Reviews not found' });
    }

    let reviews: Review[];
    try {
      reviews = JSON.parse(reviewsStr);
      if (!Array.isArray(reviews)) {
        return res.status(500).json({ error: 'Invalid reviews data format' });
      }
    } catch (parseError) {
      console.error('Failed to parse reviews:', parseError);
      return res.status(500).json({ error: 'Failed to parse reviews data' });
    }

    // Find review to delete
    const reviewIndex = reviews.findIndex((r) => r.id === id);
    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const reviewToDelete = reviews[reviewIndex];

    // Delete image file if it exists
    if (reviewToDelete.image) {
      const imagePath = path.join(reviewsImageDir, reviewToDelete.image);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error('Error deleting review image:', err);
          // Continue with review deletion even if image deletion fails
        }
      }
    }

    // Remove review from array
    reviews.splice(reviewIndex, 1);

    // Save updated reviews to Redis
    await setData(REVIEWS_KEY, JSON.stringify(reviews));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ error: 'Failed to delete review' });
  }
}

