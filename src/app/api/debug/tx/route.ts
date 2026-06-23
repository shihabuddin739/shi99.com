import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';

interface PopulatedUser {
  username: string;
  balance: number;
  softApiId?: string;
}

export async function GET() {
  try {
    await dbConnect();
    const txs = await Transaction.find({ type: 'game_play' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'username balance softApiId');

    return NextResponse.json({
      message: 'Latest Game Transactions',
      transactions: txs.map((tx) => ({
        id: tx._id,
        amount: tx.amount,
        trxId: tx.trxId,
        game: tx.number,
        timestamp: tx.createdAt,
        user: tx.user
          ? {
              username: (tx.user as PopulatedUser).username,
              balance: (tx.user as PopulatedUser).balance,
              softApiId: (tx.user as PopulatedUser).softApiId,
            }
          : 'Unknown',
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message });
  }
}
