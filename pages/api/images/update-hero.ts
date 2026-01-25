import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getData, setData } from '../../../lib/kv';
import { requireAdmin } from '../../../lib/auth';

const IMAGES_KEY = 'images';
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
    const decoded = requireAdmin(req, res);
    if (!decoded) {
      return;
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

    // Read images registry from Redis
    const imagesDataStr = await getData(IMAGES_KEY);
    if (!imagesDataStr) {
      return res.status(500).json({ error: 'Images registry not found' });
    }

    const imagesData = JSON.parse(imagesDataStr);

    // Update hero image
    imagesData.heroImage = imageName;

    // Remove from gallery if it was there
    imagesData.galleryImages = imagesData.galleryImages.filter(
      (img: string) => img !== imageName
    );

    // Write updated registry to Redis
    await setData(IMAGES_KEY, JSON.stringify(imagesData));

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

