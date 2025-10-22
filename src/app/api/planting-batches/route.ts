import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const body = await request.json();
    const { species, ...batchData } = body;

    // Create the planting batch
    const { data: batch, error: batchError } = await supabase
      .from('planting_batches')
      .insert(batchData)
      .select()
      .single();

    if (batchError) throw batchError;

    // Create species associations
    if (species && species.length > 0) {
      const speciesData = species.map((s: { species_id: string; saplings_planted: number }) => ({
        planting_batch_id: batch.id,
        species_id: s.species_id,
        saplings_planted: s.saplings_planted,
      }));

      const { error: speciesError } = await supabase
        .from('planting_batch_species')
        .insert(speciesData);

      if (speciesError) throw speciesError;
    }

    return NextResponse.json(batch);
  } catch (error) {
    console.error('Error creating planting batch:', error);
    return NextResponse.json(
      { error: 'Failed to create planting batch' },
      { status: 500 }
    );
  }
}
