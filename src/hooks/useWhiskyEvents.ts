import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { AnyWhiskyEvent, WhiskyEventType, WhiskyTransaction, PROGRAM_ID, fetchWhiskyTransactions } from '@whisky-gaming/core'
import React from 'react'
import { useWhiskyProgram } from '.'

export interface UseWhiskyEventsParams {
  address?: PublicKey
  signatureLimit?: number
  listen?: boolean
}

export function useWhiskyEventListener<T extends WhiskyEventType>(
  eventName: T,
  callback: (event: WhiskyTransaction<T>) => void,
  deps: React.DependencyList = [],
) {
  const program = useWhiskyProgram()

  React.useEffect(() => {
    if (!program) {
      console.warn('Whisky program not found')
      return
    }

    const listener = program.addEventListener(
      eventName,
      (data, slot, signature) => {
        const event = {
          signature,
          time: Date.now(),
          name: eventName,
          data,
        }
        callback(event)
      },
    )
    return () => {
      program.removeEventListener(listener)
    }
  }, [eventName, program, ...deps])
}

/**
 * Fetches previous events from the provided address (Defaults to creator set in <WhiskyProvider />)
 */
export function useWhiskyEvents<T extends WhiskyEventType>(
  eventName: T,
  props: {address?: PublicKey, signatureLimit?: number} = {},
) {
  const { signatureLimit = 30 } = props
  const { connection } = useConnection()
  const [events, setEvents] = React.useState<AnyWhiskyEvent[]>([])
  const address = props.address ?? PROGRAM_ID

  React.useEffect(
    () => {
      fetchWhiskyTransactions(
        connection,
        address,
        { limit: signatureLimit },
      ).then((x) => setEvents(x))
    }
    , [connection, signatureLimit, address],
  )

  return React.useMemo(
    () => events.filter((x) => x.name === eventName),
    [eventName, events],
  ) as WhiskyTransaction<T>[]
} 