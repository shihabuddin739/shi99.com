import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// SECRET KEY - শুধু আপনি জানবেন, কাজ শেষে এই ফাইল মুছে দিন
const MAKE_ADMIN_SECRET = 'shi999_make_admin_2024';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, secret } = await request.json();

    if (secret !== MAKE_ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOneAndUpdate(
      { username },
      { role: 'admin' },
      { new: true }
    ).select('username role');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `${user.username} is now an admin!`,
      user,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
