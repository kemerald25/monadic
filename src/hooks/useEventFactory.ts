import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACT_ADDRESSES, EVENT_FACTORY_ABI } from "../lib/wagmi";
import { parseEther } from "viem";
import {
  eventFactoryABI,
  eventABI,
  EVENT_FACTORY_ADDRESS,
} from "../abi/eventFactory";
import { wagmiConfig } from "../components/WalletProvider";

export const useEventFactory = () => {
  const {
    writeContract,
    data: writeData,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  // Read total events
  const { data: totalEvents, isLoading: isLoadingTotal } = useReadContract({
    address: CONTRACT_ADDRESSES.EVENT_FACTORY as `0x${string}`,
    abi: EVENT_FACTORY_ABI,
    functionName: "getTotalEvents",
  });

  // Create event
  const createEvent = (args: {
    name: string;
    symbol: string;
    category: string;
    ipfsMetadataURI: string;
    startTime: bigint;
    endTime: bigint;
    maxAttendees: bigint;
  }) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.EVENT_FACTORY as `0x${string}`,
      abi: EVENT_FACTORY_ABI,
      functionName: "createEvent",
      args: [
        args.name,
        args.symbol,
        args.category,
        args.ipfsMetadataURI,
        args.startTime,
        args.endTime,
        args.maxAttendees,
      ],
    });
  };

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: writeData,
    });

  // Get events by organizer
  const useEventsByOrganizer = (organizer: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.EVENT_FACTORY as `0x${string}`,
      abi: EVENT_FACTORY_ABI,
      functionName: "getEventsByOrganizer",
      args: [organizer as `0x${string}`],
      query: {
        enabled: !!organizer,
      },
    });
  };

  // Get events by category
  const useEventsByCategory = (category: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.EVENT_FACTORY as `0x${string}`,
      abi: EVENT_FACTORY_ABI,
      functionName: "getEventsByCategory",
      args: [category],
      query: {
        enabled: !!category,
      },
    });
  };

  // Get event metadata
  const useEventMetadata = (eventId: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.EVENT_FACTORY as `0x${string}`,
      abi: EVENT_FACTORY_ABI,
      functionName: "getEventMetadata",
      args: [BigInt(eventId)],
      query: {
        enabled: eventId > 0,
      },
    });
  };

  return {
    // Read data
    totalEvents,
    isLoadingTotal,

    // Write functions
    createEvent,

    // Transaction state
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
    writeData,

    // Nested hooks
    useEventsByOrganizer,
    useEventsByCategory,
    useEventMetadata,
  };
};
export function useCreateEvent() {
  const {
    writeContract,
    data: hash,
    isPending,
    error,
  } = useWriteContract({
    config: wagmiConfig,
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    config: wagmiConfig,
  });

  const createEvent = async (eventData: {
    name: string;
    symbol: string;
    category: string;
    ipfsMetadataURI: string;
    startTime: Date;
    endTime: Date;
    maxAttendees: number;
  }) => {
    const startTimeUnix = Math.floor(eventData.startTime.getTime() / 1000);
    const endTimeUnix = Math.floor(eventData.endTime.getTime() / 1000);

    console.log("Contract call parameters:", {
      name: eventData.name,
      symbol: eventData.symbol,
      category: eventData.category,
      ipfsMetadataURI: eventData.ipfsMetadataURI,
      startTime: startTimeUnix,
      endTime: endTimeUnix,
      maxAttendees: eventData.maxAttendees,
    });
    writeContract({
      address: EVENT_FACTORY_ADDRESS,
      abi: eventFactoryABI,
      functionName: "createEvent",
      args: [
        eventData.name,
        eventData.symbol,
        eventData.category,
        eventData.ipfsMetadataURI,
        BigInt(startTimeUnix),
        BigInt(endTimeUnix),
        BigInt(eventData.maxAttendees),
      ],
    });
  };

  return {
    createEvent,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useCreateTicketTier(eventContractAddress: `0x${string}`) {
  const {
    writeContract,
    data: hash,
    isPending,
    error,
  } = useWriteContract({
    config: wagmiConfig,
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    config: wagmiConfig,
  });

  const createTicketTier = async (tierData: {
    name: string;
    price: number;
    supply: number;
    startTime: Date;
    endTime: Date;
  }) => {
    const startTimeUnix = Math.floor(tierData.startTime.getTime() / 1000);
    const endTimeUnix = Math.floor(tierData.endTime.getTime() / 1000);

    writeContract({
      address: eventContractAddress,
      abi: eventABI,
      functionName: "createTicketTier",
      args: [
        tierData.name,
        parseEther(tierData.price.toString()),
        BigInt(tierData.supply),
        BigInt(startTimeUnix),
        BigInt(endTimeUnix),
      ],
    });
  };

  return {
    createTicketTier,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useCreateSponsorshipTier(eventContractAddress: `0x${string}`) {
  const {
    writeContract,
    data: hash,
    isPending,
    error,
  } = useWriteContract({
    config: wagmiConfig,
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    config: wagmiConfig,
  });

  const createSponsorshipTier = async (tierData: {
    level: string;
    price: number;
    metadataURI: string;
    supply: number;
  }) => {
    writeContract({
      address: eventContractAddress,
      abi: eventABI,
      functionName: "createSponsorshipTier",
      args: [
        tierData.level,
        parseEther(tierData.price.toString()),
        tierData.metadataURI,
        BigInt(tierData.supply || 1),
      ],
    });
  };

  return {
    createSponsorshipTier,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
