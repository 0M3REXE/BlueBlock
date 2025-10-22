/**
 * Algorand Smart Contract Integration
 * 
 * Utilities for interacting with the BlueBlock Anchor smart contract
 */

import algosdk from 'algosdk';

// Algorand configuration
const ALGOD_TOKEN = '';
const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = '';

// Create Algod client
export function getAlgodClient(): algosdk.Algodv2 {
  return new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);
}

// Get app ID from environment
export function getAppId(): number {
  const appId = process.env.NEXT_PUBLIC_ANCHOR_APP_ID;
  if (!appId) {
    throw new Error('NEXT_PUBLIC_ANCHOR_APP_ID not set in environment');
  }
  return parseInt(appId, 10);
}

/**
 * Create a Merkle root from data items
 */
export function createMerkleRoot(dataItems: unknown[]): Uint8Array {
  if (dataItems.length === 0) {
    return new Uint8Array(32);
  }

  // Hash all items
  let leaves = dataItems.map(item => {
    const hash = algosdk.sha256(Buffer.from(JSON.stringify(item)));
    return new Uint8Array(hash);
  });

  // Build Merkle tree
  while (leaves.length > 1) {
    if (leaves.length % 2 === 1) {
      leaves.push(leaves[leaves.length - 1]); // Duplicate last if odd
    }

    const parentLevel: Uint8Array[] = [];
    for (let i = 0; i < leaves.length; i += 2) {
      const combined = new Uint8Array([...leaves[i], ...leaves[i + 1]]);
      const parentHash = algosdk.sha256(combined);
      parentLevel.push(new Uint8Array(parentHash));
    }

    leaves = parentLevel;
  }

  return leaves[0];
}

/**
 * Prepare anchor transaction for signing
 * This creates an unsigned transaction that can be signed by Pera Wallet
 */
export async function prepareAnchorTransaction(
  senderAddress: string,
  projectId: string,
  merkleRoot: Uint8Array,
  recordCount: number,
  fromTimestamp: number,
  toTimestamp: number
): Promise<algosdk.Transaction> {
  const algodClient = getAlgodClient();
  const appId = getAppId();

  // Get suggested parameters
  const suggestedParams = await algodClient.getTransactionParams().do();

  // Prepare application arguments
  const appArgs = [
    new Uint8Array(Buffer.from('anchor')),
    new Uint8Array(Buffer.from(projectId, 'utf-8')),
    merkleRoot,
    algosdk.encodeUint64(recordCount),
    algosdk.encodeUint64(fromTimestamp),
    algosdk.encodeUint64(toTimestamp),
  ];

  // Create application call transaction
  const txn = algosdk.makeApplicationNoOpTxn(
    senderAddress,
    suggestedParams,
    appId,
    appArgs
  );

  return txn;
}

/**
 * Submit a signed transaction to the network
 */
export async function submitTransaction(signedTxn: Uint8Array): Promise<string> {
  const algodClient = getAlgodClient();

  // Send transaction
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

  // Wait for confirmation
  await algosdk.waitForConfirmation(algodClient, txId, 4);

  return txId;
}

/**
 * Read the global state of the application
 */
export async function getApplicationState(appId?: number): Promise<Record<string, unknown>> {
  const algodClient = getAlgodClient();
  const actualAppId = appId || getAppId();

  const appInfo = await algodClient.getApplicationByID(actualAppId).do();
  const globalState: Record<string, unknown> = {};

  if (appInfo.params['global-state']) {
    for (const item of appInfo.params['global-state']) {
      const key = Buffer.from(item.key, 'base64').toString('utf-8');
      const value = item.value;

      if (value.type === 1) {
        // bytes
        globalState[key] = Buffer.from(value.bytes, 'base64');
      } else if (value.type === 2) {
        // uint
        globalState[key] = value.uint;
      }
    }
  }

  return globalState;
}

/**
 * Get anchor by index
 */
export async function getAnchor(anchorIndex: number): Promise<{
  merkleRoot: string;
  projectId: string;
  recordCount: number;
  fromTimestamp: number;
  toTimestamp: number;
  blockTimestamp: number;
} | null> {
  try {
    const state = await getApplicationState();
    const prefix = `anchor_${anchorIndex}`;

    const merkleRoot = state[prefix] as Buffer;
    const projectId = state[`${prefix}_project`] as Buffer;
    const recordCount = state[`${prefix}_count`] as number;
    const fromTimestamp = state[`${prefix}_from`] as number;
    const toTimestamp = state[`${prefix}_to`] as number;
    const blockTimestamp = state[`${prefix}_timestamp`] as number;

    if (!merkleRoot) {
      return null;
    }

    return {
      merkleRoot: merkleRoot.toString('hex'),
      projectId: projectId.toString('utf-8'),
      recordCount,
      fromTimestamp,
      toTimestamp,
      blockTimestamp,
    };
  } catch (error) {
    console.error('Error fetching anchor:', error);
    return null;
  }
}

/**
 * Get total number of anchors
 */
export async function getAnchorCount(): Promise<number> {
  try {
    const state = await getApplicationState();
    return (state.anchor_count as number) || 0;
  } catch (error) {
    console.error('Error fetching anchor count:', error);
    return 0;
  }
}

/**
 * Opt-in to the application
 */
export async function prepareOptInTransaction(senderAddress: string): Promise<algosdk.Transaction> {
  const algodClient = getAlgodClient();
  const appId = getAppId();

  const suggestedParams = await algodClient.getTransactionParams().do();

  const txn = algosdk.makeApplicationOptInTxn(
    senderAddress,
    suggestedParams,
    appId
  );

  return txn;
}

/**
 * Helper to format transaction for Pera Wallet signing
 */
export function formatTransactionForSigning(txn: algosdk.Transaction): algosdk.Transaction[] {
  return [txn];
}

/**
 * Get Algorand explorer URL for a transaction
 */
export function getExplorerUrl(txId: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  const baseUrl = network === 'mainnet' 
    ? 'https://explorer.perawallet.app'
    : 'https://testnet.explorer.perawallet.app';
  return `${baseUrl}/tx/${txId}`;
}

/**
 * Get Algorand explorer URL for an application
 */
export function getAppExplorerUrl(appId: number, network: 'testnet' | 'mainnet' = 'testnet'): string {
  const baseUrl = network === 'mainnet'
    ? 'https://explorer.perawallet.app'
    : 'https://testnet.explorer.perawallet.app';
  return `${baseUrl}/application/${appId}`;
}
