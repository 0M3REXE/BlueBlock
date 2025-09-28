

<div align="center">
  <h1>BlueBlock</h1>
  <p><strong>Transparent reforestation + ecological restoration data anchored to the Algorand blockchain.</strong></p>
</div>

---

## 1. What Is This Project?

BlueBlock is a Next.js + Supabase application for managing reforestation / restoration project data:

- Track sites, planting batches, measurements, photos and verification events.
- Provide separate focused dashboards for Organization staff, Field operators, and external Verifiers.
- (Planned) Periodically aggregate critical data into Merkle roots and anchor them on Algorand for tamper‑evident auditability.

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

Future additions:
- Signing anchor transactions automatically when a new root is ready.
- Viewing recent on-chain anchor transactions with deep links to explorers.

## 4. Current Architecture (MVP State)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Web UI | Next.js (App Router), React, TypeScript | Dashboards + landing site |
| Styling | Tailwind CSS | Rapid, utility-first styling |
| Data | Supabase Postgres | Authoritative project, site & measurement data |
| On-Chain | Algorand (planned) | Anchor Merkle roots of critical data |
| Wallet | Pera Wallet | User key management & transaction signing |

Logical flow:
1. Field users submit measurements via Field dashboard (placeholder form now).
2. Organization users view KPIs, site detail, manage field member associations.
3. Verifiers review verification records (table present; logic to expand).
4. A background (future) job computes Merkle root -> signed & sent to Algorand.
5. Anchor tx hash stored in `onchain_anchors` for audit UI.

## 5. Dashboards Overview

| Path | Audience | Status |
|------|----------|--------|
| `/organization-dashboard` | Internal org staff | KPIs, Sites list, Site detail (members, batches, measurements, photos) |
| `/field-dashboard` | Field teams | Measurement submission (expanding soon) |
| `/verifier-dashboard` | External verifiers | Verification records table |

Sidebars + top unified navbar keep navigation consistent while keeping role scoping conceptual (auth/RLS to follow).

## 6. Feature Highlights (Implemented)
- Wallet connect / disconnect with Pera Wallet (session reconnect).
- Structured site detail view with planting batches, measurements, photos, field member management (UI placeholder for add/remove flows).
- Separated dashboards for clarity and reduced cross-role noise.
- Theming + responsive navbar + sidebar combination.

## 7. Roadmap (Planned / Next)
Short Term:
1. Supabase Auth & organization membership mapping.
2. Real measurement creation (species, survival metrics, validation).
3. Pagination / filtering for sites & verifications.
4. Basic anchor job script + manual trigger page.

Medium Term:
5. Merkle tree generation + root anchoring transaction submission.
6. Inclusion proof API + verifier-side proof UI.
7. Offline / intermittent field capture queue + sync.
8. Role-based RLS policies across all tables.

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
```

## 9. Using the Wallet
The connect button is in the top navbar. After connecting you can access the `address` via:
```tsx
"use client";
import { useWallet } from "../lib/wallet/PeraWalletProvider";
// ...inside component
const { address, isConnected } = useWallet();
```

## 10. Merkle Anchoring (Design Sketch)
Pseudo process:
```text
SELECT rows -> normalize -> hash each leaf -> build Merkle tree -> root
root || timestamp || version -> sign (optional) -> Algorand tx (note field)
store (root, tx_id, round) in onchain_anchors
```
Later: Provide an endpoint `/api/proof?leafId=...` returning branch for client-side verification.

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




