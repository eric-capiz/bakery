import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const reviewsFilePath = path.join(process.cwd(), 'data', 'reviews.json');
const reviewsImageDir = path.join(process.cwd(), 'public', 'img', 'reviews');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Review ID is required' });
    }

    // Read existing reviews
    if (!fs.existsSync(reviewsFilePath)) {
      return res.status(404).json({ error: 'Reviews file not found' });
    }

    const fileContent = fs.readFileSync(reviewsFilePath, 'utf-8');
    const reviews = JSON.parse(fileContent);

    // Find review to delete
    const reviewIndex = reviews.findIndex((r: any) => r.id === id);
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

    // Save updated reviews
    fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ error: 'Failed to delete review' });
  }
}

