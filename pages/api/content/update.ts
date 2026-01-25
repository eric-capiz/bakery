import type { NextApiRequest, NextApiResponse } from 'next';
import { getData, setData } from '../../../lib/kv';
import { requireAdmin } from '../../../lib/auth';

const CONTENT_KEY = 'content';

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

    const { section, path: contentPath, value } = req.body;

    if (!section || !contentPath || value === undefined) {
      return res.status(400).json({ error: 'Section, path, and value are required' });
    }

    // Read current content from Redis
    const contentStr = await getData(CONTENT_KEY);
    if (!contentStr) {
      return res.status(500).json({ error: 'Content not found' });
    }

    const content: Record<string, unknown> = JSON.parse(contentStr);

    // Navigate to the section and update
    const pathArray = contentPath.split('.');
    let current: Record<string, unknown> = content[section] as Record<string, unknown>;
    
    if (!current) {
      return res.status(400).json({ error: 'Invalid section' });
    }

    // Navigate to the parent of the target
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (current[pathArray[i]] === undefined) {
        return res.status(400).json({ error: 'Invalid path' });
      }
      current = current[pathArray[i]] as Record<string, unknown>;
    }

    // Set the value
    const finalKey = pathArray[pathArray.length - 1];
    current[finalKey] = value;

    // Write updated content to Redis
    await setData(CONTENT_KEY, JSON.stringify(content));

    return res.status(200).json({
      success: true,
      message: 'Content updated successfully',
    });
  } catch (error) {
    console.error('Update content error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

