import React from 'react'
import { useTokenMeta } from './useTokenMeta'
import { WhiskyPlatformContext } from '../WhiskyPlatformProvider'

export function useWagerInput(initial?: number) {
  const [_wager, setWager] = React.useState(initial)
  const context = React.useContext(WhiskyPlatformContext)
  const token = useTokenMeta(context.selectedPool.token)
  return [_wager ?? token.baseWager, setWager] as const
} 