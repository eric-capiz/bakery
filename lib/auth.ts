import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Export JWT_SECRET for use in login route (token signing)
export { JWT_SECRET };

export interface DecodedToken {
  username: string;
  admin: boolean;
}

/**
 * Verifies the admin authentication token from the request cookies
 * @param req - Next.js API request object
 * @returns Decoded token if valid, null if invalid or missing
 */
export function verifyAdminToken(req: NextApiRequest): DecodedToken | null {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    
    // Ensure admin flag is present
    if (!decoded.admin) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware function to verify admin authentication
 * Returns 401 if not authenticated, otherwise continues
 */
export function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): DecodedToken | null {
  const decoded = verifyAdminToken(req);

  if (!decoded) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }

  return decoded;
}

