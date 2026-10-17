import type { NextApiRequest, NextApiResponse } from 'next';
import { getData } from '../../../lib/kv';
import { requireAdmin } from '../../../lib/auth';

const BUILD_REQUESTS_KEY = 'build_requests';

type StoredBuildEntry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  design: unknown;
  status: string;
  createdAt: string;
};

/**
 * Admin-only list of cake build requests (bookings).
 * Reads the `build_requests` key written by POST /api/build-requests/submit.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const decoded = requireAdmin(req, res);
  if (!decoded) {
    return;
  }

  try {
    const raw = await getData(BUILD_REQUESTS_KEY);
    if (!raw) {
      return res.status(200).json([]);
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return res.status(200).json([]);
    }
    const list = parsed.filter(
      (item): item is StoredBuildEntry =>
        !!item && typeof item === 'object' && 'id' in item
    );
    // Newest first
    list.sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    );
    return res.status(200).json(list);
  } catch (error) {
    console.error('build-requests list:', error);
    return res.status(500).json({ error: 'Failed to load build requests' });
  }
}
