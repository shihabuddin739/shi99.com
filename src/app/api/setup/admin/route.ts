import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    const existingAdmin = await User.findOne({ username: 'admin' });
    const hashedPassword = await bcrypt.hash('admin123', 10);

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      return NextResponse.json({ 
        message: 'Admin credentials reset successfully', 
        username: 'admin',
        password: 'admin123' 
      });
    }

    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      balance: 1000000,
    });

    return NextResponse.json({ 
      message: 'Admin user created successfully', 
      username: 'admin',
      password: 'admin123' 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
