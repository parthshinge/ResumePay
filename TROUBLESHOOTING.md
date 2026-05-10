# ResumePay AI - Troubleshooting Guide

Complete troubleshooting guide for ResumePay AI development, deployment, and production issues.

## 🚨 Quick Diagnosis

### Quick Health Check

```bash
# Backend health
curl http://localhost:3001/health

# Frontend health
curl http://localhost:3000/

# Check environment variables
cd backend && npm run dev
cd frontend && npm run dev
```

## 🔧 Backend Issues

### Issue: Backend Won't Start

**Symptoms:**
- `npm run dev` fails
- Error message about missing environment variables
- Process exits immediately

**Solutions:**

1. Check environment variables:
```bash
cd backend
cat .env
```

2. Verify all required variables are set:
```env
PORT=3001
NODE_ENV=development
CHAIN_ID=8453
BASE_RPC_URL=https://mainnet.base.org
WORKER_PRIVATE_KEY=0x...
RECIPIENT_ADDRESS=0x...
OPENAI_API_KEY=sk-...
CORS_ORIGIN=http://localhost:3000
```

3. Validate private key format:
- Must start with `0x`
- Must be 66 characters long
- Must be a valid hexadecimal string

4. Check port availability:
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001
# Kill process if needed
taskkill /PID <pid> /F
```

### Issue: Environment Validation Failed

**Symptoms:**
- Error: "Missing required environment variables"
- Error: "Invalid WORKER_PRIVATE_KEY"
- Error: "Invalid RECIPIENT_ADDRESS"

**Solutions:**

1. Check backend logs for specific error
2. Verify variable format matches requirements
3. Update `.env` file with correct values
4. Restart backend

### Issue: b402 SDK Won't Initialize

**Symptoms:**
- Warning: "b402 SDK not initialized"
- Payment verification falls back to on-chain only

**Solutions:**

1. Check WORKER_PRIVATE_KEY is valid
2. Check BASE_RPC_URL is accessible
3. Check FACILITATOR_URL is correct
4. Check backend logs for specific error
5. Contact b402 support if issue persists

### Issue: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- API calls fail with network errors
- "Access-Control-Allow-Origin" errors

**Solutions:**

1. Check backend CORS_ORIGIN:
```bash
# In backend .env
CORS_ORIGIN=http://localhost:3000  # For local dev
CORS_ORIGIN=https://your-frontend.vercel.app  # For production
```

2. Verify frontend URL matches exactly
3. Restart backend after changing CORS_ORIGIN
4. Check browser console for specific CORS error

### Issue: Payment Verification Fails

**Symptoms:**
- Payment verification returns false
- Error: "Transaction not found"
- Error: "Transaction failed"

**Solutions:**

1. Check BaseScan for transaction details
2. Verify transaction hash is correct
3. Verify transaction is on Base network
4. Verify recipient address matches
5. Verify amount matches
6. Check backend logs for specific error

### Issue: OpenAI API Errors

**Symptoms:**
- AI review generation fails
- Error: "OpenAI API key invalid"
- Error: "Rate limit exceeded"

**Solutions:**

1. Verify OPENAI_API_KEY is valid:
- Starts with `sk-`
- Has sufficient credits
- Has correct permissions

2. Check API usage:
```bash
# Check OpenAI dashboard
https://platform.openai.com/usage
```

3. Verify API key is set correctly:
```bash
# In backend .env
OPENAI_API_KEY=sk-...
```

4. Check backend logs for specific error

## 🎨 Frontend Issues

### Issue: Frontend Won't Start

**Symptoms:**
- `npm run dev` fails
- Next.js compilation errors
- TypeScript errors

**Solutions:**

1. Check Node.js version (requires Node 18+):
```bash
node --version
# Should be v18.x or higher
```

2. Clear Next.js cache:
```bash
cd frontend
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

3. Check for TypeScript errors:
```bash
cd frontend
npm run build
# Fix any TypeScript errors
```

### Issue: Wallet Connection Fails

**Symptoms:**
- "Connect Wallet" button does nothing
- Wallet connection fails
- No wallet options appear

**Solutions:**

1. Check wallet is installed (MetaMask, Coinbase, etc.)
2. Check wallet is unlocked
3. Check browser console for errors
4. Try different wallet
5. Check wagmi configuration in `frontend/src/lib/wagmi.ts`

### Issue: Network Switch Fails

**Symptoms:**
- "Switch to Base Network" button appears
- Network switch fails in wallet
- Stays on wrong network

**Solutions:**

1. Manually add Base network to wallet:
- Network Name: Base
- RPC URL: https://mainnet.base.org
- Chain ID: 8453
- Symbol: ETH
- Explorer: https://basescan.org

2. Manually switch to Base network in wallet
3. Refresh page after manual switch
4. Check wallet supports Base network

### Issue: Transaction Fails in Wallet

**Symptoms:**
- Transaction fails in MetaMask
- "Insufficient funds" error
- "Transaction reverted" error

**Solutions:**

1. Check wallet has sufficient USDC balance
2. Check wallet has sufficient ETH for gas fees
3. Check recipient address is correct
4. Check amount is correct
5. Try increasing gas limit in wallet

### Issue: Transaction Verification Fails

**Symptoms:**
- Transaction succeeds on BaseScan
- Backend verification fails
- "Payment verification failed" error

**Solutions:**

1. Check backend logs for specific error
2. Verify transaction hash is correct
3. Verify transaction is on Base network (not testnet)
4. Verify recipient address matches backend config
5. Verify amount matches backend config

## 🌐 Network Issues

### Issue: Base RPC Connection Fails

**Symptoms:**
- Error: "Failed to connect to Base RPC"
- Transaction verification fails
- b402 SDK won't initialize

**Solutions:**

1. Check BASE_RPC_URL is correct:
```env
BASE_RPC_URL=https://mainnet.base.org
```

2. Test RPC endpoint:
```bash
curl https://mainnet.base.org
```

3. Try alternative RPC endpoint:
```env
BASE_RPC_URL=https://base.publicnode.com
```

4. Check network connectivity
5. Check firewall settings

### Issue: BaseScan API Fails

**Symptoms:**
- BaseScan queries fail
- Transaction status can't be fetched

**Solutions:**

1. Check BASESCAN_API_KEY is set (optional)
2. Verify API key is valid
3. Check BaseScan API status: https://docs.basescan.org
4. Try without API key (limited rate limits)

## 📦 Deployment Issues

### Issue: Vercel Deployment Fails

**Symptoms:**
- Vercel build fails
- Deployment errors
- Environment variables not loading

**Solutions:**

1. Check Vercel logs for specific error
2. Verify environment variables are set in Vercel dashboard
3. Verify NEXT_PUBLIC_ prefix is used for frontend variables
4. Check build logs for compilation errors
5. Clear Vercel cache and redeploy

### Issue: Railway Deployment Fails

**Symptoms:**
- Railway build fails
- Deployment errors
- Service won't start

**Solutions:**

1. Check Railway logs for specific error
2. Verify environment variables are set
3. Check build command is correct
4. Check start command is correct
5. Verify PORT is set to 3001

### Issue: Render Deployment Fails

**Symptoms:**
- Render build fails
- Deployment errors
- Service won't start

**Solutions:**

1. Check Render logs for specific error
2. Verify environment variables are set
3. Check build command is correct
4. Check start command is correct
5. Verify health check path is correct

## 🔐 Security Issues

### Issue: Private Key Exposure

**Symptoms:**
- Private key was committed to git
- Private key is in logs
- Unauthorized transactions

**Solutions:**

1. **IMMEDIATE ACTIONS:**
   - Transfer all funds from exposed wallet
   - Generate new private key
   - Update environment variables
   - Rotate API keys

2. **PREVENTION:**
   - Ensure .env is in .gitignore
   - Never commit .env files
   - Use secrets management in production
   - Review logs for sensitive data

### Issue: API Key Exposure

**Symptoms:**
- API key was committed to git
- API key is in logs
- API quota exceeded unexpectedly

**Solutions:**

1. **IMMEDIATE ACTIONS:**
   - Revoke exposed API key
   - Generate new API key
   - Update environment variables
   - Rotate API keys

2. **PREVENTION:**
   - Ensure .env is in .gitignore
   - Never commit .env files
   - Use secrets management in production
   - Review logs for sensitive data

## 📝 Common Error Messages

### "Missing required environment variables"

**Cause:** Required environment variable not set in .env file

**Solution:** Set all required variables in .env file (see ENVIRONMENT_SETUP.md)

### "Invalid WORKER_PRIVATE_KEY: must start with 0x"

**Cause:** Private key doesn't start with 0x

**Solution:** Ensure private key starts with 0x and is 66 characters

### "Invalid RECIPIENT_ADDRESS: must start with 0x"

**Cause:** Recipient address doesn't start with 0x

**Solution:** Ensure address starts with 0x and is 42 characters

### "Invalid OPENAI_API_KEY: must start with sk-"

**Cause:** OpenAI API key doesn't start with sk-

**Solution:** Ensure API key starts with sk- and is valid

### "Transaction not found"

**Cause:** Transaction hash is invalid or transaction hasn't indexed

**Solution:** Verify transaction hash is correct and wait a few minutes for indexing

### "Transaction failed"

**Cause:** Transaction failed on-chain (insufficient gas, revert, etc.)

**Solution:** Check BaseScan for failure reason, retry with higher gas limit

### "CORS policy error"

**Cause:** CORS_ORIGIN doesn't match frontend URL

**Solution:** Update CORS_ORIGIN in backend .env to match frontend URL

### "b402 SDK not initialized"

**Cause:** WORKER_PRIVATE_KEY is invalid or b402 services are down

**Solution:** Check private key format, check b402 service status

## 🔍 Debugging Steps

### Step 1: Check Logs

**Backend logs:**
```bash
cd backend
npm run dev
# Watch for errors in console
```

**Railway logs:**
- Go to Railway project
- Click "Logs" tab
- Filter by error level

**Render logs:**
- Go to Render service
- Click "Logs" tab
- Filter by error level

**Vercel logs:**
- Go to Vercel project
- Click "Logs" tab
- Filter by error level

### Step 2: Test Health Endpoints

```bash
# Backend health
curl http://localhost:3001/health
curl http://localhost:3001/api/health

# Production backend
curl https://your-backend-url/health
curl https://your-backend-url/api/health
```

### Step 3: Test Environment Variables

```bash
# Backend
cd backend
node -e "require('dotenv').config(); console.log(process.env.PORT)"

# Frontend
cd frontend
node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.NEXT_PUBLIC_CHAIN_ID)"
```

### Step 4: Test Database Connection (if using)

```bash
# Test PostgreSQL
psql $DATABASE_URL

# Test Redis
redis-cli -u $REDIS_URL ping
```

### Step 5: Test API Endpoints

```bash
# Test upload endpoint
curl -X POST http://localhost:3001/api/upload \
  -F "resume=@test.pdf"

# Test payment verification
curl -X POST http://localhost:3001/api/payment/verify \
  -H "Content-Type: application/json" \
  -d '{"txHash":"0x...","walletAddress":"0x...","amount":"5"}'
```

## 🛠️ Maintenance Commands

### Clear Caches

```bash
# Clear Next.js cache
cd frontend
rm -rf .next

# Clear backend build cache
cd backend
rm -rf dist

# Clear npm cache
npm cache clean --force
```

### Reinstall Dependencies

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Root
rm -rf node_modules package-lock.json
npm install
```

### Reset Environment

```bash
# Backend
cd backend
rm .env
cp .env.example .env
# Edit .env with new values

# Frontend
cd frontend
rm .env.local
cp .env.example .env.local
# Edit .env.local with new values
```

## 📞 Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Check relevant documentation files:
   - ENVIRONMENT_SETUP.md
   - DEPLOYMENT_GUIDE.md
   - TESTING_GUIDE.md
   - BASESCAN_VERIFICATION.md
3. Check logs for specific errors
4. Try the solutions listed for your issue
5. Gather relevant information:
   - Error messages
   - Logs
   - Environment configuration
   - Steps to reproduce

### When to Ask for Help

- You've tried all solutions in this guide
- Error is not documented
- Issue persists after multiple attempts
- You need clarification on documentation

### Information to Provide

When asking for help, provide:

1. **Error message:** Full error message
2. **Logs:** Relevant log output
3. **Environment:** Development/Production
4. **Steps to reproduce:** How to reproduce the issue
5. **Configuration:** Relevant environment variables (redact secrets)
6. **Platform:** Windows/Mac/Linux, Node version, etc.

## 📚 Additional Resources

### Documentation

- README.md - Project overview
- ENVIRONMENT_SETUP.md - Environment configuration
- DEPLOYMENT_GUIDE.md - Deployment instructions
- PRODUCTION_CHECKLIST.md - Production readiness
- TESTING_GUIDE.md - Testing instructions
- BASESCAN_VERIFICATION.md - BaseScan verification
- DEPLOYMENT_COMMANDS.md - Deployment commands
- FOLDER_STRUCTURE.md - Project structure

### External Resources

- [Base Documentation](https://docs.base.org)
- [b402 SDK Documentation](https://docs.b402.ai)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

---

**Use this guide to diagnose and resolve issues with ResumePay AI.**
