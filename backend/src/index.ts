import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { B402 } from '@b402ai/sdk';
import uploadRoutes from './routes/upload';
import paymentRoutes from './routes/payment';
import reviewRoutes from './routes/review';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize b402 SDK
let b402: B402 | undefined;
if (process.env.WORKER_PRIVATE_KEY) {
  try {
    b402 = new B402({
      privateKey: process.env.WORKER_PRIVATE_KEY,
      chainId: 8453, // Base
      rpcUrl: process.env.BASE_RPC_URL,
      facilitatorUrl: process.env.FACILITATOR_URL,
      backendApiUrl: process.env.BACKEND_API_URL,
    });
    console.log('b402 SDK initialized successfully');
  } catch (error) {
    console.error('Failed to initialize b402 SDK:', error);
  }
} else {
  console.warn('WORKER_PRIVATE_KEY is not set; payment verification is running in mock mode.');
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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`ResumePay backend running on port ${PORT}`);
  console.log(`Base chain ID: 8453`);
});
