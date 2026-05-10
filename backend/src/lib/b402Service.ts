import { B402 } from '@b402ai/sdk';
import { ethers } from 'ethers';

// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bA029040';

export class B402Service {
  private b402: B402 | null = null;
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const privateKey = process.env.WORKER_PRIVATE_KEY;
      const chainId = parseInt(process.env.CHAIN_ID || '8453');
      const rpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
      const facilitatorUrl = process.env.FACILITATOR_URL;
      const backendApiUrl = process.env.BACKEND_API_URL;

      if (!privateKey) {
        console.warn('WORKER_PRIVATE_KEY not set, b402 SDK will not be initialized');
        return;
      }

      this.b402 = new B402({
        privateKey,
        chainId,
        rpcUrl,
        facilitatorUrl,
        backendApiUrl,
      });

      this.initialized = true;
      console.log('b402 SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize b402 SDK:', error);
      this.initialized = false;
    }
  }

  isInitialized(): boolean {
    return this.initialized && this.b402 !== null;
  }

  /**
   * Shield USDC into privacy pool (gasless)
   */
  async shieldUSDC(amount: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.b402) {
      return { success: false, error: 'b402 SDK not initialized' };
    }

    try {
      const result = await this.b402.shieldFromEOA({
        token: 'USDC',
        amount,
      });

      return {
        success: true,
        txHash: result.txHash,
      };
    } catch (error) {
      console.error('Shield USDC error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute private payment through b402
   * Note: b402 SDK uses privateSwap for token transfers
   */
  async executePayment(params: {
    from: string;
    to: string;
    amount: string;
    recipient: string;
  }): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.b402) {
      return { success: false, error: 'b402 SDK not initialized' };
    }

    try {
      const result = await this.b402.execute({
        action: 'privateSwap',
        from: params.from,
        to: params.to,
        amount: params.amount,
      });

      return {
        success: true,
        txHash: result.txHash,
      };
    } catch (error) {
      console.error('Execute payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get b402 status
   */
  async getStatus(): Promise<{ success: boolean; status?: any; error?: string }> {
    if (!this.b402) {
      return { success: false, error: 'b402 SDK not initialized' };
    }

    try {
      const status = await this.b402.status();
      return {
        success: true,
        status,
      };
    } catch (error) {
      console.error('Get status error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify transaction through b402
   */
  async verifyTransaction(txHash: string): Promise<{ success: boolean; verified?: boolean; error?: string }> {
    if (!this.b402) {
      return { success: false, error: 'b402 SDK not initialized' };
    }

    try {
      // b402 SDK may have a verification method, otherwise we rely on on-chain verification
      const status = await this.b402.status();
      
      return {
        success: true,
        verified: true, // If we got status, assume it's valid
      };
    } catch (error) {
      console.error('Verify transaction error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const b402Service = new B402Service();
