import { getFrontendConfig as getEnvConfig } from '../lib/env';

/**
 * Frontend Configuration System
 * Provides environment-specific configuration for development, production, and deployment
 */

export interface FrontendConfig {
  // Base Chain
  chainId: number;
  basescanUrl: string;
  
  // Backend
  apiUrl: string;
  
  // Payment
  paymentAmountUsdc: string;
  
  // WalletConnect
  walletConnectProjectId?: string;
  
  // Recipient
  recipientAddress?: string;
  
  // Environment flags
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Get configuration based on current environment
 */
export function getFrontendConfig(): FrontendConfig {
  const env = getEnvConfig();
  
  return {
    // Base Chain
    chainId: env.NEXT_PUBLIC_CHAIN_ID,
    basescanUrl: env.NEXT_PUBLIC_BASESCAN_URL,
    
    // Backend
    apiUrl: env.NEXT_PUBLIC_API_URL,
    
    // Payment
    paymentAmountUsdc: env.NEXT_PUBLIC_PAYMENT_AMOUNT_USDC,
    
    // WalletConnect
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    
    // Recipient
    recipientAddress: env.NEXT_PUBLIC_RECIPIENT_ADDRESS,
    
    // Environment flags
    isDevelopment: env.isDevelopment,
    isProduction: env.isProduction,
  };
}

/**
 * Development-specific configuration
 */
export function getDevelopmentConfig(): Partial<FrontendConfig> {
  return {
    apiUrl: 'http://localhost:3001',
    isDevelopment: true,
    isProduction: false,
  };
}

/**
 * Production-specific configuration
 */
export function getProductionConfig(): Partial<FrontendConfig> {
  return {
    isDevelopment: false,
    isProduction: true,
  };
}

/**
 * Vercel deployment configuration
 */
export function getVercelConfig(): Partial<FrontendConfig> {
  return {
    isDevelopment: false,
    isProduction: true,
  };
}

/**
 * Export singleton config instance
 */
export const config = getFrontendConfig();
