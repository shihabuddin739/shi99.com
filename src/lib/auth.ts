import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'shi999_super_secret_key_12345';

export interface AuthTokenPayload {
  userId?: string;
  username?: string;
  role?: 'user' | 'admin';
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded.userId ? decoded : null;
  } catch {
    return null;
  }
}

export async function isAdmin() {
  const user = await getAuthUser();
  return user?.role === 'admin';
}
