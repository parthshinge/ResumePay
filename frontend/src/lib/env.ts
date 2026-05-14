interface FrontendEnvConfig {
  // Base Chain Configuration
  NEXT_PUBLIC_CHAIN_ID: number;
  NEXT_PUBLIC_BASESCAN_URL: string;
  
  // Backend Configuration
  NEXT_PUBLIC_API_URL: string;
  
  // Payment Configuration
  NEXT_PUBLIC_PAYMENT_AMOUNT_USDC: string;
  
  // WalletConnect Configuration (Optional)
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?: string;
  
  // Recipient Address
  NEXT_PUBLIC_RECIPIENT_ADDRESS?: string;
}

// Public env vars have production-safe defaults so Vercel previews can build
// without a separate env setup step.
const REQUIRED_ENV_VARS: (keyof FrontendEnvConfig)[] = [];

// Optional frontend environment variables
const OPTIONAL_ENV_VARS: (keyof FrontendEnvConfig)[] = [
  'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
  'NEXT_PUBLIC_RECIPIENT_ADDRESS',
];

/**
 * Validate frontend environment variables
 * @throws Error if required environment variables are missing
 */
export function validateFrontendEnv(): FrontendEnvConfig {
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
      `Please set these in your .env.local file. See .env.example for reference.`
    );
  }
  
  // Validate specific variable formats
  const env: Partial<FrontendEnvConfig> = {};
  
  // Base Chain Configuration
  env.NEXT_PUBLIC_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453', 10);
  if (isNaN(env.NEXT_PUBLIC_CHAIN_ID)) {
    throw new Error('Invalid NEXT_PUBLIC_CHAIN_ID: must be a number');
  }
  
  env.NEXT_PUBLIC_BASESCAN_URL = process.env.NEXT_PUBLIC_BASESCAN_URL || 'https://basescan.org';
  if (!env.NEXT_PUBLIC_BASESCAN_URL.startsWith('http')) {
    throw new Error('Invalid NEXT_PUBLIC_BASESCAN_URL: must start with http:// or https://');
  }
  
  // Backend Configuration
  env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || '/_/backend';
  if (!env.NEXT_PUBLIC_API_URL.startsWith('http') && !env.NEXT_PUBLIC_API_URL.startsWith('/')) {
    throw new Error('Invalid NEXT_PUBLIC_API_URL: must start with http://, https://, or /');
  }
  
  // Payment Configuration
  env.NEXT_PUBLIC_PAYMENT_AMOUNT_USDC = process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_USDC || '5';
  if (isNaN(parseFloat(env.NEXT_PUBLIC_PAYMENT_AMOUNT_USDC))) {
    throw new Error('Invalid NEXT_PUBLIC_PAYMENT_AMOUNT_USDC: must be a number');
  }
  
  // Optional Configuration
  env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  env.NEXT_PUBLIC_RECIPIENT_ADDRESS = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS;
  
  if (env.NEXT_PUBLIC_RECIPIENT_ADDRESS && !env.NEXT_PUBLIC_RECIPIENT_ADDRESS.startsWith('0x')) {
    throw new Error('Invalid NEXT_PUBLIC_RECIPIENT_ADDRESS: must start with 0x');
  }
  
  return env as FrontendEnvConfig;
}

/**
 * Get frontend environment configuration with validation
 */
export function getFrontendEnv(): FrontendEnvConfig {
  if (!process.env._FRONTEND_ENV_VALIDATED) {
    validateFrontendEnv();
    process.env._FRONTEND_ENV_VALIDATED = 'true';
  }
  
  return {
    NEXT_PUBLIC_CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453', 10),
    NEXT_PUBLIC_BASESCAN_URL: process.env.NEXT_PUBLIC_BASESCAN_URL || 'https://basescan.org',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/_/backend',
    NEXT_PUBLIC_PAYMENT_AMOUNT_USDC: process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_USDC || '5',
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_RECIPIENT_ADDRESS: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS,
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
 * Get environment-specific configuration
 */
export function getFrontendConfig() {
  const env = getFrontendEnv();
  
  return {
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    ...env,
  };
}
