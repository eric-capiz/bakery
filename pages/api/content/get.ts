import type { NextApiRequest, NextApiResponse } from 'next';
import { getSiteContent } from '../../../lib/content';
import { DEFAULT_CONTENT } from '../../../lib/defaults';

/**
 * Public content endpoint (new SiteContent shape).
 * SSR pages use getSiteContent(DEFAULT_CONTENT) directly; the admin UI
 * loads the same merged object through this route.
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
    console.error('Content get error:', error);
    return res.status(200).json(DEFAULT_CONTENT);
  }
}
