# Algorand Smart Contract Integration Guide

## Overview

BlueBlock now includes a fully functional Algorand smart contract for anchoring Merkle roots of Blue Carbon MRV (Measurement, Reporting, and Verification) data. This provides immutable, cryptographically verifiable timestamps for ecological restoration data.

## Architecture

### Smart Contract (`contracts/blueblock-anchor/`)

The smart contract is written in TEAL (Transaction Execution Approval Language) and handles:

1. **Data Anchoring**: Store Merkle roots with metadata
2. **Access Control**: Only authorized accounts can anchor data
3. **State Management**: Track anchor count and metadata
4. **Verification Support**: Enable third-party verification of data integrity

### Key Components

#### 1. Smart Contract Files
- `anchor_contract.py` - Contract definition and Python SDK wrapper
- `deploy.py` - Deployment script for TestNet/MainNet
- `test_contract.py` - Testing utilities

#### 2. TypeScript Integration (`src/lib/algorand/`)
- `contract.ts` - Client-side utilities for interacting with the contract
  - Merkle root generation
  - Transaction preparation
  - State reading

#### 3. API Routes (`src/app/api/anchor/`)
- `/api/anchor/prepare` - Prepare unsigned anchor transaction
- `/api/anchor/submit` - Submit signed transaction to network
- `/api/anchor/state` - Read contract state and anchors

#### 4. UI Components
- `src/components/AnchorData.tsx` - Component for anchoring data
- `src/app/anchors/page.tsx` - Anchors dashboard page

## Deployment

### Prerequisites

1. Python 3.12+ with pip
2. AlgoKit installed (`pip install algokit`)
3. Algorand account with TestNet ALGO

### Step 1: Deploy the Smart Contract

```bash
cd contracts/blueblock-anchor

# Deploy to TestNet
python3 deploy.py
```

The script will:
1. Connect to Algorand TestNet
2. Compile the TEAL smart contract
3. Deploy the application
4. Save deployment info to `deployment.json`
5. Update `.env.local` with the app ID

### Step 2: Configure Environment

Ensure `.env.local` contains:

```bash
NEXT_PUBLIC_ANCHOR_APP_ID=<your_app_id>
```

### Step 3: Test the Contract

```bash
cd contracts/blueblock-anchor
python3 test_contract.py
```

## Usage

### 1. Anchoring Data from the UI

1. Navigate to `/anchors` in your browser
2. Connect your Pera Wallet
3. Enter data to anchor (as JSON array)
4. Click "Anchor Data to Algorand"
5. Approve the transaction in Pera Wallet

### 2. Anchoring Data Programmatically

```typescript
import { prepareAnchorTransaction, createMerkleRoot } from '@/lib/algorand/contract';
import { useWallet } from '@/lib/wallet/PeraWalletProvider';

// In your component
const { address, pera } = useWallet();

// Prepare data
const measurements = [
  { site: 'A', height: 45.2, survival: 0.92 },
  { site: 'B', height: 38.7, survival: 0.88 },
];

// Create Merkle root
const merkleRoot = createMerkleRoot(measurements);

// Prepare transaction
const txn = await prepareAnchorTransaction(
  address,
  'project_001',
  merkleRoot,
  measurements.length,
  Date.now() - 86400,
  Date.now()
);

// Sign with Pera Wallet
const signedTxns = await pera.signTransaction([txn]);

// Submit to network
await submitTransaction(signedTxns[0]);
```

### 3. Reading Anchor Data

```typescript
import { getAnchor, getAnchorCount } from '@/lib/algorand/contract';

// Get total anchors
const count = await getAnchorCount();

// Get specific anchor
const anchor = await getAnchor(1);
console.log(anchor.merkleRoot);
console.log(anchor.recordCount);
console.log(anchor.blockTimestamp);
```

## Smart Contract Details

### Global State

| Key | Type | Description |
|-----|------|-------------|
| `owner` | address | Contract deployer/owner |
| `anchor_count` | uint64 | Total number of anchors |
| `project_count` | uint64 | Number of projects (future use) |
| `anchor_N` | bytes | Merkle root for anchor N |
| `anchor_N_project` | bytes | Project ID for anchor N |
| `anchor_N_count` | uint64 | Record count for anchor N |
| `anchor_N_from` | uint64 | Start timestamp for data window |
| `anchor_N_to` | uint64 | End timestamp for data window |
| `anchor_N_timestamp` | uint64 | Block timestamp when anchored |

### Application Calls

#### anchor

Store a new Merkle root on-chain.

**Arguments:**
1. Method name: `"anchor"` (bytes)
2. Project ID: `"project_xxx"` (bytes)
3. Merkle root: 32-byte hash (bytes)
4. Record count: number of records (uint64)
5. From timestamp: start of data window (uint64)
6. To timestamp: end of data window (uint64)

**Authorization:** Only owner or approved accounts

**Returns:** Transaction ID

#### get_anchor

Read anchor data (informational only; data is read via application state).

**Arguments:**
1. Method name: `"get_anchor"` (bytes)
2. Anchor index: which anchor to read (uint64)

**Authorization:** Public (anyone can read)

## Security Considerations

1. **Access Control**: Only the contract owner can anchor data by default
2. **Immutability**: Once anchored, data cannot be modified
3. **Timestamp Validation**: Blockchain timestamps provide ordering guarantees
4. **Merkle Proofs**: Third parties can verify data inclusion without exposing raw data

## Network Configuration

### TestNet (Current)
- Algod API: `https://testnet-api.algonode.cloud`
- Explorer: `https://testnet.explorer.perawallet.app`
- Faucet: `https://bank.testnet.algorand.network`

### MainNet (Production)
- Algod API: `https://mainnet-api.algonode.cloud`
- Explorer: `https://explorer.perawallet.app`
- Note: Requires real ALGO for transactions

## Merkle Tree Implementation

The implementation uses a simple binary Merkle tree:

1. **Leaf Nodes**: Hash of each data item (SHA-256)
2. **Internal Nodes**: Hash of concatenated child hashes
3. **Root**: Single 32-byte hash representing the entire dataset

### Example

```
Data: [A, B, C, D]

    Root
    /  \
   H1   H2
  / \  / \
 A  B C  D

Root = Hash(H1 + H2)
H1 = Hash(A + B)
H2 = Hash(C + D)
```

## Future Enhancements

1. **Merkle Proof Verification**: API endpoint for generating and verifying proofs
2. **Automated Anchoring**: Background job to periodically anchor new data
3. **Multi-Project Support**: Allow multiple organizations to use the same contract
4. **Gas Optimization**: Batch multiple anchors in a single transaction
5. **Off-chain Storage**: Store large datasets off-chain, only anchoring roots

## Troubleshooting

### Contract Not Found
- Ensure `NEXT_PUBLIC_ANCHOR_APP_ID` is set in `.env.local`
- Verify the app ID exists on the network you're using

### Transaction Failed
- Check account has sufficient ALGO (minimum 0.1 ALGO)
- Verify account has opted into the application
- Ensure you're connected to the correct network (TestNet vs MainNet)

### Cannot Read State
- Wait a few seconds for blockchain confirmation
- Verify the app ID is correct
- Check network connectivity

## Support

For issues or questions:
1. Check the documentation in `contracts/blueblock-anchor/README.md`
2. Review example code in `test_contract.py`
3. Open an issue on GitHub

## Resources

- [Algorand Documentation](https://developer.algorand.org/)
- [Pera Wallet](https://perawallet.app/)
- [TEAL Language Guide](https://developer.algorand.org/docs/get-details/dapps/avm/teal/)
- [AlgoKit Documentation](https://github.com/algorandfoundation/algokit-cli)
