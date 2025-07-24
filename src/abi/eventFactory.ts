export const eventFactoryABI = [
    {
      "type": "function",
      "name": "createEvent",
      "inputs": [
        { "name": "name", "type": "string" },
        { "name": "symbol", "type": "string" },
        { "name": "category", "type": "string" },
        { "name": "ipfsMetadataURI", "type": "string" },
        { "name": "startTime", "type": "uint256" },
        { "name": "endTime", "type": "uint256" },
        { "name": "maxAttendees", "type": "uint256" }
      ],
      "outputs": [
        { "name": "eventId", "type": "uint256" },
        { "name": "eventContract", "type": "address" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getEventMetadata",
      "inputs": [{ "name": "eventId", "type": "uint256" }],
      "outputs": [{
        "name": "",
        "type": "tuple",
        "components": [
          { "name": "organizer", "type": "address" },
          { "name": "eventContract", "type": "address" },
          { "name": "category", "type": "string" },
          { "name": "ipfsMetadataURI", "type": "string" },
          { "name": "timestamp", "type": "uint256" },
          { "name": "isActive", "type": "bool" }
        ]
      }],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "EventCreated",
      "inputs": [
        { "name": "eventId", "type": "uint256", "indexed": true },
        { "name": "organizer", "type": "address", "indexed": true },
        { "name": "eventContract", "type": "address", "indexed": true },
        { "name": "category", "type": "string", "indexed": false },
        { "name": "ipfsMetadataURI", "type": "string", "indexed": false }
      ]
    }
  ] as const
  
  export const eventABI = [
    {
      "type": "function",
      "name": "createTicketTier",
      "inputs": [
        { "name": "_name", "type": "string" },
        { "name": "_price", "type": "uint256" },
        { "name": "_supply", "type": "uint256" },
        { "name": "_startTime", "type": "uint256" },
        { "name": "_endTime", "type": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createSponsorshipTier",
      "inputs": [
        { "name": "level", "type": "string" },
        { "name": "price", "type": "uint256" },
        { "name": "metadataURI", "type": "string" },
        { "name": "supply", "type": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    }
  ] as const
  
  export const EVENT_FACTORY_ADDRESS = '0x6E91DB56C7BF4680a5472737Ee4fDB5A43C8c461' as const