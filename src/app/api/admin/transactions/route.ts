import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
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

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const transactions = await Transaction.find().populate('user', 'username').sort({ createdAt: -1 });
  return NextResponse.json({ transactions });
}

export async function PATCH(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { transactionId, status } = await request.json();

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  await dbConnect();
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

  if (transaction.status !== 'pending') {
    return NextResponse.json({ error: 'Transaction already processed' }, { status: 400 });
  }

  if (status === 'approved') {
    const user = await User.findById(transaction.user);
    if (transaction.type === 'deposit') {
      user.balance += transaction.amount;
    } else if (transaction.type === 'withdraw') {
      // Balance is usually deducted when request is made, but for simplicity here:
      if (user.balance < transaction.amount) {
        return NextResponse.json({ error: 'Insufficient user balance' }, { status: 400 });
      }
      user.balance -= transaction.amount;
    }
    await user.save();
  }

  transaction.status = status;
  await transaction.save();

  return NextResponse.json({ message: `Transaction ${status}`, transaction });
}
