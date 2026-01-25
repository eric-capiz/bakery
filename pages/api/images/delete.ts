import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '../../../lib/auth';

const IMAGES_FILE = path.join(process.cwd(), 'data', 'images.json');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'img', 'Cakes');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const decoded = requireAdmin(req, res);
    if (!decoded) {
      return;
    }

    const { imageName } = req.query;

    if (!imageName || typeof imageName !== 'string') {
      return res.status(400).json({ error: 'Image name is required' });
    }

    // Read images registry
    if (!fs.existsSync(IMAGES_FILE)) {
      return res.status(500).json({ error: 'Images registry not found' });
    }

    const imagesData = JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf8'));

    // Prevent deleting hero image - must set a new one first
    if (imagesData.heroImage === imageName) {
      return res.status(400).json({ 
        error: 'Cannot delete hero image. Please set a new hero image first.' 
      });
    }

    // Delete file
    const imagePath = path.join(IMAGES_DIR, imageName);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove from gallery
    imagesData.galleryImages = imagesData.galleryImages.filter(
      (img: string) => img !== imageName
    );

    // Write updated registry
    fs.writeFileSync(IMAGES_FILE, JSON.stringify(imagesData, null, 2));

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete image error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

