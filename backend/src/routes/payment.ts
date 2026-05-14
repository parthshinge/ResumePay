import express, { Request, Response } from 'express';
import { verifyTransaction, getTransactionStatus } from '../lib/transactionVerifier';
import { b402Service } from '../lib/b402Service';
import { getBackendConfig } from '../config';
import { paymentLogger, transactionLogger, b402Logger } from '../lib/logger';

const router = express.Router();
const config = getBackendConfig();

// Verify payment using b402 SDK status plus Base on-chain verification.
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { txHash, walletAddress, amount, resumeId, recipientAddress, demoTransfer } = req.body;

    paymentLogger.info('Payment verification request received', { txHash, walletAddress, amount, resumeId });

    if (!txHash || !walletAddress || amount === undefined || amount === null) {
      paymentLogger.warn('Missing required fields in payment verification');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expectedRecipient = recipientAddress || config.recipientAddress;
    if (!expectedRecipient) {
      paymentLogger.error('Recipient address not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const expectedAmount = demoTransfer ? '0' : String(amount);
    paymentLogger.info('Starting Base transaction verification', {
      txHash,
      expectedRecipient,
      expectedAmount,
      demoTransfer,
    });

    const verification = await verifyTransaction(
      txHash,
      expectedRecipient,
      expectedAmount,
      config.baseRpcUrl
    );

    transactionLogger.info('Transaction verification result', {
      txHash,
      verified: verification.verified,
      from: verification.from,
      to: verification.to,
      amount: verification.amount,
      blockNumber: verification.blockNumber,
    });

    if (!verification.verified) {
      paymentLogger.warn('Transaction verification failed', {
        txHash,
        error: verification.error,
        details: verification,
      });
      return res.status(400).json({
        success: false,
        error: verification.error || 'Payment verification failed',
        details: verification,
      });
    }

    if (verification.from.toLowerCase() !== String(walletAddress).toLowerCase()) {
      paymentLogger.warn('Wallet address mismatch', {
        expected: walletAddress,
        actual: verification.from,
      });
      return res.status(400).json({
        success: false,
        error: 'Wallet address mismatch',
        expected: walletAddress,
        actual: verification.from,
      });
    }

    if (b402Service.isInitialized()) {
      try {
        b402Logger.info('Performing b402 SDK status check');
        const b402Status = await b402Service.getStatus();
        b402Logger.info('b402 SDK status check passed', b402Status);
      } catch (b402Error) {
        b402Logger.warn('b402 SDK status check failed, using Base verification only', b402Error);
      }
    } else {
      b402Logger.warn('b402 SDK not initialized, using Base verification only');
    }

    paymentLogger.info('Payment verified successfully', { txHash, resumeId });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        txHash: verification.txHash,
        walletAddress: verification.from,
        recipientAddress: verification.to,
        amount: verification.amount,
        token: 'USDC',
        chain: 'base',
        status: 'confirmed',
        verifiedAt: new Date().toISOString(),
        blockNumber: verification.blockNumber,
        timestamp: verification.timestamp,
        demoTransfer: Boolean(demoTransfer),
      },
      resumeId,
    });
  } catch (error) {
    paymentLogger.error('Payment verification error', error);
    res.status(500).json({
      error: 'Failed to verify payment',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get payment status
router.get('/status/:txHash', async (req: Request, res: Response) => {
  try {
    const { txHash } = req.params;
    const status = await getTransactionStatus(txHash, config.baseRpcUrl);

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
