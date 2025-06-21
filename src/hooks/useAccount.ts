import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useMemo, useEffect, useState } from 'react'

export function useAccount<T>(
  publicKey: PublicKey | null | undefined,
  decoder: (data: any) => T,
): T | null {
  const { connection } = useConnection()
  const [account, setAccount] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!publicKey) {
      setAccount(null)
      return
    }

    let subscriptionId: number | undefined

    const fetchAccount = async () => {
      try {
        const accountInfo = await connection.getAccountInfo(publicKey)
        if (accountInfo) {
          const decoded = decoder(accountInfo.data)
          setAccount(decoded)
        } else {
          setAccount(null)
        }
        setError(null)
      } catch (err) {
        setError(err as Error)
        setAccount(null)
      }
    }

    const subscribeToAccount = () => {
      subscriptionId = connection.onAccountChange(
        publicKey,
        (accountInfo) => {
          if (accountInfo) {
            try {
              const decoded = decoder(accountInfo.data)
              setAccount(decoded)
              setError(null)
            } catch (err) {
              setError(err as Error)
              setAccount(null)
            }
          } else {
            setAccount(null)
          }
        },
        'confirmed'
      )
    }

    // Initial fetch
    fetchAccount()
    
    // Subscribe to changes
    subscribeToAccount()

    return () => {
      if (subscriptionId !== undefined) {
        connection.removeAccountChangeListener(subscriptionId)
      }
    }
  }, [connection, publicKey, decoder])

  if (error) {
    console.error('Error fetching account:', error)
  }

  return account
} 