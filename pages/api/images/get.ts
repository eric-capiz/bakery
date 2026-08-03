import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getData, setData } from '../../../lib/kv';

const IMAGES_KEY = 'images';
const IMAGES_DIR = path.join(process.cwd(), 'public', 'img', 'Arrangements');
const DEFAULT_GALLERY = [
  'arr1.jpg',
  'arr2.jpg',
  'arr3.jpg',
  'arr4.jpg',
  'arr5.jpg',
  'arr6.jpg',
  'arr7.jpg',
  'arr8.jpg',
];
const DEFAULT_HERO = 'arr1.jpg';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read images registry from Redis
    let imagesDataStr = await getData(IMAGES_KEY);
    let imagesData: { heroImage: string; galleryImages: string[] };
    
    if (!imagesDataStr) {
      // Initialize with Arrangements defaults
      imagesData = {
        heroImage: DEFAULT_HERO,
        galleryImages: [...DEFAULT_GALLERY],
      };
    } else {
      imagesData = JSON.parse(imagesDataStr);
      // Ensure galleryImages is always an array
      if (!Array.isArray(imagesData.galleryImages)) {
        imagesData.galleryImages = [];
      }
      // Ensure heroImage exists
      if (!imagesData.heroImage) {
        imagesData.heroImage = DEFAULT_HERO;
      }
      // Migrate bakery cake filenames to florist arrangements
      const cakeLike =
        /^cake/i.test(imagesData.heroImage || '') ||
        imagesData.galleryImages.some((img) => /^cake/i.test(img));
      if (cakeLike) {
        imagesData = {
          heroImage: DEFAULT_HERO,
          galleryImages: [...DEFAULT_GALLERY],
        };
      }
    }

    // Get all available image files from directory
    const allImages: string[] = [];
    if (fs.existsSync(IMAGES_DIR)) {
      const files = fs.readdirSync(IMAGES_DIR);
      allImages.push(...files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)));
    }

    // Ensure hero image exists, default to arr1.jpg if not
    if (!imagesData.heroImage || !allImages.includes(imagesData.heroImage)) {
      imagesData.heroImage = allImages.includes(DEFAULT_HERO)
        ? DEFAULT_HERO
        : (allImages[0] || DEFAULT_HERO);
    }

    // Ensure gallery images only include files that exist
    imagesData.galleryImages = imagesData.galleryImages.filter((img: string) => 
      allImages.includes(img) && img !== imagesData.heroImage
    );

    // Seed empty gallery with default arrangements when available
    if (imagesData.galleryImages.length === 0) {
      imagesData.galleryImages = DEFAULT_GALLERY.filter(
        (img) => allImages.includes(img) && img !== imagesData.heroImage
      );
    }

    // Add any new images from directory that aren't in gallery yet
    allImages.forEach((img) => {
      if (img !== imagesData.heroImage && !imagesData.galleryImages.includes(img)) {
        imagesData.galleryImages.push(img);
      }
    });

    // Sort gallery images
    imagesData.galleryImages.sort();

    // Write updated registry to Redis
    await setData(IMAGES_KEY, JSON.stringify(imagesData));

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
