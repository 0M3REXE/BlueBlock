/**
 * API Route: Submit Signed Transaction
 * 
 * Submits a signed transaction to the Algorand network.
 */

import { NextRequest, NextResponse } from 'next/server';
import { submitTransaction } from '@/lib/algorand/contract';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signedTransaction } = body;

    if (!signedTransaction) {
      return NextResponse.json(
        { error: 'Missing signedTransaction' },
        { status: 400 }
      );
    }

    // Convert base64 signed transaction to Uint8Array
    const signedTxn = new Uint8Array(Buffer.from(signedTransaction, 'base64'));

    // Submit to network
    const txId = await submitTransaction(signedTxn);

    return NextResponse.json({
      success: true,
      txId,
      explorerUrl: `https://testnet.explorer.perawallet.app/tx/${txId}`,
    });
  } catch (error) {
    console.error('Error submitting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to submit transaction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
