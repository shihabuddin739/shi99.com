import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shi999';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached = globalWithMongoose.mongoose = {
      conn: null,
      promise: mongoose.connect(MONGODB_URI, opts),
    };
  }

  try {
    if (cached?.promise) {
      cached.conn = await cached.promise;
    }
  } catch (error) {
    if (cached) {
      cached.promise = null;
    }
    throw error;
  }

  return cached?.conn;
}

export default dbConnect;
