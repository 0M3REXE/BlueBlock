

<div align="center">
  <h1>BlueBlock</h1>
  <p><strong>Transparent reforestation + ecological restoration data anchored to the Algorand blockchain.</strong></p>
</div>

---

## 1. What Is This Project?

A decentralized Blue Carbon MRV platform built on Algorand, enabling transparent tracking of coastal ecosystem restoration. Verified field data from drones and mobile apps is immutably stored, with smart contracts tokenizing carbon credits. The system empowers NGOs, communities, and coastal panchayats to participate and benefit in India’s climate.

### What it does ?

- Track sites, planting batches, measurements, photos and verification events.
- Provide separate focused dashboards for Organization staff, Field operators, and external Verifiers.
- **✅ NEW:** Anchor Merkle roots of MRV data to Algorand blockchain via smart contract for tamper-evident auditability.

## 2. Why Algorand?

Algorand offers low latency finality, low fees, and energy efficient consensus—ideal for frequent lightweight data anchoring. Instead of pushing every measurement on‑chain (expensive & noisy), BlueBlock will:

1. Build a canonical, ordered dataset in Postgres (Supabase).
2. Hash relevant rows (e.g. latest measurements, verification outcomes) into a Merkle tree.
3. Commit the Merkle root to Algorand (onchain_anchors table already scaffolded).
4. Allow any third party to re-compute and verify inclusion proofs against the anchored root.

Benefits:
- Immutable timestamp + ordering guarantee.
- Verifiable history without exposing sensitive raw data publicly.
- Cheap to scale (root commits vs. per-record writes).

## 3. Pera Wallet Integration

The app integrates [Pera Wallet](https://perawallet.app/) via `@perawallet/connect` so users (or later automated org keys) can connect an Algorand address, sign anchor transactions, and in future verify proofs.

Key integration pieces:
- `src/lib/wallet/PeraWalletProvider.tsx` – connection lifecycle + reconnect.
- `src/components/WalletButton.tsx` – adaptive connect / address / disconnect UI.
- Global provider wrapped in `app/layout.tsx`.

**✅ NEW - Smart Contract Integration:**
- Full TEAL smart contract deployed via AlgoKit for anchoring Merkle roots
- Interactive UI at `/anchors` for anchoring and viewing data
- API routes for transaction preparation and submission
- Pera Wallet integration for transaction signing
- View anchors on Algorand TestNet Explorer

See [ALGORAND_INTEGRATION.md](./ALGORAND_INTEGRATION.md) for detailed documentation.

## 4. Current Architecture (MVP State)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Web UI | Next.js (App Router), React, TypeScript | Dashboards + landing site |
| Styling | Tailwind CSS | Rapid, utility-first styling |
| Data | Supabase Postgres | Authoritative project, site & measurement data |
| **Smart Contract** | **Algorand TEAL + AlgoKit** | **Anchor Merkle roots on-chain** |
| On-Chain | Algorand (TestNet) | Immutable data anchoring |
| Wallet | Pera Wallet | User key management & transaction signing |

Logical flow:
1. Field users submit measurements via Field dashboard (placeholder form now).
2. Organization users view KPIs, site detail, manage field member associations.
3. Verifiers review verification records (table present; logic to expand).
4. **✅ NEW:** Authorized users can anchor batches of data to Algorand via `/anchors` page.
5. Merkle roots are computed and stored on-chain via smart contract.
6. Transaction hash and metadata stored in `onchain_anchors` for audit UI.

## 5. Dashboards Overview

| Path | Audience | Status |
|------|----------|--------|
| `/organization-dashboard` | Internal org staff | KPIs, Sites list, Site detail (members, batches, measurements, photos) |
| `/field-dashboard` | Field teams | Measurement submission (expanding soon) |
| `/verifier-dashboard` | External verifiers | Verification records table |
| **`/anchors`** | **Authorized users** | **Anchor data to blockchain + view anchors** |

Sidebars + top unified navbar keep navigation consistent while keeping role scoping conceptual (auth/RLS to follow).

## 6. Feature Highlights (Implemented)
- Wallet connect / disconnect with Pera Wallet (session reconnect).
- **✅ NEW:** Full Algorand smart contract implementation with AlgoKit.
- **✅ NEW:** Data anchoring UI with Merkle root generation.
- **✅ NEW:** View on-chain anchors with transaction links to explorer.
- Structured site detail view with planting batches, measurements, photos, field member management (UI placeholder for add/remove flows).
- Separated dashboards for clarity and reduced cross-role noise.
- Theming + responsive navbar + sidebar combination.

## 7. Roadmap (Planned / Next)
Short Term:
1. Supabase Auth & organization membership mapping.
2. Real measurement creation (species, survival metrics, validation).
3. Pagination / filtering for sites & verifications.
4. ~~Basic anchor job script + manual trigger page~~ **✅ DONE - Smart contract + UI implemented**

Medium Term:
5. ~~Merkle tree generation + root anchoring transaction submission~~ **✅ DONE**
6. Inclusion proof API + verifier-side proof UI.
7. Offline / intermittent field capture queue + sync.
8. Role-based RLS policies across all tables.
9. Automated background job for periodic anchoring.

Long Term:
9. Public transparency portal (read-only, proof verification UX).
10. Multi-org support w/ invitation flows & audit logs.
11. Geospatial overlays (map view) for sites & planting batches.

## 8. Getting Started (Local Dev)

Prerequisites: Node.js 18+, PNPM/NPM/Yarn, a Supabase project (if you want live data), optional Algorand TestNet account.

Install deps & run dev server:

```bash
npm install
npm run dev
```

Visit http://localhost:3000

Environment variables you will eventually add (placeholder):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # server jobs only (never expose client side)
ALGOD_API_URL=https://testnet-api.algonode.cloud
NEXT_PUBLIC_ANCHOR_APP_ID=   # Set after deploying smart contract
```

## Deploying the Smart Contract

```bash
# Install Python dependencies
pip3 install algokit --user

# Deploy the contract
cd contracts/blueblock-anchor
python3 deploy.py

# This will create deployment.json and update .env.local
```

See [ALGORAND_INTEGRATION.md](./ALGORAND_INTEGRATION.md) for detailed instructions.

## 9. Using the Wallet
The connect button is in the top navbar. After connecting you can access the `address` via:
```tsx
"use client";
import { useWallet } from "../lib/wallet/PeraWalletProvider";
// ...inside component
const { address, isConnected } = useWallet();
```

## 10. Merkle Anchoring (Implemented)

The smart contract enables:
```typescript
// Create Merkle root from data
import { createMerkleRoot, prepareAnchorTransaction } from '@/lib/algorand/contract';

const data = [
  { site: 'A', height: 45.2, survival: 0.92 },
  { site: 'B', height: 38.7, survival: 0.88 }
];

const merkleRoot = createMerkleRoot(data);

// Prepare and sign transaction with Pera Wallet
const txn = await prepareAnchorTransaction(
  address, projectId, merkleRoot, data.length, fromTs, toTs
);
const signed = await pera.signTransaction([txn]);

// Submit to Algorand
await submitTransaction(signed[0]);
```

View anchors at `/anchors` or via the API at `/api/anchor/state`.

For detailed documentation, see [ALGORAND_INTEGRATION.md](./ALGORAND_INTEGRATION.md).

## 11. Contributing
PRs welcome once core auth + anchoring is stabilized. Until then focus is rapid iteration.

## 12. License
TBD (add MIT / Apache-2.0 when finalized).

## 13. Acknowledgements
- Algorand ecosystem & Pera Wallet team.
- Supabase for a great DX.
- Vercel / Next.js for deployment & framework tooling.

---

> This project uses Pera Wallet for Algorand account connectivity and will leverage Algorand for cryptographic data anchoring, not bulk storage. Transparency with efficiency.


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




