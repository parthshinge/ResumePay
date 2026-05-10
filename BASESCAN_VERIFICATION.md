# BaseScan Verification Guide

Complete guide for verifying ResumePay AI transactions on BaseScan blockchain explorer.

## 📋 Overview

BaseScan is the official blockchain explorer for the Base network. This guide explains how to verify transactions, check payment details, and troubleshoot transaction issues.

## 🔗 BaseScan URLs

### Mainnet
- **Explorer:** https://basescan.org
- **API:** https://api.basescan.org
- **API Documentation:** https://docs.basescan.org

### Testnet (Sepolia)
- **Explorer:** https://sepolia.basescan.org
- **API:** https://api-sepolia.basescan.org

## 🔍 Finding Transactions on BaseScan

### Method 1: Via Application Link

1. After making a payment in ResumePay AI
2. Click "View Transaction on BaseScan" button
3. BaseScan will open in a new tab with transaction details

### Method 2: Manual Search by Transaction Hash

1. Go to BaseScan: https://basescan.org
2. Copy transaction hash from ResumePay AI
3. Paste transaction hash in search bar
4. Press Enter or click search icon
5. Transaction details will be displayed

### Method 3: Search by Wallet Address

1. Go to BaseScan: https://basescan.org
2. Copy your wallet address from ResumePay AI or MetaMask
3. Paste wallet address in search bar
4. Press Enter or click search icon
5. All transactions for that address will be displayed
6. Find your transaction in the list

## 📊 Understanding Transaction Details

### Transaction Overview

When you open a transaction on BaseScan, you'll see:

#### Transaction Hash
- **What it is:** Unique identifier for the transaction
- **Format:** 66-character hexadecimal string starting with `0x`
- **Example:** `0x1234567890abcdef...`
- **Use:** Share this hash to prove payment was made

#### Status
- **Success:** Transaction completed successfully
- **Pending:** Transaction still processing (usually < 30 seconds)
- **Failed:** Transaction failed (insufficient gas, revert, etc.)

#### Block
- **Block Number:** Block height where transaction was included
- **Timestamp:** When the block was mined
- **Confirmations:** Number of blocks since transaction (higher = more secure)

#### From / To
- **From:** Wallet address that initiated the transaction
- **To:** Contract address (for USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bA029040`)

#### Value
- **ETH Amount:** ETH transferred (usually 0 for USDC transfers)
- **Gas Used:** Gas consumed by transaction
- **Gas Price:** Price per gas unit in Gwei
- **Transaction Fee:** Total gas fee in ETH

### Internal Transactions

USDC transfers appear as internal transactions. To view:

1. Scroll down to "Internal Transactions" section
2. Look for "Transfer" type
3. Verify:
   - **From:** Your wallet address
   - **To:** Recipient wallet address
   - **Value:** 5000000 (5 USDC with 6 decimals)

### Event Logs

Event logs contain detailed information about the transaction. To view:

1. Scroll down to "Logs" section
2. Look for "Transfer" event from USDC contract
3. Verify:
   - **address:** USDC contract address
   - **topics:**
     - topic[0]: Transfer event signature
     - topic[1]: From address (indexed)
     - topic[2]: To address (indexed)
   - **data:** Amount (5000000 for 5 USDC)

## ✅ Verification Checklist

### For ResumePay AI Payments

#### Step 1: Verify Transaction Exists
- [ ] Transaction hash is valid
- [ ] Transaction appears on BaseScan
- [ ] Transaction status is "Success"

#### Step 2: Verify Transaction Details
- [ ] "From" address matches your wallet
- [ ] "To" address is USDC contract
- [ ] Network is Base (chain ID 8453)
- [ ] Timestamp is recent

#### Step 3: Verify Internal Transactions
- [ ] Internal transaction exists
- [ ] Transfer is to correct recipient
- [ ] Amount is correct (5 USDC = 5000000)

#### Step 4: Verify Event Logs
- [ ] Transfer event exists
- [ ] From address matches your wallet
- [ ] To address matches recipient
- [ ] Amount is correct

#### Step 5: Verify Backend Verification
- [ ] Backend verified transaction successfully
- [ ] Payment status is "confirmed"
- [ ] AI review was generated

## 🔧 Common Transaction Issues

### Issue 1: Transaction Pending

**Symptoms:**
- Status shows "Pending"
- Transaction hash exists but no confirmations

**Solutions:**
1. Wait 30-60 seconds for transaction to process
2. Check Base network congestion (https://basescan.org/gastracker)
3. Check if gas price was too low
4. If pending for > 5 minutes, transaction may fail

### Issue 2: Transaction Failed

**Symptoms:**
- Status shows "Failed"
- Error message displayed

**Common Causes:**
- Insufficient gas fees
- Insufficient USDC balance
- Slippage tolerance too low
- Contract reverted

**Solutions:**
1. Check wallet has sufficient ETH for gas
2. Check wallet has sufficient USDC balance
3. Try transaction again with higher gas limit
4. Check error message for specific issue

### Issue 3: Transaction Not Found

**Symptoms:**
- Transaction hash returns "Transaction not found"
- Transaction doesn't appear on BaseScan

**Solutions:**
1. Verify transaction hash is correct (66 characters, starts with 0x)
2. Check if on correct network (Base vs Base Sepolia)
3. Wait a few minutes for transaction to index
4. Check if transaction was actually submitted

### Issue 4: Wrong Recipient Address

**Symptoms:**
- Internal transaction shows wrong recipient
- Backend verification fails

**Solutions:**
1. Verify recipient address in application
2. Check backend environment variable `RECIPIENT_ADDRESS`
3. Verify transaction details on BaseScan
4. Contact support if address is incorrect

### Issue 5: Wrong Amount

**Symptoms:**
- Internal transaction shows wrong amount
- Backend verification fails

**Solutions:**
1. Verify payment amount in application
2. Check backend environment variable `PAYMENT_AMOUNT_USDC`
3. Verify transaction details on BaseScan
4. Note: USDC has 6 decimals (5 USDC = 5000000)

## 📱 BaseScan API Usage

### Get Transaction Details

```bash
curl "https://api.basescan.org/api?module=proxy&action=eth_getTransactionByHash&txhash=YOUR_TX_HASH&apikey=YOUR_API_KEY"
```

### Get Transaction Receipt

```bash
curl "https://api.basescan.org/api?module=proxy&action=eth_getTransactionReceipt&txhash=YOUR_TX_HASH&apikey=YOUR_API_KEY"
```

### Get Internal Transactions

```bash
curl "https://api.basescan.org/api?module=account&action=txlistinternal&txhash=YOUR_TX_HASH&apikey=YOUR_API_KEY"
```

### Get Event Logs

```bash
curl "https://api.basescan.org/api?module=logs&action=getLogs&address=0x833589fCD6eDb6E08f4c7C32D4f71b54bA029040&fromBlock=0&toBlock=latest&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&apikey=YOUR_API_KEY"
```

## 🔐 Security Considerations

### Verifying Transaction Authenticity

1. **Check Transaction Hash:** Verify hash matches what was shown in application
2. **Check Timestamp:** Verify transaction is recent (not from months ago)
3. **Check Amount:** Verify amount is exactly 5 USDC
4. **Check Recipient:** Verify recipient is correct address
5. **Check Network:** Verify transaction is on Base network (chain ID 8453)

### Preventing Transaction Replay

- Each transaction has unique hash
- Cannot be replayed on different networks
- Cannot be replayed with different parameters
- Backend verifies all details before accepting payment

### Privacy Considerations

- All transactions are public on blockchain
- Wallet addresses are visible
- Transaction amounts are visible
- Use separate wallet for privacy if needed

## 📊 Transaction Confirmation Times

### Base Network

- **Average confirmation time:** 2-5 seconds
- **Final confirmation:** ~12 seconds (2 blocks)
- **99.9% finality:** ~30 seconds (5 blocks)

### Base Sepolia Testnet

- **Average confirmation time:** 2-5 seconds
- **Final confirmation:** ~12 seconds (2 blocks)
- **99.9% finality:** ~30 seconds (5 blocks)

## 🎯 Best Practices

### For Users

1. **Always verify on BaseScan:** Don't trust application alone
2. **Save transaction hash:** Keep proof of payment
3. **Check recipient address:** Before confirming transaction
4. **Check amount:** Before confirming transaction
5. **Use testnet first:** Test with fake money before using real money

### For Developers

1. **Verify on-chain:** Don't trust frontend alone
2. **Check transaction receipt:** Verify status is 1 (success)
3. **Verify internal transactions:** Check USDC transfer
4. **Verify event logs:** Parse Transfer event
5. **Handle pending transactions:** Wait for confirmation

## 🔍 Advanced Verification

### Using Ethers.js

```javascript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
const tx = await provider.getTransaction('0x...');
const receipt = await provider.getTransactionReceipt('0x...');

// Verify transaction
console.log('Status:', receipt.status === 1 ? 'Success' : 'Failed');
console.log('Block:', receipt.blockNumber);
console.log('Gas Used:', receipt.gasUsed.toString());
```

### Using Backend API

```bash
# Get transaction status
curl https://your-backend-url/api/payment/status/0x...

# Verify payment
curl -X POST https://your-backend-url/api/payment/verify \
  -H "Content-Type: application/json" \
  -d '{"txHash":"0x...","walletAddress":"0x...","amount":"5","resumeId":"..."}'
```

## 📞 Support

If you encounter issues with BaseScan verification:

1. Check transaction details on BaseScan
2. Verify transaction status and details
3. Check backend logs for verification errors
4. Review this guide for common issues
5. Contact support with transaction hash

## 🎓 Learning Resources

- [BaseScan Documentation](https://docs.basescan.org)
- [Base Network Documentation](https://docs.base.org)
- [Ethers.js Documentation](https://docs.ethers.org)
- [Blockchain Explainers](https://docs.base.org/docs/learn)

---

**Use this guide to verify all ResumePay AI transactions on BaseScan.**
