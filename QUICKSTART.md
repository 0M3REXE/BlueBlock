# Quick Start Guide - Algorand Smart Contract

This guide will help you deploy and use the BlueBlock Anchor smart contract.

## Prerequisites

1. **Python 3.12+** - Required for AlgoKit and deployment scripts
2. **Node.js 18+** - For the Next.js application
3. **Algorand Account** - With TestNet ALGO for deployment

## Step 1: Install AlgoKit

```bash
pip3 install algokit --user
```

Verify installation:
```bash
algokit --version
```

## Step 2: Fund Your Account

1. Go to [Algorand TestNet Dispenser](https://bank.testnet.algorand.network/)
2. Enter your Algorand address
3. Request TestNet ALGO (you'll need at least 1 ALGO)

## Step 3: Deploy the Smart Contract

```bash
cd contracts/blueblock-anchor
python3 deploy.py
```

The script will:
- Connect to Algorand TestNet
- Compile the TEAL smart contract
- Deploy the application
- Save the app ID to `deployment.json`
- Attempt to update `.env.local` with the app ID

**Important:** Save the mnemonic phrase if creating a new account!

## Step 4: Configure Environment

Create `.env.local` in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your app ID:
```
NEXT_PUBLIC_ANCHOR_APP_ID=123456789
```

(The app ID is displayed at the end of deployment and saved in `contracts/blueblock-anchor/deployment.json`)

## Step 5: Run the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000/anchors` to access the anchoring interface.

## Step 6: Test Anchoring

1. **Connect Wallet**: Click "Connect Wallet" and connect your Pera Wallet
2. **Navigate to Anchors**: Go to `/anchors` page
3. **Prepare Data**: Enter data as JSON array, for example:
   ```json
   [
     {"site": "A", "height": 45.2, "survival": 0.92},
     {"site": "B", "height": 38.7, "survival": 0.88}
   ]
   ```
4. **Click "Anchor Data"**: This will:
   - Generate a Merkle root
   - Prepare the transaction
   - Prompt Pera Wallet to sign
   - Submit to Algorand
5. **View Result**: Transaction ID and explorer link will be shown

## Understanding the Flow

```
User Data → Merkle Root → Transaction → Pera Wallet (Sign) → Algorand → Confirmed
```

1. **Merkle Root**: Cryptographic hash representing all data items
2. **Transaction**: Smart contract call with the Merkle root
3. **Signing**: User approves with Pera Wallet
4. **On-Chain**: Immutable record on Algorand blockchain

## Viewing Anchors

### In the UI
- Navigate to `/anchors`
- See list of all anchors with:
  - Merkle root
  - Record count
  - Timestamps
  - Links to explorer

### Via API
```bash
# Get all anchors
curl http://localhost:3000/api/anchor/state

# Get specific anchor (index 1)
curl http://localhost:3000/api/anchor/state?anchorIndex=1
```

### On Blockchain Explorer
Visit: `https://testnet.explorer.perawallet.app/application/YOUR_APP_ID`

## Common Issues

### "App ID not found"
- Ensure `NEXT_PUBLIC_ANCHOR_APP_ID` is set in `.env.local`
- Restart the dev server after updating `.env.local`

### "Transaction failed"
- Check account has sufficient ALGO (at least 0.1 ALGO)
- Verify you're on TestNet (not MainNet)
- Ensure wallet is connected

### "Cannot compile contract"
- Network issue downloading TEAL compiler
- Try again or check internet connectivity

### "Deployment failed"
- Account not funded (get ALGO from dispenser)
- Network connectivity issues
- Try deploying again

## Next Steps

1. **Integrate with Real Data**: Connect the anchoring to your actual measurement data
2. **Automated Anchoring**: Create a background job to anchor data periodically
3. **Merkle Proofs**: Implement proof generation and verification
4. **Multi-Project**: Add support for multiple projects

## Resources

- [Full Documentation](./ALGORAND_INTEGRATION.md)
- [Algorand Developer Docs](https://developer.algorand.org/)
- [Pera Wallet](https://perawallet.app/)
- [AlgoKit Documentation](https://github.com/algorandfoundation/algokit-cli)

## Getting Help

- Review `ALGORAND_INTEGRATION.md` for detailed information
- Check the example code in `contracts/blueblock-anchor/test_contract.py`
- Open an issue on GitHub for bugs or questions
