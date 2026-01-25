import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const CONTENT_FILE = path.join(process.cwd(), 'data', 'content.json');

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

    const { section, path: contentPath, value } = req.body;

    if (!section || !contentPath || value === undefined) {
      return res.status(400).json({ error: 'Section, path, and value are required' });
    }

    // Read current content
    if (!fs.existsSync(CONTENT_FILE)) {
      return res.status(500).json({ error: 'Content file not found' });
    }

    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));

    // Navigate to the section and update
    const pathArray = contentPath.split('.');
    let current: any = content[section];
    
    if (!current) {
      return res.status(400).json({ error: 'Invalid section' });
    }

    // Navigate to the parent of the target
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (current[pathArray[i]] === undefined) {
        return res.status(400).json({ error: 'Invalid path' });
      }
      current = current[pathArray[i]];
    }

    // Set the value
    const finalKey = pathArray[pathArray.length - 1];
    current[finalKey] = value;

    // Write updated content
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));

    return res.status(200).json({
      success: true,
      message: 'Content updated successfully',
    });
  } catch (error) {
    console.error('Update content error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

