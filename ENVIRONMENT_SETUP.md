# Environment Configuration Setup Guide

Complete guide for setting up environment variables for ResumePay AI production deployment.

## 📋 Overview

ResumePay AI uses a comprehensive environment configuration system with:
- **Backend**: TypeScript-safe environment validation
- **Frontend**: Client-side environment validation
- **Multi-environment support**: Development, Production, Test
- **Deployment configs**: Vercel, Railway, Render

## 🔐 Security Best Practices

### Critical Security Rules

1. **NEVER commit `.env` files to git** - They are in `.gitignore`
2. **NEVER share private keys** - Keep them in environment variables only
3. **NEVER use production keys in development** - Use separate keys for each environment
4. **ALWAYS validate environment variables** - Automatic validation on startup
5. **USE strong secrets** - Generate random, secure values

### Files in .gitignore

**Backend `.gitignore`:**
- `.env` (contains sensitive secrets)
- `uploads/` (user uploaded files)
- `*.log` (log files)

**Frontend `.gitignore`:**
- `.env.local` (contains sensitive secrets)
- `.env.development.local`
- `.env.test.local`
- `.env.production.local`

## 🚀 Quick Setup

### 1. Backend Environment Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Base Chain Configuration
CHAIN_ID=8453
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key_here

# b402 SDK Configuration
WORKER_PRIVATE_KEY=YOUR_METAMASK_PRIVATE_KEY
FACILITATOR_URL=https://facilitator.b402.ai
BACKEND_API_URL=https://api.b402.ai

# Payment Configuration
PAYMENT_AMOUNT_USDC=5
RECIPIENT_ADDRESS=YOUR_BASE_WALLET_ADDRESS

# OpenAI Configuration
OPENAI_API_KEY=YOUR_OPENAI_API_KEY

# Database Configuration (Optional)
DATABASE_URL=

# Redis Configuration (Optional)
REDIS_URL=

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 2. Frontend Environment Setup

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Base Chain Configuration
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_BASESCAN_URL=https://basescan.org

# Payment Configuration
NEXT_PUBLIC_PAYMENT_AMOUNT_USDC=5

# WalletConnect Project ID (optional, for production)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# Recipient Address (where payments are sent)
NEXT_PUBLIC_RECIPIENT_ADDRESS=
```

## 📝 Environment Variables Reference

### Backend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | Yes | Server port | `3001` |
| `NODE_ENV` | Yes | Environment mode | `development` / `production` / `test` |
| `CHAIN_ID` | Yes | Base chain ID | `8453` |
| `BASE_RPC_URL` | Yes | Base RPC endpoint | `https://mainnet.base.org` |
| `BASESCAN_API_KEY` | No | BaseScan API key | `your_api_key` |
| `WORKER_PRIVATE_KEY` | Yes | Worker wallet private key | `0x...` (66 chars) |
| `FACILITATOR_URL` | Yes | b402 facilitator URL | `https://facilitator.b402.ai` |
| `BACKEND_API_URL` | Yes | b402 backend API URL | `https://api.b402.ai` |
| `PAYMENT_AMOUNT_USDC` | Yes | Payment amount in USDC | `5` |
| `RECIPIENT_ADDRESS` | Yes | Recipient wallet address | `0x...` (42 chars) |
| `OPENAI_API_KEY` | Yes | OpenAI API key | `sk-...` |
| `DATABASE_URL` | No | PostgreSQL connection string | `postgresql://...` |
| `REDIS_URL` | No | Redis connection string | `redis://...` |
| `MAX_FILE_SIZE` | Yes | Max file upload size (bytes) | `5242880` |
| `UPLOAD_DIR` | Yes | Upload directory path | `./uploads` |
| `CORS_ORIGIN` | Yes | Allowed CORS origin | `http://localhost:3000` |

### Frontend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL | `http://localhost:3001` |
| `NEXT_PUBLIC_CHAIN_ID` | Yes | Base chain ID | `8453` |
| `NEXT_PUBLIC_BASESCAN_URL` | Yes | BaseScan explorer URL | `https://basescan.org` |
| `NEXT_PUBLIC_PAYMENT_AMOUNT_USDC` | Yes | Payment amount in USDC | `5` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | No | WalletConnect project ID | `your_project_id` |
| `NEXT_PUBLIC_RECIPIENT_ADDRESS` | No | Recipient wallet address | `0x...` |

## 🔧 Environment Validation

### Backend Validation

The backend automatically validates all required environment variables on startup:

```typescript
// backend/src/lib/env.ts
validateEnv() // Validates format, required fields, and data types
```

**Validation checks:**
- ✅ All required variables are present
- ✅ PORT is a valid number
- ✅ CHAIN_ID is a valid number
- ✅ BASE_RPC_URL starts with http:// or https://
- ✅ WORKER_PRIVATE_KEY starts with 0x and is 66 characters
- ✅ RECIPIENT_ADDRESS starts with 0x and is 42 characters
- ✅ OPENAI_API_KEY starts with sk-
- ✅ CORS_ORIGIN starts with http:// or https://

**If validation fails:**
- Backend will NOT start
- Error message will show missing/invalid variables
- Process exits with code 1

### Frontend Validation

The frontend validates environment variables on build/start:

```typescript
// frontend/src/lib/env.ts
validateFrontendEnv() // Validates format and required fields
```

**Validation checks:**
- ✅ All required variables are present
- ✅ NEXT_PUBLIC_CHAIN_ID is a valid number
- ✅ NEXT_PUBLIC_BASESCAN_URL starts with http:// or https://
- ✅ NEXT_PUBLIC_API_URL starts with http:// or https://
- ✅ NEXT_PUBLIC_PAYMENT_AMOUNT_USDC is a valid number
- ✅ NEXT_PUBLIC_RECIPIENT_ADDRESS (if set) starts with 0x

**If validation fails:**
- Development: Throws error and stops build
- Production: Logs error but continues (graceful degradation)

## 🌍 Environment-Specific Configurations

### Development Environment

**Backend `.env`:**
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
UPLOAD_DIR=./uploads
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Production Environment

**Backend `.env`:**
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
UPLOAD_DIR=/tmp/uploads
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Test Environment

**Backend `.env`:**
```env
PORT=3001
NODE_ENV=test
CORS_ORIGIN=http://localhost:3000
```

## 🚢 Deployment Environment Setup

### Vercel (Frontend)

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add the following variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_BASESCAN_URL=https://basescan.org
NEXT_PUBLIC_PAYMENT_AMOUNT_USDC=5
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_RECIPIENT_ADDRESS=your_recipient_address
```

3. Redeploy to apply changes

### Railway (Backend)

1. Go to Railway Dashboard → Project → Variables
2. Add the following variables:

```env
PORT=3001
NODE_ENV=production
CHAIN_ID=8453
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
WORKER_PRIVATE_KEY=your_private_key
FACILITATOR_URL=https://facilitator.b402.ai
BACKEND_API_URL=https://api.b402.ai
PAYMENT_AMOUNT_USDC=5
RECIPIENT_ADDRESS=your_recipient_address
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
MAX_FILE_SIZE=5242880
UPLOAD_DIR=/tmp/uploads
CORS_ORIGIN=https://your-frontend-domain.com
```

3. Redeploy to apply changes

### Render (Backend)

1. Go to Render Dashboard → Service → Environment
2. Add the same variables as Railway above
3. Redeploy to apply changes

## 🔑 Getting Required Keys

### 1. MetaMask Private Key

1. Open MetaMask
2. Click account → Account Details → Export Private Key
3. Enter password
4. Copy the private key (starts with `0x`)
5. **IMPORTANT**: Never share this key with anyone!

### 2. OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Add to environment variables

### 3. BaseScan API Key (Optional)

1. Go to https://basescan.org/myapikey
2. Sign up/login
3. Create new API key
4. Add to environment variables

### 4. WalletConnect Project ID (Optional)

1. Go to https://cloud.walletconnect.com/
2. Sign up/login
3. Create new project
4. Copy the Project ID
5. Add to environment variables

### 5. Base Wallet Address

1. Open MetaMask
2. Copy your wallet address (starts with `0x`)
3. Ensure you have Base network configured
4. Add to environment variables

## ✅ Validation Checklist

Before deploying, verify:

- [ ] Backend `.env` file exists and is not in git
- [ ] Frontend `.env.local` file exists and is not in git
- [ ] All required environment variables are set
- [ ] Private key is valid (66 characters, starts with 0x)
- [ ] Recipient address is valid (42 characters, starts with 0x)
- [ ] OpenAI API key is valid (starts with sk-)
- [ ] CORS_ORIGIN matches frontend domain
- [ ] Backend starts without errors: `npm run dev`
- [ ] Frontend starts without errors: `npm run dev`
- [ ] Environment validation passes on startup

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `Missing required environment variables`

**Solution:** Check that all required variables are in `.env` file

**Error:** `Invalid WORKER_PRIVATE_KEY: must be 66 characters`

**Solution:** Ensure private key is exactly 66 characters (including 0x prefix)

**Error:** `Invalid RECIPIENT_ADDRESS: must be 42 characters`

**Solution:** Ensure recipient address is exactly 42 characters (including 0x prefix)

### Frontend Won't Build

**Error:** `Missing required environment variables`

**Solution:** Check that all required variables are in `.env.local` file

**Error:** `Invalid NEXT_PUBLIC_API_URL: must start with http:// or https://`

**Solution:** Ensure API URL includes protocol (http:// or https://)

### CORS Errors

**Error:** `CORS policy error` in browser console

**Solution:** Ensure `CORS_ORIGIN` in backend matches your frontend domain

### b402 SDK Not Initializing

**Error:** `Failed to initialize b402 SDK`

**Solution:** 
- Check `WORKER_PRIVATE_KEY` is valid
- Check `FACILITATOR_URL` and `BACKEND_API_URL` are correct
- Check network connectivity to b402 services

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Express Environment Variables](https://expressjs.com/en/starter/installing.html)
- [b402 SDK Documentation](https://docs.b402.ai)
- [Base Chain Documentation](https://docs.base.org)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Railway Environment Variables](https://docs.railway.app/reference/variables)
- [Render Environment Variables](https://render.com/docs/environment-variables)

## 🔒 Security Reminders

- ✅ **NEVER commit `.env` files to git**
- ✅ **NEVER share private keys**
- ✅ **NEVER use production keys in development**
- ✅ **ALWAYS use environment variables for secrets**
- ✅ **ALWAYS validate environment variables on startup**
- ✅ **ALWAYS rotate compromised keys immediately**
- ✅ **ALWAYS use HTTPS in production**
- ✅ **ALWAYS use separate keys for each environment**

## 🎯 Next Steps

After setting up environment variables:

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Verify environment validation passes
4. Test the complete payment flow
5. Deploy to production following deployment guides

---

**Need help?** Check the [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) for complete deployment instructions.
