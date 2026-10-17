import type { NextApiRequest, NextApiResponse } from 'next';
import { getSiteContent } from '../../../lib/content';
import { DEFAULT_CONTENT } from '../../../lib/defaults';

/**
 * Public content read. Returns the branch's SiteContent — saved CMS values
 * merged over lib/defaults.ts, with the defaults as the fallback when
 * Redis is empty or unconfigured.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const content = await getSiteContent(DEFAULT_CONTENT);
    return res.status(200).json(content);
  } catch (error) {
    console.error('Get content error:', error);
    return res.status(500).json({ error: 'Failed to fetch content' });
  }
}
