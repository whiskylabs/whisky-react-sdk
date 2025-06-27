import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useMemo, useEffect, useState, useCallback, useRef } from 'react'

export function useAccount<T>(
  publicKey: PublicKey | null | undefined,
  decoder: (data: any) => T,
): T | null {
  const { connection } = useConnection()
  const [account, setAccount] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const lastFetchTime = useRef<number>(0)
  const isFetching = useRef<boolean>(false)
  
  // Memoize the decoder to prevent infinite loops
  const memoizedDecoder = useCallback(decoder, [])
  
  // Memoize publicKey string to prevent unnecessary refetches
  const publicKeyString = useMemo(() => publicKey?.toString(), [publicKey])

  useEffect(() => {
    if (!publicKey || !publicKeyString) {
      setAccount(null)
      return
    }

    let subscriptionId: number | undefined
    let isActive = true

    const fetchAccount = async () => {
      // Throttle requests - max 1 per second per account
      const now = Date.now()
      if (isFetching.current || (now - lastFetchTime.current) < 1000) {
        return
      }

      isFetching.current = true
      lastFetchTime.current = now

      try {
        const accountInfo = await connection.getAccountInfo(publicKey)
        if (!isActive) return

        if (accountInfo) {
          const decoded = memoizedDecoder(accountInfo.data)
          setAccount(decoded)
        } else {
          setAccount(null)
        }
        setError(null)
      } catch (err) {
        if (!isActive) return
        console.warn('Error fetching account:', publicKeyString, err)
        setError(err as Error)
        setAccount(null)
      } finally {
        isFetching.current = false
      }
    }

    const subscribeToAccount = () => {
      try {
        subscriptionId = connection.onAccountChange(
          publicKey,
          (accountInfo) => {
            if (!isActive) return
            
            if (accountInfo) {
              try {
                const decoded = memoizedDecoder(accountInfo.data)
                setAccount(decoded)
                setError(null)
              } catch (err) {
                console.warn('Error decoding account:', publicKeyString, err)
                setError(err as Error)
                setAccount(null)
              }
            } else {
              setAccount(null)
            }
          },
          'confirmed'
        )
      } catch (err) {
        console.warn('Error setting up account subscription:', publicKeyString, err)
      }
    }

    // Initial fetch with throttling
    fetchAccount()
    
    // Subscribe to changes
    subscribeToAccount()

    return () => {
      isActive = false
      if (subscriptionId !== undefined) {
        try {
          connection.removeAccountChangeListener(subscriptionId)
        } catch (err) {
          console.warn('Error removing account listener:', err)
        }
      }
    }
  }, [connection, publicKeyString, memoizedDecoder])

  if (error) {
    console.error('Error fetching account:', error)
  }

  return account
} 