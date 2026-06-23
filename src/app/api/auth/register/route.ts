import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, password, referralCode } = (await request.json()) as {
      username?: string;
      password?: string;
      referralCode?: string;
    };

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    let referredById = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredById = referrer._id;
        // Basic referral logic: Give the referrer some earnings immediately or track it.
        // For now, we'll just track the referrer. Rewards can be added on first deposit.
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate a simple unique referral code for the new user based on username and random string
    const newReferralCode = username.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.random().toString(36).substring(2, 6);

    const user = await User.create({
      username,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referredById,
    });

    return NextResponse.json({ message: 'User registered successfully', user: { id: user._id, username: user.username } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
