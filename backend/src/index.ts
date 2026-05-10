import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { B402 } from '@b402ai/sdk';
import { validateEnv, getEnv } from './lib/env';
import { getBackendConfig } from './config';
import { envLogger } from './lib/logger';
import uploadRoutes from './routes/upload';
import paymentRoutes from './routes/payment';
import reviewRoutes from './routes/review';
import adminRoutes from './routes/admin';

dotenv.config();

// Validate environment variables on startup
try {
  validateEnv();
  envLogger.info('✅ Environment variables validated successfully');
} catch (error) {
  envLogger.error('❌ Environment validation failed', error);
  console.error('❌ Environment validation failed:');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const config = getBackendConfig();
const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize b402 SDK
let b402: B402 | undefined;
if (config.workerPrivateKey) {
  try {
    b402 = new B402({
      privateKey: config.workerPrivateKey,
      chainId: config.chainId,
      rpcUrl: config.baseRpcUrl,
      facilitatorUrl: config.facilitatorUrl,
      backendApiUrl: config.backendApiUrl,
    });
    console.log('✅ b402 SDK initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize b402 SDK:', error);
  }
} else {
  console.warn('⚠️  WORKER_PRIVATE_KEY is not set; payment verification is running without b402 SDK.');
}

// Make b402 available globally
declare global {
  var b402: B402 | undefined;
}
global.b402 = b402;

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    chainId: config.chainId,
    version: '1.0.0',
  });
});

// API health check (for load balancers and monitoring)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    chainId: config.chainId,
    baseRpcUrl: config.baseRpcUrl,
    b402Initialized: global.b402 !== undefined,
    openaiConfigured: config.openaiApiKey.startsWith('sk-'),
    recipientConfigured: config.recipientAddress.startsWith('0x'),
    version: '1.0.0',
  });
});

app.listen(config.port, () => {
  console.log(`🚀 ResumePay backend running on port ${config.port}`);
  console.log(`📦 Environment: ${config.nodeEnv}`);
  console.log(`⛓️  Base chain ID: ${config.chainId}`);
  console.log(`🔗 Base RPC: ${config.baseRpcUrl}`);
  console.log(`🌐 CORS Origin: ${config.corsOrigin}`);
});
