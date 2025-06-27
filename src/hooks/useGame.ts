import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { WhiskyPlayInput } from './useWhiskyPlay'
import { useWhiskyPlay } from './useWhiskyPlay'
import { useNextResult } from './useWhisky'
import React from 'react'
import { useUserBalance } from '.'
import { WhiskyPlatformContext } from '../WhiskyPlatformProvider'
import { GameContext } from '../GameContext'
import { useFakeToken } from './useFakeToken'

export function useGame() {
  const gameContext = React.useContext(GameContext)
  const fake = useFakeToken()
  const context = React.useContext(WhiskyPlatformContext)
  const balances = useUserBalance()
  const getNextResult = useNextResult()
  const whiskyPlay = useWhiskyPlay()
  
  // Provide a default game to prevent null errors
  const defaultGame = {
    id: 'default',
    app: () => null,
    meta: {},
    props: {}
  }

  const game = gameContext?.game || defaultGame

  const result = async () => {
    if (fake.isActive) {
      return fake.result()
    }
    return getNextResult()
  }

  const play = async (
    input: Pick<WhiskyPlayInput, 'wager' | 'bet' | 'metadata'>,
    instructions: TransactionInstruction[] = [],
  ) => {
    const metaArgs = input.metadata ?? []
    const metadata = ['0', game.id, ...metaArgs]

    const gameInput: WhiskyPlayInput = {
      ...input,
      creator: new PublicKey(context.platform.creator),
      metadata,
      clientSeed: context.clientSeed,
      creatorFee: context.defaultCreatorFee,
      jackpotFee: context.defaultJackpotFee,
      token: context.selectedPool.token,
      poolAuthority: context.selectedPool.authority,
    }

    if (fake.isActive) {
      return fake.play(gameInput)
    }

    return whiskyPlay(gameInput, instructions)
  }

  return {
    play,
    game,
    result,
  }
}
