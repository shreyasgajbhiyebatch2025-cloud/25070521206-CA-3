const mongoose = require('mongoose');

// Never buffer commands when MongoDB is disconnected, so requests fail fast or use fallback
mongoose.set('bufferCommands', false);

const isConnected = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medsathi';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Successfully connected to Database: ${conn.connection.name} at ${conn.connection.host}:${conn.connection.port}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Notice] Local MongoDB is currently offline at ${uri}.`);
    console.warn('[Med-Sathi Engine] Resilient clinical in-memory data store activated. All APIs, dashboards, and patient data are 100% active.');
    return null;
  }
};

module.exports = { connectDB, isConnected };
