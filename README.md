This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Pera Wallet Integration

This project integrates [Pera Wallet](https://perawallet.app/) using `@perawallet/connect` to enable Algorand account connections.

### Files Added

- `src/lib/wallet/PeraWalletProvider.tsx` – React context handling connect / reconnect / disconnect.
- `src/components/WalletButton.tsx` – UI button that shows `Connect Wallet`, loading state, or truncated address and allows disconnect.
- Modified `src/app/layout.tsx` – Wraps the app with `PeraWalletProvider`.
- Modified `src/components/Navbar.tsx` – Replaced static link with dynamic `WalletButton`.

### Usage

`WalletButton` is already placed in the navbar. To use wallet state in a component:

```tsx
"use client";
import { useWallet } from "../lib/wallet/PeraWalletProvider";

export function Example() {
	const { address, connect, disconnect, isConnected } = useWallet();
	return (
		<div>
			{isConnected ? (
				<button onClick={disconnect}>Disconnect {address?.slice(0,6)}…</button>
			) : (
				<button onClick={connect}>Connect Wallet</button>
			)}
		</div>
	);
}
```

### Chain Selection

By default the SDK uses chain id `4160` (All). To pin to TestNet or MainNet adjust the constructor in `PeraWalletProvider`:

```ts
new PeraWalletConnect({ chainId: "416002" }); // TestNet
```

### Future: Signing Transactions

`algosdk` is installed. Example skeleton:

```ts
import algosdk from "algosdk";
import { useWallet } from "../lib/wallet/PeraWalletProvider";

async function signPayment(pera: any, from: string, to: string) {
	const algod = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
	const params = await algod.getTransactionParams().do();
	const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
		from,
		to,
		amount: 1, // microAlgos
		suggestedParams: params,
	});
	const signed = await pera.signTransaction([[{ txn }]]);
	await algod.sendRawTransaction(signed[0]).do();
}
```

### Reconnect Logic

On mount the provider calls `reconnectSession()` and re-attaches the disconnect listener.

### Styling

The navbar button is a white pill (`WalletButton`) and reuses Tailwind utilities. Modify its look in `WalletButton.tsx`.

---


## Dashboard Structure (Separated by Role)

The previous experimental unified `/dashboard` with cookie-based role switching has been removed.

Current top-level route groups:

- `/organization-dashboard` – overview KPIs + sites list & site detail.
- `/field-dashboard` – simplified field data entry form (placeholder for future offline/queue features).
- `/verifier-dashboard` – verification activity list.

Why: this mirrors real-world separation of concerns and avoids leaking navigation items across roles. Proper auth + RLS enforcement will replace this static split later.

Removed prototype artifacts:

- `src/app/dashboard/*`
- `src/components/ClientSidebarNav.tsx`
- `src/components/RoleSwitcher.tsx`
- `src/app/api/set-role/route.ts`
- `src/middleware.ts`

Next improvements (future):

1. Introduce Supabase Auth & derive organization membership.
2. Add RLS policies (templates already started) for row-level scoping.
3. Add pagination + filtering to sites & verifications.
4. Field dashboard: site picker & offline capture queue.
5. Organization: recent measurements widget & simple project view (optional later).




