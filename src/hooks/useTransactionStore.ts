import { create } from 'zustand'

interface TransactionStore {
  state: 'none' | 'pending' | 'confirmed' | 'error'
  error?: Error
  setState: (state: TransactionStore['state'], error?: Error) => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  state: 'none',
  setState: (state, error) => set({ state, error }),
})) 