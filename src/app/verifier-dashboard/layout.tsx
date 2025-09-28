import { ReactNode } from 'react';
import WalletButton from '../../components/WalletButton';

export const metadata = { title: 'Verifier Dashboard - BlueBlock' };

export default function VerifierDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#031c22] text-white">
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-white/10 bg-[#04252d] px-4 py-2">
          <div className="text-xs font-semibold tracking-wide">VERIFIER DASHBOARD</div>
          <div className="ml-auto"><WalletButton /></div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
