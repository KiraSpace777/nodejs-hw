// src/db/connectMongoDB.js
// ---------------------------------

import { connect } from 'mongoose';

export default async function connectMongoDB() {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1); // аварійне завершення програми
  }
}
