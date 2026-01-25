import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, MAX_REVIEW_DESCRIPTION_LENGTH } from '../../../lib/constants';

interface FormidableError extends Error {
  files?: Record<string, formidable.File | formidable.File[]>;
  code?: string;
  httpCode?: number;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const reviewsFilePath = path.join(process.cwd(), 'data', 'reviews.json');
const reviewsImageDir = path.join(process.cwd(), 'public', 'img', 'reviews');

// Ensure reviews image directory exists
if (!fs.existsSync(reviewsImageDir)) {
  fs.mkdirSync(reviewsImageDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: reviewsImageDir,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE_BYTES,
      filter: (part) => {
        // Only allow image files
        if (part.name === 'image' && part.mimetype) {
          return part.mimetype?.includes('image') || false;
        }
        return true;
      },
    });

    const [fields, files] = await form.parse(req);

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (description.length > MAX_REVIEW_DESCRIPTION_LENGTH) {
      return res.status(400).json({ error: `Description must be ${MAX_REVIEW_DESCRIPTION_LENGTH} characters or less` });
    }

    // Handle image upload if provided
    let imageFilename: string | null = null;
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (imageFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!imageFile.mimetype || !allowedTypes.includes(imageFile.mimetype)) {
        // Clean up uploaded file if invalid type
        if (fs.existsSync(imageFile.filepath)) {
          fs.unlinkSync(imageFile.filepath);
        }
        return res.status(400).json({ error: 'Invalid image type. Only JPG, PNG, and WebP are allowed.' });
      }

      // Generate unique filename
      const ext = path.extname(imageFile.originalFilename || '');
      imageFilename = `${uuidv4()}${ext}`;
      const newPath = path.join(reviewsImageDir, imageFilename);

      // Move file to final location
      try {
        fs.renameSync(imageFile.filepath, newPath);
      } catch (error) {
        console.error('Error moving image file:', error);
        // Clean up if rename fails
        if (fs.existsSync(imageFile.filepath)) {
          fs.unlinkSync(imageFile.filepath);
        }
        return res.status(500).json({ error: 'Failed to upload image. Please try again.' });
      }
    }

    // Create new review
    const newReview = {
      id: `review-${uuidv4()}`,
      title: title.trim(),
      description: description.trim(),
      name: name && name.trim() ? name.trim() : null,
      image: imageFilename,
      date: new Date().toISOString(),
    };

    // Read existing reviews
    let reviews = [];
    if (fs.existsSync(reviewsFilePath)) {
      const fileContent = fs.readFileSync(reviewsFilePath, 'utf-8');
      reviews = JSON.parse(fileContent);
    }

    // Add new review
    reviews.push(newReview);

    // Save to file
    fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2));

    return res.status(200).json({ success: true, review: newReview });
  } catch (error: unknown) {
    console.error('Error submitting review:', error);
    
    // Clean up any uploaded files on error
    const formidableError = error as FormidableError;
    if (formidableError.files) {
      Object.values(formidableError.files).forEach((file) => {
        if (Array.isArray(file)) {
          file.forEach((f) => {
            if (f.filepath && fs.existsSync(f.filepath)) {
              fs.unlinkSync(f.filepath);
            }
          });
        } else if (file.filepath && fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }
      });
    }

    if (formidableError.message?.includes('maxFileSize')) {
      return res.status(400).json({ error: `Image file is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` });
    }

    return res.status(500).json({ error: 'Failed to submit review. Please try again.' });
  }
}

