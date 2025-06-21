import { UiPoolState, usePool } from '@whisky-gaming/core'
import { useContext } from 'react'
import { WhiskyPlatformContext } from '../WhiskyPlatformProvider'
import { useFakeToken } from './useFakeToken'

export const useCurrentPool = (): UiPoolState => {
  const { selectedPool } = useContext(WhiskyPlatformContext)
  const pool = usePool(selectedPool.token, selectedPool.authority)
  const fake = useFakeToken()
  if (fake.isActive) {
    return fake.pool
  }
  return pool
}
