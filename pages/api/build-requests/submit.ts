import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { getData, setData } from '../../../lib/kv';
import { MAX_BUILD_NOTES_LENGTH } from '../../../lib/constants';

const BUILD_REQUESTS_KEY = 'build_requests';

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, notes, design } = req.body ?? {};

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

    const designPayload =
      design != null && typeof design === 'object' && !Array.isArray(design)
        ? design
        : {};

    const entry = {
      id: `build-${uuidv4()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notesValue,
      design: designPayload,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    const existingStr = await getData(BUILD_REQUESTS_KEY);
    const list: unknown[] = existingStr ? JSON.parse(existingStr) : [];
    if (!Array.isArray(list)) {
      return res.status(500).json({ error: 'Storage error' });
    }
    list.push(entry);
    await setData(BUILD_REQUESTS_KEY, JSON.stringify(list));

    return res.status(200).json({ success: true, id: entry.id });
  } catch (e) {
    console.error('build-requests submit:', e);
    return res.status(500).json({ error: 'Failed to submit. Please try again.' });
  }
}
