const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Imovies';

  // Check if URI contains unreplaced placeholder brackets
  if (mongoUri.includes('<db_username>') || mongoUri.includes('<') || mongoUri.includes('>')) {
    console.warn('--------------------------------------------------');
    console.warn('⚠️ [MongoDB Atlas Warning] Detected unreplaced placeholders (<...>) in MONGO_URI.');
    console.warn('   Please replace <db_username> with your Atlas Database Username');
    console.warn('   and remove the angle brackets around the password.');
    console.warn('--------------------------------------------------');
  }

  try {
    const maskedUri = mongoUri.replace(/:([^:@]+)@/, ':****@');
    console.log(`[Database] Connecting to MongoDB at: ${maskedUri}`);

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });

    isConnected = true;
    console.log(`[Database] ✅ MongoDB connected successfully to database: ${mongoose.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.error(`[Database] ❌ MongoDB connection error: ${error.message}`);
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('[Database] 👉 Tip: Check that your MongoDB Atlas Database Username and Password are correct and do not include the "<" and ">" characters.');
    }
  }

  // Handle runtime connection events
  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('[Database] MongoDB connection established.');
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.error('[Database] MongoDB runtime error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[Database] MongoDB disconnected.');
  });
};

const getDbStatus = () => {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    statusText: ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][mongoose.connection.readyState] || 'Unknown',
    databaseName: mongoose.connection.name || 'Imovies',
  };
};

module.exports = { connectDB, getDbStatus };
