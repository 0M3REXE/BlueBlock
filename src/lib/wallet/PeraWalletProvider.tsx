"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PeraWalletConnect } from "@perawallet/connect";

interface WalletContextValue {
  address: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  pera: PeraWalletConnect | null;
  chainId: number;
  networkName: string;
  isTestnet: boolean;
  setChainId: (id: AlgorandChainIDs) => void; // Future network switching
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

let peraInstance: PeraWalletConnect | null = null;
type AlgorandChainIDs = 416001 | 416002 | 416003 | 4160;
let currentChainId: AlgorandChainIDs = 4160; // default (All networks)

function getPera() {
  if (!peraInstance) {
  peraInstance = new PeraWalletConnect({ shouldShowSignTxnToast: false, chainId: currentChainId });
  }
  return peraInstance;
}

export function PeraWalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [chainId, setChainId] = useState<number>(currentChainId);
  const pera = getPera();

  const disconnect = useCallback(async () => {
    try {
      await pera.disconnect();
    } catch {
      // ignore
    } finally {
      setAddress(null);
    }
  }, [pera]);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const accounts = await pera.connect();
      pera.connector?.on("disconnect", disconnect);
      if (accounts.length) setAddress(accounts[0]);
    } catch (e: unknown) {
      interface ErrWithData { data?: { type?: string } }
      const dataType = (e as ErrWithData)?.data?.type;
      if (dataType !== "CONNECT_MODAL_CLOSED") console.error("Pera connect error", e);
    } finally {
      setConnecting(false);
    }
  }, [pera, disconnect]);

  useEffect(() => {
    pera
      .reconnectSession()
      .then((accounts) => {
        pera.connector?.on("disconnect", disconnect);
        if (pera.isConnected && accounts.length) {
          setAddress(accounts[0]);
        }
      })
      .catch((e) => console.warn("Reconnect failed", e));
  }, [pera, disconnect]);

  const networkName = useMemo(() => {
    switch (chainId) {
      case 416001: return "MainNet";
      case 416002: return "TestNet";
      case 416003: return "BetaNet";
      default: return "All";
    }
  }, [chainId]);

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      connecting,
      connect,
      disconnect,
      isConnected: !!address,
      pera,
      chainId,
      networkName,
      isTestnet: chainId === 416002,
      setChainId: (id: AlgorandChainIDs) => {
        currentChainId = id;
        setChainId(id);
      },
    }),
    [address, connecting, connect, disconnect, pera, chainId, networkName]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within PeraWalletProvider");
  return ctx;
}
