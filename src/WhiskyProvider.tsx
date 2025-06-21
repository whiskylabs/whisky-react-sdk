import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WhiskyProvider as WhiskyProviderCore } from '@whisky-gaming/core'
import React, { useMemo, useState, useEffect } from 'react'
import { WhiskyPlugin } from './plugins'

export interface WhiskyContext {
  provider: WhiskyProviderCore | null
  plugins: WhiskyPlugin[]
  addPlugin: (plugin: WhiskyPlugin) => void
}

export interface WhiskyProviderProps {
  plugins?: WhiskyPlugin[]
  /** @deprecated use "plugins" */
  __experimental_plugins?: any[]
}

export const WhiskyContext = React.createContext<WhiskyContext>({
  provider: null,
  plugins: [],
  addPlugin: () => null!,
})

export function useWhiskyContext() {
  const context = React.useContext(WhiskyContext)
  if (!context) throw new Error('No WhiskyContext')
  return context
}

export function WhiskyProvider({ plugins: _plugins = [], children }: React.PropsWithChildren<WhiskyProviderProps>) {
  const [plugins, setPlugins] = useState<WhiskyPlugin[]>(_plugins)
  const { connection } = useConnection()
  const { wallet, connected, publicKey, signTransaction, signAllTransactions } = useWallet()
  const [provider, setProvider] = useState<WhiskyProviderCore | null>(null)

  useEffect(() => {
    if (!connected || !publicKey || !signTransaction || !signAllTransactions) {
      setProvider(null)
      return
    }

    try {
      // Create a wallet adapter that matches WhiskyProviderWallet interface
      const whiskyWallet = {
        publicKey,
        signTransaction,
        signAllTransactions,
      }
      
      const newProvider = new WhiskyProviderCore(connection, whiskyWallet)
      setProvider(newProvider)
    } catch (error) {
      console.error('Error creating WhiskyProvider:', error)
      setProvider(null)
    }
  }, [connection, connected, publicKey, signTransaction, signAllTransactions])

  const addPlugin = (plugin: WhiskyPlugin) => {
    setPlugins((plugins) => [...plugins, plugin])
    return () => {
      setPlugins(
        (plugins) => plugins.filter((p) => p !== plugin),
      )
    }
  }

  return (
    <WhiskyContext.Provider value={{
      provider,
      plugins,
      addPlugin,
    }}>
      {children}
    </WhiskyContext.Provider>
  )
} 