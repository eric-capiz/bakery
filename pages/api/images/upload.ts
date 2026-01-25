import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { getData, setData } from '../../../lib/kv';
import { requireAdmin } from '../../../lib/auth';
import { MAX_FILE_SIZE_BYTES } from '../../../lib/constants';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'img', 'Cakes');
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

    // Ensure images directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
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

        const fileArray = Array.isArray(files.image) ? files.image : [files.image];
        if (!fileArray || fileArray.length === 0) {
          res.status(400).json({ error: 'No file uploaded' });
          resolve();
          return;
        }

        const uploadedFiles: string[] = [];

        fileArray.forEach((file) => {
          if (file && file.filepath) {
            const originalName = file.originalFilename || 'image.jpg';
            const ext = path.extname(originalName);
            const baseName = path.basename(originalName, ext);
            
            // Generate unique filename
            let newFileName = `${baseName}${ext}`;
            let counter = 1;
            while (fs.existsSync(path.join(IMAGES_DIR, newFileName))) {
              newFileName = `${baseName}_${counter}${ext}`;
              counter++;
            }

            const newPath = path.join(IMAGES_DIR, newFileName);
            fs.renameSync(file.filepath, newPath);
            uploadedFiles.push(newFileName);
          }
        });

        // Update images registry in Redis
        const imagesDataStr = await getData(IMAGES_KEY);
        const imagesData = imagesDataStr ? JSON.parse(imagesDataStr) : { heroImage: 'cake1.jpg', galleryImages: [] };
        uploadedFiles.forEach((fileName) => {
          if (!imagesData.galleryImages.includes(fileName)) {
            imagesData.galleryImages.push(fileName);
          }
        });
        imagesData.galleryImages.sort();
        await setData(IMAGES_KEY, JSON.stringify(imagesData));

        res.status(200).json({
          success: true,
          files: uploadedFiles,
          message: `${uploadedFiles.length} file(s) uploaded successfully`,
        });
        resolve();
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

