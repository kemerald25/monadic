// Gasless meta-transaction relayer utilities
import { ethers } from 'ethers'
import { config } from '../lib/config'

export interface MetaTransaction {
  to: string
  data: string
  nonce: number
  gasLimit: number
  gasPrice: number
}

export interface RelayerResponse {
  success: boolean
  txHash?: string
  error?: string
}

/**
 * Signs a meta-transaction for gasless execution
 */
export const signMetaTransaction = async (
  signer: ethers.Signer,
  transaction: MetaTransaction,
  contractAddress: string,
  chainId: number
): Promise<string> => {
  const domain = {
    name: 'MonadicMeetups',
    version: '1',
    chainId,
    verifyingContract: contractAddress,
  }

  const types = {
    MetaTransaction: [
      { name: 'to', type: 'address' },
      { name: 'data', type: 'bytes' },
      { name: 'nonce', type: 'uint256' },
      { name: 'gasLimit', type: 'uint256' },
      { name: 'gasPrice', type: 'uint256' },
    ],
  }

  const value = {
    to: transaction.to,
    data: transaction.data,
    nonce: transaction.nonce,
    gasLimit: transaction.gasLimit,
    gasPrice: transaction.gasPrice,
  }

  return await signer._signTypedData(domain, types, value)
}

/**
 * Submits a meta-transaction to the relayer service
 */
export const submitMetaTransaction = async (
  transaction: MetaTransaction,
  signature: string,
  relayerUrl: string = config.services.relayerUrl
): Promise<RelayerResponse> => {
  try {
    const response = await fetch(`${relayerUrl}/relay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction,
        signature,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error submitting meta-transaction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Helper function to execute gasless transactions
 */
export const executeGaslessTransaction = async (
  signer: ethers.Signer,
  contractAddress: string,
  functionData: string,
  chainId: number,
  nonce: number
): Promise<RelayerResponse> => {
  const transaction: MetaTransaction = {
    to: contractAddress,
    data: functionData,
    nonce,
    gasLimit: 300000, // Adjust based on function complexity
    gasPrice: 0, // Gasless
  }

  const signature = await signMetaTransaction(signer, transaction, contractAddress, chainId)
  return await submitMetaTransaction(transaction, signature)
}

/**
 * Gets the next nonce for a user
 */
export const getUserNonce = async (
  userAddress: string,
  contractAddress: string,
  provider: ethers.Provider
): Promise<number> => {
  // This would typically call a nonce function on your contract
  // For now, we'll use a simple implementation
  try {
    const contract = new ethers.Contract(
      contractAddress,
      ['function nonces(address) view returns (uint256)'],
      provider
    )
    
    const nonce = await contract.nonces(userAddress)
    return nonce.toNumber()
  } catch (error) {
    console.error('Error getting user nonce:', error)
    return 0
  }
}