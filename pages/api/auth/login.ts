import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getData, setData } from '../../../lib/kv';
import { JWT_SECRET } from '../../../lib/auth';
import { COOKIE_EXPIRATION_SECONDS } from '../../../lib/constants';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be set');
}

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
      // First run: seed the admin account from environment variables.
      // No default credentials are baked in — ADMIN_USERNAME and
      // ADMIN_PASSWORD must be set (enforced above).
      const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD as string, 10);
      const seededAdmin = {
        username: ADMIN_USERNAME,
        passwordHash,
      };
      adminDataStr = JSON.stringify(seededAdmin);
      await setData(ADMIN_KEY, adminDataStr);
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

