import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';

const JWT_SECRET = process.env.JWT_SECRET || 'shi999_super_secret_key_12345';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
    return decoded.userId ? decoded : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const userData = await getUser();
  if (!userData) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const transactions = await Transaction.find({ user: userData.userId }).sort({ createdAt: -1 });
  
  return NextResponse.json({ transactions });
}
