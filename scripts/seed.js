const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const MONGODB_URI = 'mongodb+srv://stock_market:LMWQvSeusjSck0FO@cluster0.xm8ksdz.mongodb.net/shi99?retryWrites=true&w=majority';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralEarnings: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ MongoDB Connected!');

  const adminPass = await bcrypt.hash('Admin@shi99', 10);
  const userPass  = await bcrypt.hash('User@shi99', 10);

  // Admin
  await User.findOneAndUpdate(
    { username: 'admin' },
    {
      username: 'admin',
      password: adminPass,
      role: 'admin',
      balance: 0,
      referralCode: 'ADMIN001',
    },
    { upsert: true, new: true }
  );
  console.log('✅ Admin created!');

  // User
  await User.findOneAndUpdate(
    { username: 'shihab' },
    {
      username: 'shihab',
      password: userPass,
      role: 'user',
      balance: 1000,
      referralCode: 'SHIHAB' + crypto.randomBytes(2).toString('hex').toUpperCase(),
    },
    { upsert: true, new: true }
  );
  console.log('✅ User created!');

  console.log('\n=============================');
  console.log('🔑 ADMIN LOGIN:');
  console.log('   Username : admin');
  console.log('   Password : Admin@shi99');
  console.log('   URL      : http://localhost:3000/login');
  console.log('\n👤 USER LOGIN:');
  console.log('   Username : shihab');
  console.log('   Password : User@shi99');
  console.log('   URL      : http://localhost:3000/login');
  console.log('=============================\n');

  await mongoose.disconnect();
  console.log('✅ Done!');
}

seed().catch(console.error);
