"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "../lib/wallet/PeraWalletProvider";

function truncate(addr: string) {
  return addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

export default function WalletButton({ className = "" }: { className?: string }) {
  const { address, connect, disconnect, connecting, networkName, isTestnet } = useWallet();
  const isConnected = !!address;
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  async function handleCopy() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setOpen(false);
    } catch (e) {
      console.warn("Copy failed", e);
    }
  }

  const baseColorClasses = isTestnet
    ? "bg-yellow-300 text-[#2a2300] ring-yellow-200 hover:bg-yellow-200 hover:ring-yellow-100"
    : "bg-white text-[#062024] ring-white/60 hover:bg-white/90 hover:ring-white";

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        aria-haspopup={isConnected ? "menu" : undefined}
        aria-expanded={isConnected ? open : undefined}
        onClick={() => (isConnected ? setOpen(o => !o) : connect())}
        disabled={connecting}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-[0.7rem] font-semibold tracking-wide shadow-sm ring-1 transition disabled:cursor-not-allowed disabled:opacity-70 ${baseColorClasses}`}
      >
        {connecting ? "Connecting…" : isConnected ? truncate(address!) : "Connect Wallet"}
        {isConnected && (
          <span
            className={`inline-block h-2 w-2 rounded-full ${isTestnet ? 'bg-yellow-600' : 'bg-emerald-500'} shadow-inner`}
            title={networkName}
          />
        )}
        {isConnected && (
          <svg
            className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 4.5 6 7.5 9 4.5" />
          </svg>
        )}
      </button>
      {open && isConnected && (
        <div
          role="menu"
          aria-label="Wallet menu"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border border-white/10 bg-[#032229]/95 p-1 text-xs shadow-lg backdrop-blur-sm"
        >
          <div className="px-3 py-2 text-[0.6rem] uppercase tracking-[0.25em] text-white/40 flex items-center justify-between">
            <span>Wallet</span>
            <span className="rounded-full bg-white/10 px-2 py-[2px] text-[0.55rem] font-medium text-white/60">{networkName}</span>
          </div>
          <button
            onClick={handleCopy}
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-white/80 hover:bg-white/10 hover:text-white"
          >
            <span className="h-3 w-3 rounded-sm border border-white/40" /> Copy Address
          </button>
          <button
            onClick={() => { disconnect(); setOpen(false); }}
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
          >
            <span className="h-3 w-3 rounded-full bg-rose-400" /> Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
