import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getData, setData } from '../../../lib/kv';
import { JWT_SECRET } from '../../../lib/auth';
import { COOKIE_EXPIRATION_SECONDS } from '../../../lib/constants';

const ADMIN_KEY = 'admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read admin credentials from Redis
    let adminDataStr = await getData(ADMIN_KEY);
    
    if (!adminDataStr) {
      // Initialize with defaults
      const defaultHash = bcrypt.hashSync('breezy', 10);
      const defaultAdmin = {
        username: 'breezy',
        passwordHash: defaultHash,
      };
      adminDataStr = JSON.stringify(defaultAdmin);
      await setData(ADMIN_KEY, adminDataStr);
    } else {
      // Migrate legacy admin credentials to breezy/breezy
      try {
        const existing = JSON.parse(adminDataStr);
        if (existing.username === 'admin') {
          const breezyHash = bcrypt.hashSync('breezy', 10);
          const migratedAdmin = {
            username: 'breezy',
            passwordHash: breezyHash,
          };
          adminDataStr = JSON.stringify(migratedAdmin);
          await setData(ADMIN_KEY, adminDataStr);
        }
      } catch (migrateError) {
        console.error('Failed to migrate admin credentials:', migrateError);
      }
    }
    
    const adminData = JSON.parse(adminDataStr);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Verify username
    if (username !== adminData.username) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminData.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: adminData.username, admin: true },
      JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // Set HTTP only cookie
    res.setHeader(
      'Set-Cookie',
      `adminToken=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${COOKIE_EXPIRATION_SECONDS}; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`
    );

    return res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : String(error);
    console.error('Login error details:', { errorMessage, errorStack });
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}
