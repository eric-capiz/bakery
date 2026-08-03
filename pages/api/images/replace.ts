import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { getData, setData } from '../../../lib/kv';
import { requireAdmin } from '../../../lib/auth';
import { MAX_FILE_SIZE_BYTES } from '../../../lib/constants';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'img', 'Arrangements');
const IMAGES_KEY = 'images';

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    const form = new IncomingForm({
      uploadDir: IMAGES_DIR,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE_BYTES,
    });

    return new Promise<void>((resolve) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ error: 'File upload error' });
          resolve();
          return;
        }

        const imageName = Array.isArray(fields.imageName) 
          ? fields.imageName[0] 
          : fields.imageName;

        if (!imageName || typeof imageName !== 'string') {
          res.status(400).json({ error: 'Image name to replace is required' });
          resolve();
          return;
        }

        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        if (!file || !file.filepath) {
          res.status(400).json({ error: 'No file uploaded' });
          resolve();
          return;
        }

        const imagePath = path.join(IMAGES_DIR, imageName);
        if (!fs.existsSync(imagePath)) {
          res.status(404).json({ error: 'Image to replace not found' });
          resolve();
          return;
        }

        // Delete old file
        fs.unlinkSync(imagePath);

        // Get extension from new file
        const ext = path.extname(file.originalFilename || 'image.jpg');
        const newPath = path.join(IMAGES_DIR, imageName);

        // Move new file to replace old one (keeping same name)
        fs.renameSync(file.filepath, newPath);

        // Update registry in Redis if needed (filename stays the same, so registry doesn't need update)
        // But ensure it's in the right place
        const imagesDataStr = await getData(IMAGES_KEY);
        if (imagesDataStr) {
          const imagesData = JSON.parse(imagesDataStr);
          
          // If replacing hero image, ensure it's still set as hero
          if (imagesData.heroImage === imageName) {
            // Hero image replaced, no change needed
          } else if (!imagesData.galleryImages.includes(imageName)) {
            // Add to gallery if not already there
            imagesData.galleryImages.push(imageName);
            imagesData.galleryImages.sort();
          }
          
          await setData(IMAGES_KEY, JSON.stringify(imagesData));
        }

        res.status(200).json({
          success: true,
          imageName,
          message: 'Image replaced successfully',
        });
        resolve();
      });
    });
  } catch (error) {
    console.error('Replace image error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

