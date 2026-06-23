import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { getSiteSettings } from '@/lib/settings';

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

export async function POST(request: Request) {
  const userData = await getUser();
  if (!userData) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { method, amount, number } = await request.json();

  if (!method || !amount || !number) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  await dbConnect();
  const settings = await getSiteSettings();
  if (Number(amount) < settings.minWithdraw) {
    return NextResponse.json({ error: `Minimum withdraw is ${settings.minWithdraw}` }, { status: 400 });
  }

  const user = await User.findById(userData.userId);
  
  if (user.balance < Number(amount)) {
    return NextResponse.json({ error: 'অপর্যাপ্ত ব্যালেন্স' }, { status: 400 });
  }

  // Deduct balance immediately
  user.balance -= Number(amount);
  await user.save();

  const transaction = await Transaction.create({
    user: userData.userId,
    type: 'withdraw',
    method,
    amount: Number(amount),
    number, // The user's number where they want to receive money
    status: 'pending'
  });

  return NextResponse.json({ message: 'Withdrawal request submitted', transaction });
}
