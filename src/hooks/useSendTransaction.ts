import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction, VersionedTransaction, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { useCallback } from 'react'
import { useTransactionStore } from './useTransactionStore'

export interface SendTransactionOptions {
  confirmation?: 'processed' | 'confirmed' | 'finalized'
  label?: string
  lookupTable?: PublicKey[]
}

export function throwTransactionError(error: Error): never {
  throw error
}

export function useSendTransaction() {
  const { connection } = useConnection()
  const { sendTransaction, publicKey } = useWallet()
  const { setState } = useTransactionStore()

  return useCallback(
    async (
      instructions: TransactionInstruction[],
      options: SendTransactionOptions = {},
    ) => {
      try {
        setState('pending')
        
        if (!publicKey) {
          throw new Error('Wallet not connected')
        }
        
        // Create transaction
        const transaction = new Transaction()
        
        // Add instructions to transaction
        instructions.forEach(instruction => {
          transaction.add(instruction)
        })
        
        // Get latest blockhash
        const { blockhash } = await connection.getLatestBlockhash()
        transaction.recentBlockhash = blockhash
        transaction.feePayer = publicKey
        
        // Send transaction
        const signature = await sendTransaction(transaction, connection, {
          skipPreflight: false,
          preflightCommitment: options.confirmation || 'confirmed',
        })
        
        // Wait for confirmation
        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
        }, options.confirmation || 'confirmed')
        
        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${confirmation.value.err}`)
        }
        
        setState('confirmed')
        return signature
      } catch (error) {
        setState('error', error as Error)
        throw error
      }
    },
    [connection, sendTransaction, publicKey, setState],
  )
} 