import type { NextApiRequest, NextApiResponse } from 'next';
import { getData, setData } from '../../../lib/kv';
import { MAX_BUILD_NOTES_LENGTH } from '../../../lib/constants';

const BUILD_REQUESTS_KEY = 'build_requests';

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, name, email, phone, notes, design } = req.body ?? {};

    if (!isNonEmptyString(id)) {
      return res.status(400).json({ error: 'Id is required' });
    }
    if (!isNonEmptyString(name)) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!isNonEmptyString(email)) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email' });
    }
    if (!isNonEmptyString(phone)) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    let notesValue: string | null = null;
    if (notes != null && String(notes).trim() !== '') {
      const n = String(notes).trim();
      if (n.length > MAX_BUILD_NOTES_LENGTH) {
        return res.status(400).json({
          error: `Notes must be ${MAX_BUILD_NOTES_LENGTH} characters or less`,
        });
      }
      notesValue = n;
    }

    const existingStr = await getData(BUILD_REQUESTS_KEY);
    const list: unknown[] = existingStr ? JSON.parse(existingStr) : [];
    if (!Array.isArray(list)) {
      return res.status(500).json({ error: 'Storage error' });
    }

    const idx = list.findIndex(
      (item) =>
        item &&
        typeof item === 'object' &&
        'id' in item &&
        (item as StoredBuildEntry).id === id
    );

    if (idx === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const prev = list[idx] as StoredBuildEntry;
    let designOut: unknown = prev.design;
    if (design !== undefined) {
      if (design != null && typeof design === 'object' && !Array.isArray(design)) {
        designOut = design;
      } else {
        return res.status(400).json({ error: 'Design must be a JSON object' });
      }
    }

    list[idx] = {
      ...prev,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notesValue,
      design: designOut,
    };
    await setData(BUILD_REQUESTS_KEY, JSON.stringify(list));

    return res.status(200).json({ success: true, id: prev.id });
  } catch (e) {
    console.error('build-requests update:', e);
    return res.status(500).json({ error: 'Failed to update. Please try again.' });
  }
}
