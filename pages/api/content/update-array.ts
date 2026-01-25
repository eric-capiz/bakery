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

    const { section, path: contentPath, action, index, item, maxItems } = req.body;

    if (!section || !contentPath || !action) {
      return res.status(400).json({ error: 'Section, path, and action are required' });
    }

    // Read current content
    if (!fs.existsSync(CONTENT_FILE)) {
      return res.status(500).json({ error: 'Content file not found' });
    }

    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));

    // Navigate to the array
    const pathArray = contentPath.split('.');
    let current: any = content[section];
    
    if (!current) {
      return res.status(400).json({ error: 'Invalid section' });
    }

    for (let i = 0; i < pathArray.length; i++) {
      if (current[pathArray[i]] === undefined) {
        return res.status(400).json({ error: 'Invalid path' });
      }
      current = current[pathArray[i]];
    }

    if (!Array.isArray(current)) {
      return res.status(400).json({ error: 'Target is not an array' });
    }

    // Perform action
    if (action === 'add') {
      if (maxItems && current.length >= maxItems) {
        return res.status(400).json({ error: `Maximum ${maxItems} items allowed` });
      }
      if (!item) {
        return res.status(400).json({ error: 'Item is required for add action' });
      }
      current.push(item);
    } else if (action === 'update') {
      if (index === undefined || !item) {
        return res.status(400).json({ error: 'Index and item are required for update action' });
      }
      if (index < 0 || index >= current.length) {
        return res.status(400).json({ error: 'Invalid index' });
      }
      current[index] = item;
    } else if (action === 'delete') {
      if (index === undefined) {
        return res.status(400).json({ error: 'Index is required for delete action' });
      }
      if (index < 0 || index >= current.length) {
        return res.status(400).json({ error: 'Invalid index' });
      }
      current.splice(index, 1);
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Write updated content
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));

    return res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: current,
    });
  } catch (error) {
    console.error('Update array content error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

