import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

// Get project ID from WalletConnect Cloud (optional, for production)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'ResumePay AI',
      appLogoUrl: 'https://resumepay.ai/logo.png',
    }),
    walletConnect({
      projectId,
      showQrModal: false,
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
})

// Export chain constants
export const BASE_CHAIN_ID = base.id
export const BASE_CHAIN = base
