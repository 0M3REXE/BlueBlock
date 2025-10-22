"use client";

/**
 * Anchors Page
 * 
 * View and manage blockchain anchors for MRV data
 */

import { useState, useEffect } from 'react';
import AnchorData from '@/components/AnchorData';
import { useWallet } from '@/lib/wallet/PeraWalletProvider';

interface AnchorInfo {
  merkleRoot: string;
  projectId: string;
  recordCount: number;
  fromTimestamp: number;
  toTimestamp: number;
  blockTimestamp: number;
}

export default function AnchorsPage() {
  const { isConnected } = useWallet();
  const [anchorCount, setAnchorCount] = useState<number>(0);
  const [anchors, setAnchors] = useState<AnchorInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnchorForm, setShowAnchorForm] = useState(false);

  useEffect(() => {
    fetchAnchors();
  }, []);

  const fetchAnchors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/anchor/state');
      
      if (!response.ok) {
        throw new Error('Failed to fetch anchors');
      }

      const data = await response.json();
      setAnchorCount(data.anchorCount || 0);

      // Fetch individual anchors
      const anchorPromises = [];
      for (let i = 1; i <= data.anchorCount; i++) {
        anchorPromises.push(
          fetch(`/api/anchor/state?anchorIndex=${i}`).then(r => r.json())
        );
      }

      const anchorResults = await Promise.all(anchorPromises);
      const anchorData = anchorResults
        .filter(r => r.success && r.anchor)
        .map(r => r.anchor);

      setAnchors(anchorData);
    } catch (err) {
      console.error('Error fetching anchors:', err);
      setError(err instanceof Error ? err.message : 'Failed to load anchors');
    } finally {
      setLoading(false);
    }
  };

  const handleAnchorSuccess = (txId: string) => {
    console.log('Anchor successful:', txId);
    setShowAnchorForm(false);
    // Refresh anchors after a short delay
    setTimeout(() => fetchAnchors(), 3000);
  };

  const handleAnchorError = (errorMsg: string) => {
    alert(`Error: ${errorMsg}`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Blockchain Anchors
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            Immutable records of MRV data anchored to Algorand blockchain
          </p>
        </div>

        {/* Stats Card */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-md sm:mb-8 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500 sm:text-sm">Total Anchors</p>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">{anchorCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 sm:text-sm">Network</p>
              <p className="text-xl font-bold text-blue-600 sm:text-2xl">TestNet</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 sm:text-sm">Status</p>
              <p className="text-xl font-bold text-green-600 sm:text-2xl">Active</p>
            </div>
          </div>
        </div>

        {/* Anchor Data Form */}
        {isConnected && (
          <div className="mb-6 rounded-lg bg-white p-4 shadow-md sm:mb-8 sm:p-6">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                Anchor New Data
              </h2>
              <button
                onClick={() => setShowAnchorForm(!showAnchorForm)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                {showAnchorForm ? 'Hide Form' : 'Show Form'}
              </button>
            </div>

            {showAnchorForm && (
              <AnchorData
                projectId="project_001"
                onSuccess={handleAnchorSuccess}
                onError={handleAnchorError}
              />
            )}
          </div>
        )}

        {/* Anchors List */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Recent Anchors
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-sm text-gray-500 sm:p-8 sm:text-base">
              Loading anchors...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              Error: {error}
            </div>
          ) : anchors.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No anchors found. Create your first anchor above!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {anchors.map((anchor, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          Anchor #{anchors.length - index}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          {anchor.projectId}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex gap-2">
                          <span className="text-gray-500 w-32">Merkle Root:</span>
                          <code className="text-gray-900 font-mono text-xs break-all">
                            {anchor.merkleRoot}
                          </code>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-500 w-32">Records:</span>
                          <span className="text-gray-900">{anchor.recordCount}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-500 w-32">Data Period:</span>
                          <span className="text-gray-900">
                            {formatDate(anchor.fromTimestamp)} - {formatDate(anchor.toTimestamp)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-500 w-32">Anchored:</span>
                          <span className="text-gray-900">
                            {formatDate(anchor.blockTimestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://testnet.explorer.perawallet.app/application/${process.env.NEXT_PUBLIC_ANCHOR_APP_ID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-blue-600 hover:underline text-sm"
                    >
                      View on Explorer →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            About Blockchain Anchoring
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Merkle roots provide cryptographic proof of data integrity</li>
            <li>• All anchors are immutable and timestamped on Algorand</li>
            <li>• Third parties can verify data authenticity using Merkle proofs</li>
            <li>• Low-cost, energy-efficient consensus on Algorand TestNet</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
