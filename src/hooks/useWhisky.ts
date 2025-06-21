import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { decodeGame, getGameAddress, getNextResult } from '@whisky-gaming/core'
import { useAccount } from './useAccount'
import { useWalletAddress } from './useBalances'
import { useWhiskyPlay } from './useWhiskyPlay'
import { useTransactionStore } from './useTransactionStore'
import { useWhiskyContext } from '../WhiskyProvider'

export function useNextResult() {
  const { connection } = useConnection()
  const userAddress = useWalletAddress()
  const game = useAccount(getGameAddress(userAddress), decodeGame)
  
  return () => {
    const prevNonce = game?.nonce?.toNumber() ?? 0
    return getNextResult(connection, userAddress, prevNonce)
  }
}

export function useWhisky() {
  const userAddress = useWalletAddress()
  const game = useAccount(getGameAddress(userAddress), decodeGame)
  const userCreated = !!game
  const nextRngSeedHashed = game?.nextRngSeedHashed
  const txStore = useTransactionStore()
  const isPlaying = txStore.state !== 'error' && txStore.state !== 'none' || !!game?.status?.resultRequested

  const play = useWhiskyPlay()
  const result = useNextResult()
  const { provider } = useWhiskyContext()

  return {
    play,
    result,
    userCreated,
    nonce: Number(game?.nonce?.toNumber() ?? 0),
    nextRngSeedHashed,
    game,
    isPlaying,
    provider,
  }
} 