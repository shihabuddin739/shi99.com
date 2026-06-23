import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/settings';

export async function GET() {
  const settings = await getSiteSettings();

  return NextResponse.json({
    settings: {
      siteName: settings.siteName,
      announcement: settings.announcement,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      heroImage: settings.heroImage,
      referralEnabled: settings.referralEnabled,
      referralBonus: settings.referralBonus,
      referralNote: settings.referralNote,
      minDeposit: settings.minDeposit,
      minWithdraw: settings.minWithdraw,
      offers: settings.offers.filter((offer: { isActive: boolean }) => offer.isActive),
      supportNumbers: settings.supportNumbers.filter((support: { isActive: boolean }) => support.isActive),
      popupEnabled: settings.popupEnabled,
      popupTitle: settings.popupTitle,
      popupImage: settings.popupImage,
      popupLink: settings.popupLink,
    },
  });
}
