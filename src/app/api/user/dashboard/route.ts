import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jsonwebtoken from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    await dbConnect();

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let decoded: { userId: string };
    try {
      decoded = jsonwebtoken.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;

    // Fetch User Details
    const user = await User.findById(userId).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Fetch Transactions
    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

    // Calculate Totals
    const totalDeposited = transactions
      .filter((t) => t.type === 'deposit' && t.status === 'approved')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawn = transactions
      .filter((t) => t.type === 'withdraw' && t.status === 'approved')
      .reduce((sum, t) => sum + t.amount, 0);

    // Fetch Referrals
    const referredUsers = await User.find({ referredBy: userId }).select('username createdAt');

    // Ensure user has a referral code
    if (!user.referralCode) {
      user.referralCode =
        user.username.toLowerCase().replace(/[^a-z0-9]/g, '') +
        Math.random().toString(36).substring(2, 6);
      await user.save();
    }

    return NextResponse.json({
      user: {
        username: user.username,
        balance: user.balance,
        role: user.role,
        referralCode: user.referralCode,
        referralEarnings: user.referralEarnings,
        createdAt: user.createdAt,
      },
      stats: {
        totalDeposited,
        totalWithdrawn,
        totalReferrals: referredUsers.length,
      },
      transactions,
      referrals: referredUsers,
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
