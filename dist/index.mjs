// src/index.ts
import React27, { createContext as createContext2 } from "react";
import { PublicKey as PublicKey13 } from "@solana/web3.js";

// src/WhiskyPlatformProvider.tsx
import { PublicKey as PublicKey11 } from "@solana/web3.js";
import { NATIVE_MINT as NATIVE_MINT4 } from "@whisky-gaming/core";
import React25 from "react";

// src/PortalContext.tsx
import React from "react";
import ReactDOM from "react-dom";
var PortalContext = React.createContext(null);
var PortalProvider = (props) => {
  const [refs, _setRefs] = React.useState({});
  const context = {
    refs,
    setRef(target, ref) {
      _setRefs((refs2) => ({ ...refs2, [target]: ref }));
    }
  };
  return /* @__PURE__ */ React.createElement(PortalContext.Provider, { value: context }, props.children);
};
function Portal(props) {
  const { refs } = React.useContext(PortalContext);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, refs[props.target]?.current && ReactDOM.createPortal(props.children, refs[props.target]?.current));
}
function PortalTarget(props) {
  const { setRef } = React.useContext(PortalContext);
  const ref = React.useRef(null);
  React.useEffect(
    () => {
      setRef(props.target, ref);
      return () => setRef(props.target, null);
    },
    [props.target]
  );
  return /* @__PURE__ */ React.createElement("div", { style: { display: "contents" }, ref }, props.children);
}

// src/referral/ReferralContext.tsx
import { useWallet as useWallet5 } from "@solana/wallet-adapter-react";
import { PublicKey as PublicKey10 } from "@solana/web3.js";
import React24, { createContext, useEffect as useEffect4, useState as useState3 } from "react";

// src/WhiskyProvider.tsx
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WhiskyProvider as WhiskyProviderCore } from "@whisky-gaming/core";
import React2, { useState, useEffect } from "react";
var WhiskyContext = React2.createContext({
  provider: null,
  plugins: [],
  addPlugin: () => null
});
function useWhiskyContext() {
  const context = React2.useContext(WhiskyContext);
  if (!context)
    throw new Error("No WhiskyContext");
  return context;
}
function WhiskyProvider({ plugins: _plugins = [], children }) {
  const [plugins, setPlugins] = useState(_plugins);
  const { connection } = useConnection();
  const { wallet, connected, publicKey, signTransaction, signAllTransactions } = useWallet();
  const [provider, setProvider] = useState(null);
  useEffect(() => {
    if (!connected || !publicKey || !signTransaction || !signAllTransactions) {
      setProvider(null);
      return;
    }
    try {
      const whiskyWallet = {
        publicKey,
        signTransaction,
        signAllTransactions
      };
      const newProvider = new WhiskyProviderCore(connection, whiskyWallet);
      setProvider(newProvider);
    } catch (error) {
      console.error("Error creating WhiskyProvider:", error);
      setProvider(null);
    }
  }, [connection, connected, publicKey, signTransaction, signAllTransactions]);
  const addPlugin = (plugin) => {
    setPlugins((plugins2) => [...plugins2, plugin]);
    return () => {
      setPlugins(
        (plugins2) => plugins2.filter((p) => p !== plugin)
      );
    };
  };
  return /* @__PURE__ */ React2.createElement(WhiskyContext.Provider, { value: {
    provider,
    plugins,
    addPlugin
  } }, children);
}

// src/hooks/index.ts
import React23 from "react";

// src/hooks/useTokenMeta.tsx
import { signal } from "@preact/signals-react";
import { PublicKey as PublicKey2 } from "@solana/web3.js";
import React4 from "react";

// src/TokenMetaProvider.tsx
import React3 from "react";
import { PublicKey } from "@solana/web3.js";
var FAKE_TOKEN_MINT = new PublicKey("FakeCDoCX1NWywV9m63fk7gmV9S4seMoyqzcNYEmRYjy");
var TokenMetaContext = React3.createContext({});
function TokenMetaProvider({ children, tokens = [], fetcher, debounce }) {
  const byMint = React3.useMemo(
    () => {
      return tokens.reduce((prev, value) => ({
        ...prev,
        [value.mint.toString()]: value
      }), {});
    },
    [tokens]
  );
  const fallback = (mint) => {
    return byMint[mint.toString()];
  };
  return /* @__PURE__ */ React3.createElement(TokenMetaContext.Provider, { value: { tokens, fallback, fetcher, debounce } }, children);
}

// src/hooks/useTokenMeta.tsx
var DEFAULT_DEBOUNCE_MS = 0;
var tokenMints = signal(/* @__PURE__ */ new Set());
var tokenData = signal({});
var STANDARD_TOKEN_DATA = {
  So11111111111111111111111111111111111111112: {
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
    image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    baseWager: 0.01 * 1e9
  },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    symbol: "USDC",
    image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    usdPrice: 1,
    decimals: 6,
    baseWager: 1 * 1e6
  },
  [FAKE_TOKEN_MINT.toString()]: {
    name: "Fake Money",
    image: "./whiskyglass.png",
    symbol: "FAKE",
    decimals: 9,
    baseWager: 1 * 1e9,
    usdPrice: 0
  }
};
var fetchTimeout;
function useTokenMeta(mint) {
  const context = React4.useContext(TokenMetaContext);
  const fetchedTokenData = tokenData.value[mint.toString()];
  React4.useEffect(() => {
    tokenMints.value.add(mint.toString());
    clearTimeout(fetchTimeout);
    fetchTimeout = setTimeout(async () => {
      if (!context.fetcher)
        return;
      const unique = Array.from(tokenMints.value).filter((x) => x !== FAKE_TOKEN_MINT.toString() && !Object.keys(tokenData.value).includes(x));
      if (!unique.length) {
        return;
      }
      console.debug("Fetching Mint", unique);
      const newData = await context.fetcher(unique);
      tokenData.value = { ...tokenData.value, ...newData };
      tokenMints.value.clear();
    }, context.debounce ?? DEFAULT_DEBOUNCE_MS);
    return () => {
      clearTimeout(fetchTimeout);
    };
  }, [mint.toString()]);
  const defaultToken = {
    mint: new PublicKey2(mint),
    name: "Unknown",
    symbol: mint.toString().substring(0, 3),
    image: void 0,
    decimals: 9,
    baseWager: 1,
    usdPrice: 0
  };
  const fallback = context.fallback ?? (() => void 0);
  return {
    ...defaultToken,
    ...fetchedTokenData,
    ...STANDARD_TOKEN_DATA[mint.toString()],
    ...fallback(mint)
  };
}
useTokenMeta.debouce = DEFAULT_DEBOUNCE_MS;
useTokenMeta.fallback = (mint) => {
  return void 0;
};
useTokenMeta.setFallbackHandler = (cb) => {
};
useTokenMeta.fetcher = (mints) => {
  return {};
};
useTokenMeta.setFetcher = (cb) => {
};

// src/hooks/useBalances.ts
import { useWallet as useWallet2 } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { getPoolAddress, getUserUnderlyingAta, getUserBonusAtaForPool, isNativeMint } from "@whisky-gaming/core";

// src/hooks/useAccount.ts
import { useConnection as useConnection2 } from "@solana/wallet-adapter-react";
import { useMemo as useMemo2, useEffect as useEffect2, useState as useState2, useCallback, useRef } from "react";
function useAccount(publicKey, decoder) {
  const { connection } = useConnection2();
  const [account, setAccount] = useState2(null);
  const [error, setError] = useState2(null);
  const lastFetchTime = useRef(0);
  const isFetching = useRef(false);
  const memoizedDecoder = useCallback(decoder, []);
  const publicKeyString = useMemo2(() => publicKey?.toString(), [publicKey]);
  useEffect2(() => {
    if (!publicKey || !publicKeyString) {
      setAccount(null);
      return;
    }
    let subscriptionId;
    let isActive = true;
    const fetchAccount = async () => {
      const now = Date.now();
      if (isFetching.current || now - lastFetchTime.current < 1e3) {
        return;
      }
      isFetching.current = true;
      lastFetchTime.current = now;
      try {
        const accountInfo = await connection.getAccountInfo(publicKey);
        if (!isActive)
          return;
        if (accountInfo) {
          const decoded = memoizedDecoder(accountInfo.data);
          setAccount(decoded);
        } else {
          setAccount(null);
        }
        setError(null);
      } catch (err) {
        if (!isActive)
          return;
        console.warn("Error fetching account:", publicKeyString, err);
        setError(err);
        setAccount(null);
      } finally {
        isFetching.current = false;
      }
    };
    const subscribeToAccount = () => {
      try {
        subscriptionId = connection.onAccountChange(
          publicKey,
          (accountInfo) => {
            if (!isActive)
              return;
            if (accountInfo) {
              try {
                const decoded = memoizedDecoder(accountInfo.data);
                setAccount(decoded);
                setError(null);
              } catch (err) {
                console.warn("Error decoding account:", publicKeyString, err);
                setError(err);
                setAccount(null);
              }
            } else {
              setAccount(null);
            }
          },
          "confirmed"
        );
      } catch (err) {
        console.warn("Error setting up account subscription:", publicKeyString, err);
      }
    };
    fetchAccount();
    subscribeToAccount();
    return () => {
      isActive = false;
      if (subscriptionId !== void 0) {
        try {
          connection.removeAccountChangeListener(subscriptionId);
        } catch (err) {
          console.warn("Error removing account listener:", err);
        }
      }
    };
  }, [connection, publicKeyString, memoizedDecoder]);
  if (error) {
    console.error("Error fetching account:", error);
  }
  return account;
}

// src/hooks/useBalances.ts
import { useMemo as useMemo3 } from "react";
var emptyAccount = new Keypair();
function useWalletAddress() {
  const wallet = useWallet2();
  return wallet.publicKey ?? emptyAccount.publicKey;
}
function useBalance(publicKey, token, authority) {
  const addresses = useMemo3(() => {
    const ata = getUserUnderlyingAta(publicKey, token);
    const bonusAta = getUserBonusAtaForPool(publicKey, getPoolAddress(token, authority));
    return {
      ata,
      bonusAta,
      publicKeyString: publicKey.toString(),
      tokenString: token.toString(),
      authorityString: authority?.toString()
    };
  }, [publicKey, token, authority]);
  const userAccount = useAccount(publicKey, (info) => info);
  const tokenAccount = useAccount(addresses.ata, (data) => data);
  const bonusAccount = useAccount(addresses.bonusAta, (data) => data);
  const balance = useMemo3(() => {
    const nativeBalance = Number(userAccount?.lamports ?? 0);
    const tokenBalance = Number(tokenAccount?.amount ?? 0);
    const bonusBalance = Number(bonusAccount?.amount ?? 0);
    return {
      nativeBalance,
      balance: isNativeMint(token) ? nativeBalance : tokenBalance,
      bonusBalance
    };
  }, [userAccount?.lamports, tokenAccount?.amount, bonusAccount?.amount, token]);
  return balance;
}

// src/hooks/usePool.ts
import {
  BPS_PER_WHOLE,
  SYSTEM_PROGRAM,
  decodeAta,
  decodeWhiskyState,
  decodePool,
  getWhiskyStateAddress,
  getPoolAddress as getPoolAddress2,
  getPoolJackpotTokenAccountAddress
} from "@whisky-gaming/core";
function usePool(token, authority = SYSTEM_PROGRAM) {
  const publicKey = getPoolAddress2(token, authority);
  const account = useAccount(publicKey, decodePool);
  const whiskyState = useAccount(getWhiskyStateAddress(), decodeWhiskyState);
  const jackpotUnderlyingTokenAccount = useAccount(getPoolJackpotTokenAccountAddress(publicKey), decodeAta);
  const jackpotBalance = jackpotUnderlyingTokenAccount?.amount ?? BigInt(0);
  if (!account) {
    return {
      token,
      publicKey,
      liquidity: BigInt(0),
      minWager: 0,
      maxPayout: 0,
      whiskyFee: 0,
      poolFee: 0,
      jackpotBalance: 0,
      authority
    };
  }
  const liquidity = BigInt(account.liquidityCheckpoint);
  const customWhiskyFeeBps = account.customWhiskyFeeBps.toNumber();
  const customPoolFeeBps = account.customPoolFeeBps.toNumber();
  const whiskyFee = ((customWhiskyFeeBps || whiskyState?.whiskyFeeBps.toNumber()) ?? 0) / BPS_PER_WHOLE;
  const poolFee = ((customPoolFeeBps || whiskyState?.defaultPoolFee.toNumber()) ?? 0) / BPS_PER_WHOLE;
  const maxPayoutBps = (account.customMaxPayoutBps?.toNumber() || whiskyState?.maxPayoutBps?.toNumber()) ?? 0;
  const maxPayout = Number(liquidity * BigInt(maxPayoutBps)) / BPS_PER_WHOLE;
  return {
    token,
    publicKey,
    minWager: account.minWager.toNumber(),
    liquidity,
    maxPayout,
    whiskyFee,
    poolFee,
    jackpotBalance: Number(jackpotBalance),
    authority
  };
}

// src/hooks/useWhisky.ts
import { useConnection as useConnection4 } from "@solana/wallet-adapter-react";
import { decodeGame, getGameAddress, getNextResult } from "@whisky-gaming/core";

// src/hooks/useWhiskyPlay.ts
import { useWallet as useWallet4 } from "@solana/wallet-adapter-react";
import { PublicKey as PublicKey5 } from "@solana/web3.js";
import { NATIVE_MINT as NATIVE_MINT2, SYSTEM_PROGRAM as SYSTEM_PROGRAM2, getPoolAddress as getPoolAddress3 } from "@whisky-gaming/core";

// src/hooks/useSendTransaction.ts
import { useConnection as useConnection3, useWallet as useWallet3 } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { useCallback as useCallback2 } from "react";
import React5 from "react";

// src/hooks/useTransactionStore.ts
import { create } from "zustand";
var useTransactionStore = create((set) => ({
  state: "none",
  setState: (state, error) => set({ state, error })
}));

// src/PubSub.ts
var PubSub = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = (listener) => {
      this.listeners.add(listener);
      return () => {
        this.listeners.delete(listener);
      };
    };
    this.emit = (...args) => {
      this.listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (error) {
          console.error("Error in PubSub listener:", error);
        }
      });
    };
  }
};

// src/hooks/useSendTransaction.ts
var transactionEventEmitter = new PubSub();
var throwTransactionError = (error) => {
  transactionEventEmitter.emit(error);
  return error;
};
function useTransactionError(callback) {
  React5.useLayoutEffect(
    () => transactionEventEmitter.subscribe(callback),
    [callback]
  );
}
function useSendTransaction() {
  const { connection } = useConnection3();
  const { sendTransaction, publicKey } = useWallet3();
  const { setState } = useTransactionStore();
  return useCallback2(
    async (instructions, options = {}) => {
      try {
        setState("pending");
        if (!publicKey) {
          throw new Error("Wallet not connected");
        }
        const transaction = new Transaction();
        instructions.forEach((instruction) => {
          transaction.add(instruction);
        });
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;
        const signature = await sendTransaction(transaction, connection, {
          skipPreflight: false,
          preflightCommitment: options.confirmation || "confirmed"
        });
        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight
        }, options.confirmation || "confirmed");
        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${confirmation.value.err}`);
        }
        setState("confirmed");
        return signature;
      } catch (error) {
        setState("error", error);
        throw throwTransactionError(error);
      }
    },
    [connection, sendTransaction, publicKey, setState]
  );
}

// src/hooks/useWhiskyPlay.ts
function useWhiskyPlay() {
  const { connected } = useWallet4();
  const sendTx = useSendTransaction();
  const context = useWhiskyContext();
  const provider = context.provider;
  return async function play(input, additionalInstructions = [], opts) {
    const creator = new PublicKey5(input.creator);
    const creatorFee = input.creatorFee ?? 0;
    const jackpotFee = input.jackpotFee ?? 0;
    const meta = input.metadata?.join(":") ?? "";
    const token = new PublicKey5(input.token ?? NATIVE_MINT2);
    const poolAuthority = new PublicKey5(input.poolAuthority ?? SYSTEM_PROGRAM2);
    if (!connected) {
      throw throwTransactionError(new Error("NOT_CONNECTED"));
    }
    if (!provider) {
      throw throwTransactionError(new Error("PROVIDER_NOT_AVAILABLE"));
    }
    const pluginInput = {
      wallet: provider.user,
      creator,
      token,
      wager: input.wager,
      bet: input.bet,
      input
    };
    const pluginContext = {
      creatorFee,
      provider
    };
    const pluginInstructions = [];
    for (const plugin of context.plugins) {
      try {
        const resolved = await plugin(pluginInput, pluginContext);
        if (resolved && Array.isArray(resolved)) {
          pluginInstructions.push(...resolved);
        }
      } catch (error) {
        console.error("Plugin error:", error);
      }
    }
    const pool = getPoolAddress3(token, poolAuthority);
    const playInstruction = await Promise.resolve(provider.play(
      input.wager,
      input.bet,
      input.clientSeed ?? "",
      pool,
      token,
      creator,
      pluginContext.creatorFee,
      jackpotFee,
      meta
    ));
    const allInstructions = [
      ...additionalInstructions,
      playInstruction,
      ...pluginInstructions
    ];
    return sendTx(allInstructions, { ...opts, label: "play", lookupTable: opts?.lookupTables });
  };
}

// src/hooks/useWhisky.ts
function useNextResult() {
  const { connection } = useConnection4();
  const userAddress = useWalletAddress();
  const game = useAccount(getGameAddress(userAddress), decodeGame);
  return () => {
    const prevNonce = game?.nonce?.toNumber() ?? 0;
    return getNextResult(connection, userAddress, prevNonce);
  };
}
function useWhisky() {
  const userAddress = useWalletAddress();
  const game = useAccount(getGameAddress(userAddress), decodeGame);
  const userCreated = !!game;
  const nextRngSeedHashed = game?.nextRngSeedHashed;
  const txStore = useTransactionStore();
  const isPlaying = txStore.state !== "error" && txStore.state !== "none" || !!game?.status?.resultRequested;
  const play = useWhiskyPlay();
  const result = useNextResult();
  const { provider } = useWhiskyContext();
  return {
    play,
    result,
    userCreated,
    nonce: Number(game?.nonce?.toNumber() ?? 0),
    nextRngSeedHashed,
    game,
    isPlaying,
    provider
  };
}

// src/hooks/useWhiskyEvents.ts
import { useConnection as useConnection5 } from "@solana/wallet-adapter-react";
import { PROGRAM_ID, fetchWhiskyTransactions } from "@whisky-gaming/core";
import React6 from "react";
function useWhiskyEventListener(eventName, callback, deps = []) {
  const program = useWhiskyProgram();
  React6.useEffect(() => {
    if (!program) {
      console.warn("Whisky program not found");
      return;
    }
    const listener = program.addEventListener(
      eventName,
      (data, slot, signature) => {
        const event = {
          signature,
          time: Date.now(),
          name: eventName,
          data
        };
        callback(event);
      }
    );
    return () => {
      program.removeEventListener(listener);
    };
  }, [eventName, program, ...deps]);
}
function useWhiskyEvents(eventName, props = {}) {
  const { signatureLimit = 30 } = props;
  const { connection } = useConnection5();
  const [events, setEvents] = React6.useState([]);
  const address = props.address ?? PROGRAM_ID;
  React6.useEffect(
    () => {
      fetchWhiskyTransactions(
        connection,
        address,
        { limit: signatureLimit }
      ).then((x) => setEvents(x));
    },
    [connection, signatureLimit, address]
  );
  return React6.useMemo(
    () => events.filter((x) => x.name === eventName),
    [eventName, events]
  );
}

// src/hooks/useWagerInput.ts
import React7 from "react";

// src/hooks/useSound.ts
import { useCallback as useCallback3, useEffect as useEffect3, useMemo as useMemo4 } from "react";
import { Player, Gain } from "tone";
import { create as create2 } from "zustand";
var useSoundStore = create2(
  (set, get) => ({
    volume: 0.5,
    masterGain: 0.5,
    set: (volume) => set({ volume, masterGain: volume }),
    get
  })
);
var useWhiskyAudioStore = useSoundStore;
var Sound = class {
  constructor(url, autoPlay = false) {
    this.player = new Player();
    this.gain = new Gain();
    this.ready = false;
    this.url = url;
    this.player.load(url).then((x) => {
      this.ready = x.loaded;
      this.player.connect(this.gain);
      this.gain.toDestination();
      if (autoPlay) {
        this.player.loop = true;
        this.player.start();
      }
    }).catch((err) => console.error("Failed to load audio", err));
  }
  play({ playbackRate = 1, gain = 0.1 } = {}) {
    try {
      this.player.playbackRate = playbackRate;
      this.gain.set({ gain });
      this.player.start();
    } catch (err) {
      console.warn("Failed to play sound", this.url, err);
    }
  }
};
function useSound(definition) {
  const store = useSoundStore();
  const sources = Object.keys(definition);
  const soundById = useMemo4(
    () => Object.entries(definition).map(([id, url]) => {
      const sound = new Sound(url);
      return { id, sound };
    }).reduce((prev, { id, sound }) => ({
      ...prev,
      [id]: sound
    }), {}),
    [...sources]
  );
  const sounds = useMemo4(() => Object.entries(soundById).map(([_, s]) => s), [soundById]);
  useEffect3(
    () => {
      return () => {
        sounds.forEach((sound) => {
          sound.player.stop();
          sound.player.dispose();
        });
      };
    },
    [soundById]
  );
  useEffect3(
    () => {
      sounds.forEach((sound) => {
        sound.gain.set({ gain: store.volume });
      });
    },
    [store.volume]
  );
  const play = useCallback3(
    (soundId, params) => {
      const gain = params?.gain ?? 1;
      const opts = { ...params, gain: gain * store.get().volume };
      soundById[soundId].play(opts);
    },
    [soundById]
  );
  return {
    play,
    sounds: soundById
  };
}

// src/hooks/useGame.ts
import { PublicKey as PublicKey6 } from "@solana/web3.js";
import React22 from "react";

// src/GameContext.tsx
import React20 from "react";

// src/EffectTest.tsx
import React8 from "react";

// src/hooks/useAnimationFrame.ts
import { useLayoutEffect, useRef as useRef2 } from "react";
var useAnimationFrame_default = (cb) => {
  if (typeof performance === "undefined" || typeof window === "undefined") {
    return;
  }
  const cbRef = useRef2(null);
  const frame = useRef2();
  const init = useRef2(performance.now());
  const last = useRef2(performance.now());
  cbRef.current = cb;
  const animate = (now) => {
    cbRef.current({
      time: (now - init.current) / 1e3,
      delta: (now - last.current) / 1e3
    });
    last.current = now;
    frame.current = requestAnimationFrame(animate);
  };
  useLayoutEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => {
      frame.current && cancelAnimationFrame(frame.current);
    };
  }, []);
};

// src/EffectTest.tsx
function EffectTest({ src }) {
  const parts = React8.useRef(Array.from({ length: 25 }).map(() => ({
    x: Math.random(),
    y: -Math.random() * 600
  })));
  const image = React8.useMemo(
    () => {
      const image2 = document.createElement("img");
      image2.src = src;
      return image2;
    },
    [src]
  );
  useAnimationFrame_default(
    () => {
      parts.current.forEach(
        (part, i) => {
          const speed = (1 + Math.sin(i * 44213.3) * 0.1) * 5;
          part.y += speed;
        }
      );
    }
  );
  return /* @__PURE__ */ React8.createElement(
    WhiskyUi.Canvas,
    {
      zIndex: 99,
      style: { pointerEvents: "none" },
      render: ({ ctx, size }, clock) => {
        ctx.save();
        ctx.clearRect(0, 0, size.width, size.height);
        ctx.fillStyle = "#00000011";
        ctx.fillRect(0, 0, size.width, size.height);
        ctx.font = "30px arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#22ff11";
        parts.current.forEach(
          (part, i) => {
            ctx.save();
            ctx.translate(part.x * size.width, size.height - part.y - 25);
            ctx.scale(0.5, 0.5);
            ctx.drawImage(image, 0, 0);
            ctx.restore();
          }
        );
        ctx.restore();
      }
    }
  );
}

// src/ErrorBoundary.tsx
import React9 from "react";
var ErrorBoundary = class extends React9.Component {
  constructor() {
    super(...arguments);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.props.onError && this.props.onError(error);
    this.setState({ hasError: true, error: errorInfo });
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback)
        return this.props.fallback;
      return null;
    }
    return this.props.children;
  }
};

// src/components/Button.tsx
import React10 from "react";
import styled, { css } from "styled-components";
var StyledButton = styled.button`
  --color: var(--whisky-ui-button-default-color);
  --background-color: var(--whisky-ui-button-default-background);
  --background-color-hover: var(--whisky-ui-button-default-background-hover);

  ${(props) => props.$main && css`
    --background-color: var(--whisky-ui-button-main-background);
    --color: var(--whisky-ui-button-main-color);
    --background-color-hover: var(--whisky-ui-button-main-background-hover);
  `}

  ${(props) => css`
    --padding: ${props.$size === "small" ? "5px" : props.$size === "medium" ? "10px" : props.$size === "large" && "15px"};
  `}

  background: var(--background-color);
  color: var(--color);
  &:hover {
    background: var(--background-color-hover);
  }

  border: none;
  border-radius: var(--whisky-ui-border-radius);
  padding: var(--padding);
  cursor: pointer;
  /* min-width: 100px; */
  text-align: center;
  align-items: center;

  &:disabled {
    cursor: default;
    opacity: .7;
  }
`;
function Button(props) {
  return /* @__PURE__ */ React10.createElement(
    StyledButton,
    {
      disabled: props.disabled,
      onClick: props.onClick,
      $main: props.main,
      $size: props.size ?? "medium"
    },
    props.children
  );
}

// src/components/Canvas.tsx
import React11 from "react";
var WhiskyCanvas = React11.forwardRef(function Canvas(props, forwardRef) {
  const { render, zIndex = 0, style, ...rest } = props;
  const wrapper = React11.useRef(null);
  const canvas = React11.useRef(null);
  React11.useImperativeHandle(forwardRef, () => canvas.current);
  useAnimationFrame_default(
    (time) => {
      const ctx = canvas.current.getContext("2d");
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      render(
        {
          canvas: canvas.current,
          ctx,
          size: {
            width: wrapper.current.clientWidth,
            height: wrapper.current.clientHeight
          }
        },
        time
      );
      ctx.restore();
    }
  );
  React11.useLayoutEffect(() => {
    let timeout;
    const resize = () => {
      canvas.current.width = wrapper.current.clientWidth * window.devicePixelRatio;
      canvas.current.height = wrapper.current.clientHeight * window.devicePixelRatio;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper.current);
    const resizeHandler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        resize();
      }, 250);
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
      ro.disconnect();
      clearTimeout(timeout);
    };
  }, []);
  return /* @__PURE__ */ React11.createElement("div", { ref: wrapper, style: { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex } }, /* @__PURE__ */ React11.createElement("canvas", { ...rest, style: { width: "100%", height: "100%", ...style }, ref: canvas }));
});

// src/components/ResponsiveSize.tsx
import React12 from "react";
import styled2 from "styled-components";
var Responsive = styled2.div`
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100%;
  flex-direction: column;
  max-width: 100vw;
  height: 100%;
  left: 0;
  top: 0;
`;
function ResponsiveSize({ children, maxScale = 1, overlay, ...props }) {
  const wrapper = React12.useRef(null);
  const inner = React12.useRef(null);
  const content = React12.useRef(null);
  React12.useLayoutEffect(() => {
    let timeout;
    const resize = () => {
      const ww = wrapper.current.clientWidth / (content.current.scrollWidth + 40);
      const hh = wrapper.current.clientHeight / (content.current.clientHeight + 80);
      const zoom = Math.min(maxScale, ww, hh);
      inner.current.style.transform = "scale(" + zoom + ")";
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper.current);
    const resizeHandler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        resize();
      }, 250);
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
      ro.disconnect();
      clearTimeout(timeout);
    };
  }, [maxScale]);
  return /* @__PURE__ */ React12.createElement(Responsive, { ...props, ref: wrapper }, /* @__PURE__ */ React12.createElement("div", { ref: inner }, /* @__PURE__ */ React12.createElement("div", { ref: content }, children)));
}

// src/components/Select.tsx
import React13 from "react";
import styled3 from "styled-components";
var StyledWrapper = styled3.div`
  position: relative;
`;
var StyledPopup = styled3.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  width: max-content;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-radius: 10px;
  padding: 5px;
  color: var(--whisky-ui-input-color);
  background: var(--whisky-ui-input-background);
  white-space: nowrap;
  transform: translateY(-5px);
  z-index: 100;
  & > button {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;
    font-size: inherit;
    padding: 5px;
    display: flex;
    align-items: center;
    &:hover {
      background: var(--whisky-ui-input-background-hover);
    }
  }
`;
function Select(props) {
  const [open, setOpen] = React13.useState(false);
  const set = (val) => {
    setOpen(false);
    props.onChange(val);
  };
  return /* @__PURE__ */ React13.createElement(StyledWrapper, { className: props.className }, /* @__PURE__ */ React13.createElement(Button, { disabled: props.disabled, onClick: () => setOpen(!open) }, props.label ? props.label(props.value) : JSON.stringify(props.value)), open && /* @__PURE__ */ React13.createElement(StyledPopup, null, props.options.map((val, i) => /* @__PURE__ */ React13.createElement("button", { key: i, onClick: () => set(val) }, props.label ? props.label(val) : JSON.stringify(val)))));
}

// src/components/Switch.tsx
import React14 from "react";
import styled4 from "styled-components";
var SwitchButton = styled4.input`
  all: unset;
  cursor: pointer;
  position: relative;
  height: 25px;
  aspect-ratio: 2 / 1;
  border-radius: 20px;
  background: #0e0e16;
  &:checked {
    background: #9564ff66;
  }
  &:checked:after {
    left: 50%;
  }
  &:after {
    transition: left .1s ease;
    content: " ";
    height: 100%;
    width: 50%;
    left: 0;
    top: 0;
    border-radius: 20px;
    position: absolute;
    background: #9564ff;
  }
  &:not(:disabled):hover {
    outline: #9564ff solid 1px;
    outline-offset: 1px;
  }
  &:disabled:after {
    background: gray;
  }
`;
function Switch(props) {
  return /* @__PURE__ */ React14.createElement(
    SwitchButton,
    {
      type: "checkbox",
      className: props.className,
      checked: props.checked,
      disabled: props.disabled,
      onChange: (evt) => props.onChange && props.onChange(evt.target.checked)
    }
  );
}

// src/components/TextInput.tsx
import React15 from "react";
import styled5 from "styled-components";
var StyledTextInput = styled5.input`
  color: var(--whisky-ui-input-color);
  background: var(--whisky-ui-input-background);
  &:hover {
    background: var(--whisky-ui-input-background-hover);
  }

  border: none;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  min-width: 100px;
  align-items: center;

  &:disabled {
    cursor: default;
    opacity: .7;
  }
`;
function TextInput({ onChange, ...props }) {
  return /* @__PURE__ */ React15.createElement(
    StyledTextInput,
    {
      type: "text",
      onChange: (evt) => onChange && onChange(evt.target.value),
      onFocus: (evt) => evt.target.select(),
      ...props
    }
  );
}

// src/components/WagerInput.tsx
import React18, { useRef as useRef3 } from "react";
import styled6, { css as css2 } from "styled-components";

// src/components/TokenValue.tsx
import React16 from "react";
function TokenValue(props) {
  const context = React16.useContext(WhiskyPlatformContext);
  const mint = props.mint ?? context?.selectedPool.token;
  if (!mint) {
    throw new Error('"mint" prop is required when not using WhiskyPlatformProvider');
  }
  const token = useTokenMeta(mint);
  const suffix = props.suffix ?? token?.symbol ?? "?";
  const tokenAmount = props.amount / 10 ** token.decimals;
  const displayedAmount = (() => {
    if (!props.exact) {
      if (tokenAmount >= 1e9) {
        return (tokenAmount / 1e9).toLocaleString(void 0, { maximumFractionDigits: 1 }) + "B";
      }
      if (tokenAmount >= 1e6) {
        return (tokenAmount / 1e6).toLocaleString(void 0, { maximumFractionDigits: 1 }) + "M";
      }
      if (tokenAmount > 1e3) {
        return (tokenAmount / 1e3).toLocaleString(void 0, { maximumFractionDigits: 1 }) + "K";
      }
    }
    return tokenAmount.toLocaleString(void 0, { maximumFractionDigits: Math.floor(tokenAmount) > 100 ? 1 : 4 });
  })();
  return /* @__PURE__ */ React16.createElement(React16.Fragment, null, displayedAmount, " ", suffix);
}

// src/hooks/useOnClickOutside.ts
import React17 from "react";
function useOnClickOutside(ref, handler) {
  React17.useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// src/components/WagerInput.tsx
var StyledPopup2 = styled6.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  width: max-content;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-radius: 10px;
  padding: 5px;
  color: var(--whisky-ui-input-color);
  background: var(--whisky-ui-input-background);
  white-space: nowrap;
  transform: translateY(-5px);
  z-index: 100;
  & > button {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;
    font-size: inherit;
    padding: 5px;
    display: flex;
    align-items: center;
    &:hover {
      background: var(--whisky-ui-input-background-hover);
    }
  }
`;
var StyledWagerInput = styled6.div`
  display: flex;
  justify-content: space-between;
  color: var(--whisky-ui-input-color);
  background: var(--whisky-ui-input-background);
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  ${(props) => props.$edit && css2`
    outline: #9564ff solid 1px;
    outline-offset: 1px;
  `}
`;
var Flex = styled6.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-grow: 1;
  box-sizing: border-box;
`;
var Input = styled6.input`
  border: none;
  border-radius: 0;
  margin: 0;
  padding: 10px;
  padding-left: 0;
  padding-right: 0;
  color: var(--whisky-ui-input-color);
  background: var(--whisky-ui-input-background);
  outline: none;
  flex-grow: 1;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }
`;
var InputButton = styled6.button`
  border: none;
  border-radius: 0;
  margin: 0;
  padding: 2px 10px;
  color: var(--whisky-ui-input-color);
  background: var(--whisky-ui-input-background);
  cursor: pointer;
`;
var Buttons = styled6.div`
  display: flex;
`;
var TokenImage = styled6.img`
  width: 25px;
  height: 25px;
  margin: 0 5px;
  border-radius: 50%;
  -webkit-user-drag: none;
`;
var WagerAmount = styled6.div`
  text-wrap: nowrap;
  padding: 10px 0;
  width: 40px;

  @media (min-width: 600px) {
    width: 100px;
  }

  opacity: .8;
  overflow: hidden;
`;
function WagerInput(props) {
  const whisky = useWhisky();
  const token = useCurrentToken();
  const [input, setInput] = React18.useState("");
  const balance = useUserBalance();
  const fees = useFees();
  const [isEditing, setIsEditing] = React18.useState(false);
  const ref = useRef3(null);
  React18.useEffect(
    () => {
      props.onChange(token.baseWager);
    },
    [token.mint.toString()]
  );
  useOnClickOutside(ref, () => setIsEditing(false));
  const startEditInput = () => {
    if (props.options) {
      setIsEditing(!isEditing);
      return;
    }
    setIsEditing(true);
    setInput(String(props.value / 10 ** token.decimals));
  };
  const apply = () => {
    props.onChange(Number(input) * 10 ** token.decimals);
    setIsEditing(false);
  };
  const x2 = () => {
    const availableBalance = balance.balance + balance.bonusBalance;
    const nextValue = Math.max(token.baseWager, props.value * 2 || token.baseWager);
    props.onChange(Math.max(0, Math.min(nextValue, availableBalance - nextValue * fees)));
  };
  return /* @__PURE__ */ React18.createElement("div", { ref, className: props.className, style: { position: "relative" } }, /* @__PURE__ */ React18.createElement(StyledWagerInput, { $edit: isEditing }, /* @__PURE__ */ React18.createElement(Flex, { onClick: () => !whisky.isPlaying && startEditInput() }, /* @__PURE__ */ React18.createElement(TokenImage, { src: token.image }), !isEditing || props.options ? /* @__PURE__ */ React18.createElement(
    WagerAmount,
    {
      title: (props.value / 10 ** token.decimals).toLocaleString()
    },
    /* @__PURE__ */ React18.createElement(TokenValue, { suffix: "", amount: props.value, mint: token.mint })
  ) : /* @__PURE__ */ React18.createElement(
    Input,
    {
      value: input,
      type: "number",
      max: balance.balance / 10 ** token.decimals,
      min: 0,
      step: 0.05,
      style: { width: "100px" },
      onChange: (evt) => setInput(evt.target.value),
      onKeyDown: (e) => e.code === "Enter" && apply(),
      onBlur: (evt) => apply(),
      disabled: whisky.isPlaying,
      autoFocus: true,
      onFocus: (e) => e.target.select()
    }
  )), !props.options && /* @__PURE__ */ React18.createElement(Buttons, null, /* @__PURE__ */ React18.createElement(InputButton, { disabled: whisky.isPlaying, onClick: () => props.onChange(props.value / 2) }, "x.5"), /* @__PURE__ */ React18.createElement(InputButton, { disabled: whisky.isPlaying, onClick: x2 }, "x2"))), props.options && isEditing && /* @__PURE__ */ React18.createElement(StyledPopup2, null, props.options.map((option, i) => /* @__PURE__ */ React18.createElement("button", { key: i, onClick: () => {
    props.onChange(option);
    setIsEditing(false);
  } }, /* @__PURE__ */ React18.createElement(TokenValue, { amount: option })))));
}

// src/components/WagerSelect.tsx
import React19 from "react";
function WagerSelect(props) {
  const whisky = useWhisky();
  return /* @__PURE__ */ React19.createElement(
    Select,
    {
      className: props.className,
      options: props.options,
      value: props.value,
      onChange: props.onChange,
      disabled: whisky.isPlaying,
      label: (value) => /* @__PURE__ */ React19.createElement(TokenValue, { amount: value })
    }
  );
}

// src/GameContext.tsx
var GameContext = React20.createContext({ game: { id: "unknown", app: null } });
function Game({ game, children, errorFallback }) {
  return /* @__PURE__ */ React20.createElement(GameContext.Provider, { key: game.id, value: { game } }, /* @__PURE__ */ React20.createElement(ErrorBoundary, { fallback: errorFallback }, /* @__PURE__ */ React20.createElement(React20.Suspense, { fallback: /* @__PURE__ */ React20.createElement(React20.Fragment, null) }, /* @__PURE__ */ React20.createElement(game.app, { ...game.props }))), children);
}
function PlayButton(props) {
  const whisky = useWhisky();
  return /* @__PURE__ */ React20.createElement(Portal, { target: "play" }, /* @__PURE__ */ React20.createElement(
    Button,
    {
      disabled: whisky.isPlaying || props.disabled,
      onClick: props.onClick,
      main: true
    },
    props.children
  ));
}
var WhiskyUi = {
  useGame,
  useSound,
  Portal,
  PortalTarget,
  Effect: EffectTest,
  Button,
  Game,
  Responsive: ResponsiveSize,
  Canvas: WhiskyCanvas,
  WagerInput,
  /**
   * @deprecated Use WagerInput with "options" prop
   */
  WagerSelect,
  Switch,
  PlayButton,
  Select,
  TextInput
};

// src/hooks/useFakeToken.ts
import React21 from "react";
import { create as create3 } from "zustand";
import { getPoolAddress as getPoolAddress4, SYSTEM_PROGRAM as SYSTEM_PROGRAM3 } from "@whisky-gaming/core";
var betBuffer;
var useFakeAccountStore = create3(
  (set) => ({
    balance: 1e12,
    set
  })
);
useNextFakeResult.delay = 500;
function useNextFakeResult() {
  const store = useFakeAccountStore();
  const context = React21.useContext(WhiskyPlatformContext);
  const user = useWalletAddress();
  return async function getNextFakeResult() {
    if (!betBuffer)
      throw new Error("No game in progress");
    await new Promise((resolve) => setTimeout(resolve, useNextFakeResult.delay));
    const resultIndex = Math.random() * betBuffer.bet.length | 0;
    const multiplier = betBuffer.bet[resultIndex];
    const wager = betBuffer.wager;
    const payout = multiplier * wager;
    const profit = payout - wager;
    store.set(
      (state) => ({ balance: state.balance + payout })
    );
    return {
      creator: context.platform.creator,
      user,
      rngSeed: "fake_rng_seed",
      clientSeed: betBuffer.clientSeed ?? "",
      nonce: 0,
      bet: betBuffer.bet,
      resultIndex,
      wager,
      payout,
      profit,
      multiplier,
      token: context.selectedPool.token,
      bonusUsed: 0,
      jackpotWin: 0
    };
  };
}
function useFakeToken() {
  const context = React21.useContext(WhiskyPlatformContext);
  const balance = useFakeAccountStore();
  const result = useNextFakeResult();
  const isActive = context.selectedPool.token.equals(FAKE_TOKEN_MINT);
  const play = (input) => {
    if (balance.balance < input.wager) {
      throw throwTransactionError(new Error("Insufficient funds"));
    }
    balance.set(({ balance: balance2 }) => ({ balance: balance2 - input.wager }));
    betBuffer = input;
    return "fake_game";
  };
  const pool = {
    publicKey: getPoolAddress4(context.selectedPool.token),
    authority: SYSTEM_PROGRAM3,
    token: context.selectedPool.token,
    minWager: 0,
    whiskyFee: 0,
    poolFee: 0,
    jackpotBalance: 0,
    liquidity: BigInt(1e99),
    maxPayout: 1e99
  };
  return { isActive, balance, result, play, pool };
}

// src/hooks/useGame.ts
function useGame() {
  const gameContext = React22.useContext(GameContext);
  const fake = useFakeToken();
  const context = React22.useContext(WhiskyPlatformContext);
  const balances = useUserBalance();
  const getNextResult2 = useNextResult();
  const whiskyPlay = useWhiskyPlay();
  const defaultGame = {
    id: "default",
    app: () => null,
    meta: {},
    props: {}
  };
  const game = gameContext?.game || defaultGame;
  const result = async () => {
    if (fake.isActive) {
      return fake.result();
    }
    return getNextResult2();
  };
  const play = async (input, instructions = []) => {
    const metaArgs = input.metadata ?? [];
    const metadata = ["0", game.id, ...metaArgs];
    const gameInput = {
      ...input,
      creator: new PublicKey6(context.platform.creator),
      metadata,
      clientSeed: context.clientSeed,
      creatorFee: context.defaultCreatorFee,
      jackpotFee: context.defaultJackpotFee,
      token: context.selectedPool.token,
      poolAuthority: context.selectedPool.authority
    };
    if (fake.isActive) {
      return fake.play(gameInput);
    }
    return whiskyPlay(gameInput, instructions);
  };
  return {
    play,
    game,
    result
  };
}

// src/hooks/index.ts
function useWhiskyPlatformContext() {
  return React23.useContext(WhiskyPlatformContext);
}
function useCurrentPool() {
  const context = React23.useContext(WhiskyPlatformContext);
  return React23.useMemo(() => context.selectedPool, [context.selectedPool]);
}
function useCurrentToken() {
  const context = React23.useContext(WhiskyPlatformContext);
  const token = React23.useMemo(() => context.selectedPool.token, [context.selectedPool.token]);
  return useTokenMeta(token);
}
function useFees() {
  const context = React23.useContext(WhiskyPlatformContext);
  const pool = useCurrentPool();
  return React23.useMemo(() => {
    const creatorFee = context.defaultCreatorFee;
    const jackpotFee = context.defaultJackpotFee;
    const poolData = usePool(pool.token, pool.authority);
    return creatorFee + jackpotFee + poolData.whiskyFee + poolData.poolFee;
  }, [context.defaultCreatorFee, context.defaultJackpotFee, pool.token, pool.authority]);
}
function useUserBalance(mint) {
  const pool = useCurrentPool();
  const token = useCurrentToken();
  const userAddress = useWalletAddress();
  const targetMint = React23.useMemo(() => mint ?? token.mint, [mint, token.mint]);
  const authority = React23.useMemo(() => pool.authority, [pool.authority]);
  const realBalance = useBalance(userAddress, targetMint, authority);
  return realBalance;
}
function useWhiskyProvider() {
  const context = useWhiskyContext();
  return React23.useMemo(() => context.provider, [context.provider]);
}
function useWhiskyProgram() {
  const provider = useWhiskyProvider();
  return React23.useMemo(() => provider?.whiskyProgram, [provider]);
}

// src/referral/program.ts
import { Program } from "@coral-xyz/anchor";
import { PublicKey as PublicKey7 } from "@solana/web3.js";

// src/referral/idl.ts
var REFERRAL_IDL = { version: "0.1.0", name: "refer_program", instructions: [{ name: "configReferAccount", accounts: [{ name: "authority", isMut: true, isSigner: true }, { name: "referAccount", isMut: true, isSigner: false }, { name: "creator", isMut: false, isSigner: false }, { name: "systemProgram", isMut: false, isSigner: false }], args: [{ name: "referrer", type: "publicKey" }] }, { name: "closeReferAccount", accounts: [{ name: "authority", isMut: true, isSigner: true }, { name: "referAccount", isMut: true, isSigner: false }, { name: "creator", isMut: false, isSigner: false }, { name: "systemProgram", isMut: false, isSigner: false }], args: [] }], accounts: [{ name: "referAccount", type: { kind: "struct", fields: [{ name: "referrer", type: "publicKey" }] } }] };

// src/referral/program.ts
var PROGRAM_ID2 = new PublicKey7("RefwFk2PPNd9bPehSyAkrkrehSHkvz6mTAHTNe8v9vH");
var getReferrerPda = (creator, authority) => PublicKey7.findProgramAddressSync([
  creator.toBytes(),
  authority.toBytes()
], PROGRAM_ID2)[0];
var createReferral = async (provider, creator, referAccount) => {
  const referralProgram = new Program(REFERRAL_IDL, PROGRAM_ID2, provider);
  return referralProgram.methods.configReferAccount(referAccount).accounts({ referAccount: getReferrerPda(creator, provider.wallet.publicKey), creator }).instruction();
};
var closeReferral = async (provider, creator) => {
  const referralProgram = new Program(REFERRAL_IDL, PROGRAM_ID2, provider);
  return referralProgram.methods.closeReferAccount().accounts({ referAccount: getReferrerPda(creator, provider.wallet.publicKey), creator }).instruction();
};
var fetchReferral = async (provider, pda) => {
  const referralProgram = new Program(REFERRAL_IDL, PROGRAM_ID2, provider);
  const account = await referralProgram.account.referAccount.fetch(pda);
  if (!account)
    return null;
  return account.referrer;
};

// src/referral/referralPlugin.ts
import * as SplToken from "@solana/spl-token";
import { SystemProgram } from "@solana/web3.js";
var makeReferralPlugin = (recipient, upsert, referralFee = 0.01, creatorFeeDeduction = 1) => async (input, context) => {
  const instructions = [];
  const tokenAmount = BigInt(Math.floor(input.wager * referralFee));
  if (upsert) {
    instructions.push(
      await createReferral(context.provider.anchorProvider, input.creator, recipient)
    );
  }
  if (input.token.equals(SplToken.NATIVE_MINT)) {
    instructions.push(
      SystemProgram.transfer({
        fromPubkey: input.wallet,
        toPubkey: recipient,
        lamports: tokenAmount
      })
    );
  } else {
    const fromAta = SplToken.getAssociatedTokenAddressSync(input.token, input.wallet);
    const toAta = SplToken.getAssociatedTokenAddressSync(input.token, recipient);
    const recipientHasAta = await (async () => {
      try {
        await SplToken.getAccount(context.provider.anchorProvider.connection, toAta, "confirmed");
        return true;
      } catch (error) {
        if (error instanceof SplToken.TokenAccountNotFoundError || error instanceof SplToken.TokenInvalidAccountOwnerError) {
          return false;
        } else {
          throw error;
        }
      }
    })();
    if (!recipientHasAta) {
      instructions.push(
        SplToken.createAssociatedTokenAccountInstruction(
          input.wallet,
          toAta,
          recipient,
          input.token
        )
      );
    }
    instructions.push(
      SplToken.createTransferInstruction(
        fromAta,
        toAta,
        input.wallet,
        tokenAmount
      )
    );
  }
  context.creatorFee = Math.max(0, context.creatorFee - referralFee * creatorFeeDeduction);
  return instructions;
};

// src/referral/referralUtils.ts
import { PublicKey as PublicKey9 } from "@solana/web3.js";
function getReferralLink(prefix, address) {
  return location.protocol + "//" + location.host + "?" + prefix + "=" + address.toString();
}
function getReferralAddressFromUrl(prefix) {
  const params = new URLSearchParams(location.search);
  const referralAddressString = params.get(prefix);
  if (!referralAddressString)
    return null;
  try {
    return new PublicKey9(referralAddressString);
  } catch (err) {
    console.error("Failed to parse code");
    return null;
  }
}

// src/referral/ReferralContext.tsx
var defaultPrefix = "code";
function useWhiskyContext2() {
  const { provider } = useWhisky();
  return {
    provider,
    addPlugin: (plugin) => {
      console.warn("addPlugin not implemented yet");
      return () => {
      };
    }
  };
}
function useWalletAddress2() {
  const { publicKey } = useWallet5();
  return publicKey;
}
var ReferralContext = createContext({
  referrerAddress: null,
  isOnChain: false,
  prefix: defaultPrefix,
  referralStatus: "local",
  clearCache: () => null,
  setCache: () => null
});
function ReferralProvider({
  fee,
  prefix = defaultPrefix,
  children,
  storage = localStorage,
  autoAccept = true
}) {
  const wallet = useWallet5();
  const owner = useWalletAddress2();
  const whiskyContext = useWhiskyContext2();
  const whiskyPlatformContext = useWhiskyPlatformContext();
  const [isFetchingOnChain, setIsFetchingOnChain] = useState3(false);
  const [referralCache, setReferralCache] = useState3({ address: null, isOnChain: false });
  const getOnChainAddress = async () => {
    try {
      if (!owner || !whiskyContext.provider?.anchorProvider)
        return null;
      const pda = getReferrerPda(whiskyPlatformContext.platform.creator, owner);
      const address = await fetchReferral(whiskyContext.provider.anchorProvider, pda);
      return address;
    } catch {
      return null;
    }
  };
  const getPublicKeyFromStorage = (key) => {
    try {
      const value = storage.getItem(key);
      if (value)
        return new PublicKey10(value);
    } catch {
      return;
    }
  };
  useEffect4(() => {
    let isCancelled = false;
    const handleReferral = async () => {
      const urlAddress = getReferralAddressFromUrl(prefix);
      if (autoAccept && urlAddress) {
        storage.setItem("referral-new", urlAddress.toString());
        const url = new URL(window.location.href);
        const params = url.searchParams;
        params.delete(prefix);
        const newUrl = url.origin + url.pathname + (params.toString() ? "?" + params.toString() : "");
        window.history.replaceState({}, document.title, newUrl);
        return;
      }
      if (!wallet.publicKey) {
        setReferralCache({ address: null, isOnChain: false });
        return;
      }
      setIsFetchingOnChain(true);
      try {
        const onChainAddress = await getOnChainAddress();
        if (isCancelled)
          return;
        if (!onChainAddress)
          throw new Error();
        setReferralCache({ address: onChainAddress, isOnChain: true });
      } catch {
        if (isCancelled)
          return;
        const storedReferralForAddress = getPublicKeyFromStorage("referral-" + wallet.publicKey.toString());
        if (storedReferralForAddress) {
          setReferralCache({ address: storedReferralForAddress, isOnChain: false });
          return;
        }
        const newReferral = getPublicKeyFromStorage("referral-new");
        if (newReferral && !newReferral.equals(wallet.publicKey)) {
          setReferralCache({ address: newReferral, isOnChain: false });
          storage.setItem("referral-" + wallet.publicKey.toString(), newReferral.toString());
          storage.removeItem("referral-new");
        }
      } finally {
        if (!isCancelled)
          setIsFetchingOnChain(false);
      }
    };
    handleReferral();
    return () => {
      isCancelled = true;
    };
  }, [
    autoAccept,
    whiskyPlatformContext.platform.creator.toString(),
    wallet.publicKey?.toString(),
    prefix
  ]);
  useEffect4(() => {
    if (!referralCache.address)
      return;
    return whiskyContext.addPlugin(
      makeReferralPlugin(
        referralCache.address,
        !referralCache.isOnChain,
        fee,
        1
      )
    );
  }, [fee, referralCache.address, referralCache.isOnChain]);
  const clearCache = () => {
    if (wallet.publicKey) {
      storage.removeItem("referral-" + wallet.publicKey.toString());
    }
    storage.removeItem("referral-new");
    setReferralCache({ address: null, isOnChain: false });
  };
  const setCache = (address, isOnChain = false) => {
    if (wallet.publicKey) {
      storage.setItem("referral-" + wallet.publicKey.toString(), address.toString());
    }
    storage.setItem("referral-new", address.toString());
    setReferralCache({ address, isOnChain });
  };
  return /* @__PURE__ */ React24.createElement(ReferralContext.Provider, { value: {
    prefix,
    isOnChain: referralCache.isOnChain,
    referrerAddress: referralCache.address,
    referralStatus: isFetchingOnChain ? "fetching" : referralCache.isOnChain ? "on-chain" : "local",
    clearCache,
    setCache
  } }, children);
}

// src/WhiskyPlatformProvider.tsx
var WhiskyPlatformContext = React25.createContext(null);
function WhiskyPlatformProvider(props) {
  const {
    creator,
    children,
    referral = { prefix: "code", fee: 0.01, autoAccept: true }
  } = props;
  const [selectedPool, setSelectedPool] = React25.useState(props.defaultPool ?? { token: NATIVE_MINT4 });
  const [clientSeed, setClientSeed] = React25.useState(String(Math.random() * 1e9 | 0));
  const [defaultJackpotFee, setDefaultJackpotFee] = React25.useState(props.defaultJackpotFee ?? 1e-3);
  const defaultCreatorFee = props.defaultCreatorFee ?? 0.01;
  const platform = React25.useMemo(() => ({
    name: "",
    creator: new PublicKey11(creator)
  }), [creator]);
  const setPool = React25.useCallback((tokenMint, authority = new PublicKey11("11111111111111111111111111111111")) => {
    setSelectedPool({
      token: new PublicKey11(tokenMint),
      authority: new PublicKey11(authority)
    });
  }, []);
  const setToken = React25.useCallback((tokenMint) => {
    setPool(tokenMint);
  }, [setPool]);
  const contextValue = React25.useMemo(() => ({
    platform,
    selectedPool,
    setToken,
    setPool,
    clientSeed,
    setClientSeed,
    defaultJackpotFee,
    setDefaultJackpotFee,
    defaultCreatorFee
  }), [
    platform,
    selectedPool,
    setToken,
    setPool,
    clientSeed,
    defaultJackpotFee,
    defaultCreatorFee
  ]);
  return /* @__PURE__ */ React25.createElement(WhiskyPlatformContext.Provider, { value: contextValue }, /* @__PURE__ */ React25.createElement(ReferralProvider, { ...referral }, /* @__PURE__ */ React25.createElement(PortalProvider, null, children)));
}

// src/index.ts
import { BPS_PER_WHOLE as BPS_PER_WHOLE2 } from "@whisky-gaming/core";

// src/SendTransactionContext.tsx
import React26 from "react";
var defaultValue = {
  priorityFee: 100001,
  simulationUnits: 14e5,
  computeUnitLimitMargin: 1.1
};
var SendTransactionContext = React26.createContext(defaultValue);
function SendTransactionProvider({ children, ...props }) {
  return /* @__PURE__ */ React26.createElement(SendTransactionContext.Provider, { value: { ...defaultValue, ...props } }, children);
}

// src/makeHeliusTokenFetcher.ts
import { PublicKey as PublicKey12 } from "@solana/web3.js";
function makeHeliusTokenFetcher(heliusApiKey, params = {}) {
  const { dollarBaseWager = 1 } = params;
  return async (tokenMints2) => {
    const response = await fetch("https://mainnet.helius-rpc.com/?api-key=" + heliusApiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAssetBatch",
        params: { ids: tokenMints2 }
      })
    });
    const { result } = await response.json();
    const tokens = result.filter((x) => !!x).reduce((prev, x) => {
      const info = x?.token_info;
      const usdPrice = info?.price_info?.price_per_token;
      const data = {
        mint: new PublicKey12(x.id),
        image: x.content?.links?.image,
        symbol: x.content?.metadata.symbol ?? info.symbol,
        decimals: info.decimals,
        name: x.content?.metadata.name ?? info.symbol,
        baseWager: Math.floor(dollarBaseWager / usdPrice * 10 ** info.decimals) || 1,
        usdPrice
        // usdPrice: info.price_info?.price_per_token ?? 0,
      };
      return { ...prev, [x.id.toString()]: data };
    }, {});
    return tokens;
  };
}

// src/referral/useReferral.ts
import { useWallet as useWallet6 } from "@solana/wallet-adapter-react";
import { useContext, useMemo as useMemo5 } from "react";
function useWhiskyProvider2() {
  const { provider } = useWhisky();
  return { anchorProvider: provider?.anchorProvider };
}
function useSendTransaction2() {
  return async (transaction, options) => {
    console.warn("useSendTransaction not implemented yet");
    return "fake-tx-id";
  };
}
function useReferral() {
  const { clearCache, setCache, isOnChain, referrerAddress, referralStatus, prefix } = useContext(ReferralContext);
  const wallet = useWallet6();
  const platform = useWhiskyPlatformContext();
  const provider = useWhiskyProvider2();
  const sendTransaction = useSendTransaction2();
  const referralLink = useMemo5(() => wallet.publicKey && getReferralLink(prefix, wallet.publicKey), [prefix, wallet.publicKey?.toString()]);
  const copyLinkToClipboard = () => {
    if (!wallet.publicKey) {
      throw new Error("NOT_CONNECTED");
    }
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
    }
  };
  const removeInvite = async (options) => {
    if (!provider.anchorProvider) {
      throw new Error("Provider not available");
    }
    const txId = await sendTransaction(
      closeReferral(
        provider.anchorProvider,
        platform.platform.creator
      ),
      { confirmation: "confirmed", ...options }
    );
    clearCache();
    return txId;
  };
  const acceptInvite = async (address, options) => {
    if (!provider.anchorProvider) {
      throw new Error("Provider not available");
    }
    const txId = await sendTransaction(
      createReferral(
        provider.anchorProvider,
        platform.platform.creator,
        address
      ),
      { confirmation: "confirmed", ...options }
    );
    setCache(address, true);
    return txId;
  };
  const acceptInviteOnNextPlay = async (address) => {
    setCache(address, false);
  };
  return {
    /** Accepts the invite on-chain. Requires a signature from the user. You can also use `acceptInviteOnNextPlay`. */
    acceptInvite,
    /** Removes the invite on-chain and cache. */
    removeInvite,
    /** Clears the local cache. */
    clearCache,
    /**
     * Stores the invite locally until the next play, at which point it will be upserted on-chain.
     * @note If the user has already accepted an invite on-chain, the local invite will be ignored and must be removed with `removeInvite`.
     * */
    acceptInviteOnNextPlay,
    /** Copies the users invite code to clipboard */
    copyLinkToClipboard,
    /** The address which referred the connected user */
    referrerAddress,
    /** Whether on not the connected user has been accepted the invite on-chain */
    isOnChain,
    referralStatus,
    referralLink
  };
}

// src/index.ts
var GameContextObj = createContext2({
  game: null,
  setGame: () => {
  }
});
function useWagerInput2(initial) {
  const [_wager, setWager] = React27.useState(initial);
  const context = React27.useContext(WhiskyPlatformContext);
  const token = useTokenMeta(context.selectedPool.token);
  return [_wager ?? token.baseWager, setWager];
}
function useTokenList() {
  return React27.useContext(TokenMetaContext).tokens ?? [];
}
var WhiskyStandardTokens = {
  fake: {
    mint: new PublicKey13("FakeCDoCX1NWywV9m63fk7gmV9S4seMoyqzcNYEmRYjy"),
    name: "Fake Money",
    symbol: "FAKE",
    decimals: 9,
    baseWager: 1 * 1e9
  },
  sol: {
    mint: new PublicKey13("So11111111111111111111111111111111111111112"),
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
    baseWager: 0.01 * 1e9
  },
  usdc: {
    mint: new PublicKey13("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
    baseWager: 0.5 * 1e6
  }
  // whisky: {
  //   mint: new PublicKey('XXXXXXXX'),
  //   name: 'Whisky',
  //   symbol: 'WHISKY',
  //   decimals: 5,
  //   baseWager: 1000000 * 1e5,
  // },
};
export {
  BPS_PER_WHOLE2 as BPS_PER_WHOLE,
  EffectTest,
  FAKE_TOKEN_MINT,
  GameContext,
  PlayButton,
  ReferralContext,
  ReferralProvider,
  SendTransactionContext,
  SendTransactionProvider,
  TokenMetaContext,
  TokenMetaProvider,
  TokenValue,
  WhiskyCanvas,
  WhiskyContext,
  WhiskyPlatformContext,
  WhiskyPlatformProvider,
  WhiskyProvider,
  WhiskyStandardTokens,
  WhiskyUi,
  makeHeliusTokenFetcher,
  throwTransactionError,
  useAccount,
  useBalance,
  useCurrentPool,
  useCurrentToken,
  useFees,
  useGame,
  useNextResult,
  usePool,
  useReferral,
  useSendTransaction,
  useSound,
  useSoundStore,
  useTokenList,
  useTokenMeta,
  useTransactionError,
  useTransactionStore,
  useUserBalance,
  useWagerInput2 as useWagerInput,
  useWalletAddress,
  useWhisky,
  useWhiskyAudioStore,
  useWhiskyContext,
  useWhiskyEventListener,
  useWhiskyEvents,
  useWhiskyPlatformContext,
  useWhiskyPlay,
  useWhiskyProgram,
  useWhiskyProvider
};
