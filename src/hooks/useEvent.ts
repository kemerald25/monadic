import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { EVENT_ABI } from "../lib/wagmi";

export const useEvent = (eventAddress: string) => {
  const {
    writeContract,
    data: writeData,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  // Create ticket tier
  const createTicketTier = (args: {
    name: string;
    price: bigint;
    supply: bigint;
    startTime: bigint;
    endTime: bigint;
  }) => {
    return writeContract({
      address: eventAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "createTicketTier",
      args: [args.name, args.price, args.supply, args.startTime, args.endTime],
    });
  };

  // Mint ticket
  const mintTicket = (
    args: { tierId: bigint; to: `0x${string}` },
    value: bigint
  ) => {
    return writeContract({
      address: eventAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "mintTicket",
      args: [args.tierId, args.to],
      value,
    });
  };

  // Create sponsorship tier
  const createSponsorshipTier = (args: {
    level: string;
    price: bigint;
    metadataURI: string;
    supply: bigint;
  }) => {
    return writeContract({
      address: eventAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "createSponsorshipTier",
      args: [args.level, args.price, args.metadataURI, args.supply],
    });
  };

  // Mint sponsorship
  const mintSponsorship = (
    args: {
      levelId: bigint;
      sponsorAddress: `0x${string}`;
      amount: bigint;
    },
    value: bigint
  ) => {
    return writeContract({
      address: eventAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "mintSponsorship",
      args: [args.levelId, args.sponsorAddress, args.amount],
      value,
    });
  };

  // Submit poll
  const submitPoll = (args: { questionHash: string; options: string[] }) => {
    return writeContract({
      address: eventAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "submitPoll",
      args: [args.questionHash, args.options],
    });
  };

  // Vote on poll
  const vote = (args: { pollId: bigint; optionId: bigint }) => {
    return writeContract({
      address: eventAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "vote",
      args: [args.pollId, args.optionId],
    });
  };

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: writeData,
    });

  // Get ticket tier count
  const { data: ticketTierCount, isLoading: isLoadingTierCount } =
    useReadContract({
      address: eventAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "getTicketTierCount",
    });

  // Get ticket tier details
  const useTicketTier = (tierId: number) => {
    return useReadContract({
      address: eventAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "ticketTiers",
      args: [BigInt(tierId)],
      query: {
        enabled: tierId > 0,
      },
    });
  };

  // Get poll results
  const usePollResults = (pollId: number) => {
    return useReadContract({
      address: eventAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "getPollResults",
      args: [BigInt(pollId)],
      query: {
        enabled: pollId > 0,
      },
    });
  };

  return {
    // Write functions
    createTicketTier,
    mintTicket,
    createSponsorshipTier,
    mintSponsorship,
    submitPoll,
    vote,

    // Transaction state
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
    writeData,

    // Read data
    ticketTierCount,
    isLoadingTierCount,

    // Nested hooks
    useTicketTier,
    usePollResults,
  };
};
