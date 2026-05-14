import { ethers } from 'ethers';

// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Minimal ABI for USDC transfer
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

/**
 * Verify a transaction on Base chain
 * @param txHash - Transaction hash to verify
 * @param expectedRecipient - Expected recipient address
 * @param expectedAmount - Expected amount in USDC (6 decimals)
 * @param rpcUrl - Base RPC URL
 * @returns Verification result with transaction details
 */
export async function verifyTransaction(
  txHash: string,
  expectedRecipient: string,
  expectedAmount: string,
  rpcUrl: string
): Promise<{
  verified: boolean;
  txHash: string;
  from: string;
  to: string;
  amount: string;
  blockNumber: number;
  timestamp: number;
  error?: string;
}> {
  try {
    // Initialize provider
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return {
        verified: false,
        txHash,
        from: '',
        to: '',
        amount: '0',
        blockNumber: 0,
        timestamp: 0,
        error: 'Transaction not found',
      };
    }

    // Check transaction status (1 = success, 0 = failed)
    if (receipt.status !== 1) {
      return {
        verified: false,
        txHash,
        from: '',
        to: '',
        amount: '0',
        blockNumber: receipt.blockNumber,
        timestamp: 0,
        error: 'Transaction failed',
      };
    }

    // Get transaction details
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return {
        verified: false,
        txHash,
        from: '',
        to: '',
        amount: '0',
        blockNumber: receipt.blockNumber,
        timestamp: 0,
        error: 'Transaction details not found',
      };
    }

    // Get block timestamp
    const block = await provider.getBlock(receipt.blockNumber);
    const timestamp = block?.timestamp || 0;

    // Check if it's a USDC transfer
    if (tx.to?.toLowerCase() === USDC_CONTRACT_ADDRESS.toLowerCase()) {
      // Parse the transfer from logs
      const usdcInterface = new ethers.Interface(ERC20_ABI);
      let transferFound = false;
      let transferAmount = '0';
      let transferFrom = '';
      let transferTo = '';

      for (const log of receipt.logs) {
        try {
          const parsed = usdcInterface.parseLog(log);
          if (parsed && parsed.name === 'Transfer') {
            transferFrom = parsed.args[0].toLowerCase();
            transferTo = parsed.args[1].toLowerCase();
            transferAmount = parsed.args[2].toString();
            transferFound = true;
            break;
          }
        } catch (e) {
          // Log not for USDC transfer
          continue;
        }
      }

      if (!transferFound) {
        return {
          verified: false,
          txHash,
          from: tx.from,
          to: tx.to || '',
          amount: '0',
          blockNumber: receipt.blockNumber,
          timestamp,
          error: 'USDC transfer not found in logs',
        };
      }

      // Verify recipient
      if (transferTo.toLowerCase() !== expectedRecipient.toLowerCase()) {
        return {
          verified: false,
          txHash,
          from: transferFrom,
          to: transferTo,
          amount: transferAmount,
          blockNumber: receipt.blockNumber,
          timestamp,
          error: `Recipient mismatch. Expected: ${expectedRecipient}, Got: ${transferTo}`,
        };
      }

      // Verify amount (USDC has 6 decimals)
      const expectedAmountWei = ethers.parseUnits(expectedAmount, 6);
      if (BigInt(transferAmount) < expectedAmountWei) {
        return {
          verified: false,
          txHash,
          from: transferFrom,
          to: transferTo,
          amount: transferAmount,
          blockNumber: receipt.blockNumber,
          timestamp,
          error: `Amount insufficient. Expected: ${expectedAmount}, Got: ${ethers.formatUnits(transferAmount, 6)}`,
        };
      }

      // All checks passed
      return {
        verified: true,
        txHash,
        from: transferFrom,
        to: transferTo,
        amount: ethers.formatUnits(transferAmount, 6),
        blockNumber: receipt.blockNumber,
        timestamp,
      };
    }

    // If not USDC transfer, check if it's ETH transfer to expected recipient
    if (tx.to?.toLowerCase() === expectedRecipient.toLowerCase()) {
      const value = tx.value.toString();
      const expectedValue = ethers.parseEther(expectedAmount);

      if (BigInt(value) < expectedValue) {
        return {
          verified: false,
          txHash,
          from: tx.from,
          to: tx.to || '',
          amount: ethers.formatEther(value),
          blockNumber: receipt.blockNumber,
          timestamp,
          error: `ETH amount insufficient. Expected: ${expectedAmount}, Got: ${ethers.formatEther(value)}`,
        };
      }

      return {
        verified: true,
        txHash,
        from: tx.from,
        to: tx.to || '',
        amount: ethers.formatEther(value),
        blockNumber: receipt.blockNumber,
        timestamp,
      };
    }

    return {
      verified: false,
      txHash,
      from: tx.from,
      to: tx.to || '',
      amount: '0',
      blockNumber: receipt.blockNumber,
      timestamp,
      error: 'Transaction not to expected recipient or USDC contract',
    };
  } catch (error) {
    console.error('Transaction verification error:', error);
    return {
      verified: false,
      txHash,
      from: '',
      to: '',
      amount: '0',
      blockNumber: 0,
      timestamp: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get transaction status from Base chain
 * @param txHash - Transaction hash
 * @param rpcUrl - Base RPC URL
 * @returns Transaction status
 */
export async function getTransactionStatus(
  txHash: string,
  rpcUrl: string
): Promise<{
  status: 'pending' | 'success' | 'failed';
  blockNumber?: number;
  timestamp?: number;
  error?: string;
}> {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return { status: 'pending' };
    }

    const block = await provider.getBlock(receipt.blockNumber);
    const timestamp = block?.timestamp;

    return {
      status: receipt.status === 1 ? 'success' : 'failed',
      blockNumber: receipt.blockNumber,
      timestamp,
    };
  } catch (error) {
    console.error('Get transaction status error:', error);
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
