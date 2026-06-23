import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getSiteSettings } from '@/lib/settings';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const settings = await getSiteSettings();

  const allowedFields = [
    'siteName',
    'announcement',
    'heroTitle',
    'heroSubtitle',
    'heroImage',
    'referralEnabled',
    'referralBonus',
    'referralNote',
    'minDeposit',
    'minWithdraw',
    'offers',
    'supportNumbers',
    'popupEnabled',
    'popupTitle',
    'popupImage',
    'popupLink',
  ];

  for (const field of allowedFields) {
    if (field in payload) {
      settings.set(field, payload[field]);
    }
  }

  await settings.save();
  return NextResponse.json({ settings });
}
