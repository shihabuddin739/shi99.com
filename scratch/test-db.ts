import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/shi999';

async function testConnection() {
  console.log('Connecting to:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Connection error message:', message);
    process.exit(1);
  }
}

testConnection();
