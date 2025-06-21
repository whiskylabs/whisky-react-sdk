# @whisky-gaming/ui

A unified React UI library for the Whisky Gaming Protocol, combining both UI components and React hooks.

## Features

- **Unified Package**: Combines UI components and React hooks in a single package
- **Whisky Protocol Integration**: Built specifically for the Whisky Gaming Protocol
- **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- **Wallet Integration**: Seamless integration with Solana wallet adapters
- **Plugin System**: Extensible plugin system for custom functionality
- **Transaction Management**: Built-in transaction handling and state management

## Installation

```bash
npm install @whisky-gaming/ui
```

## Quick Start

```tsx
import { WhiskyProvider, useWhisky, WhiskyPlatformProvider } from '@whisky-gaming/ui'

function App() {
  return (
    <WhiskyProvider>
      <WhiskyPlatformProvider>
        <YourGame />
      </WhiskyPlatformProvider>
    </WhiskyProvider>
  )
}

function YourGame() {
  const { play, isPlaying, game } = useWhisky()
  
  const handlePlay = async () => {
    await play({
      wager: 1000000, // 0.001 SOL
      bet: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 10x multiplier
      creator: 'YOUR_CREATOR_ADDRESS',
    })
  }
  
  return (
    <div>
      <button onClick={handlePlay} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Play'}
      </button>
    </div>
  )
}
```

## Core Components

### WhiskyProvider
The main provider that wraps your app and provides access to the Whisky protocol.

```tsx
import { WhiskyProvider } from '@whisky-gaming/ui'

<WhiskyProvider plugins={[yourCustomPlugin]}>
  {children}
</WhiskyProvider>
```

### WhiskyPlatformProvider
Provides platform-specific functionality like token selection and pool management.

```tsx
import { WhiskyPlatformProvider } from '@whisky-gaming/ui'

<WhiskyPlatformProvider>
  {children}
</WhiskyPlatformProvider>
```

## Hooks

### useWhisky()
Main hook for interacting with the Whisky protocol.

```tsx
const { play, result, isPlaying, game } = useWhisky()
```

### usePool()
Get pool information for a specific token.

```tsx
const pool = usePool(tokenMint, poolAuthority)
```

### useBalance()
Get balance information for a wallet and token.

```tsx
const { balance, nativeBalance, bonusBalance } = useBalance(wallet, token)
```

### useWalletAddress()
Get the current wallet address.

```tsx
const walletAddress = useWalletAddress()
```

## UI Components

### TokenValue
Display token values with proper formatting.

```tsx
import { TokenValue } from '@whisky-gaming/ui'

<TokenValue amount={1000000} token={tokenMeta} />
```

### Canvas
Game canvas component for rendering games.

```tsx
import { Canvas } from '@whisky-gaming/ui'

<Canvas game={gameBundle} />
```

## Plugin System

Create custom plugins to extend functionality:

```tsx
import { WhiskyPlugin } from '@whisky-gaming/ui'

const myPlugin: WhiskyPlugin = async (input, context) => {
  // Your custom logic here
  return [] // Return additional transaction instructions
}

<WhiskyProvider plugins={[myPlugin]}>
  {children}
</WhiskyProvider>
```

## Referral System

Built-in referral system support:

```tsx
import { ReferralProvider, useReferral } from '@whisky-gaming/ui'

<ReferralProvider>
  <YourApp />
</ReferralProvider>

// In your component
const { referralCode, setReferralCode } = useReferral()
```

## Dependencies

This package requires the following peer dependencies:

- `@whisky-gaming/core`: The core Whisky protocol SDK
- `@solana/wallet-adapter-react`: Solana wallet integration
- `@solana/web3.js`: Solana web3 utilities
- `react`: React library
- `react-dom`: React DOM

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Development mode with watch
npm run dev

# Type checking
npm run lint
```

## License

MIT 