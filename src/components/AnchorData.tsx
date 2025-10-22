"use client";

/**
 * Anchor Data Component
 * 
 * Allows users to anchor Merkle roots of data batches to Algorand blockchain
 */

import { useState } from 'react';
import { useWallet } from '@/lib/wallet/PeraWalletProvider';
import algosdk from 'algosdk';

interface AnchorDataProps {
  projectId: string;
  onSuccess?: (txId: string) => void;
  onError?: (error: string) => void;
}

export default function AnchorData({ projectId, onSuccess, onError }: AnchorDataProps) {
  const { address, isConnected, pera } = useWallet();
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [dataInput, setDataInput] = useState('');

  const anchorData = async () => {
    if (!address || !pera) {
      onError?.('Please connect your wallet first');
      return;
    }

    if (!dataInput.trim()) {
      onError?.('Please enter data to anchor');
      return;
    }

    setIsAnchoring(true);
    setLastTxId(null);

    try {
      // Parse data items (expecting JSON array)
      let dataItems;
      try {
        dataItems = JSON.parse(dataInput);
        if (!Array.isArray(dataItems)) {
          throw new Error('Data must be a JSON array');
        }
      } catch {
        // If not valid JSON, treat as single text item
        dataItems = [{ data: dataInput, timestamp: Date.now() }];
      }

      // Step 1: Prepare transaction
      const prepareResponse = await fetch('/api/anchor/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderAddress: address,
          projectId,
          dataItems,
        }),
      });

      if (!prepareResponse.ok) {
        const error = await prepareResponse.json();
        throw new Error(error.error || 'Failed to prepare transaction');
      }

      const { transaction, merkleRoot, recordCount } = await prepareResponse.json();

      // Step 2: Sign with Pera Wallet
      const txnBuffer = Buffer.from(transaction, 'base64');
      const txnDecoded = algosdk.decodeUnsignedTransaction(txnBuffer);

      const signedTxns = await pera.signTransaction([txnDecoded]);

      if (!signedTxns || signedTxns.length === 0) {
        throw new Error('Transaction signing was cancelled');
      }

      // Step 3: Submit signed transaction
      const submitResponse = await fetch('/api/anchor/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedTransaction: Buffer.from(signedTxns[0]).toString('base64'),
        }),
      });

      if (!submitResponse.ok) {
        const error = await submitResponse.json();
        throw new Error(error.error || 'Failed to submit transaction');
      }

      const { txId, explorerUrl } = await submitResponse.json();

      setLastTxId(txId);
      console.log('Anchor successful!', { txId, merkleRoot, recordCount, explorerUrl });
      onSuccess?.(txId);
    } catch (error) {
      console.error('Anchor error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onError?.(errorMessage);
    } finally {
      setIsAnchoring(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800 sm:text-base">Please connect your Pera Wallet to anchor data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="data-input" className="mb-2 block text-sm font-medium">
          Data to Anchor
        </label>
        <textarea
          id="data-input"
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          placeholder='Enter data as JSON array, e.g.: [{"site": "A", "value": 123}, {"site": "B", "value": 456}]'
          rows={6}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isAnchoring}
        />
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Enter measurement data as a JSON array. A Merkle root will be computed and stored on-chain.
        </p>
      </div>

      <button
        onClick={anchorData}
        disabled={isAnchoring || !dataInput.trim()}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-base"
      >
        {isAnchoring ? 'Anchoring...' : 'Anchor Data to Algorand'}
      </button>

      {lastTxId && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="mb-2 font-medium text-green-800">✅ Data anchored successfully!</p>
          <p className="mb-2 break-all text-xs text-green-700 sm:text-sm">Transaction ID: {lastTxId}</p>
          <a
            href={`https://testnet.explorer.perawallet.app/tx/${lastTxId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline sm:text-sm"
          >
            View on Explorer →
          </a>
        </div>
      )}
    </div>
  );
}
