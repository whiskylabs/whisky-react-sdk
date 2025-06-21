import { PublicKey } from '@solana/web3.js'
import { 
  BPS_PER_WHOLE, 
  SYSTEM_PROGRAM, 
  decodeAta, 
  decodeWhiskyState, 
  decodePool, 
  getWhiskyStateAddress, 
  getPoolAddress, 
  getPoolJackpotTokenAccountAddress 
} from '@whisky-gaming/core'
import { useAccount } from './useAccount'

export interface UiPoolState {
  publicKey: PublicKey
  token: PublicKey
  liquidity: bigint
  minWager: number
  maxPayout: number
  whiskyFee: number
  poolFee: number
  jackpotBalance: number
  authority: PublicKey
}

export function usePool(token: PublicKey, authority: PublicKey = SYSTEM_PROGRAM): UiPoolState {
  const publicKey = getPoolAddress(token, authority)
  const account = useAccount(publicKey, decodePool)
  const whiskyState = useAccount(getWhiskyStateAddress(), decodeWhiskyState)
  const jackpotUnderlyingTokenAccount = useAccount(getPoolJackpotTokenAccountAddress(publicKey), decodeAta)
  
  const jackpotBalance = jackpotUnderlyingTokenAccount?.amount ?? BigInt(0)

  if (!account) {
    return {
      token,
      publicKey,
      liquidity: BigInt(0),
      minWager: 0,
      maxPayout: 0,
      whiskyFee: 0,
      poolFee: 0,
      jackpotBalance: 0,
      authority,
    }
  }

  const liquidity = BigInt(account.liquidityCheckpoint)

  const customWhiskyFeeBps = account.customWhiskyFeeBps.toNumber()
  const customPoolFeeBps = account.customPoolFeeBps.toNumber()

  const whiskyFee = ((customWhiskyFeeBps || whiskyState?.whiskyFeeBps.toNumber()) ?? 0) / BPS_PER_WHOLE
  const poolFee = ((customPoolFeeBps || whiskyState?.defaultPoolFee.toNumber()) ?? 0) / BPS_PER_WHOLE
  const maxPayoutBps = (account.customMaxPayoutBps?.toNumber() || whiskyState?.maxPayoutBps?.toNumber()) ?? 0

  const maxPayout = Number(liquidity * BigInt(maxPayoutBps)) / BPS_PER_WHOLE

  return {
    token,
    publicKey,
    minWager: account.minWager.toNumber(),
    liquidity,
    maxPayout,
    whiskyFee,
    poolFee,
    jackpotBalance: Number(jackpotBalance),
    authority,
  }
} 