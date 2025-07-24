import React, { createContext, useContext,} from 'react'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccount, useChainId } from 'wagmi'
import { monadTestnet } from '../lib/wagmi'
import { config } from '../lib/config'

// Project ID from environment variables
const projectId = config.reown.projectId

// Create wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [monadTestnet], // Use 'networks' instead of 'chains'
})

// Create query client
const queryClient = new QueryClient()

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [monadTestnet], // Use 'networks' instead of 'chains'
  defaultNetwork: monadTestnet, // Use 'defaultNetwork' instead of 'defaultChain'
  metadata: {
    name: 'Monadic Meetups',
    description: 'On-chain event and networking ecosystem',
    url: 'https://monadic-meetups.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#8B5CF6',
    '--w3m-border-radius-master': '8px',
  },
})

interface WalletContextType {
  isConnected: boolean
  address: string | undefined
  chainId: number | undefined
}

const WalletContext = createContext<WalletContextType>({
  isConnected: true,
  address: undefined,
  chainId: undefined,
})

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

// Internal component to use wagmi hooks
const WalletContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  const contextValue = {
    isConnected,
    address,
    chainId,
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Export the wagmi config for use in other parts of the app
export const wagmiConfig = wagmiAdapter.wagmiConfig