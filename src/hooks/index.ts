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
export * from './useSound'
export * from './useGame'

// Legacy hooks for compatibility
export function useWhiskyPlatformContext() {
  return React.useContext(WhiskyPlatformContext)
}

export function useCurrentPool() {
  const context = React.useContext(WhiskyPlatformContext)
  return context.selectedPool
}

export function useCurrentToken() {
  const { token } = React.useContext(WhiskyPlatformContext).selectedPool
  return useTokenMeta(token)
}

export function useFees() {
  const context = React.useContext(WhiskyPlatformContext)
  const pool = useCurrentPool()
  const creatorFee = context.defaultCreatorFee
  const jackpotFee = context.defaultJackpotFee
  
  // Get actual pool fees
  const poolData = usePool(pool.token, pool.authority)
  return creatorFee + jackpotFee + poolData.whiskyFee + poolData.poolFee
}

export function useUserBalance(mint?: PublicKey) {
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const userAddress = useWalletAddress()
  const realBalance = useBalance(userAddress, mint ?? token.mint, pool.authority)
  
  return realBalance
}

// Provider helpers
export function useWhiskyProvider() {
  return useWhiskyContext().provider
}

export function useWhiskyProgram() {
  const provider = useWhiskyProvider()
  return provider?.whiskyProgram
}
