import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'shi999_super_secret_key_12345';

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}

// GET — all users
export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return NextResponse.json({ users });
}

// PATCH — balance update, role change, ban/unban, password reset
export async function PATCH(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as {
    userId: string;
    action: 'add' | 'subtract' | 'setBalance' | 'setRole' | 'ban' | 'unban' | 'resetPassword';
    amount?: number;
    role?: string;
    newPassword?: string;
  };

  await dbConnect();
  const user = await User.findById(body.userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  switch (body.action) {
    case 'add':
      user.balance += Number(body.amount ?? 0);
      break;
    case 'subtract':
      user.balance = Math.max(0, user.balance - Number(body.amount ?? 0));
      break;
    case 'setBalance':
      user.balance = Number(body.amount ?? 0);
      break;
    case 'setRole':
      user.role = body.role as 'user' | 'admin';
      break;
    case 'ban':
      user.isBanned = true;
      break;
    case 'unban':
      user.isBanned = false;
      break;
    case 'resetPassword':
      if (!body.newPassword) return NextResponse.json({ error: 'No password provided' }, { status: 400 });
      user.password = await bcrypt.hash(body.newPassword, 10);
      break;
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  await user.save();
  return NextResponse.json({ message: 'Updated successfully', balance: user.balance, role: user.role, isBanned: user.isBanned });
}
