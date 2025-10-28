import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { calculateRelevanceScore } from '@/lib/claude';
import { Person } from '@/lib/types';

export async function POST(request: NextRequest) {
  const supabase = getServiceSupabase();
  const body = await request.json();

  // If no relevance score provided, calculate it with AI
  let relevanceScore = body.relevance_score;
  if (relevanceScore === undefined) {
    const { data: person } = await supabase
      .from('people')
      .select('*')
      .eq('id', body.person_id)
      .single();

    if (person) {
      relevanceScore = await calculateRelevanceScore(body, person as Person);
    } else {
      relevanceScore = 50; // Default
    }
  }

  const { data, error } = await supabase
    .from('signals')
    .insert({
      ...body,
      relevance_score: relevanceScore,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
