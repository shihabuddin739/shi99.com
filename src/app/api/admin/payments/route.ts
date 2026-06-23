import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import PaymentNumber from '@/models/PaymentNumber';

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
  const numbers = await PaymentNumber.find().sort({ createdAt: -1 });
  return NextResponse.json({ numbers });
}

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const { method, number, type } = await request.json();
  const newNumber = await PaymentNumber.create({ method, number, type });
  return NextResponse.json({ number: newNumber });
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  await dbConnect();
  await PaymentNumber.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Number deleted' });
}
