import { PublicKey, TransactionInstruction } from '@solana/web3.js'

export interface WhiskyPluginInput {
  wallet: PublicKey
  creator: PublicKey
  token: PublicKey
  wager: number
  bet: number[]
  input: any
}

export interface WhiskyPluginContext {
  creatorFee: number
  provider: any
}

export type WhiskyPlugin = (
  input: WhiskyPluginInput,
  context: WhiskyPluginContext,
) => TransactionInstruction[] | Promise<TransactionInstruction[]> 