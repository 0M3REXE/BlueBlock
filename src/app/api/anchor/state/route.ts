/**
 * API Route: Get Contract State
 * 
 * Returns the current state of the anchor smart contract.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getApplicationState, getAnchorCount, getAnchor } from '@/lib/algorand/contract';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const anchorIndex = searchParams.get('anchorIndex');

    if (anchorIndex) {
      // Get specific anchor
      const anchor = await getAnchor(parseInt(anchorIndex, 10));
      
      if (!anchor) {
        return NextResponse.json(
          { error: 'Anchor not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        anchor,
      });
    }

    // Get overall state
    const state = await getApplicationState();
    const anchorCount = await getAnchorCount();

    return NextResponse.json({
      success: true,
      anchorCount,
      state,
    });
  } catch (error) {
    console.error('Error fetching contract state:', error);
    return NextResponse.json(
      { error: 'Failed to fetch state', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
