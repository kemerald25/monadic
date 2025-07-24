import { createConfig, http } from "@wagmi/core";
import { mainnet, polygon, arbitrum } from "@wagmi/core/chains";
import { QueryClient } from "@tanstack/react-query";
import { config as appConfig } from "./config";
import type { Chain } from "@wagmi/core/chains";

// Monad testnet configuration
export const monadTestnet: Chain = {
  id: 0x279F,
  name: "Monad Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: [appConfig.blockchain.monadRpcUrl],
    },
    public: {
      http: [appConfig.blockchain.monadRpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: appConfig.blockchain.explorerUrl,
    },
  },
  testnet: true,
};

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: [monadTestnet, mainnet, polygon, arbitrum],
  transports: {
    [monadTestnet.id]: http(appConfig.blockchain.monadRpcUrl),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});

// Create query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

// Contract addresses from environment variables
export const CONTRACT_ADDRESSES = {
  EVENT_FACTORY: appConfig.contracts.eventFactory,
  TICKET_NFT: appConfig.contracts.ticketNFT,
  SPONSORSHIP_NFT: appConfig.contracts.sponsorshipNFT,
};

// Contract ABIs
export const EVENT_FACTORY_ABI = [
  {
    "type": "event",
    "name": "EventCreated",
    "inputs": [
      { "name": "eventId", "type": "uint256", "indexed": true, "internalType": "uint256" },
      { "name": "organizer", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "eventContract", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "category", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "ipfsMetadataURI", "type": "string", "indexed": false, "internalType": "string" }
    ],
    "anonymous": false
  },
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "category", type: "string" },
      { name: "ipfsMetadataURI", type: "string" },
      { name: "startTime", type: "uint256" },
      { name: "endTime", type: "uint256" },
      { name: "maxAttendees", type: "uint256" },
    ],
    name: "createEvent",
    outputs: [
      { name: "eventId", type: "uint256" },
      { name: "eventContract", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "organizer", type: "address" }],
    name: "getEventsByOrganizer",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "category", type: "string" }],
    name: "getEventsByCategory",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalEvents",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "eventId", type: "uint256" }],
    name: "getEventMetadata",
    outputs: [
      {
        components: [
          { name: "organizer", type: "address" },
          { name: "eventContract", type: "address" },
          { name: "category", type: "string" },
          { name: "ipfsMetadataURI", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "isActive", type: "bool" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const EVENT_ABI = [
  {
    inputs: [
      { name: "_name", type: "string" },
      { name: "_price", type: "uint256" },
      { name: "_supply", type: "uint256" },
      { name: "_startTime", type: "uint256" },
      { name: "_endTime", type: "uint256" },
    ],
    name: "createTicketTier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "tierId", type: "uint256" },
      { name: "to", type: "address" },
    ],
    name: "mintTicket",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "level", type: "string" },
      { name: "price", type: "uint256" },
      { name: "metadataURI", type: "string" },
      { name: "supply", type: "uint256" },
    ],
    name: "createSponsorshipTier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "levelId", type: "uint256" },
      { name: "sponsorAddress", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "mintSponsorship",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "questionHash", type: "string" },
      { name: "options", type: "string[]" },
    ],
    name: "submitPoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "pollId", type: "uint256" },
      { name: "optionId", type: "uint256" },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "pollId", type: "uint256" }],
    name: "getPollResults",
    outputs: [
      { name: "options", type: "string[]" },
      { name: "votes", type: "uint256[]" },
      { name: "totalVotes", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTicketTierCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "ticketTiers",
    outputs: [
      { name: "name", type: "string" },
      { name: "price", type: "uint256" },
      { name: "supply", type: "uint256" },
      { name: "sold", type: "uint256" },
      { name: "startTime", type: "uint256" },
      { name: "endTime", type: "uint256" },
      { name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
