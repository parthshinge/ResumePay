'use client';

import { useState } from 'react';
import { useAccount, useSwitchChain, useBalance } from 'wagmi';
import { base } from 'wagmi/chains';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ArrowLeft, Wallet, CheckCircle, AlertCircle, Loader2, ExternalLink, Copy } from 'lucide-react';
import axios from 'axios';
import { ethers } from 'ethers';
import { apiUrl } from '../lib/api';

interface PaymentFlowProps {
  paymentData: any;
  resumeData: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const BASE_USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const ERC20_ABI = ['function transfer(address to, uint256 value) returns (bool)'];

export default function PaymentFlow({
  paymentData,
  resumeData,
  onComplete,
  onBack,
}: PaymentFlowProps) {
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: balance } = useBalance({ address });

  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'switching' | 'sending' | 'verifying' | 'success' | 'failed'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const amount = paymentData?.amount;
  const configuredRecipient = paymentData?.recipientAddress || process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS;
  const hasRecipient = configuredRecipient && ethers.isAddress(configuredRecipient);
  const recipientAddress = hasRecipient ? configuredRecipient : address;

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
      await switchChainAsync({ chainId: base.id });
      setPaymentStatus('idle');
    } catch (err: any) {
      setError(err.message || 'Failed to switch to Base network');
      setPaymentStatus('idle');
    }
  };

  const sendUsdcTransfer = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('No wallet provider found. Please connect Base Wallet, Coinbase Wallet, or MetaMask.');
    }

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const fromAddress = await signer.getAddress();
    const targetRecipient = hasRecipient ? configuredRecipient : fromAddress;
    const transferAmount = hasRecipient ? ethers.parseUnits(String(amount), 6) : 0n;
    const usdc = new ethers.Contract(BASE_USDC_ADDRESS, ERC20_ABI, signer);
    const tx = await usdc.transfer(targetRecipient, transferAmount);
    const receipt = await tx.wait();

    return {
      txHash: receipt?.hash || tx.hash,
      walletAddress: fromAddress,
      recipientAddress: targetRecipient,
      amount: hasRecipient ? amount : '0',
      demoTransfer: !hasRecipient,
    };
  };

  const handlePayment = async () => {
    if (!address) {
      setError('Wallet address not available');
      return;
    }

    if (chain?.id !== base.id) {
      await handleSwitchToBase();
      return;
    }

    setPaymentStatus('sending');
    setError(null);

    try {
      const payment = await sendUsdcTransfer();
      setTxHash(payment.txHash);
      setPaymentStatus('verifying');

      const verifyResponse = await axios.post(
        apiUrl('/api/payment/verify'),
        {
          txHash: payment.txHash,
          walletAddress: payment.walletAddress,
          amount: payment.amount,
          resumeId: resumeData.id,
          recipientAddress: payment.recipientAddress,
          demoTransfer: payment.demoTransfer,
        }
      );

      if (verifyResponse.data.success) {
        setPaymentStatus('success');
        onComplete({
          ...verifyResponse.data,
          paymentMethod: payment.demoTransfer ? 'base-wallet-demo' : 'base-wallet-usdc',
          txHash: payment.txHash,
        });
      } else {
        setError(verifyResponse.data.error || 'Payment verification failed');
        setPaymentStatus('failed');
      }
    } catch (err: any) {
      setError(err.shortMessage || err.message || 'Transaction failed');
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
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold text-gray-900">{hasRecipient ? amount : '0'} USDC</span>
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
            <span className="text-2xl font-bold text-primary-600">{hasRecipient ? amount : '0'} USDC</span>
          </div>
          {!hasRecipient && (
            <p className="text-xs text-amber-700">
              Recipient wallet is not configured. Demo mode will send a 0 USDC Base transaction to your connected wallet so a real tx hash appears for recording.
            </p>
          )}
        </div>

        {!isConnected ? (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-4">
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

            {chain?.id !== base.id && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">Please switch to Base network to continue</p>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {paymentStatus === 'switching' && (
              <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-700">Switching to Base network...</p>
              </div>
            )}

            {paymentStatus === 'sending' && (
              <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-700">Sending Base USDC transaction...</p>
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
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="flex items-center justify-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-700">Payment failed. Please try again.</p>
              </div>
            )}

            {paymentStatus === 'idle' && chain?.id === base.id && (
              <button
                onClick={handlePayment}
                className="w-full bg-primary-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-3"
              >
                <Wallet className="h-5 w-5" />
                <span>{hasRecipient ? `Pay ${amount} USDC` : 'Send Base Demo TX'}</span>
              </button>
            )}

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

        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Secured by b402 SDK - backend checks b402 status when configured</p>
          <p>Wallet transactions are verified on Base</p>
        </div>
      </div>
    </div>
  );
}
