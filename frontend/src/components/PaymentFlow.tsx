'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain, useBalance, useSendTransaction } from 'wagmi';
import { base } from 'wagmi/chains';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ArrowLeft, Wallet, CheckCircle, AlertCircle, Loader2, ExternalLink, Copy } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '../lib/api';
import { parseUnits } from 'viem';

interface PaymentFlowProps {
  paymentData: any;
  resumeData: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bA029040' as const;

export default function PaymentFlow({
  paymentData,
  resumeData,
  onComplete,
  onBack,
}: PaymentFlowProps) {
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({ address });
  const { sendTransaction, isPending: isSendingTransaction } = useSendTransaction();
  
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'switching' | 'sending' | 'verifying' | 'success' | 'failed'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  const amount = paymentData?.amount;
  const recipientAddress = paymentData?.recipientAddress || process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS;

  if (!paymentData || !resumeData || !amount) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">Payment details are missing. Please upload your resume again.</p>
        </div>
      </div>
    );
  }

  const handleSwitchToBase = async () => {
    setPaymentStatus('switching');
    setError(null);
    try {
      await switchChain({ chainId: base.id });
      setPaymentStatus('idle');
    } catch (err: any) {
      setError(err.message || 'Failed to switch to Base network');
      setPaymentStatus('idle');
    }
  };

  const handlePayment = async () => {
    if (!address || !recipientAddress) {
      setError('Wallet or recipient address not available');
      return;
    }

    // Check if on Base network
    if (chain?.id !== base.id) {
      await handleSwitchToBase();
      return;
    }

    setPaymentStatus('sending');
    setError(null);

    try {
      // Convert amount to wei (USDC has 6 decimals)
      const amountInWei = parseUnits(amount, 6);

      // Send transaction
      const result = await sendTransaction({
        to: recipientAddress as `0x${string}`,
        value: amountInWei,
      });

      if (result) {
        setTxHash(result);
        setPaymentStatus('verifying');
        await verifyPayment(result, address);
      }
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      setPaymentStatus('failed');
    }
  };

  const verifyPayment = async (hash: string, walletAddress: string) => {
    try {
      const verifyResponse = await axios.post(
        apiUrl('/api/payment/verify'),
        {
          txHash: hash,
          walletAddress,
          amount,
          resumeId: resumeData.id,
        }
      );

      if (verifyResponse.data.success) {
        setPaymentStatus('success');
        onComplete({
          ...verifyResponse.data,
          paymentMethod: 'wallet',
          txHash: hash,
        });
      } else {
        setError(verifyResponse.data.error || 'Payment verification failed');
        setPaymentStatus('failed');
      }
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
      setPaymentStatus('failed');
    }
  };

  const copyToClipboard = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const basescanUrl = txHash ? `https://basescan.org/tx/${txHash}` : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h2>
        <p className="text-gray-600">
          Pay {amount} USDC on Base to get your resume review
        </p>
      </div>

      <div className="space-y-6">
        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold text-gray-900">{amount} USDC</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Network</span>
            <span className="font-semibold text-gray-900">Base</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Token</span>
            <span className="font-semibold text-gray-900">USDC</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <span className="text-gray-900 font-medium">Total</span>
            <span className="text-2xl font-bold text-primary-600">{amount} USDC</span>
          </div>
        </div>

        {/* Wallet Connection */}
        {!isConnected ? (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Wallet Info */}
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Wallet Connected</p>
                  <p className="text-sm text-green-700">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
              </div>
              {balance && (
                <div className="text-right">
                  <p className="text-sm text-green-700">Balance</p>
                  <p className="font-medium text-green-900">{parseFloat(balance.formatted).toFixed(4)} {balance.symbol}</p>
                </div>
              )}
            </div>

            {/* Network Warning */}
            {chain?.id !== base.id && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">Please switch to Base network to continue</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Payment Status */}
            {paymentStatus === 'switching' && (
              <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-700">Switching to Base network...</p>
              </div>
            )}

            {paymentStatus === 'sending' && (
              <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-700">Sending transaction...</p>
              </div>
            )}

            {paymentStatus === 'verifying' && (
              <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-700">Verifying payment on-chain...</p>
              </div>
            )}

            {paymentStatus === 'success' && txHash && (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-700">Payment successful! Generating your review...</p>
                </div>
                
                {/* Transaction Hash */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Transaction Hash</p>
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-gray-900 font-mono">{txHash.slice(0, 10)}...{txHash.slice(-8)}</code>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={copyToClipboard}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Copy transaction hash"
                      >
                        <Copy className="h-4 w-4 text-gray-600" />
                      </button>
                      {basescanUrl && (
                        <a
                          href={basescanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="View on BaseScan"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-600" />
                        </a>
                      )}
                    </div>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
                  )}
                </div>

                {basescanUrl && (
                  <a
                    href={basescanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Transaction on BaseScan
                  </a>
                )}
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="flex items-center justify-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-700">Payment failed. Please try again.</p>
              </div>
            )}

            {/* Pay Button */}
            {paymentStatus === 'idle' && chain?.id === base.id && (
              <button
                onClick={handlePayment}
                disabled={isSendingTransaction}
                className="w-full bg-primary-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {isSendingTransaction ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-5 w-5" />
                    <span>Pay {amount} USDC</span>
                  </>
                )}
              </button>
            )}

            {/* Switch Network Button */}
            {paymentStatus === 'idle' && chain?.id !== base.id && (
              <button
                onClick={handleSwitchToBase}
                className="w-full bg-yellow-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-3"
              >
                <Wallet className="h-5 w-5" />
                <span>Switch to Base Network</span>
              </button>
            )}
          </div>
        )}

        {/* Security Note */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Secured by b402 SDK - Privacy-preserving payments on Base</p>
          <p>Your transaction is verified on-chain</p>
        </div>
      </div>
    </div>
  );
}
