/**
 * API Route: Prepare Anchor Transaction
 * 
 * Prepares an unsigned transaction for anchoring data to Algorand.
 * The transaction is then signed by the user's Pera Wallet.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prepareAnchorTransaction, createMerkleRoot } from '@/lib/algorand/contract';
import algosdk from 'algosdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderAddress, projectId, dataItems } = body;

    // Validate inputs
    if (!senderAddress || !projectId || !Array.isArray(dataItems)) {
      return NextResponse.json(
        { error: 'Missing required fields: senderAddress, projectId, dataItems' },
        { status: 400 }
      );
    }

    if (dataItems.length === 0) {
      return NextResponse.json(
        { error: 'dataItems array cannot be empty' },
        { status: 400 }
      );
    }

    // Create Merkle root from data items
    const merkleRoot = createMerkleRoot(dataItems);
    const recordCount = dataItems.length;

    // Calculate timestamps (current time window)
    const now = Math.floor(Date.now() / 1000);
    const fromTimestamp = now - 86400; // 24 hours ago
    const toTimestamp = now;

    // Prepare transaction
    const txn = await prepareAnchorTransaction(
      senderAddress,
      projectId,
      merkleRoot,
      recordCount,
      fromTimestamp,
      toTimestamp
    );

    // Convert transaction to base64 for client-side signing
    const txnB64 = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString('base64');

    return NextResponse.json({
      success: true,
      transaction: txnB64,
      merkleRoot: Buffer.from(merkleRoot).toString('hex'),
      recordCount,
      fromTimestamp,
      toTimestamp,
    });
  } catch (error) {
    console.error('Error preparing anchor transaction:', error);
    return NextResponse.json(
      { error: 'Failed to prepare transaction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
