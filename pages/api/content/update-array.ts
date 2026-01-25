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

    const { section, path: contentPath, action, index, item, maxItems } = req.body;

    if (!section || !contentPath || !action) {
      return res.status(400).json({ error: 'Section, path, and action are required' });
    }

    // Read current content from Redis
    const contentStr = await getData(CONTENT_KEY);
    if (!contentStr) {
      return res.status(500).json({ error: 'Content not found' });
    }

    const content: Record<string, unknown> = JSON.parse(contentStr);

    // Navigate to the array
    const pathArray = contentPath.split('.');
    let current: unknown = content[section];
    
    if (!current) {
      return res.status(400).json({ error: 'Invalid section' });
    }

    for (let i = 0; i < pathArray.length; i++) {
      if (typeof current !== 'object' || current === null || !(pathArray[i] in current)) {
        return res.status(400).json({ error: 'Invalid path' });
      }
      current = (current as Record<string, unknown>)[pathArray[i]];
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

    // Write updated content to Redis
    await setData(CONTENT_KEY, JSON.stringify(content));

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

