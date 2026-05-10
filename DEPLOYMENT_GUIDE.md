# ResumePay AI - Deployment Guide

Complete guide for deploying ResumePay AI to production environments.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Completed environment setup (see `ENVIRONMENT_SETUP.md`)
- ✅ Filled in all required environment variables
- ✅ Tested the application locally with `npm run dev`
- ✅ Created accounts on deployment platforms (Vercel, Railway, or Render)
- ✅ Obtained necessary API keys (BaseScan, OpenAI, WalletConnect)
- ✅ Configured MetaMask wallet with Base network
- ✅ Funded your wallet with USDC on Base for testing

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Vercel (Frontend)   │
│   Next.js 14     │
│   Port: 3000    │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│  Railway/Render (Backend) │
│  Express        │
│  Port: 3001     │
└─────────────────┘
         │
         │
    Base Chain
    (USDC Payments)
```

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

**Recommended for:**
- Production deployments
- Teams with separate frontend/backend teams
- Projects requiring custom backend infrastructure

---

### Option 2: Vercel (Frontend) + Render (Backend)

**Recommended for:**
- Production deployments
- Projects requiring Render's features
- Teams familiar with Render platform

---

### Option 3: Vercel Serverless (Both Frontend + Backend)

**Recommended for:**
- Small-scale projects
- Serverless architecture preference
- Simpler deployment pipeline

---

## 📦 Part 1: Backend Deployment (Railway)

### Step 1: Prepare Railway Account

1. Go to [Railway.app](https://railway.app/)
2. Sign up or log in
3. Click "New Project" → "Deploy from GitHub repo"

### Step 2: Connect GitHub Repository

1. Search for your ResumePay repository
2. Click "Install & Authorize"
3. Select the repository
4. Click "Import"

### Step 3: Configure Backend Service

Railway will automatically detect the Node.js project. Configure it:

**Build Command:**
```bash
cd backend && npm install && npm run build
```

**Start Command:**
```bash
cd backend && npm start
```

### Step 4: Set Environment Variables

Go to the "Variables" tab in your Railway project and add:

```env
PORT=3001
NODE_ENV=production
CHAIN_ID=8453
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
WORKER_PRIVATE_KEY=your_worker_private_key
FACILITATOR_URL=https://facilitator.b402.ai
BACKEND_API_URL=https://api.b402.ai
PAYMENT_AMOUNT_USDC=5
RECIPIENT_ADDRESS=your_recipient_wallet_address
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://... (optional)
REDIS_URL=redis://... (optional)
MAX_FILE_SIZE=5242880
UPLOAD_DIR=/tmp/uploads
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Step 5: Deploy Backend

1. Click "Deploy" button
2. Wait for deployment to complete (~2-3 minutes)
3. Railway will provide a public URL (e.g., `https://resumepay-backend.railway.app`)
4. Copy this URL for frontend configuration

### Step 6: Verify Backend Deployment

```bash
curl https://your-backend-url.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-05-10T...",
  "environment": "production",
  "chainId": 8453,
  "version": "1.0.0"
}
```

---

## 📦 Part 2: Backend Deployment (Render)

### Step 1: Prepare Render Account

1. Go to [Render.com](https://render.com/)
2. Sign up or log in
3. Click "New" → "Web Service"

### Step 2: Connect GitHub Repository

1. Connect your GitHub account
2. Select the ResumePay repository
3. Click "Connect"

### Step 3: Configure Backend Service

**Name:** `resumepay-backend`

**Build Command:**
```bash
cd backend && npm install && npm run build
```

**Start Command:**
```bash
cd backend && npm start
```

**Instance Type:** `Free` (for testing) or `Starter` ($7/month for production)

### Step 4: Set Environment Variables

Scroll to "Environment" section and add the same variables as Railway:

```env
PORT=3001
NODE_ENV=production
CHAIN_ID=8453
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
WORKER_PRIVATE_KEY=your_worker_private_key
FACILITATOR_URL=https://facilitator.b402.ai
BACKEND_API_URL=https://api.b402.ai
PAYMENT_AMOUNT_USDC=5
RECIPIENT_ADDRESS=your_recipient_wallet_address
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://... (optional)
REDIS_URL=redis://... (optional)
MAX_FILE_SIZE=5242880
UPLOAD_DIR=/tmp/uploads
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Step 5: Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment to complete (~2-3 minutes)
3. Render will provide a public URL (e.g., `https://resumepay-backend.onrender.com`)
4. Copy this URL for frontend configuration

### Step 6: Verify Backend Deployment

```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-05-10T...",
  "environment": "production",
  "chainId": 8453,
  "version": "1.0.0"
}
```

---

## 📦 Part 3: Frontend Deployment (Vercel)

### Step 1: Prepare Vercel Account

1. Go to [Vercel.com](https://vercel.com/)
2. Sign up or log in
3. Click "Add New" → "Project"

### Step 2: Import Frontend

1. Connect your GitHub account
2. Select the ResumePay repository
3. Vercel will detect the Next.js frontend
4. Click "Import"

### Step 3: Configure Frontend Project

**Framework Preset:** Next.js

**Root Directory:** `frontend`

**Build Command:**
```bash
npm run build
```

**Output Directory:** `.next`

**Install Command:**
```bash
npm install
```

### Step 4: Set Environment Variables

Go to "Environment Variables" section and add:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_BASESCAN_URL=https://basescan.org
NEXT_PUBLIC_PAYMENT_AMOUNT_USDC=5
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_RECIPIENT_ADDRESS=your_recipient_wallet_address
```

**Important:** Replace `NEXT_PUBLIC_API_URL` with your actual backend URL from Railway or Render.

### Step 5: Deploy Frontend

1. Click "Deploy"
2. Wait for deployment to complete (~1-2 minutes)
3. Vercel will provide a URL (e.g., `https://resumepay.vercel.app`)
4. Click the URL to test the live application

### Step 6: Update Backend CORS

Go back to Railway/Render and update the `CORS_ORIGIN` variable:

```env
CORS_ORIGIN=https://resumepay.vercel.app
```

Redeploy the backend to apply changes.

---

## 🔧 Part 4: Vercel Serverless Deployment (Both Frontend + Backend)

### Step 1: Create Serverless Function

Create `frontend/api/payment/verify/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/transactionVerifier';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { txHash, walletAddress, amount, resumeId } = body;

  // Verify transaction on Base
  const verification = await verifyTransaction(
    txHash,
    process.env.RECIPIENT_ADDRESS!,
    amount,
    process.env.BASE_RPC_URL!
  );

  return NextResponse.json({
    success: verification.verified,
    payment: verification,
  });
}
```

### Step 2: Update Environment Variables

Add backend-specific variables to Vercel:

```env
# Frontend variables
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_BASESCAN_URL=https://basescan.org
NEXT_PUBLIC_PAYMENT_AMOUNT_USDC=5

# Backend variables (server-side only)
BASE_RPC_URL=https://mainnet.base.org
RECIPIENT_ADDRESS=your_wallet_address
WORKER_PRIVATE_KEY=your_worker_private_key
OPENAI_API_KEY=your_openai_api_key
```

### Step 3: Deploy

1. Push changes to GitHub
2. Vercel will automatically deploy
3. Test the complete flow

---

## ✅ Part 5: Verification & Testing

### Test Backend Health Check

```bash
curl https://your-backend-url/health
curl https://your-backend-url/api/health
```

### Test Frontend

1. Open your Vercel URL
2. Try uploading a resume
3. Connect wallet
4. Test payment flow (use testnet first!)

### Test Payment Flow (Testnet)

1. Switch MetaMask to Base Sepolia testnet
2. Get test USDC from faucet
3. Upload resume
4. Connect wallet
5. Make test payment
6. Verify on BaseScan Sepolia

### Test Payment Flow (Mainnet)

⚠️ **WARNING: Real money will be used!**

1. Switch MetaMask to Base mainnet
2. Ensure you have sufficient USDC
3. Upload resume
4. Connect wallet
5. Make real payment
6. Verify on BaseScan mainnet

---

## 🔄 Part 6: CI/CD Automation

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy ResumePay

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up --service=resumepay-backend
```

---

## 📊 Part 7: Monitoring & Logging

### Railway Monitoring

1. Go to Railway project
2. Click "Metrics" tab
3. Monitor:
   - CPU usage
   - Memory usage
   - Request rate
   - Error rate
   - Response time

### Render Monitoring

1. Go to Render service
2. Click "Metrics" tab
3. Monitor:
   - Response time
   - Error rate
   - Request count
   - CPU usage
   - Memory usage

### Vercel Analytics

1. Go to Vercel project
2. Click "Analytics" tab
3. Monitor:
   - Page views
   - Web Vitals
   - Requests
   - Errors

### Custom Logging

The backend includes comprehensive logging:
- Environment loading logs
- Payment verification logs
- Transaction logs
- b402 SDK logs
- Wallet connection logs

View logs in Railway/Render dashboards.

---

## 🔒 Part 8: Security Checklist

### Before Going Live

- [ ] All environment variables are set in production
- [ ] Private keys are not committed to git
- [ ] CORS is configured correctly
- [ ] HTTPS is enabled on all endpoints
- [ ] Rate limiting is configured
- [ ] Database connections use SSL
- [ ] API keys are rotated regularly
- [ ] Error messages don't expose sensitive data
- [ ] File upload size limits are enforced
- [ ] Input validation is in place
- [ ] Dependencies are up to date
- [ ] Security headers are configured

---

## 🚨 Part 9: Rollback Procedure

### If Deployment Fails

**Frontend (Vercel):**
1. Go to Vercel project
2. Click "Deployments"
3. Find previous successful deployment
4. Click "..." → "Redeploy"

**Backend (Railway):**
1. Go to Railway project
2. Click "Deployments"
3. Find previous successful deployment
4. Click "..." → "Redeploy"

**Backend (Render):**
1. Go to Render service
2. Click "Deployments"
3. Find previous successful deployment
4. Click "Redeploy"

---

## 📞 Part 10: Troubleshooting

### Common Issues

**Issue: CORS errors**
- Solution: Update `CORS_ORIGIN` in backend to match frontend URL

**Issue: Environment variables not loading**
- Solution: Verify variables are set in deployment platform dashboard

**Issue: b402 SDK not initializing**
- Solution: Check `WORKER_PRIVATE_KEY` is valid and starts with `0x`

**Issue: Payment verification failing**
- Solution: Check BaseScan for transaction details, verify recipient address

**Issue: Frontend can't connect to backend**
- Solution: Verify `NEXT_PUBLIC_API_URL` is correct and backend is running

---

## 🎯 Part 11: Post-Deployment Tasks

### 1. Set Up Domain (Optional)

**Vercel:**
1. Go to project Settings → Domains
2. Add custom domain
3. Configure DNS records

**Railway:**
1. Go to project Settings → Domains
2. Add custom domain
3. Configure DNS records

### 2. Set Up SSL Certificates

Both Vercel and Railway provide automatic SSL certificates.

### 3. Configure CDN (Optional)

Vercel provides automatic CDN with edge network.

### 4. Set Up Monitoring Alerts

Configure alerts for:
- High error rates
- Slow response times
- High CPU/memory usage
- Failed deployments

### 5. Back Up Database

If using PostgreSQL:
- Enable automatic backups in Railway/Render
- Set up regular export schedules

---

## 📚 Part 12: Deployment Commands Reference

### Local Development

```bash
# Start both frontend and backend
npm run dev

# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm run dev
```

### Build for Production

```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

### Deploy Commands

```bash
# Deploy to Vercel
vercel --prod

# Deploy to Railway
railway up

# Deploy to Render (automatic on git push)
git push origin main
```

---

## 🎉 Part 13: Success Criteria

Your deployment is successful when:

- ✅ Backend health check returns `{"status": "ok"}`
- ✅ Frontend loads without errors
- ✅ Wallet connection works
- ✅ File upload works
- ✅ Payment flow completes
- ✅ Transaction appears on BaseScan
- ✅ Resume review generates
- ✅ PDF report downloads
- ✅ No CORS errors in console
- ✅ No environment errors in logs

---

## 📞 Support

If you encounter issues:

1. Check logs in Railway/Render/Vercel dashboards
2. Review `ENVIRONMENT_SETUP.md` for environment configuration
3. Review `TROUBLESHOOTING.md` for common issues
4. Check BaseScan for transaction details
5. Verify wallet is on correct network

---

**Your ResumePay AI application is now deployed and ready for production use!** 🚀
