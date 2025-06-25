import React, { useContext, useState, createContext, useCallback } from 'react'
import { PublicKey } from '@solana/web3.js'
import { WhiskyPlatformContext } from './WhiskyPlatformProvider'
import { TokenMetaContext } from './TokenMetaProvider'
import { useTokenMeta } from './hooks'

// Re-export core constants and types
export { BPS_PER_WHOLE } from '@whisky-gaming/core'
export type { WhiskyTransaction, WhiskyEventType, AnyWhiskyEvent } from '@whisky-gaming/core'

// Core React hooks and provider
export * from './WhiskyProvider'
export * from './plugins'
export * from './hooks/useAccount'
export * from './hooks/useBalances'
export * from './hooks/usePool'
export * from './hooks/useWhisky'
export * from './hooks/useWhiskyPlay'
export * from './hooks/useSendTransaction'
export * from './hooks/useTransactionStore'

// UI Components
export * from './EffectTest'
export * from './ErrorBoundary'
export * from './WhiskyPlatformProvider'
export * from './GameContext'
export * from './TokenMetaProvider'
export * from './SendTransactionContext'
export * from './components/Canvas'
export * from './components/TokenValue'
export * from './hooks'
export * from './makeHeliusTokenFetcher'
export * from './referral/ReferralContext'
export * from './referral/useReferral'

export interface GameBundle<T = any> {
  id: string
  app: any
  meta?: T
  props?: any
}

// Real production-ready useGame context
const GameContextObj = createContext<{
  game: GameBundle | null
  setGame: (game: GameBundle | null) => void
}>({
  game: null,
  setGame: () => {},
})

// useGame is exported from hooks/useGame.ts

// export function GameProvider({ children }: { children: React.ReactNode }) {
//   const [game, setGame] = useState<GameBundle | null>(null)
//   const setGameCallback = useCallback((g: GameBundle | null) => setGame(g), [])
//   return (
//     <GameContextObj.Provider value={{ game, setGame: setGameCallback }}>
//       {children}
//     </GameContextObj.Provider>
//   )
// }

export function useWagerInput(initial?: number) {
  const [_wager, setWager] = React.useState(initial)
  const context = React.useContext(WhiskyPlatformContext)
  const token = useTokenMeta(context.selectedPool.token)
  return [_wager ?? token.baseWager, setWager] as const
}

/** @deprecated Use <TokenMetaProvider /> */
export function useTokenList() {
  return React.useContext(TokenMetaContext).tokens ?? []
}

/** @deprecated Use <TokenMetaProvider /> */
export const WhiskyStandardTokens = {
  fake: {
    mint: new PublicKey('FakeCDoCX1NWywV9m63fk7gmV9S4seMoyqzcNYEmRYjy'),
    name: 'Fake Money',
    symbol: 'FAKE',
    decimals: 9,
    baseWager: 1 * 1e9,
  },
  sol: {
    mint: new PublicKey('So11111111111111111111111111111111111111112'),
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    baseWager: 0.01 * 1e9,
  },
  usdc: {
    mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    baseWager: .5 * 1e6,
  },
  // whisky: {
  //   mint: new PublicKey('XXXXXXXX'),
  //   name: 'Whisky',
  //   symbol: 'WHISKY',
  //   decimals: 5,
  //   baseWager: 1000000 * 1e5,
  // },
}
