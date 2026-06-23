import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    bonusPercent: { type: Number, default: 0 },
    minDeposit: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const SupportNumberSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    number: { type: String, required: true },
    channel: { type: String, default: 'WhatsApp' },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const SiteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    siteName: { type: String, default: 'SHI999' },
    announcement: {
      type: String,
      default: 'Fast deposit, quick withdraw, and premium games are live now.',
    },
    heroTitle: { type: String, default: 'Play SHI999 Premium Games' },
    heroSubtitle: {
      type: String,
      default: 'A clean mobile-first gaming lobby with instant wallet actions.',
    },
    heroImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80',
    },
    referralEnabled: { type: Boolean, default: true },
    referralBonus: { type: Number, default: 50 },
    referralNote: {
      type: String,
      default: 'Invite a friend and receive bonus balance after their first deposit.',
    },
    minDeposit: { type: Number, default: 500 },
    minWithdraw: { type: Number, default: 500 },
    offers: { type: [OfferSchema], default: [] },
    supportNumbers: { type: [SupportNumberSchema], default: [] },
    // Popup / Welcome Modal
    popupEnabled: { type: Boolean, default: true },
    popupTitle: { type: String, default: 'স্বাগতম! Welcome to Shi99' },
    popupImage: { type: String, default: 'https://299bet-play.com/assets/img/banner_games_hero__566dd8.webp' },
    popupLink: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSetting || mongoose.model('SiteSetting', SiteSettingSchema);
