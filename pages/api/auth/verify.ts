import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminToken } from '../../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = verifyAdminToken(req);

    if (!decoded) {
      // 200 so the browser does not log a failed request for the normal logged-out state
      return res.status(200).json({ authenticated: false });
    }

    return res.status(200).json({ authenticated: true, username: decoded.username });
  } catch (error) {
    return res.status(200).json({ authenticated: false });
  }
}

