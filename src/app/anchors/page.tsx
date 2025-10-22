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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Blockchain Anchors
          </h1>
          <p className="text-gray-600">
            Immutable records of MRV data anchored to Algorand blockchain
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Anchors</p>
              <p className="text-2xl font-bold text-gray-900">{anchorCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Network</p>
              <p className="text-2xl font-bold text-blue-600">TestNet</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
          </div>
        </div>

        {/* Anchor Data Form */}
        {isConnected && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Anchor New Data
              </h2>
              <button
                onClick={() => setShowAnchorForm(!showAnchorForm)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Anchors
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
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
