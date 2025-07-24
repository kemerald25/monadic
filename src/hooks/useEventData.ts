import { useReadContract, useReadContracts } from 'wagmi'
import { useState, useEffect } from 'react'
import { eventFactoryABI, EVENT_FACTORY_ADDRESS } from '../abi/eventFactory'
import { wagmiConfig } from '../components/WalletProvider'

export interface Event {
  id: string
  name: string
  description: string
  category: string
  startTime: string
  endTime: string
  location: string
  organizer: string
  ticketPrice: number
  maxAttendees: number
  currentAttendees: number
  imageUrl: string
  featured: boolean
  eventContract: string
  ipfsMetadataURI: string
}

export function useEventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get total number of events
  const { data: totalEvents, isError: totalEventsError } = useReadContract({
    address: EVENT_FACTORY_ADDRESS,
    abi: eventFactoryABI,
    functionName: 'getTotalEvents',
    config: wagmiConfig
  })

  // Fetch event metadata for all events
  const eventIds = totalEvents ? Array.from({ length: Number(totalEvents) }, (_, i) => i + 1) : []
  
  const { data: eventMetadataArray, isError: metadataError, isLoading: metadataLoading } = useReadContracts({
    contracts: eventIds.map(id => ({
      address: EVENT_FACTORY_ADDRESS,
      abi: eventFactoryABI,
      functionName: 'getEventMetadata',
      args: [BigInt(id)]
    })),
    config: wagmiConfig
  })

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventMetadataArray || metadataLoading) return

      setIsLoading(true)
      setError(null)

      try {
        const eventsWithDetails = await Promise.all(
          eventMetadataArray.map(async (result, index) => {
            if (result.status !== 'success' || !result.result) {
              return null
            }

            const metadata = result.result
            const eventId = (index + 1).toString()

            // Fetch IPFS metadata
            let ipfsData = null
            try {
              if (metadata.ipfsMetadataURI && metadata.ipfsMetadataURI.startsWith('ipfs://')) {
                const ipfsHash = metadata.ipfsMetadataURI.replace('ipfs://', '')
                const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
                const response = await fetch(ipfsUrl)
                if (response.ok) {
                  ipfsData = await response.json()
                }
              }
            } catch (ipfsError) {
              console.warn(`Failed to fetch IPFS data for event ${eventId}:`, ipfsError)
            }

            // Create event object with available data
            const event: Event = {
              id: eventId,
              name: ipfsData?.name || `Event #${eventId}`,
              description: ipfsData?.description || 'No description available',
              category: metadata.category || 'Uncategorized',
              startTime: new Date().toISOString(), // We'll need to get this from the Event contract
              endTime: new Date(Date.now() + 3600000).toISOString(), // Default to 1 hour later
              location: ipfsData?.location || 'Location TBD',
              organizer: metadata.organizer,
              ticketPrice: 0, // We'll need to get this from ticket tiers
              maxAttendees: 0, // We'll need to get this from the Event contract
              currentAttendees: 0, // We'll need to calculate this
              imageUrl: ipfsData?.image || 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=800',
              featured: index < 2, // Mark first 2 events as featured
              eventContract: metadata.eventContract,
              ipfsMetadataURI: metadata.ipfsMetadataURI
            }

            return event
          })
        )

        const validEvents = eventsWithDetails.filter((event): event is Event => event !== null)
        setEvents(validEvents)
      } catch (err) {
        console.error('Error fetching event details:', err)
        setError('Failed to fetch event details')
      } finally {
        setIsLoading(false)
      }
    }

    if (totalEventsError || metadataError) {
      setError('Failed to fetch events from blockchain')
      setIsLoading(false)
      return
    }

    fetchEventDetails()
  }, [eventMetadataArray, metadataLoading, totalEventsError, metadataError])

  return {
    events,
    isLoading,
    error,
    totalEvents: Number(totalEvents || 0)
  }
}

export function useEventsByCategory(category: string) {
  const { data: eventIds, isError, isLoading } = useReadContract({
    address: EVENT_FACTORY_ADDRESS,
    abi: eventFactoryABI,
    functionName: 'getEventsByCategory',
    args: [category],
    config: wagmiConfig
  })

  return {
    eventIds: eventIds || [],
    isLoading,
    isError
  }
}

export function useEventsByOrganizer(organizer: string) {
  const { data: eventIds, isError, isLoading } = useReadContract({
    address: EVENT_FACTORY_ADDRESS,
    abi: eventFactoryABI,
    functionName: 'getEventsByOrganizer',
    args: [organizer as `0x${string}`],
    config: wagmiConfig
  })

  return {
    eventIds: eventIds || [],
    isLoading,
    isError
  }
}