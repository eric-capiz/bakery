import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/auth';
import { saveSiteContent } from '../../../lib/content';

/**
 * Full-replace CMS save (admin only). The request body is the complete
 * SiteContent object; it is merged over the branch defaults server-side
 * so partial payloads cannot wipe fields.
 *
 * NOTE: the branch default is intentionally not imported here — the admin UI
 * always sends the complete object it loaded via GET /api/content/get, and
 * mergeContent guards against missing keys.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const decoded = requireAdmin(req, res);
  if (!decoded) {
    return;
  }

  try {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Content body is required' });
    }
    // Basic shape check — hero/about are the required anchors.
    if (!body.hero || !body.about) {
      return res.status(400).json({ error: 'Invalid content shape' });
    }
    await saveSiteContent(body);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Save content error:', error);
    return res.status(500).json({ error: 'Failed to save content' });
  }
}
