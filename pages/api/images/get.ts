import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const IMAGES_FILE = path.join(process.cwd(), 'data', 'images.json');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'img', 'Cakes');

// Initialize images.json if it doesn't exist
function initializeImagesFile() {
  if (!fs.existsSync(IMAGES_FILE)) {
    const dataDir = path.dirname(IMAGES_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Set default hero image
    const defaultImages = {
      heroImage: 'cake1.jpg',
      galleryImages: [],
    };
    
    fs.writeFileSync(IMAGES_FILE, JSON.stringify(defaultImages, null, 2));
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize images file if needed
    initializeImagesFile();

    // Read images registry
    const imagesData = JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf8'));

    // Get all available image files from directory
    const allImages: string[] = [];
    if (fs.existsSync(IMAGES_DIR)) {
      const files = fs.readdirSync(IMAGES_DIR);
      allImages.push(...files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)));
    }

    // Ensure hero image exists, default to cake1.jpg if not
    if (!imagesData.heroImage || !allImages.includes(imagesData.heroImage)) {
      imagesData.heroImage = allImages.includes('cake1.jpg') ? 'cake1.jpg' : (allImages[0] || 'cake1.jpg');
    }

    // Ensure gallery images only include files that exist
    imagesData.galleryImages = imagesData.galleryImages.filter((img: string) => 
      allImages.includes(img) && img !== imagesData.heroImage
    );

    // Add any new images from directory that aren't in gallery yet
    allImages.forEach((img) => {
      if (img !== imagesData.heroImage && !imagesData.galleryImages.includes(img)) {
        imagesData.galleryImages.push(img);
      }
    });

    // Sort gallery images
    imagesData.galleryImages.sort();

    // Write updated registry
    fs.writeFileSync(IMAGES_FILE, JSON.stringify(imagesData, null, 2));

    return res.status(200).json({
      heroImage: imagesData.heroImage,
      galleryImages: imagesData.galleryImages,
      allImages,
    });
  } catch (error) {
    console.error('Get images error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

