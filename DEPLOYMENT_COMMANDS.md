# ResumePay AI - Deployment Commands & Steps

Complete reference of all deployment commands and step-by-step instructions for ResumePay AI.

## 🚀 Quick Deployment Commands

### Local Development

```bash
# Start both frontend and backend
npm run dev

# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm run dev

# Build for production
cd backend && npm run build
cd frontend && npm run build

# Start production servers
cd backend && npm start
cd frontend && npm start
```

### Vercel Deployment (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_CHAIN_ID
vercel env add NEXT_PUBLIC_BASESCAN_URL
vercel env add NEXT_PUBLIC_PAYMENT_AMOUNT_USDC
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
vercel env add NEXT_PUBLIC_RECIPIENT_ADDRESS
```

### Railway Deployment (Backend)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
railway init

# Deploy to Railway
railway up

# Set environment variables
railway variables set PORT=3001
railway variables set NODE_ENV=production
railway variables set CHAIN_ID=8453
railway variables set BASE_RPC_URL=https://mainnet.base.org
railway variables set WORKER_PRIVATE_KEY=your_private_key
railway variables set RECIPIENT_ADDRESS=your_wallet_address
railway variables set OPENAI_API_KEY=your_openai_key
railway variables set CORS_ORIGIN=https://your-frontend.vercel.app
```

### Render Deployment (Backend)

```bash
# Deploy to Render (via git)
git push origin main

# Render automatically detects render.yaml
# No CLI needed for basic deployment
```

## 📋 Step-by-Step Deployment Guide

### Phase 1: Pre-Deployment Setup

#### Step 1.1: Clone Repository

```bash
git clone https://github.com/parthshinge/ResumePay.git
cd ResumePay
```

#### Step 1.2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

#### Step 1.3: Configure Environment Variables

```bash
# Backend environment setup
cd backend
cp .env.example .env
# Edit .env with your actual values

# Frontend environment setup
cd ../frontend
cp .env.example .env.local
# Edit .env.local with your actual values
```

#### Step 1.4: Test Locally

```bash
# Start backend (terminal 1)
cd backend
npm run dev

# Start frontend (terminal 2)
cd frontend
npm run dev

# Test at http://localhost:3000
```

### Phase 2: Backend Deployment (Railway)

#### Step 2.1: Create Railway Account

1. Go to https://railway.app/
2. Sign up with GitHub
3. Verify email

#### Step 2.2: Connect Repository

```bash
# Login to Railway
railway login

# Initialize project
railway init

# Select your ResumePay repository
```

#### Step 2.3: Configure Backend Service

```bash
# Set build command
railway variables set BUILD_COMMAND="cd backend && npm install && npm run build"

# Set start command
railway variables set START_COMMAND="cd backend && npm start"

# Set port
railway variables set PORT=3001
```

#### Step 2.4: Set Environment Variables

```bash
# Required variables
railway variables set NODE_ENV=production
railway variables set CHAIN_ID=8453
railway variables set BASE_RPC_URL=https://mainnet.base.org
railway variables set BASESCAN_API_KEY=your_basescan_api_key
railway variables set WORKER_PRIVATE_KEY=your_worker_private_key
railway variables set FACILITATOR_URL=https://facilitator.b402.ai
railway variables set BACKEND_API_URL=https://api.b402.ai
railway variables set PAYMENT_AMOUNT_USDC=5
railway variables set RECIPIENT_ADDRESS=your_recipient_address
railway variables set OPENAI_API_KEY=your_openai_api_key
railway variables set CORS_ORIGIN=https://your-frontend.vercel.app

# Optional variables
railway variables set DATABASE_URL=postgresql://...
railway variables set REDIS_URL=redis://...
railway variables set MAX_FILE_SIZE=5242880
railway variables set UPLOAD_DIR=/tmp/uploads
```

#### Step 2.5: Deploy Backend

```bash
# Deploy to Railway
railway up

# Wait for deployment (~2-3 minutes)
# Railway will provide a public URL
# Copy this URL for frontend configuration
```

#### Step 2.6: Verify Backend Deployment

```bash
# Test health check
curl https://your-backend-url.railway.app/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2024-05-10T...",
#   "environment": "production",
#   "chainId": 8453,
#   "version": "1.0.0"
# }

# Test API health check
curl https://your-backend-url.railway.app/api/health
```

### Phase 3: Backend Deployment (Render) - Alternative

#### Step 3.1: Create Render Account

1. Go to https://render.com/
2. Sign up with GitHub
3. Verify email

#### Step 3.2: Connect Repository

1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect GitHub account
4. Select ResumePay repository

#### Step 3.3: Configure Service

**Name:** `resumepay-backend`

**Build Command:**
```bash
cd backend && npm install && npm run build
```

**Start Command:**
```bash
cd backend && npm start
```

#### Step 3.4: Set Environment Variables

In Render dashboard, add:

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
RECIPIENT_ADDRESS=your_recipient_address
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGIN=https://your-frontend.vercel.app
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
MAX_FILE_SIZE=5242880
UPLOAD_DIR=/tmp/uploads
```

#### Step 3.5: Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment (~2-3 minutes)
3. Copy the public URL for frontend configuration

#### Step 3.6: Verify Backend Deployment

```bash
# Test health check
curl https://your-backend-url.onrender.com/health

# Test API health check
curl https://your-backend-url.onrender.com/api/health
```

### Phase 4: Frontend Deployment (Vercel)

#### Step 4.1: Create Vercel Account

1. Go to https://vercel.com/
2. Sign up with GitHub
3. Verify email

#### Step 4.2: Connect Repository

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel
```

#### Step 4.3: Configure Frontend Project

**Framework:** Next.js

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

#### Step 4.4: Set Environment Variables

```bash
# Set environment variables in Vercel dashboard
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-backend-url.railway.app

vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 8453

vercel env add NEXT_PUBLIC_BASESCAN_URL production
# Enter: https://basescan.org

vercel env add NEXT_PUBLIC_PAYMENT_AMOUNT_USDC production
# Enter: 5

vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production
# Enter: your_walletconnect_project_id

vercel env add NEXT_PUBLIC_RECIPIENT_ADDRESS production
# Enter: your_recipient_address
```

#### Step 4.5: Deploy Frontend

```bash
# Deploy to production
vercel --prod

# Wait for deployment (~1-2 minutes)
# Vercel will provide a URL
```

#### Step 4.6: Update Backend CORS

Go back to Railway/Render and update CORS_ORIGIN:

```bash
# On Railway
railway variables set CORS_ORIGIN=https://your-frontend.vercel.app

# On Render (in dashboard)
# Update CORS_ORIGIN variable
# Redeploy to apply changes
```

### Phase 5: Post-Deployment Verification

#### Step 5.1: Verify Frontend

1. Open your Vercel URL
2. Check page loads without errors
3. Open browser console (F12)
4. Check for any errors
5. Test wallet connection

#### Step 5.2: Verify Backend-Frontend Connection

```bash
# Test API from frontend
# Open browser console and run:
fetch('https://your-backend-url.railway.app/health')
  .then(r => r.json())
  .then(console.log)
```

#### Step 5.3: Test Complete Flow

1. Upload a resume
2. Connect wallet
3. Make test payment (use testnet first!)
4. Verify transaction on BaseScan
5. Get AI review
6. Download PDF report

#### Step 5.4: Monitor Logs

**Railway:**
- Go to Railway project
- Click "Logs" tab
- Monitor for errors

**Render:**
- Go to Render service
- Click "Logs" tab
- Monitor for errors

**Vercel:**
- Go to Vercel project
- Click "Logs" tab
- Monitor for errors

## 🔄 CI/CD Automation (Optional)

### GitHub Actions for Automatic Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy ResumePay

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 🔧 Troubleshooting Commands

### Backend Issues

```bash
# Check backend logs
railway logs
# Or in Render dashboard

# Restart backend
railway restart

# Rebuild backend
railway up

# Check environment variables
railway variables
```

### Frontend Issues

```bash
# Redeploy frontend
vercel --prod

# Check deployment logs
vercel logs

# Clear build cache
vercel build --force
```

### Database Issues

```bash
# Reset database (Railway)
railway variables unset DATABASE_URL
railway variables set DATABASE_URL=postgresql://...

# Reset database (Render)
# Update DATABASE_URL in dashboard
# Redeploy service
```

## 📊 Monitoring Commands

### Health Checks

```bash
# Backend health
curl https://your-backend-url/health

# API health
curl https://your-backend-url/api/health

# Frontend health
curl https://your-frontend-url/
```

### Performance Monitoring

```bash
# Check response time
time curl https://your-backend-url/health

# Check with verbose output
curl -v https://your-backend-url/health
```

## 🔐 Security Commands

### Rotate Secrets

```bash
# Rotate private key
railway variables set WORKER_PRIVATE_KEY=new_private_key

# Rotate API key
railway variables set OPENAI_API_KEY=new_api_key

# Redeploy to apply
railway up
```

### Backup Database

```bash
# Export database (Railway)
railway db:dump > backup.sql

# Import database
railway db:import < backup.sql
```

## 🚀 Rollback Commands

### Rollback Backend

```bash
# Railway
railway rollback

# Render
# Go to dashboard → Deployments
# Click previous deployment → Redeploy
```

### Rollback Frontend

```bash
# Vercel
vercel rollback

# Or go to Vercel dashboard
# Click Deployments
# Select previous deployment
# Click Redeploy
```

## 📝 Maintenance Commands

### Update Dependencies

```bash
# Update all dependencies
npm update

# Update specific dependency
npm update package-name

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Clean Build Artifacts

```bash
# Clean backend
cd backend
rm -rf dist
npm run build

# Clean frontend
cd frontend
rm -rf .next
npm run build
```

## 🎯 Quick Reference

### Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development servers |
| `npm run build` | Build for production |
| `vercel --prod` | Deploy to Vercel production |
| `railway up` | Deploy to Railway |
| `railway logs` | View Railway logs |
| `vercel logs` | View Vercel logs |
| `railway variables` | List Railway env vars |
| `vercel env ls` | List Vercel env vars |

### URLs After Deployment

| Service | Example URL |
|---------|-------------|
| Frontend (Vercel) | `https://resumepay.vercel.app` |
| Backend (Railway) | `https://resumepay-backend.railway.app` |
| Backend (Render) | `https://resumepay-backend.onrender.com` |
| BaseScan | `https://basescan.org` |

---

**Use this reference for all deployment-related commands and steps.**
