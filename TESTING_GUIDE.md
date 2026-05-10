# ResumePay AI - Testing Guide & Wallet Instructions

Complete testing guide for ResumePay AI including wallet testing, payment flow verification, and troubleshooting.

## 🧪 Testing Overview

### Testing Environments

1. **Local Development** - Test on localhost with local backend/frontend
2. **Testnet** - Test on Base Sepolia testnet with fake USDC
3. **Mainnet** - Test on Base mainnet with real USDC (CAUTION: Real money!)

### Testing Prerequisites

- ✅ MetaMask or compatible wallet installed
- ✅ Base network configured in wallet
- ✅ Test USDC for testnet testing
- ✅ Real USDC for mainnet testing
- ✅ Sufficient ETH for gas fees
- ✅ Resume PDF file for testing

## 🔧 Local Development Testing

### Step 1: Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
[2026-05-10T...] [INFO] [ENV] Environment variables loaded
✅ Environment variables validated successfully
✅ b402 SDK initialized successfully
🚀 ResumePay backend running on port 3001
📦 Environment: development
⛓️  Base chain ID: 8453
🔗 Base RPC: https://mainnet.base.org
🌐 CORS Origin: http://localhost:3000
```

### Step 2: Start Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
- Environments: .env.local
✓ Starting...
✓ Ready in 2.5s
```

### Step 3: Test Backend Health Check

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-05-10T...",
  "environment": "development",
  "chainId": 8453,
  "version": "1.0.0"
}
```

### Step 4: Test Frontend

1. Open browser to `http://localhost:3000`
2. Check page loads without errors
3. Open browser console (F12)
4. Verify no console errors

## 💼 Wallet Testing Instructions

### Step 1: Configure MetaMask for Base Network

#### Base Mainnet Configuration

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network" → "Add a network manually"
4. Enter:

**Network Name:** Base
**New RPC URL:** `https://mainnet.base.org`
**Chain ID:** `8453`
**Currency Symbol:** ETH
**Block Explorer URL:** `https://basescan.org`

5. Click "Save"
6. Switch to Base network

#### Base Sepolia Testnet Configuration

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network" → "Add a network manually"
4. Enter:

**Network Name:** Base Sepolia
**New RPC URL:** `https://sepolia.base.org`
**Chain ID:** `8453`
**Currency Symbol:** ETH
**Block Explorer URL:** `https://sepolia.basescan.org`

5. Click "Save"
6. Switch to Base Sepolia network

### Step 2: Get Test USDC (Testnet Only)

#### Option A: Base Sepolia Faucet

1. Go to Base Sepolia faucet: https://faucet.quicknode.com/base/sepolia
2. Enter your wallet address
3. Complete verification (if required)
4. Receive test ETH

#### Option B: Swap on Testnet DEX

1. Go to Uniswap on Base Sepolia
2. Connect your wallet
3. Swap test ETH for test USDC
4. Receive test USDC

### Step 3: Get Real USDC (Mainnet Only)

#### Option A: Bridge from Ethereum

1. Go to Base bridge: https://bridge.base.org
2. Connect your wallet
3. Select "Ethereum" → "Base"
4. Select USDC
5. Enter amount to bridge
6. Approve transaction
7. Wait for bridge (~10-15 minutes)

#### Option B: Swap on Base DEX

1. Go to Uniswap on Base
2. Connect your wallet
3. Swap ETH for USDC
4. Receive USDC

### Step 4: Check Wallet Balance

#### In MetaMask

1. Open MetaMask
2. Switch to Base network
3. Check ETH balance (for gas fees)
4. Add USDC token if not showing:
   - Click "Import tokens"
   - Token contract address: `0x833589fCD6eDb6E08f4c7C32D4f71b54bA029040`
   - Token symbol: USDC
   - Token decimal: 6
5. Check USDC balance

#### On BaseScan

1. Go to BaseScan: https://basescan.org
2. Enter your wallet address
3. Check USDC balance
4. Check transaction history

## 🎯 Complete Payment Flow Testing

### Test 1: Upload Resume

1. Open ResumePay application
2. Click "Upload Your Resume"
3. Drag and drop a PDF file
4. Click "Upload & Continue to Payment"
5. Verify file uploads successfully
6. Verify you're redirected to payment page

### Test 2: Connect Wallet

#### MetaMask Connection

1. Click "Connect Wallet" button
2. Select MetaMask from wallet options
3. Approve connection in MetaMask
4. Verify wallet address displays correctly
5. Verify wallet balance displays

#### Coinbase Wallet Connection

1. Click "Connect Wallet" button
2. Select Coinbase Wallet from wallet options
3. Scan QR code with Coinbase Wallet app
4. Approve connection
5. Verify wallet address displays correctly

#### WalletConnect Connection

1. Click "Connect Wallet" button
2. Select WalletConnect from wallet options
3. Scan QR code with mobile wallet
4. Approve connection
5. Verify wallet address displays correctly

### Test 3: Switch to Base Network

1. If wallet is not on Base, you'll see "Switch to Base Network" button
2. Click "Switch to Base Network"
3. Approve network switch in wallet
4. Verify network switches to Base (ID: 8453)
5. Verify wallet balance updates

### Test 4: Make Payment (Testnet)

⚠️ **Use testnet for initial testing!**

1. Ensure wallet is on Base Sepolia
2. Ensure wallet has test USDC
3. Click "Pay 5 USDC" button
4. MetaMask will open with transaction details
5. Verify:
   - Recipient address is correct
   - Amount is 5 USDC
   - Network is Base Sepolia
6. Click "Confirm" in MetaMask
7. Wait for transaction to be mined (~10-30 seconds)
8. Verify transaction hash displays
9. Click "View Transaction on BaseScan"
10. Verify transaction on BaseScan Sepolia

### Test 5: Make Payment (Mainnet)

⚠️ **WARNING: Real money will be used!**

1. Ensure wallet is on Base mainnet
2. Ensure wallet has sufficient USDC
3. Ensure wallet has ETH for gas fees (~$0.01)
4. Click "Pay 5 USDC" button
5. MetaMask will open with transaction details
6. Verify:
   - Recipient address is correct
   - Amount is 5 USDC
   - Network is Base mainnet
7. Click "Confirm" in MetaMask
8. Wait for transaction to be mined (~10-30 seconds)
9. Verify transaction hash displays
10. Click "View Transaction on BaseScan"
11. Verify transaction on BaseScan mainnet

### Test 6: Payment Verification

1. After payment, wait for backend verification
2. Verify "Payment Verified" message appears
3. Verify transaction details are displayed:
   - Transaction hash
   - Wallet address
   - Recipient address
   - Amount
   - Status: confirmed
   - Block number
   - Timestamp

### Test 7: AI Review Generation

1. Wait for AI review to generate (~10-30 seconds)
2. Verify review appears with:
   - ATS Score (0-100)
   - Keyword Score (0-100)
   - Grammar Score (0-100)
   - Formatting Score (0-100)
   - Role Fit Score (0-100)
   - Strengths
   - Weaknesses
   - Suggestions
   - Recruiter Perspective

### Test 8: PDF Report Download

1. Click "Download PDF Report"
2. Verify PDF downloads successfully
3. Open PDF file
4. Verify content is correct
5. Verify formatting is correct

## 🔍 BaseScan Verification Steps

### Step 1: Find Transaction on BaseScan

#### Via Application Link

1. After payment, click "View Transaction on BaseScan"
2. BaseScan will open in new tab
3. Transaction details will be displayed

#### Via Manual Search

1. Go to BaseScan: https://basescan.org
2. Enter transaction hash (from application)
3. Click search
4. Transaction details will be displayed

### Step 2: Verify Transaction Details

#### Check Transaction Status

- **Success**: Transaction completed successfully
- **Pending**: Transaction still processing
- **Failed**: Transaction failed (retry payment)

#### Check Transaction Details

1. **From**: Your wallet address
2. **To**: USDC contract address (`0x833589fCD6eDb6E08f4c7C32D4f71b54bA029040`)
3. **Value**: 0 ETH (for USDC transfer)
4. **Gas Used**: Amount of gas used
5. **Gas Price**: Gas price in Gwei
6. **Transaction Fee**: Total gas fee in ETH

#### Check Internal Transactions

1. Scroll down to "Internal Transactions"
2. Verify USDC transfer to recipient address
3. Verify amount is correct (5 USDC)

#### Check Event Logs

1. Scroll down to "Logs"
2. Find "Transfer" event
3. Verify:
   - From: Your wallet address
   - To: Recipient address
   - Value: 5000000 (5 USDC with 6 decimals)

### Step 3: Verify on Backend

1. Check backend logs for verification
2. Verify transaction hash matches
3. Verify verification succeeded
4. Check database for payment record (if using database)

## 🐛 Common Testing Issues

### Issue: Wallet Won't Connect

**Symptoms:**
- Clicking "Connect Wallet" does nothing
- Wallet connection fails

**Solutions:**
1. Ensure wallet is unlocked
2. Ensure wallet supports Base network
3. Try refreshing the page
4. Try different wallet (MetaMask, Coinbase, WalletConnect)
5. Check browser console for errors

### Issue: Network Switch Fails

**Symptoms:**
- "Switch to Base Network" button appears
- Clicking button does nothing
- Network switch fails in wallet

**Solutions:**
1. Manually add Base network to wallet
2. Manually switch to Base network in wallet
3. Refresh page after manual switch
4. Check wallet is not locked

### Issue: Transaction Fails

**Symptoms:**
- Transaction fails in wallet
- Transaction status is "Failed" on BaseScan

**Solutions:**
1. Check wallet has sufficient USDC balance
2. Check wallet has sufficient ETH for gas fees
3. Try increasing gas limit in wallet
4. Check recipient address is correct
5. Try transaction again

### Issue: Payment Verification Fails

**Symptoms:**
- Transaction succeeds on BaseScan
- Backend verification fails
- "Payment verification failed" error

**Solutions:**
1. Check backend logs for error details
2. Verify recipient address matches
3. Verify amount matches
4. Check Base RPC URL is accessible
5. Verify transaction is on correct network (Base)

### Issue: AI Review Fails

**Symptoms:**
- Payment succeeds
- AI review generation fails
- Error message displayed

**Solutions:**
1. Check backend logs for error details
2. Verify OpenAI API key is valid
3. Check OpenAI API credits
4. Check resume PDF is valid
5. Try with different resume

### Issue: PDF Download Fails

**Symptoms:**
- Clicking "Download PDF" does nothing
- PDF download fails

**Solutions:**
1. Check browser download settings
2. Check browser console for errors
3. Try different browser
4. Check backend logs for PDF generation errors

## 📊 Testing Checklist

### Pre-Testing

- [ ] Backend is running (`npm run dev` in backend)
- [ ] Frontend is running (`npm run dev` in frontend)
- [ ] Wallet is installed and configured
- [ ] Base network is added to wallet
- [ ] Wallet has sufficient ETH for gas fees
- [ ] Wallet has sufficient USDC for payment
- [ ] Test resume PDF is ready

### Testnet Testing

- [ ] Wallet is on Base Sepolia
- [ ] Wallet has test USDC
- [ ] Resume upload works
- [ ] Wallet connection works
- [ ] Network switch works
- [ ] Payment succeeds
- [ ] Transaction appears on BaseScan Sepolia
- [ ] Payment verification succeeds
- [ ] AI review generates
- [ ] PDF download works

### Mainnet Testing

- [ ] Wallet is on Base mainnet
- [ ] Wallet has real USDC
- [ ] Resume upload works
- [ ] Wallet connection works
- [ ] Network switch works
- [ ] Payment succeeds
- [ ] Transaction appears on BaseScan mainnet
- [ ] Payment verification succeeds
- [ ] AI review generates
- [ ] PDF download works

## 🎯 Success Criteria

### Local Development

- ✅ Backend starts without errors
- ✅ Frontend starts without errors
- ✅ Health check returns 200
- ✅ No console errors in browser

### Testnet

- ✅ Complete payment flow works
- ✅ Transaction verified on BaseScan Sepolia
- ✅ AI review generates successfully
- ✅ PDF downloads successfully

### Mainnet

- ✅ Complete payment flow works
- ✅ Transaction verified on BaseScan mainnet
- ✅ AI review generates successfully
- ✅ PDF downloads successfully
- ✅ Real USDC transferred correctly

## 📝 Test Report Template

```markdown
# Test Report

**Date:** [DATE]
**Tester:** [NAME]
**Environment:** [Local/Testnet/Mainnet]

### Test Results

| Test | Status | Notes |
|------|--------|-------|
| Backend startup | ✅/❌ | [Notes] |
| Frontend startup | ✅/❌ | [Notes] |
| Wallet connection | ✅/❌ | [Notes] |
| Network switch | ✅/❌ | [Notes] |
| Payment submission | ✅/❌ | [Notes] |
| Transaction verification | ✅/❌ | [Notes] |
| BaseScan verification | ✅/❌ | [Notes] |
| AI review generation | ✅/❌ | [Notes] |
| PDF download | ✅/❌ | [Notes] |

### Issues Found

1. [Issue 1]
2. [Issue 2]

### Recommendations

1. [Recommendation 1]
2. [Recommendation 2]
```

---

**Follow this guide to thoroughly test ResumePay AI before production deployment.**
