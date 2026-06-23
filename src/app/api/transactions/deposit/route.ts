import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import PaymentNumber from '@/models/PaymentNumber';
import Transaction from '@/models/Transaction';
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

// GET randomly selected number for a method
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const method = searchParams.get('method');

  if (!method) return NextResponse.json({ error: 'Method is required' }, { status: 400 });

  await dbConnect();
  const numbers = await PaymentNumber.find({ method, isActive: true });

  if (numbers.length === 0) {
    return NextResponse.json({ error: 'No numbers available for this method' }, { status: 404 });
  }

  // Random rotation logic
  const randomIndex = Math.floor(Math.random() * numbers.length);
  const selectedNumber = numbers[randomIndex];

  return NextResponse.json({ number: selectedNumber.number, type: selectedNumber.type });
}

// POST submit deposit request
export async function POST(request: Request) {
  const userData = await getUser();
  if (!userData) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { method, amount, number, trxId } = await request.json();

  if (!method || !amount || !number || !trxId) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  await dbConnect();
  const settings = await getSiteSettings();
  if (Number(amount) < settings.minDeposit) {
    return NextResponse.json({ error: `Minimum deposit is ${settings.minDeposit}` }, { status: 400 });
  }

  const transaction = await Transaction.create({
    user: userData.userId,
    type: 'deposit',
    method,
    amount: Number(amount),
    number, // The Admin number the user sent money to
    trxId,
    status: 'pending'
  });

  return NextResponse.json({ message: 'Deposit request submitted successfully', transaction });
}
