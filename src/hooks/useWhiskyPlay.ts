import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { NATIVE_MINT, SYSTEM_PROGRAM, getPoolAddress } from '@whisky-gaming/core'
import React from 'react'
import { useWhiskyContext } from '../WhiskyProvider'
import { WhiskyPluginContext, WhiskyPluginInput } from '../plugins'
import { SendTransactionOptions, throwTransactionError, useSendTransaction } from './useSendTransaction'

export interface WhiskyPlayInput {
  wager: number
  bet: number[]
  creator: string | PublicKey
  creatorFee?: number
  jackpotFee?: number
  clientSeed?: string
  token?: string | PublicKey
  poolAuthority?: string | PublicKey
  metadata?: (string | number)[]
  useBonus?: boolean
}

export function useWhiskyPlay() {
  const { connected } = useWallet()
  const sendTx = useSendTransaction()
  const context = useWhiskyContext()
  const provider = context.provider

  return async function play(
    input: WhiskyPlayInput,
    additionalInstructions: TransactionInstruction[] = [],
    opts?: SendTransactionOptions & { lookupTables?: PublicKey[] },
  ) {
    const creator = new PublicKey(input.creator)
    const creatorFee = input.creatorFee ?? 0
    const jackpotFee = input.jackpotFee ?? 0
    const meta = input.metadata?.join(':') ?? ''
    const token = new PublicKey(input.token ?? NATIVE_MINT)
    const poolAuthority = new PublicKey(input.poolAuthority ?? SYSTEM_PROGRAM)

    if (!connected) {
      throw throwTransactionError(new Error('NOT_CONNECTED'))
    }

    if (!provider) {
      throw throwTransactionError(new Error('PROVIDER_NOT_AVAILABLE'))
    }

    const pluginInput: WhiskyPluginInput = {
      wallet: provider.user,
      creator,
      token,
      wager: input.wager,
      bet: input.bet,
      input,
    }

    const pluginContext: WhiskyPluginContext = {
      creatorFee: creatorFee,
      provider,
    }
    
    // Collect all plugin instructions
    const pluginInstructions: TransactionInstruction[] = []
    
    for (const plugin of context.plugins) {
      try {
        const resolved = await plugin(pluginInput, pluginContext)
        if (resolved && Array.isArray(resolved)) {
          pluginInstructions.push(...resolved)
        }
      } catch (error) {
        console.error('Plugin error:', error)
        // Continue with other plugins
      }
    }

    const pool = getPoolAddress(token, poolAuthority)

    // Handle potential async provider.play()
    const playInstruction = await Promise.resolve(provider.play(
      input.wager,
      input.bet,
      input.clientSeed ?? '',
      pool,
      token,
      creator,
      pluginContext.creatorFee,
      jackpotFee,
      meta,
    ))

    const allInstructions = [
      ...additionalInstructions, 
      playInstruction,
      ...pluginInstructions,
    ]

    return sendTx(allInstructions, { ...opts, label: 'play', lookupTable: opts?.lookupTables })
  }
} 