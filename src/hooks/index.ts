import { useWhiskyContext } from '../WhiskyProvider'
import React from 'react'
import { WhiskyPlatformContext } from '../WhiskyPlatformProvider'
import { PublicKey } from '@solana/web3.js'
import { useTokenMeta } from './useTokenMeta'
import { useBalance, useWalletAddress } from './useBalances'
import { usePool } from './usePool'

// Core hooks
export { useAccount } from './useAccount'
export { useBalance, useWalletAddress } from './useBalances'
export { usePool } from './usePool'
export { useWhisky, useNextResult } from './useWhisky'
export { useWhiskyPlay } from './useWhiskyPlay'
export { useSendTransaction, throwTransactionError, useTransactionError } from './useSendTransaction'
export { useTransactionStore } from './useTransactionStore'
export * from './useWhiskyEvents'

// UI hooks
export { useTokenMeta } from './useTokenMeta'
export { useWagerInput } from './useWagerInput'
export { useSound, useSoundStore, useWhiskyAudioStore } from './useSound'
export * from './useGame'

// Legacy hooks for compatibility
export function useWhiskyPlatformContext() {
  return React.useContext(WhiskyPlatformContext)
}

export function useCurrentPool() {
  const context = React.useContext(WhiskyPlatformContext)
  return React.useMemo(() => context.selectedPool, [context.selectedPool])
}

export function useCurrentToken() {
  const context = React.useContext(WhiskyPlatformContext)
  const token = React.useMemo(() => context.selectedPool.token, [context.selectedPool.token])
  return useTokenMeta(token)
}

export function useFees() {
  const context = React.useContext(WhiskyPlatformContext)
  const pool = useCurrentPool()
  
  return React.useMemo(() => {
    const creatorFee = context.defaultCreatorFee
    const jackpotFee = context.defaultJackpotFee
    
    // Get actual pool fees
    const poolData = usePool(pool.token, pool.authority)
    return creatorFee + jackpotFee + poolData.whiskyFee + poolData.poolFee
  }, [context.defaultCreatorFee, context.defaultJackpotFee, pool.token, pool.authority])
}

export function useUserBalance(mint?: PublicKey) {
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const userAddress = useWalletAddress()
  
  const targetMint = React.useMemo(() => mint ?? token.mint, [mint, token.mint])
  const authority = React.useMemo(() => pool.authority, [pool.authority])
  
  const realBalance = useBalance(userAddress, targetMint, authority)
  
  return realBalance
}

// Provider helpers
export function useWhiskyProvider() {
  const context = useWhiskyContext()
  return React.useMemo(() => context.provider, [context.provider])
}

export function useWhiskyProgram() {
  const provider = useWhiskyProvider()
  return React.useMemo(() => provider?.whiskyProgram, [provider])
}
