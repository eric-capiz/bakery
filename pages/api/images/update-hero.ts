import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const IMAGES_FILE = path.join(process.cwd(), 'data', 'images.json');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'img', 'Cakes');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    let decoded: { username: string; admin: boolean };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { username: string; admin: boolean };
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!decoded.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { imageName } = req.body;

    if (!imageName) {
      return res.status(400).json({ error: 'Image name is required' });
    }

    // Verify image exists
    const imagePath = path.join(IMAGES_DIR, imageName);
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Read images registry
    if (!fs.existsSync(IMAGES_FILE)) {
      return res.status(500).json({ error: 'Images registry not found' });
    }

    const imagesData = JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf8'));

    // Update hero image
    imagesData.heroImage = imageName;

    // Remove from gallery if it was there
    imagesData.galleryImages = imagesData.galleryImages.filter(
      (img: string) => img !== imageName
    );

    // Write updated registry
    fs.writeFileSync(IMAGES_FILE, JSON.stringify(imagesData, null, 2));

    return res.status(200).json({
      success: true,
      heroImage: imageName,
      message: 'Hero image updated successfully',
    });
  } catch (error) {
    console.error('Update hero error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

