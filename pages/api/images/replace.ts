import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { requireAdmin } from '../../../lib/auth';
import { MAX_FILE_SIZE_BYTES } from '../../../lib/constants';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'img', 'Cakes');
const IMAGES_FILE = path.join(process.cwd(), 'data', 'images.json');

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

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload error' });
      }

      const imageName = Array.isArray(fields.imageName) 
        ? fields.imageName[0] 
        : fields.imageName;

      if (!imageName || typeof imageName !== 'string') {
        return res.status(400).json({ error: 'Image name to replace is required' });
      }

      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      if (!file || !file.filepath) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const imagePath = path.join(IMAGES_DIR, imageName);
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: 'Image to replace not found' });
      }

      // Delete old file
      fs.unlinkSync(imagePath);

      // Get extension from new file
      const ext = path.extname(file.originalFilename || 'image.jpg');
      const newPath = path.join(IMAGES_DIR, imageName);

      // Move new file to replace old one (keeping same name)
      fs.renameSync(file.filepath, newPath);

      // Update registry if needed (filename stays the same, so registry doesn't need update)
      // But ensure it's in the right place
      if (fs.existsSync(IMAGES_FILE)) {
        const imagesData = JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf8'));
        
        // If replacing hero image, ensure it's still set as hero
        if (imagesData.heroImage === imageName) {
          // Hero image replaced, no change needed
        } else if (!imagesData.galleryImages.includes(imageName)) {
          // Add to gallery if not already there
          imagesData.galleryImages.push(imageName);
          imagesData.galleryImages.sort();
        }
        
        fs.writeFileSync(IMAGES_FILE, JSON.stringify(imagesData, null, 2));
      }

      return res.status(200).json({
        success: true,
        imageName,
        message: 'Image replaced successfully',
      });
    });
  } catch (error) {
    console.error('Replace image error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

