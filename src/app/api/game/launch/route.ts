import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { launchGame } from '@/lib/softapi';

const JWT_SECRET = process.env.JWT_SECRET || 'shi999_super_secret_key_12345';

export async function POST(req: Request) {
  try {
    // Attempt to get game_uid from body or query params for flexibility
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    
    const gameUid = body.game_uid || searchParams.get('game_uid');
    const isDemo = body.is_demo === true || searchParams.get('is_demo') === '1';

    if (!gameUid) {
      return NextResponse.json({ error: 'game_uid is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
    if (!decoded.userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }
    await dbConnect();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let origin = req.headers.get('origin') || new URL(req.url).origin;
    
    // SoftAPI often requires a valid HTTPS domain. 
    if (origin.includes('localhost')) {
      origin = origin.replace('http://', 'https://');
    }

    if (!user.softApiId) {
      // Generate a numeric ID for SoftAPI compatibility
      user.softApiId = Date.now().toString().slice(-9) + Math.floor(Math.random() * 10).toString();
      await user.save();
    }

    const numericUserId = isDemo ? `999${user.softApiId}` : user.softApiId;
    const launchBalance = isDemo ? 100000 : user.balance;

    console.log(`[SoftAPI] Launching ${isDemo ? 'DEMO' : 'REAL'} Game:`, {
      user: user.username,
      softApiId: numericUserId,
      balance: launchBalance,
      game_uid: gameUid
    });

    const response = await launchGame({
      user_id: numericUserId,
      balance: launchBalance,
      game_uid: gameUid,
      return: `${origin}`, 
      callback: `${origin}/api/game/callback?key=${process.env.SOFTAPI_SECRET || '6ec179b179fc1e4dca307f26ea88dfd3'}`,
      currency_code: 'BDT',
      language: 'bn',
      is_demo: isDemo ? 1 : 0
    });

    console.log('SoftAPI Response:', response);

    if (response.code === 0) {
      return NextResponse.json({ url: response.data.url });
    } else {
      return NextResponse.json({ error: response.msg || 'Failed to launch game' }, { status: 500 });
    }
  } catch (error) {
    console.error('Launch Game Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
