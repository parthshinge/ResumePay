import express from 'express';
import { verifyTransaction, getTransactionStatus } from '../lib/transactionVerifier';
import { b402Service } from '../lib/b402Service';

const router = express.Router();

// Verify payment using b402 SDK and on-chain verification
router.post('/verify', async (req, res) => {
  try {
    const { txHash, walletAddress, amount, resumeId } = req.body;

    if (!txHash || !walletAddress || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get Base RPC URL from environment
    const baseRpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
    const recipientAddress = process.env.RECIPIENT_ADDRESS;

    if (!recipientAddress) {
      console.error('RECIPIENT_ADDRESS not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Verify transaction on-chain
    const verification = await verifyTransaction(
      txHash,
      recipientAddress,
      amount,
      baseRpcUrl
    );

    if (!verification.verified) {
      return res.status(400).json({
        success: false,
        error: verification.error || 'Payment verification failed',
        details: verification,
      });
    }

    // Verify the sender matches the connected wallet
    if (verification.from.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address mismatch',
        expected: walletAddress,
        actual: verification.from,
      });
    }

    // Use b402 SDK for additional verification if available
    if (b402Service.isInitialized()) {
      try {
        const b402Status = await b402Service.getStatus();
        console.log('b402 SDK status check passed:', b402Status);
      } catch (b402Error) {
        console.warn('b402 SDK status check failed:', b402Error);
        // Continue with on-chain verification even if b402 fails
      }
    } else {
      console.warn('b402 SDK not initialized, using on-chain verification only');
    }

    // Payment verified successfully
    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        txHash: verification.txHash,
        walletAddress: verification.from,
        recipientAddress: verification.to,
        amount: verification.amount,
        status: 'confirmed',
        verifiedAt: new Date().toISOString(),
        blockNumber: verification.blockNumber,
        timestamp: verification.timestamp,
      },
      resumeId,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get payment status
router.get('/status/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    
    const baseRpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
    
    const status = await getTransactionStatus(txHash, baseRpcUrl);
    
    res.json({
      txHash,
      status: status.status,
      blockNumber: status.blockNumber,
      timestamp: status.timestamp,
      confirmedAt: status.timestamp ? new Date(status.timestamp * 1000).toISOString() : null,
    });
  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

export default router;
