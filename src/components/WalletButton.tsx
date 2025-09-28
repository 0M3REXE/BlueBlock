"use client";

import { useWallet } from "../lib/wallet/PeraWalletProvider";

function truncate(addr: string) {
  return addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

export default function WalletButton({ className = "" }: { className?: string }) {
  const { address, connect, disconnect, connecting } = useWallet();
  const isConnected = !!address;

  return (
    <button
      onClick={() => (isConnected ? disconnect() : connect())}
      disabled={connecting}
      className={`rounded-full bg-white px-5 py-2 text-[0.7rem] font-semibold tracking-wide text-[#062024] shadow-sm ring-1 ring-white/60 transition hover:bg-white/90 hover:ring-white disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {connecting ? "Connecting…" : isConnected ? truncate(address!) : "Connect Wallet"}
    </button>
  );
}
