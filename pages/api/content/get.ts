import type { NextApiRequest, NextApiResponse } from 'next';
import { getSiteContent } from '../../../lib/content';
import { DEFAULT_CONTENT } from '../../../lib/defaults';

/**
 * Returns the current SiteContent (CMS-managed), seeding from the branch
 * defaults on first run. Falls back to defaults when Redis is unconfigured.
 *
 * Consumed by the admin content editor and any client-side readers.
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
    return res.status(200).json(DEFAULT_CONTENT);
  }
}
