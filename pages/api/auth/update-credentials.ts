import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_FILE = path.join(process.cwd(), 'data', 'admin.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    let decoded: { username: string; admin: boolean };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { username: string; admin: boolean };
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!decoded.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { currentPassword, newUsername, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required' });
    }

    // Read current admin credentials
    if (!fs.existsSync(ADMIN_FILE)) {
      return res.status(500).json({ error: 'Admin file not found' });
    }

    const adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, adminData.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update credentials
    const updates: { username?: string; passwordHash?: string } = {};

    if (newUsername && newUsername.trim() !== '') {
      updates.username = newUsername.trim();
    }

    if (newPassword && newPassword.trim() !== '') {
      if (newPassword.length < 4) {
        return res.status(400).json({ error: 'New password must be at least 4 characters' });
      }
      updates.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Update admin data
    const updatedAdminData = {
      ...adminData,
      ...updates,
    };

    // Write updated data
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(updatedAdminData, null, 2));

    // If username changed, generate new token
    if (updates.username) {
      const newToken = jwt.sign(
        { username: updates.username, admin: true },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.setHeader(
        'Set-Cookie',
        `adminToken=${newToken}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; ${
          process.env.NODE_ENV === 'production' ? 'Secure;' : ''
        }`
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Credentials updated successfully',
      usernameUpdated: !!updates.username,
      passwordUpdated: !!updates.passwordHash,
    });
  } catch (error) {
    console.error('Update credentials error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

