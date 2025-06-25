import React, { PropsWithChildren } from 'react';
import * as _solana_web3_js from '@solana/web3.js';
import { PublicKey, TransactionInstruction, Commitment } from '@solana/web3.js';
import * as _whisky_gaming_core from '@whisky-gaming/core';
import { WhiskyProvider as WhiskyProvider$1, WhiskyEventType, WhiskyTransaction } from '@whisky-gaming/core';
export { AnyWhiskyEvent, BPS_PER_WHOLE, WhiskyEventType, WhiskyTransaction } from '@whisky-gaming/core';
import * as zustand from 'zustand';
import * as _coral_xyz_anchor from '@coral-xyz/anchor';
import { Player, Gain } from 'tone';

declare const FAKE_TOKEN_MINT: PublicKey;
interface TokenMeta {
    mint: PublicKey;
    name: string;
    symbol: string;
    image?: string;
    decimals: number;
    baseWager: number;
    /** Set this value if you want to use a private pool */
    poolAuthority?: PublicKey;
    usdPrice?: number;
}
type TokenMetaFetcher = (ids: string[]) => (Record<string, TokenMeta> | Promise<Record<string, TokenMeta>>);
type TokenMetaList = PartialTokenMetaWithMint[];
interface TokenMetaProps {
    fetcher?: TokenMetaFetcher;
    tokens?: TokenMetaList;
    debounce?: number;
}
type PartialTokenMetaWithMint = Partial<TokenMeta> & {
    mint: PublicKey;
};
interface TokenMetaContext extends TokenMetaProps {
    fallback?: (mint: string | PublicKey) => Partial<PartialTokenMetaWithMint> | undefined;
}
declare const TokenMetaContext: React.Context<TokenMetaContext>;
declare function TokenMetaProvider({ children, tokens, fetcher, debounce }: React.PropsWithChildren<TokenMetaProps>): React.JSX.Element;

interface WhiskyPluginInput {
    wallet: PublicKey;
    creator: PublicKey;
    token: PublicKey;
    wager: number;
    bet: number[];
    input: any;
}
interface WhiskyPluginContext {
    creatorFee: number;
    provider: any;
}
type WhiskyPlugin = (input: WhiskyPluginInput, context: WhiskyPluginContext) => TransactionInstruction[] | Promise<TransactionInstruction[]>;

interface WhiskyProviderProps {
    plugins?: WhiskyPlugin[];
    /** @deprecated use "plugins" */
    __experimental_plugins?: any[];
}
interface WhiskyContext {
    provider: WhiskyProvider$1 | null;
    plugins: WhiskyPlugin[];
    addPlugin: (plugin: WhiskyPlugin) => void;
}
declare const WhiskyContext: React.Context<WhiskyContext>;
declare function useWhiskyContext(): WhiskyContext;
declare function WhiskyProvider({ plugins: _plugins, children }: React.PropsWithChildren<WhiskyProviderProps>): React.JSX.Element;

declare function useAccount<T>(publicKey: PublicKey | null | undefined, decoder: (data: any) => T): T | null;

declare function useWalletAddress(): PublicKey;
declare function useBalance(publicKey: PublicKey, token: PublicKey, authority?: PublicKey): {
    nativeBalance: number;
    balance: number;
    bonusBalance: number;
};

interface UiPoolState {
    publicKey: PublicKey;
    token: PublicKey;
    liquidity: bigint;
    minWager: number;
    maxPayout: number;
    whiskyFee: number;
    poolFee: number;
    jackpotBalance: number;
    authority: PublicKey;
}
declare function usePool(token: PublicKey, authority?: PublicKey): UiPoolState;

interface SendTransactionOptions {
    confirmation?: 'processed' | 'confirmed' | 'finalized';
    label?: string;
    lookupTable?: PublicKey[];
}
declare const throwTransactionError: (error: any) => any;
declare function useTransactionError(callback: (error: any) => void): void;
declare function useSendTransaction(): (instructions: TransactionInstruction[], options?: SendTransactionOptions) => Promise<string>;

interface WhiskyPlayInput {
    wager: number;
    bet: number[];
    creator: string | PublicKey;
    creatorFee?: number;
    jackpotFee?: number;
    clientSeed?: string;
    token?: string | PublicKey;
    poolAuthority?: string | PublicKey;
    metadata?: (string | number)[];
}
declare function useWhiskyPlay(): (input: WhiskyPlayInput, additionalInstructions?: TransactionInstruction[], opts?: SendTransactionOptions & {
    lookupTables?: PublicKey[];
}) => Promise<string>;

declare function useNextResult(): () => Promise<{
    creator: PublicKey;
    user: PublicKey;
    rngSeed: string;
    clientSeed: string;
    nonce: number;
    bet: number[];
    resultIndex: number;
    wager: number;
    payout: number;
    profit: number;
    multiplier: number;
    token: PublicKey;
    bonusUsed: number;
    jackpotWin: number;
}>;
declare function useWhisky(): {
    play: (input: WhiskyPlayInput, additionalInstructions?: _solana_web3_js.TransactionInstruction[], opts?: SendTransactionOptions & {
        lookupTables?: PublicKey[];
    }) => Promise<string>;
    result: () => Promise<{
        creator: PublicKey;
        user: PublicKey;
        rngSeed: string;
        clientSeed: string;
        nonce: number;
        bet: number[];
        resultIndex: number;
        wager: number;
        payout: number;
        profit: number;
        multiplier: number;
        token: PublicKey;
        bonusUsed: number;
        jackpotWin: number;
    }>;
    userCreated: boolean;
    nonce: number;
    nextRngSeedHashed: string | undefined;
    game: {
        nonce: bn_js;
        user: PublicKey;
        tokenMint: PublicKey;
        pool: PublicKey;
        status: {
            none?: Record<string, never> | undefined;
            resultRequested?: Record<string, never> | undefined;
            ready?: Record<string, never> | undefined;
        };
        nextRngSeedHashed: string;
        rngSeed: string;
        timestamp: bn_js;
        creator: PublicKey;
        creatorMeta: string;
        wager: bn_js;
        underlyingUsed: bn_js;
        bonusUsed: bn_js;
        creatorFee: bn_js;
        whiskyFee: bn_js;
        poolFee: bn_js;
        jackpotFee: bn_js;
        jackpotResult: bn_js;
        jackpotProbabilityUbps: bn_js;
        jackpotPayout: bn_js;
        clientSeed: string;
        bet: number[];
        result: number;
        points: boolean;
        pointsAuthority: PublicKey;
        metadata: string;
        bump: number[];
    } | null;
    isPlaying: boolean;
    provider: _whisky_gaming_core.WhiskyProvider | null;
};

interface TransactionStore {
    state: 'none' | 'pending' | 'confirmed' | 'error';
    error?: Error;
    setState: (state: TransactionStore['state'], error?: Error) => void;
}
declare const useTransactionStore: zustand.UseBoundStore<zustand.StoreApi<TransactionStore>>;

declare function EffectTest({ src }: {
    src: string;
}): React.JSX.Element;

interface ReferralContext {
    referrerAddress: PublicKey | null;
    isOnChain: boolean;
    prefix: string;
    referralStatus: 'local' | 'on-chain' | 'fetching';
    clearCache: () => void;
    setCache: (address: PublicKey, isOnChain?: boolean) => void;
}
declare const ReferralContext: React.Context<ReferralContext>;
interface ReferralProviderProps {
    fee: number;
    prefix?: string;
    autoAccept?: boolean;
    /** localStorage or sessionStorage */
    storage?: Storage;
}
declare function ReferralProvider({ fee, prefix, children, storage, autoAccept, }: PropsWithChildren<ReferralProviderProps>): React.JSX.Element;

interface PlatformMeta {
    name: string;
    creator: PublicKey;
}
interface PoolToken {
    token: PublicKey;
    authority?: PublicKey;
}
interface WhiskyPlatformContext {
    platform: PlatformMeta;
    selectedPool: PoolToken;
    defaultCreatorFee: number;
    defaultJackpotFee: number;
    setDefaultJackpotFee: (defaultJackpotFee: number) => void;
    setPool: (tokenMint: PublicKey | string, authority?: PublicKey | string) => void;
    setToken: (tokenMint: PublicKey | string) => void;
    clientSeed: string;
    setClientSeed: (clientSeed: string) => void;
}
declare const WhiskyPlatformContext: React.Context<WhiskyPlatformContext>;
interface WhiskyPlatformProviderProps extends React.PropsWithChildren {
    creator: PublicKey | string;
    defaultPool?: PoolToken;
    /** How much the player should pay in fees to the platform */
    defaultCreatorFee?: number;
    /** How much the player should pay in fees to play for the jackpot in every game. 0.001 = 0.1% */
    defaultJackpotFee?: number;
    /** */
    referral?: ReferralProviderProps;
}
declare function WhiskyPlatformProvider(props: WhiskyPlatformProviderProps): React.JSX.Element;

/**
 * Renders the child elements to a <PortalTarget />.
 */
declare function Portal(props: React.PropsWithChildren<{
    target: string;
}>): React.JSX.Element;
/**
 * Renders the elements passed to a <Portal />.
 */
declare function PortalTarget(props: React.PropsWithChildren<{
    target: string;
}>): React.JSX.Element;

type ButtonSize = 'small' | 'medium' | 'large';
interface ButtonProps extends React.PropsWithChildren {
    disabled?: boolean;
    onClick?: () => void;
    main?: boolean;
    size?: ButtonSize;
}
declare function Button(props: ButtonProps): React.JSX.Element;

interface Props extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
    maxScale?: number;
    overlay?: boolean;
}
declare function ResponsiveSize({ children, maxScale, overlay, ...props }: Props): React.JSX.Element;

interface SelectProps<T> extends React.PropsWithChildren {
    value: T;
    disabled?: boolean;
    options: T[];
    onChange: (value: T) => void;
    label?: (value: T) => React.ReactNode;
    className?: string;
}
declare function Select<T>(props: SelectProps<T>): React.JSX.Element;

interface SwitchProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}
declare function Switch(props: SwitchProps): React.JSX.Element;

interface TextInputProps<T extends number | string> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    disabled?: boolean;
    onClick?: () => void;
    value: T;
    onChange?: (value: string) => void;
}
declare function TextInput<T extends number | string>({ onChange, ...props }: TextInputProps<T>): React.JSX.Element;

interface WagerInputBaseProps {
    value: number;
    onChange: (value: number) => void;
}
type WagerInputProps = WagerInputBaseProps & {
    className?: string;
    disabled?: boolean;
    options?: number[];
};
declare function WagerInput(props: WagerInputProps): React.JSX.Element;

interface WagerSelectProps {
    options: number[];
    value: number;
    onChange: (value: number) => void;
    className?: string;
}
/**
 * @deprecated Use WagerInput with "options" prop
 */
declare function WagerSelect(props: WagerSelectProps): React.JSX.Element;

interface PlaySoundParams {
    playbackRate?: number;
    gain?: number;
}
declare class Sound {
    player: Player;
    gain: Gain<"gain">;
    ready: boolean;
    private url?;
    constructor(url: string, autoPlay?: boolean);
    play({ playbackRate, gain }?: PlaySoundParams): void;
}
declare function useSound<T extends {
    [s: string]: string;
}>(definition: T): {
    play: (soundId: keyof T, params?: PlaySoundParams) => void;
    sounds: Record<keyof T, Sound>;
};

interface GameProps extends React.PropsWithChildren {
    game: GameBundle;
    errorFallback?: React.ReactNode;
}
interface GameContext {
    game: GameBundle;
}
declare const GameContext: React.Context<GameContext>;
declare function Game({ game, children, errorFallback }: GameProps): React.JSX.Element;
declare function PlayButton(props: ButtonProps): React.JSX.Element;
declare const WhiskyUi: {
    useGame: typeof useGame;
    useSound: typeof useSound;
    Portal: typeof Portal;
    PortalTarget: typeof PortalTarget;
    Effect: typeof EffectTest;
    Button: typeof Button;
    Game: typeof Game;
    Responsive: typeof ResponsiveSize;
    Canvas: React.ForwardRefExoticComponent<CanvasProps & React.RefAttributes<HTMLCanvasElement>>;
    WagerInput: typeof WagerInput;
    /**
     * @deprecated Use WagerInput with "options" prop
     */
    WagerSelect: typeof WagerSelect;
    Switch: typeof Switch;
    PlayButton: typeof PlayButton;
    Select: typeof Select;
    TextInput: typeof TextInput;
};

interface SendTransactionContext {
    /** Priority fee in microlamports. If set, a setComputeUnitPrice is added instruction to the transactions */
    priorityFee?: number;
    simulationUnits: number;
    /** % of the consumed units in the simulation to be used as computeUnitLimit in the actual transaction */
    computeUnitLimitMargin: number;
    /**  */
    blockhashCommitment?: Commitment;
}
declare const SendTransactionContext: React.Context<SendTransactionContext>;
type SendTransactionProps = Partial<SendTransactionContext>;
declare function SendTransactionProvider({ children, ...props }: React.PropsWithChildren<SendTransactionProps>): React.JSX.Element;

interface AnimationFrameData {
    time: number;
    delta: number;
}

interface CanvasContext {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    size: {
        width: number;
        height: number;
    };
}
interface CanvasProps extends React.InputHTMLAttributes<HTMLCanvasElement> {
    zIndex?: number;
    render: (context: CanvasContext, time: AnimationFrameData) => void;
}
declare const WhiskyCanvas: React.ForwardRefExoticComponent<CanvasProps & React.RefAttributes<HTMLCanvasElement>>;

interface TokenValueProps {
    mint?: PublicKey;
    amount: number;
    suffix?: string;
    exact?: boolean;
}
declare function TokenValue(props: TokenValueProps): React.JSX.Element;

interface UseWhiskyEventsParams {
    address?: PublicKey;
    signatureLimit?: number;
    listen?: boolean;
}
declare function useWhiskyEventListener<T extends WhiskyEventType>(eventName: T, callback: (event: WhiskyTransaction<T>) => void, deps?: React.DependencyList): void;
/**
 * Fetches previous events from the provided address (Defaults to creator set in <WhiskyProvider />)
 */
declare function useWhiskyEvents<T extends WhiskyEventType>(eventName: T, props?: {
    address?: PublicKey;
    signatureLimit?: number;
}): WhiskyTransaction<T>[];

declare function useTokenMeta(mint: PublicKey): TokenMeta;
declare namespace useTokenMeta {
    var debouce: number;
    var fallback: (mint: PublicKey) => (Partial<TokenMeta> | undefined);
    var setFallbackHandler: (cb: (mint: PublicKey) => (Partial<TokenMeta> | undefined)) => void;
    var fetcher: (mints: string[]) => {};
    var setFetcher: (cb: UseTokenMetaFetcher) => void;
}
type UseTokenMetaFetcher = (tokenMints: string[]) => (Promise<Record<string, TokenMeta>> | Record<string, TokenMeta>);

declare function useWhiskyPlatformContext(): WhiskyPlatformContext;
declare function useCurrentPool(): PoolToken;
declare function useCurrentToken(): TokenMeta;
declare function useFees(): number;
declare function useUserBalance(mint?: PublicKey): {
    nativeBalance: number;
    balance: number;
    bonusBalance: number;
};
declare function useWhiskyProvider(): _whisky_gaming_core.WhiskyProvider | null;
declare function useWhiskyProgram(): _coral_xyz_anchor.Program<_whisky_gaming_core.WhiskyCore> | undefined;

interface HeliusTokenFetcherParams {
    dollarBaseWager?: number;
}
/**
 * Creates a token metadata fetcher that batches token mints and uses a Helius RPC's "getAssetBatch" method to retrieve their info
 * @param heliusApiKey (Required Helius API key)
 * @returns
 */
declare function makeHeliusTokenFetcher(heliusApiKey: string, params?: HeliusTokenFetcherParams): (tokenMints: string[]) => Promise<Record<string, TokenMeta>>;

declare function useReferral(): {
    /** Accepts the invite on-chain. Requires a signature from the user. You can also use `acceptInviteOnNextPlay`. */
    acceptInvite: (address: PublicKey, options?: any) => Promise<string>;
    /** Removes the invite on-chain and cache. */
    removeInvite: (options?: any) => Promise<string>;
    /** Clears the local cache. */
    clearCache: () => void;
    /**
     * Stores the invite locally until the next play, at which point it will be upserted on-chain.
     * @note If the user has already accepted an invite on-chain, the local invite will be ignored and must be removed with `removeInvite`.
     * */
    acceptInviteOnNextPlay: (address: PublicKey) => Promise<void>;
    /** Copies the users invite code to clipboard */
    copyLinkToClipboard: () => void;
    /** The address which referred the connected user */
    referrerAddress: PublicKey | null;
    /** Whether on not the connected user has been accepted the invite on-chain */
    isOnChain: boolean;
    referralStatus: "local" | "on-chain" | "fetching";
    referralLink: string | null;
};

interface GameBundle<T = any> {
    id: string;
    app: any;
    meta?: T;
    props?: any;
}
declare function useGame(): {
    game: GameBundle | null;
    setGame: (game: GameBundle | null) => void;
};
declare function useWagerInput(initial?: number): readonly [number, React.Dispatch<React.SetStateAction<number | undefined>>];
/** @deprecated Use <TokenMetaProvider /> */
declare function useTokenList(): TokenMetaList;
/** @deprecated Use <TokenMetaProvider /> */
declare const WhiskyStandardTokens: {
    fake: {
        mint: PublicKey;
        name: string;
        symbol: string;
        decimals: number;
        baseWager: number;
    };
    sol: {
        mint: PublicKey;
        name: string;
        symbol: string;
        decimals: number;
        baseWager: number;
    };
    usdc: {
        mint: PublicKey;
        name: string;
        symbol: string;
        decimals: number;
        baseWager: number;
    };
};

export { CanvasContext, CanvasProps, EffectTest, FAKE_TOKEN_MINT, GameBundle, GameContext, PartialTokenMetaWithMint, PlayButton, PoolToken, ReferralContext, ReferralProvider, ReferralProviderProps, SendTransactionContext, SendTransactionOptions, SendTransactionProps, SendTransactionProvider, TokenMeta, TokenMetaContext, TokenMetaFetcher, TokenMetaList, TokenMetaProps, TokenMetaProvider, TokenValue, TokenValueProps, UiPoolState, UseWhiskyEventsParams, WhiskyCanvas, WhiskyContext, WhiskyPlatformContext, WhiskyPlatformProvider, WhiskyPlayInput, WhiskyPlugin, WhiskyPluginContext, WhiskyPluginInput, WhiskyProvider, WhiskyProviderProps, WhiskyStandardTokens, WhiskyUi, makeHeliusTokenFetcher, throwTransactionError, useAccount, useBalance, useCurrentPool, useCurrentToken, useFees, useGame, useNextResult, usePool, useReferral, useSendTransaction, useTokenList, useTokenMeta, useTransactionError, useTransactionStore, useUserBalance, useWagerInput, useWalletAddress, useWhisky, useWhiskyContext, useWhiskyEventListener, useWhiskyEvents, useWhiskyPlatformContext, useWhiskyPlay, useWhiskyProgram, useWhiskyProvider };
