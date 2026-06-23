import dbConnect from '@/lib/db';
import SiteSetting from '@/models/SiteSetting';

const POPUP_DEFAULTS = {
  popupEnabled: true,
  popupTitle: 'স্বাগতম! Welcome to Shi99',
  popupImage: 'https://299bet-play.com/assets/img/banner_games_hero__566dd8.webp',
  popupLink: '',
};

export async function getSiteSettings() {
  await dbConnect();

  let settings = await SiteSetting.findOne({ key: 'main' });
  if (!settings) {
    settings = await SiteSetting.create({
      key: 'main',
      ...POPUP_DEFAULTS,
      offers: [
        {
          title: 'Welcome Bonus',
          description: 'Get a bonus on your first approved deposit.',
          bonusPercent: 10,
          minDeposit: 500,
          isActive: true,
        },
      ],
      supportNumbers: [
        {
          label: 'Support Desk',
          number: '+8801700000000',
          channel: 'WhatsApp',
          isActive: true,
        },
      ],
    });
  } else if (settings.popupEnabled === undefined || settings.popupEnabled === null) {
    // Auto-patch old documents missing popup fields
    settings.popupEnabled = POPUP_DEFAULTS.popupEnabled;
    settings.popupTitle = settings.popupTitle || POPUP_DEFAULTS.popupTitle;
    settings.popupImage = settings.popupImage || POPUP_DEFAULTS.popupImage;
    settings.popupLink = settings.popupLink || POPUP_DEFAULTS.popupLink;
    await settings.save();
  }

  return settings;
}
