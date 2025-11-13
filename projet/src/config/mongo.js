import mongoose from 'mongoose';

export async function connectMongo(url) {
  await mongoose.connect(url, { dbName: 'scan' });
  return mongoose.connection;
}
