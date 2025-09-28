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
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

let peraInstance: PeraWalletConnect | null = null;

function getPera() {
  if (!peraInstance) {
    peraInstance = new PeraWalletConnect({ shouldShowSignTxnToast: false });
  }
  return peraInstance;
}

export function PeraWalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const pera = getPera();

  const disconnect = useCallback(async () => {
    try {
      await pera.disconnect();
    } catch (e) {
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
    } catch (e: any) {
      if (e?.data?.type !== "CONNECT_MODAL_CLOSED") {
        console.error("Pera connect error", e);
      }
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

  const value = useMemo<WalletContextValue>(
    () => ({ address, connecting, connect, disconnect, isConnected: !!address, pera }),
    [address, connecting, connect, disconnect, pera]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within PeraWalletProvider");
  return ctx;
}
