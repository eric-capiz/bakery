import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
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

    // Ensure images directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir: IMAGES_DIR,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload error' });
      }

      const fileArray = Array.isArray(files.image) ? files.image : [files.image];
      if (!fileArray || fileArray.length === 0) {
        return res.status(400).json({ error: 'No file uploaded' });
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

      // Update images registry
      if (fs.existsSync(IMAGES_FILE)) {
        const imagesData = JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf8'));
        uploadedFiles.forEach((fileName) => {
          if (!imagesData.galleryImages.includes(fileName)) {
            imagesData.galleryImages.push(fileName);
          }
        });
        imagesData.galleryImages.sort();
        fs.writeFileSync(IMAGES_FILE, JSON.stringify(imagesData, null, 2));
      }

      return res.status(200).json({
        success: true,
        files: uploadedFiles,
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

