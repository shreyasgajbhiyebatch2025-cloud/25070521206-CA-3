require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path');
const { connectDB, isConnected } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const auditRoutes = require('./routes/auditRoutes');
const aiRiskRoutes = require('./routes/aiRiskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(async (conn) => {
  if (conn && isConnected()) {
    try {
      const User = require('./models/User');
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[Med-Sathi Server] No users detected in MongoDB. Auto-seeding realistic clinical demo dataset...');
        const seedDatabase = require('./seed');
        await seedDatabase();
      }
    } catch (seedErr) {
      console.warn('[Med-Sathi Server] Auto-seed check notice:', seedErr.message);
    }
  }
});

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  if (!req.url.startsWith('/assets')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/ai-risk', aiRiskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Med-Sathi Enterprise Closed-Loop eMAR API',
    database: isConnected() ? 'MongoDB (Local 27017 Connected)' : 'In-Memory Resilient Store (Active)',
    timestamp: new Date().toISOString()
  });
});

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`[Med-Sathi API Server] Successfully running on port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
