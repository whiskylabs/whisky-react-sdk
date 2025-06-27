import { PublicKey } from '@solana/web3.js'
import { NATIVE_MINT } from '@whisky-gaming/core'
import React from 'react'
import { PortalProvider } from './PortalContext'
import { ReferralProvider, ReferralProviderProps } from './referral/ReferralContext'

interface PlatformMeta {
  name: string
  creator: PublicKey
}

export interface PoolToken {
  token: PublicKey
  authority?: PublicKey
}

export interface WhiskyPlatformContext {
  platform: PlatformMeta
  selectedPool: PoolToken
  defaultCreatorFee: number
  defaultJackpotFee: number
  setDefaultJackpotFee: (defaultJackpotFee: number) => void
  setPool: (tokenMint: PublicKey | string, authority?: PublicKey | string) => void
  setToken: (tokenMint: PublicKey | string) => void
  clientSeed: string
  setClientSeed: (clientSeed: string) => void
}

export const WhiskyPlatformContext = React.createContext<WhiskyPlatformContext>(null!)

interface WhiskyPlatformProviderProps extends React.PropsWithChildren {
  creator: PublicKey | string
  defaultPool?: PoolToken
  /** How much the player should pay in fees to the platform */
  defaultCreatorFee?: number
  /** How much the player should pay in fees to play for the jackpot in every game. 0.001 = 0.1% */
  defaultJackpotFee?: number
  /** */
  referral?: ReferralProviderProps
}

export function WhiskyPlatformProvider(props: WhiskyPlatformProviderProps) {
  const {
    creator,
    children,
    referral = { prefix: 'code', fee: 0.01, autoAccept: true },
  } = props
  
  const [selectedPool, setSelectedPool] = React.useState<PoolToken>(props.defaultPool ?? { token: NATIVE_MINT })
  const [clientSeed, setClientSeed] = React.useState(String(Math.random() * 1e9 | 0))
  const [defaultJackpotFee, setDefaultJackpotFee] = React.useState(props.defaultJackpotFee ?? 0.001)
  const defaultCreatorFee = props.defaultCreatorFee ?? 0.01

  // Memoize platform object to prevent re-renders
  const platform = React.useMemo(() => ({
    name: '',
    creator: new PublicKey(creator),
  }), [creator])

  // Memoize setters to prevent re-renders
  const setPool = React.useCallback((
    tokenMint: PublicKey | string,
    authority: PublicKey | string = new PublicKey('11111111111111111111111111111111'),
  ) => {
    setSelectedPool({
      token: new PublicKey(tokenMint),
      authority: new PublicKey(authority),
    })
  }, [])

  const setToken = React.useCallback((tokenMint: PublicKey | string) => {
    setPool(tokenMint)
  }, [setPool])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    platform,
    selectedPool,
    setToken,
    setPool,
    clientSeed,
    setClientSeed,
    defaultJackpotFee,
    setDefaultJackpotFee,
    defaultCreatorFee,
  }), [
    platform,
    selectedPool,
    setToken,
    setPool,
    clientSeed,
    defaultJackpotFee,
    defaultCreatorFee
  ])

  return (
    <WhiskyPlatformContext.Provider value={contextValue}>
      <ReferralProvider {...referral}>
        <PortalProvider>
          {children}
        </PortalProvider>
      </ReferralProvider>
    </WhiskyPlatformContext.Provider>
  )
} 