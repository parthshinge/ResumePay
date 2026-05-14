import dotenv from 'dotenv';
import path from 'path';
import { envLogger } from './logger';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

envLogger.info('Environment variables loaded');

interface EnvConfig {
  // Server Configuration
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  
  // Base Chain Configuration
  CHAIN_ID: number;
  BASE_RPC_URL: string;
  BASESCAN_API_KEY?: string;
  
  // b402 SDK Configuration
  WORKER_PRIVATE_KEY: string;
  FACILITATOR_URL: string;
  BACKEND_API_URL: string;
  
  // Payment Configuration
  PAYMENT_AMOUNT_USDC: string;
  RECIPIENT_ADDRESS: string;
  
  // OpenAI Configuration
  OPENAI_API_KEY: string;
  
  // Database Configuration (Optional)
  DATABASE_URL?: string;
  
  // Redis Configuration (Optional)
  REDIS_URL?: string;
  
  // File Upload Configuration
  MAX_FILE_SIZE: number;
  UPLOAD_DIR: string;
  
  // CORS Configuration
  CORS_ORIGIN: string;
}

// The backend can boot with safe defaults. Secrets are validated at the feature
// boundary that needs them, so health/upload/payment demo routes keep working.
const REQUIRED_ENV_VARS: (keyof EnvConfig)[] = [];

// Optional environment variables
const OPTIONAL_ENV_VARS: (keyof EnvConfig)[] = [
  'BASESCAN_API_KEY',
  'DATABASE_URL',
  'REDIS_URL',
];

/**
 * Validate environment variables
 * @throws Error if required environment variables are missing
 */
export function validateEnv(): EnvConfig {
  const missing: string[] = [];
  
  // Check required environment variables
  for (const key of REQUIRED_ENV_VARS) {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      `Please set these in your .env file. See .env.example for reference.`
    );
  }
  
  // Validate specific variable formats
  const env: Partial<EnvConfig> = {};
  
  // Server Configuration
  env.PORT = parseInt(process.env.PORT || '3001', 10);
  if (isNaN(env.PORT)) {
    throw new Error('Invalid PORT: must be a number');
  }
  
  env.NODE_ENV = (process.env.NODE_ENV || 'development') as EnvConfig['NODE_ENV'];
  if (!['development', 'production', 'test'].includes(env.NODE_ENV)) {
    throw new Error('Invalid NODE_ENV: must be development, production, or test');
  }
  
  // Base Chain Configuration
  env.CHAIN_ID = parseInt(process.env.CHAIN_ID || '8453', 10);
  if (isNaN(env.CHAIN_ID)) {
    throw new Error('Invalid CHAIN_ID: must be a number');
  }
  
  env.BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
  if (!env.BASE_RPC_URL.startsWith('http')) {
    throw new Error('Invalid BASE_RPC_URL: must start with http:// or https://');
  }
  
  env.BASESCAN_API_KEY = process.env.BASESCAN_API_KEY;
  
  // b402 SDK Configuration
  env.WORKER_PRIVATE_KEY = process.env.WORKER_PRIVATE_KEY || '';
  if (env.WORKER_PRIVATE_KEY && !env.WORKER_PRIVATE_KEY.startsWith('0x')) {
    throw new Error('Invalid WORKER_PRIVATE_KEY: must start with 0x');
  }
  if (env.WORKER_PRIVATE_KEY && env.WORKER_PRIVATE_KEY.length !== 66) {
    throw new Error('Invalid WORKER_PRIVATE_KEY: must be 66 characters (32 bytes hex)');
  }
  
  env.FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://b402-facilitator-base-62092339396.us-central1.run.app';
  if (!env.FACILITATOR_URL.startsWith('http')) {
    throw new Error('Invalid FACILITATOR_URL: must start with http:// or https://');
  }
  
  env.BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://b402-base-api-62092339396.us-central1.run.app';
  if (!env.BACKEND_API_URL.startsWith('http')) {
    throw new Error('Invalid BACKEND_API_URL: must start with http:// or https://');
  }
  
  // Payment Configuration
  env.PAYMENT_AMOUNT_USDC = process.env.PAYMENT_AMOUNT_USDC || '5';
  if (isNaN(parseFloat(env.PAYMENT_AMOUNT_USDC))) {
    throw new Error('Invalid PAYMENT_AMOUNT_USDC: must be a number');
  }
  
  env.RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS || '';
  if (env.RECIPIENT_ADDRESS && !env.RECIPIENT_ADDRESS.startsWith('0x')) {
    throw new Error('Invalid RECIPIENT_ADDRESS: must start with 0x');
  }
  if (env.RECIPIENT_ADDRESS && env.RECIPIENT_ADDRESS.length !== 42) {
    throw new Error('Invalid RECIPIENT_ADDRESS: must be 42 characters (20 bytes hex)');
  }
  
  // OpenAI Configuration
  env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
  if (env.OPENAI_API_KEY && !env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('Invalid OPENAI_API_KEY: must start with sk-');
  }
  
  // Optional Configuration
  env.DATABASE_URL = process.env.DATABASE_URL;
  env.REDIS_URL = process.env.REDIS_URL;
  
  // File Upload Configuration
  env.MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);
  if (isNaN(env.MAX_FILE_SIZE)) {
    throw new Error('Invalid MAX_FILE_SIZE: must be a number');
  }
  
  env.UPLOAD_DIR = process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp/uploads' : './uploads');
  
  // CORS Configuration
  env.CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
  if (env.CORS_ORIGIN !== '*' && !env.CORS_ORIGIN.startsWith('http')) {
    throw new Error('Invalid CORS_ORIGIN: must start with http:// or https://');
  }
  
  return env as EnvConfig;
}

/**
 * Get environment configuration with validation
 */
export function getEnv(): EnvConfig {
  if (!process.env._ENV_VALIDATED) {
    validateEnv();
    process.env._ENV_VALIDATED = 'true';
  }
  
  return {
    PORT: parseInt(process.env.PORT || '3001', 10),
    NODE_ENV: (process.env.NODE_ENV || 'development') as EnvConfig['NODE_ENV'],
    CHAIN_ID: parseInt(process.env.CHAIN_ID || '8453', 10),
    BASE_RPC_URL: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    BASESCAN_API_KEY: process.env.BASESCAN_API_KEY,
    WORKER_PRIVATE_KEY: process.env.WORKER_PRIVATE_KEY || '',
    FACILITATOR_URL: process.env.FACILITATOR_URL || 'https://b402-facilitator-base-62092339396.us-central1.run.app',
    BACKEND_API_URL: process.env.BACKEND_API_URL || 'https://b402-base-api-62092339396.us-central1.run.app',
    PAYMENT_AMOUNT_USDC: process.env.PAYMENT_AMOUNT_USDC || '5',
    RECIPIENT_ADDRESS: process.env.RECIPIENT_ADDRESS || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
    UPLOAD_DIR: process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp/uploads' : './uploads'),
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  };
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in test mode
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Get environment-specific configuration
 */
export function getConfig() {
  const env = getEnv();
  
  return {
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    isTest: isTest(),
    ...env,
  };
}
