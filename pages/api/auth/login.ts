import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { JWT_SECRET } from '../../../lib/auth';
import { COOKIE_EXPIRATION_SECONDS } from '../../../lib/constants';

const ADMIN_FILE = path.join(process.cwd(), 'data', 'admin.json');

// Initialize admin.json if it doesn't exist
function initializeAdminFile() {
  if (!fs.existsSync(ADMIN_FILE)) {
    const adminDir = path.dirname(ADMIN_FILE);
    if (!fs.existsSync(adminDir)) {
      fs.mkdirSync(adminDir, { recursive: true });
    }
    // Hash default password "admin"
    const defaultHash = bcrypt.hashSync('admin', 10);
    const defaultAdmin = {
      username: 'admin',
      passwordHash: defaultHash,
    };
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(defaultAdmin, null, 2));
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize admin file if needed
    initializeAdminFile();

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Read admin credentials
    const adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));

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
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.setHeader(
      'Set-Cookie',
      `adminToken=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${COOKIE_EXPIRATION_SECONDS}; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`
    );

    return res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

