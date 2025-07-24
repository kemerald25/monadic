import { config } from '../lib/config'

export interface IPFSUploadResponse {
  success: boolean
  hash?: string
  url?: string
  error?: string
}

/**
 * Uploads data to IPFS via Pinata
 */
export const uploadToIPFS = async (metadata: any): Promise<string> => {
  // This is a placeholder - you'll need to implement actual IPFS upload
  // You can use services like Pinata, IPFS HTTP client, or Web3.Storage
  
  try {
    // Simulate IPFS upload for now
    console.log('Uploading to IPFS:', metadata)
    
    // For demo purposes, return a mock IPFS URI with proper format
    const mockHash = `Qm${Math.random().toString(36).substr(2, 44).padEnd(44, '0')}`
    const ipfsURI = `ipfs://${mockHash}`
    
    console.log('Generated IPFS URI:', ipfsURI)
    
    // Return just the URI string, not an object
    return ipfsURI
  } catch (error) {
    console.error('Failed to upload to IPFS:', error)
    throw new Error('Failed to upload metadata to IPFS')
  }
}

/**
 * Uploads file to IPFS via Pinata
 */
export const uploadFileToIPFS = async (file: File): Promise<IPFSUploadResponse> => {
  try {
    if (!config.ipfs.pinataApiKey || !config.ipfs.pinataSecretKey) {
      throw new Error('Pinata API credentials not configured')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('pinataMetadata', JSON.stringify({
      name: `monadic-meetups-file-${Date.now()}`,
    }))

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': config.ipfs.pinataApiKey,
        'pinata_secret_api_key': config.ipfs.pinataSecretKey,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    return {
      success: true,
      hash: result.IpfsHash,
      url: `${config.ipfs.gateway}${result.IpfsHash}`,
    }
  } catch (error) {
    console.error('Error uploading file to IPFS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Retrieves data from IPFS
 */
export const getFromIPFS = async (hash: string): Promise<any> => {
  try {
    const response = await fetch(`${config.ipfs.gateway}${hash}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error retrieving from IPFS:', error)
    throw error
  }
}

export const createEventMetadata = (formData: any) => {
  return {
    name: formData.name,
    description: formData.description,
    image: formData.imageUrl || '',
    location: formData.location,
    category: formData.category,
    attributes: [
      {
        trait_type: 'Category',
        value: formData.category
      },
      {
        trait_type: 'Max Attendees',
        value: formData.maxAttendees
      },
      {
        trait_type: 'Ticket Tiers',
        value: formData.ticketTiers?.length || 0
      },
      {
        trait_type: 'Sponsorship Tiers',
        value: formData.sponsorshipTiers?.length || 0
      }
    ],
    external_url: window.location.origin,
    created_at: new Date().toISOString()
  }
}