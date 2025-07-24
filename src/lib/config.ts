// Environment configuration with validation
export const config = {
  // Reown Configuration
  reown: {
    projectId: import.meta.env.VITE_REOWN_PROJECT_ID || '',
  },

  // Blockchain Configuration
  blockchain: {
    monadRpcUrl: import.meta.env.VITE_MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz',
    explorerUrl: import.meta.env.VITE_MONAD_EXPLORER_URL || 'https://testnet.monadexplorer.com/',
    chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '0x279F'),
  },

  // Contract Addresses
  contracts: {
    eventFactory: import.meta.env.VITE_EVENT_FACTORY_ADDRESS || '',
    ticketNFT: import.meta.env.VITE_TICKET_NFT_ADDRESS || '',
    sponsorshipNFT: import.meta.env.VITE_SPONSORSHIP_NFT_ADDRESS || '',
  },

  // The Graph Configuration
  graph: {
    subgraphUrl: import.meta.env.VITE_SUBGRAPH_URL || '',
    apiKey: import.meta.env.VITE_GRAPH_API_KEY || '',
  },

  // Backend Services
  services: {
    relayerUrl: import.meta.env.VITE_RELAYER_URL || '',
    analyticsApiUrl: import.meta.env.VITE_ANALYTICS_API_URL || '',
    websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || '',
  },

  // IPFS Configuration
  ipfs: {
    gateway: import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/',
    pinataApiKey: import.meta.env.VITE_PINATA_API_KEY || '',
    pinataSecretKey: import.meta.env.VITE_PINATA_SECRET_KEY || '',
  },

  // External APIs
  apis: {
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    mapboxAccessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
  },

  // Analytics & Monitoring
  monitoring: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
    mixpanelToken: import.meta.env.VITE_MIXPANEL_TOKEN || '',
  },

  // Development
  development: {
    enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
    environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  },
}

// Validation function to check required environment variables
export const validateConfig = () => {
  const requiredVars = [
    'VITE_REOWN_PROJECT_ID',
  ]

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName])

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars)
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  // Warn about optional but recommended variables
  const recommendedVars = [
    'VITE_SUBGRAPH_URL',
    'VITE_EVENT_FACTORY_ADDRESS',
  ]

  const missingRecommended = recommendedVars.filter(varName => !import.meta.env[varName])
  
  if (missingRecommended.length > 0) {
    console.warn('Missing recommended environment variables:', missingRecommended)
  }
}

// Initialize validation
if (config.development.environment !== 'test') {
  validateConfig()
}

export default config