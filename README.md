# Monadic Meetups - On-Chain Event & Networking Ecosystem

A comprehensive Web3 event management platform built on the Monad blockchain, featuring NFT tickets, sponsorship tokens, gasless transactions, and real-time analytics.

## 🌟 Features

### Core Functionality
- **Event Creation & Management**: Deploy events as smart contracts with customizable ticket tiers
- **NFT Tickets**: ERC-721 tokens with unique metadata, QR codes, and on-chain verification
- **Sponsorship System**: ERC-1155 tokens for different sponsorship levels with benefits
- **Live Polling**: Real-time Q&A and voting during events
- **Gasless Transactions**: Meta-transaction support for seamless UX
- **Analytics Dashboard**: Real-time event performance and attendance tracking

### Technical Stack
- **Frontend**: React + TypeScript + Tailwind CSS + Framer Motion
- **Smart Contracts**: Solidity on Monad (EVM-compatible)
- **Wallet Integration**: wagmi + Reown (Web3Modal)
- **Indexing**: The Graph subgraph for efficient data querying
- **State Management**: React hooks with custom contract hooks
- **Animations**: Framer Motion for smooth transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Monad testnet ETH for gas fees

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/monadic-meetups.git
cd monadic-meetups
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
VITE_REOWN_PROJECT_ID=your_reown_project_id
VITE_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/monadic-meetups/events
VITE_RELAYER_URL=https://relayer.monadic-meetups.com
VITE_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
```

4. **Set up Hardhat environment**
```bash
cp .env.hardhat .env
```

Edit `.env` for contract deployment:
```env
PRIVATE_KEY=your_private_key_here
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
MONAD_EXPLORER_API_KEY=your_explorer_api_key
```

5. **Start the development server**
```bash
npm run dev
```

## 📦 Smart Contracts

### Contract Architecture

#### EventFactory.sol
- Deploys new Event instances
- Manages global event registry
- Stores event metadata and categorization
- Emits creation events for indexing

#### Event.sol
- Core event management contract
- Handles ticket tiers and minting
- Manages sponsorship opportunities
- Implements live polling system
- Records attendance and post-event data

#### TicketNFT.sol (ERC-721)
- Unique ticket tokens with metadata
- QR code generation for verification
- Seat assignment and perks tracking
- Transfer restrictions during events

#### SponsorshipNFT.sol (ERC-1155)
- Semi-fungible sponsorship tokens
- Multiple sponsorship levels
- Benefits tracking and metadata
- Batch minting capabilities

### Deployment

1. **Install Hardhat**
```bash
npm install --save-dev hardhat
```

2. **Compile contracts**
```bash
npx hardhat compile
```

3. **Deploy to Monad testnet**
```bash
npx hardhat deploy --network monad-testnet
```

4. **Verify contracts**
```bash
npx hardhat verify --network monad-testnet DEPLOYED_CONTRACT_ADDRESS
```

## 🔧 Configuration

### Wallet Setup
The app uses Reown (formerly Web3Modal) for wallet connections. Supported wallets:
- MetaMask
- WalletConnect compatible wallets
- Coinbase Wallet
- Rainbow Wallet

### Network Configuration
Monad testnet is pre-configured with:
- Chain ID: 41454
- RPC URL: https://testnet-rpc.monad.xyz
- Explorer: https://testnet-explorer.monad.xyz

## 🎨 UI Components

### Key Components

#### EventCard
- Displays event information with animations
- Shows attendance progress and pricing
- Handles event interaction and navigation

#### EventCreationWizard
- Multi-step form for event creation
- Validates input and guides users
- Integrates with smart contracts

#### Dashboard
- Real-time analytics and charts
- Event performance metrics
- Revenue and attendance tracking

#### WalletProvider
- Manages wallet connections
- Provides Web3 context to components
- Handles network switching

## 🔗 Hooks & Integration

### Custom Hooks

#### useEventFactory
```typescript
const { createEvent, totalEvents, useEventsByOrganizer } = useEventFactory()
```

#### useEvent
```typescript
const { mintTicket, createTicketTier, submitPoll } = useEvent(eventAddress)
```

### GraphQL Integration
```typescript
const { data, loading, error } = useQuery(GET_EVENTS, {
  variables: { first: 10, skip: 0 }
})
```

## 🛠 Development

### Project Structure
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── contracts/          # Smart contract files
├── graphql/            # GraphQL queries and client
├── lib/                # Utility libraries
├── utils/              # Helper functions
└── types/              # TypeScript definitions
```

### Code Style
- ESLint configuration for consistent code style
- TypeScript for type safety
- Prettier for code formatting
- Husky for pre-commit hooks

### Testing
```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run contract tests
npx hardhat test
```

## 📊 Analytics & Monitoring

### The Graph Integration
- Indexes all contract events
- Provides efficient querying capabilities
- Supports complex filtering and sorting

### Real-time Updates
- WebSocket connections for live data
- Optimistic updates for better UX
- Event-driven architecture

## 🔐 Security

### Smart Contract Security
- OpenZeppelin contracts for security
- Reentrancy protection
- Access control patterns
- Input validation

### Frontend Security
- Signature verification for meta-transactions
- Secure wallet integration
- HTTPS enforcement
- Content Security Policy

## 📱 Mobile Support

### Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Optimized for mobile wallets
- Progressive Web App features

## 🌍 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Deploy to Vercel
vercel --prod
```

### Backend Services
- Relayer service for gasless transactions
- Analytics API for advanced metrics
- IPFS integration for metadata storage

## 📚 API Reference

### Contract Functions

#### EventFactory
```solidity
function createEvent(
    string memory name,
    string memory symbol,
    string memory category,
    string memory ipfsMetadataURI,
    uint256 startTime,
    uint256 endTime,
    uint256 maxAttendees
) external returns (uint256 eventId, address eventContract)
```

#### Event
```solidity
function createTicketTier(
    string memory name,
    uint256 price,
    uint256 supply,
    uint256 startTime,
    uint256 endTime
) external

function mintTicket(uint256 tierId, address to) external payable
```

### GraphQL Queries
```graphql
query GetEvents($first: Int!, $skip: Int!) {
  events(first: $first, skip: $skip) {
    id
    name
    description
    category
    organizer
    startTime
    endTime
    maxAttendees
    currentAttendees
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Development Guidelines
- Follow the existing code style
- Add comprehensive tests
- Update documentation
- Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Monad blockchain team for the amazing L1 solution
- OpenZeppelin for secure smart contract libraries
- The Graph for decentralized indexing
- Reown for wallet connection infrastructure
- React and TypeScript communities

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core event management
- ✅ NFT ticketing system
- ✅ Basic sponsorship features
- ✅ Wallet integration

### Phase 2 (Next)
- 🔄 Advanced analytics dashboard
- 🔄 Mobile app development
- 🔄 Integration with external APIs
- 🔄 Multi-chain support

### Phase 3 (Future)
- 📋 DAO governance features
- 📋 Cross-chain bridging
- 📋 AI-powered recommendations
- 📋 Advanced monetization features

## 📞 Support

For support, please:
1. Check the [documentation](https://docs.monadic-meetups.com)
2. Open an issue on GitHub
3. Join our [Discord community](https://discord.gg/monadic-meetups)
4. Follow us on [Twitter](https://twitter.com/monadic_meetups)

---

Built with ❤️ for the Monad ecosystem