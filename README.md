# ResumePay AI

Private Pay-per-Resume Review Platform on Base using b402 SDK

## Overview

ResumePay AI is a **production-ready**, privacy-first, pay-per-use AI resume review platform that leverages the b402 SDK for secure, gasless payments on the Base chain. Users upload their resume, pay a small fee in USDC, and receive instant AI-powered feedback without subscriptions or login requirements.

## ✨ Key Features

### For Users
- **No Monthly Subscriptions**: Pay only when you need a review
- **Instant AI Feedback**: Get detailed resume analysis in seconds
- **Privacy-First**: Secure crypto payments with b402 SDK
- **Base Chain**: Low gas fees and fast transactions
- **No Login Required**: Simple upload-and-pay workflow
- **Comprehensive Analysis**: ATS scoring, keyword optimization, grammar check, and more
- **Real On-Chain Transactions**: All payments verified on Base with BaseScan proof

### For Builders
- **Monetizable API**: Scalable SaaS architecture
- **Agent-Compatible**: Future support for AI agents paying automatically
- **Privacy-Preserving**: b402 SDK ensures untraceable transactions
- **Production-Ready**: Fully deployed with real wallet integration

## 🛠 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling
- **wagmi**: React hooks for Ethereum
- **viem**: TypeScript interface for Ethereum
- **RainbowKit**: Beautiful wallet connection modal
- **Coinbase Wallet SDK**: Native Coinbase Wallet support
- **Lucide React**: Beautiful icons
- **React Dropzone**: File upload with drag & drop

### Backend
- **Express**: Fast and minimalist web framework
- **TypeScript**: Type-safe backend development
- **@b402ai/sdk**: Payment verification and processing
- **ethers.js**: Ethereum library for transaction verification
- **OpenAI GPT-4**: AI-powered resume analysis
- **PDFKit**: PDF report generation
- **Multer**: File upload handling
- **PostgreSQL**: Database (optional, for production)
- **Redis**: Caching and job queues (optional)

## 🏗 Architecture

```
Frontend (Next.js + wagmi + RainbowKit)
        ↓
Upload API (Express)
        ↓
Real Transaction Verification (ethers.js)
        ↓
Base Chain Payment Validation
        ↓
b402 SDK Integration
        ↓
AI Review Engine (OpenAI)
        ↓
PDF Report Generator
        ↓
User Download + BaseScan Proof
```

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MetaMask, Coinbase Wallet, or compatible Web3 wallet
- Base network configured in wallet

### 1. Clone the Repository

```bash
git clone https://github.com/parthshinge/ResumePay.git
cd ResumePay
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Environment Configuration

#### Frontend (.env.local)
```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:
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
NEXT_PUBLIC_RECIPIENT_ADDRESS=0x...
```

#### Backend (.env)
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Base Chain Configuration
CHAIN_ID=8453
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key_here

# b402 SDK Configuration
WORKER_PRIVATE_KEY=your_private_key_here
FACILITATOR_URL=https://facilitator.b402.ai
BACKEND_API_URL=https://api.b402.ai

# Payment Configuration
PAYMENT_AMOUNT_USDC=5
RECIPIENT_ADDRESS=your_recipient_wallet_address_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration (Optional - for production)
DATABASE_URL=postgresql://user:password@localhost:5432/resumepay

# Redis Configuration (Optional - for production)
REDIS_URL=redis://localhost:6379

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

## 🚀 Deployment

### Frontend (Vercel)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy Frontend**
```bash
cd frontend
vercel
```

3. **Set Environment Variables in Vercel Dashboard**
- `NEXT_PUBLIC_API_URL`: Your deployed backend URL
- `NEXT_PUBLIC_CHAIN_ID`: 8453
- `NEXT_PUBLIC_BASESCAN_URL`: https://basescan.org
- `NEXT_PUBLIC_PAYMENT_AMOUNT_USDC`: 5
- `NEXT_PUBLIC_RECIPIENT_ADDRESS`: Your recipient wallet address

### Backend (Railway)

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Deploy Backend**
```bash
cd backend
railway login
railway init
railway up
```

3. **Set Environment Variables in Railway Dashboard**
Configure all variables from `backend/.env.example`

### Backend (Render)

1. **Create `render.yaml`** (already included in backend)
2. **Connect GitHub Repository** to Render
3. **Render will automatically deploy** using the configuration

### Alternative: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 💰 User Flow

### Complete Payment Flow

1. **Upload Resume**: Drag and drop or click to upload PDF resume
2. **Payment Required**: System returns HTTP 402 with payment details
3. **Connect Wallet**: Connect MetaMask, Coinbase Wallet, or WalletConnect
4. **Auto-Switch to Base**: App automatically switches wallet to Base network
5. **Pay USDC**: Sign transaction to pay required amount in USDC on Base
6. **Transaction Submitted**: Real transaction submitted to Base chain
7. **On-Chain Verification**: Backend verifies transaction on Base using ethers.js
8. **BaseScan Proof**: View transaction on BaseScan explorer
9. **Get Review**: Instant AI analysis with detailed feedback
10. **Download Report**: Download comprehensive PDF report

### Wallet Support

- ✅ MetaMask
- ✅ Coinbase Wallet
- ✅ WalletConnect
- ✅ RainbowKit (multiple wallets)
- ✅ Injected wallets (Brave, Trust Wallet, etc.)

## 🔌 API Endpoints

### Upload Resume
```http
POST /api/upload
Content-Type: multipart/form-data

Body: resume (PDF file)
```

Returns HTTP 402 with payment details if unpaid.

### Verify Payment (Real On-Chain Verification)
```http
POST /api/payment/verify
Content-Type: application/json

{
  "txHash": "0x...",
  "walletAddress": "0x...",
  "amount": "5",
  "resumeId": "uuid"
}
```

This endpoint performs **real on-chain verification**:
- Fetches transaction receipt from Base
- Validates transaction status (success/failure)
- Verifies recipient address
- Verifies payment amount
- Checks USDC transfer logs
- Validates sender wallet address

### Get Payment Status
```http
GET /api/payment/status/:txHash
```

Returns real-time transaction status from Base chain.

### Generate Review
```http
POST /api/review/generate
Content-Type: application/json

{
  "resumeId": "uuid",
  "filePath": "/path/to/resume.pdf"
}
```

### Download Report
```http
GET /api/review/report/:resumeId
```

### Admin Dashboard
```http
GET /api/admin/dashboard
GET /api/admin/payments
GET /api/admin/reviews
```

## 🔐 Security

- **Real On-Chain Verification**: All payments verified on Base blockchain
- **Wallet Signature Validation**: Verify payment authenticity
- **Encrypted Storage**: Resumes stored securely
- **Temporary File Deletion**: Automatic cleanup
- **HTTPS Required**: All communications encrypted
- **Audit Logs**: Track all transactions
- **BaseScan Integration**: All transactions publicly verifiable

## 🎯 Transaction Verification

The backend uses **ethers.js** for real transaction verification:

```typescript
// Verify transaction on Base chain
const verification = await verifyTransaction(
  txHash,
  recipientAddress,
  amount,
  baseRpcUrl
);

// Checks:
// - Transaction exists
// - Transaction status is successful
// - Recipient address matches
// - Payment amount is correct
// - USDC transfer logs are valid
// - Sender wallet matches connected wallet
```

## 📊 b402 SDK Integration

The platform uses b402 SDK for privacy-preserving payments:

```typescript
import { B402 } from '@b402ai/sdk';

const b402 = new B402({
  privateKey: process.env.WORKER_PRIVATE_KEY!,
  chainId: 8453, // Base
  rpcUrl: process.env.BASE_RPC_URL,
  facilitatorUrl: process.env.FACILITATOR_URL,
  backendApiUrl: process.env.BACKEND_API_URL,
});

// Shield USDC into privacy pool (gasless)
await b402.shieldFromEOA({ token: 'USDC', amount: '5' });

// Process payment
await b402.execute({
  action: 'privateSwap',
  from: 'USDC',
  to: 'USDC',
  amount: '5',
});
```

## 🤖 AI Resume Analysis

The platform uses OpenAI GPT-4 to analyze resumes and provide:

- **ATS Score**: Compatibility with applicant tracking systems
- **Keyword Score**: Optimization for job descriptions
- **Grammar Score**: Language and writing quality
- **Formatting Score**: Structure and presentation
- **Role Fit Score**: Alignment with target roles
- **Strengths & Weaknesses**: Detailed analysis
- **Suggestions**: Actionable improvements
- **Recruiter Perspective**: How recruiters view the resume

## ⚡ Performance

- Payment verification: < 5 seconds
- Resume review: < 30 seconds
- API latency: < 2 seconds
- Transaction confirmation: < 30 seconds (Base network)

## 🔮 Future Enhancements

- [ ] AI Agent API for automated payments
- [ ] Multi-chain support (Arbitrum, BSC)
- [ ] Advanced ATS matching with job descriptions
- [ ] Resume templates and builder
- [ ] Subscription plans for power users
- [ ] Integration with LinkedIn and job boards
- [ ] Real-time collaboration features
- [ ] Mobile app (React Native)

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues and questions:
- GitHub Issues: https://github.com/parthshinge/ResumePay/issues
- Documentation: https://github.com/parthshinge/ResumePay/wiki

## 🙏 Acknowledgments

- **b402 SDK**: Privacy-preserving DeFi execution layer
- **Base Chain**: Low-cost, high-performance Ethereum L2
- **OpenAI**: GPT-4 for AI-powered analysis
- **Next.js**: React framework for production
- **wagmi**: React hooks for Ethereum
- **RainbowKit**: Beautiful wallet connection modal

## 🎉 Demo

Try the live demo at: [https://resumepay.ai](https://resumepay.ai)

**Demo Flow:**
1. Upload your resume (PDF)
2. Connect your wallet (MetaMask, Coinbase Wallet, etc.)
3. Pay 5 USDC on Base
4. View transaction on BaseScan
5. Get instant AI-powered resume review
6. Download comprehensive PDF report

**All transactions are real and verifiable on Base blockchain!**
