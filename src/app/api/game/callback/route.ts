import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const EXPECTED_KEY = process.env.SOFTAPI_SECRET || '6ec179b179fc1e4dca307f26ea88dfd3';

    if (key !== EXPECTED_KEY) {
      console.warn(`[SoftAPI] Unauthorized callback attempt. Invalid key: ${key}`);
      return NextResponse.json({ code: -1, msg: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    if (!data) {
      return NextResponse.json({ code: -1, msg: 'Invalid JSON' });
    }

    const {
      game_uid,
      game_round,
      member_account,
      bet_amount,
      win_amount,
    } = data;

    const accountId = String(member_account || '');
    const isDemo = accountId.startsWith('999');

    // DETAILED LOGGING FOR DEBUGGING
    console.log(`[SoftAPI CALLBACK] Payload:`, JSON.stringify(data));

    // Handle Demo Sessions - Return zero deduction to keep game balance intact
    if (isDemo) {
      console.log(`[SoftAPI] DEMO SESSION: Skipping all processing for ${accountId}`);
      return NextResponse.json({
        code: 0,
        msg: "SUCCESS",
        credit_amount: 0, // Tell the game no money was taken
        balance: 100000,   // Return a high fixed balance
        timestamp: Date.now()
      });
    }

    if (!member_account) {
       return NextResponse.json({ code: -1, msg: 'member_account is required' });
    }

    await dbConnect();

    // Prevent duplicate processing
    if (game_round) {
      const existingTx = await Transaction.findOne({ trxId: game_round });
      if (existingTx) {
        const user = await User.findOne({ softApiId: accountId });
        return NextResponse.json({
          code: 0,
          msg: "SUCCESS",
          balance: user?.balance || 0,
          credit_amount: 0,
          timestamp: Date.now()
        });
      }
    }

    // Safely parse amounts to prevent NaN issues
    const bet = Number(bet_amount) || Number(data.amount) || Number(data.betAmount) || 0;
    const win = Number(win_amount) || Number(data.winAmount) || 0;
    const balanceChange = win - bet;

    // Update real balance
    const updatedUser = await User.findOneAndUpdate(
      { softApiId: accountId },
      { $inc: { balance: balanceChange } },
      { new: true }
    );

    if (!updatedUser) {
      console.error(`[SoftAPI] User not found: ${accountId}`);
      return NextResponse.json({ code: -1, msg: 'User not found' });
    }

    // Record real transaction
    if (game_round) {
      await Transaction.create({
        user: updatedUser._id,
        type: 'game_play',
        method: 'game',
        amount: balanceChange,
        status: 'approved',
        trxId: game_round,
        number: game_uid,
      });
    }

    console.log(`[SoftAPI] Real Balance Updated: ${updatedUser.username} -> ${updatedUser.balance}`);

    return NextResponse.json({
      code: 0,
      msg: "SUCCESS",
      balance: updatedUser.balance,
      credit_amount: Math.max(0, bet - win),
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('[SoftAPI] Callback Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ code: -1, msg: message });
  }
}
