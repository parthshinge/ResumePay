import { getConfig } from '../lib/env';

/**
 * Backend Configuration System
 * Provides environment-specific configuration for development, production, and deployment
 */

export interface Config {
  // Server
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  
  // Base Chain
  chainId: number;
  baseRpcUrl: string;
  basescanApiKey?: string;
  basescanUrl: string;
  
  // b402 SDK
  workerPrivateKey: string;
  facilitatorUrl: string;
  backendApiUrl: string;
  
  // Payment
  paymentAmountUsdc: string;
  recipientAddress: string;
  
  // OpenAI
  openaiApiKey: string;
  
  // Database (Optional)
  databaseUrl?: string;
  
  // Redis (Optional)
  redisUrl?: string;
  
  // File Upload
  maxFileSize: number;
  uploadDir: string;
  
  // CORS
  corsOrigin: string;
  
  // Environment flags
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

/**
 * Get configuration based on current environment
 */
export function getBackendConfig(): Config {
  const env = getConfig();
  
  return {
    // Server
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    
    // Base Chain
    chainId: env.CHAIN_ID,
    baseRpcUrl: env.BASE_RPC_URL,
    basescanApiKey: env.BASESCAN_API_KEY,
    basescanUrl: 'https://basescan.org',
    
    // b402 SDK
    workerPrivateKey: env.WORKER_PRIVATE_KEY,
    facilitatorUrl: env.FACILITATOR_URL,
    backendApiUrl: env.BACKEND_API_URL,
    
    // Payment
    paymentAmountUsdc: env.PAYMENT_AMOUNT_USDC,
    recipientAddress: env.RECIPIENT_ADDRESS,
    
    // OpenAI
    openaiApiKey: env.OPENAI_API_KEY,
    
    // Database
    databaseUrl: env.DATABASE_URL,
    
    // Redis
    redisUrl: env.REDIS_URL,
    
    // File Upload
    maxFileSize: env.MAX_FILE_SIZE,
    uploadDir: env.UPLOAD_DIR,
    
    // CORS
    corsOrigin: env.CORS_ORIGIN,
    
    // Environment flags
    isDevelopment: env.isDevelopment,
    isProduction: env.isProduction,
    isTest: env.isTest,
  };
}

/**
 * Development-specific configuration
 */
export function getDevelopmentConfig(): Partial<Config> {
  return {
    port: 3001,
    nodeEnv: 'development',
    corsOrigin: 'http://localhost:3000',
    uploadDir: './uploads',
  };
}

/**
 * Production-specific configuration
 */
export function getProductionConfig(): Partial<Config> {
  return {
    nodeEnv: 'production',
    uploadDir: '/tmp/uploads',
  };
}

/**
 * Railway deployment configuration
 */
export function getRailwayConfig(): Partial<Config> {
  return {
    nodeEnv: 'production',
    uploadDir: '/tmp/uploads',
  };
}

/**
 * Render deployment configuration
 */
export function getRenderConfig(): Partial<Config> {
  return {
    nodeEnv: 'production',
    uploadDir: '/tmp/uploads',
  };
}

/**
 * Vercel serverless configuration (if using serverless backend)
 */
export function getVercelConfig(): Partial<Config> {
  return {
    nodeEnv: 'production',
    uploadDir: '/tmp/uploads',
  };
}

/**
 * Export singleton config instance
 */
export const config = getBackendConfig();
