import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { calculateRelevanceScore } from '@/lib/claude';
import { Person } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Verify API key for security
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.N8N_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { person_name, person_id, signal_type, content, url, relevance_score, detected_at } = body;

    // Validate required fields
    if (!signal_type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: signal_type, content' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    let personRecord: Person | null = null;

    // Find person by name or ID
    if (person_name) {
      const { data: person, error: personError } = await supabase
        .from('people')
        .select('*')
        .ilike('name', person_name)
        .single();

      if (personError || !person) {
        return NextResponse.json(
          { error: `Person not found: ${person_name}` },
          { status: 404 }
        );
      }
      personRecord = person as Person;
    } else if (person_id) {
      const { data: person } = await supabase
        .from('people')
        .select('*')
        .eq('id', person_id)
        .single();

      personRecord = person as Person;
    } else {
      return NextResponse.json(
        { error: 'Must provide either person_name or person_id' },
        { status: 400 }
      );
    }

    // If no relevance score provided, calculate it with AI
    let finalRelevanceScore = relevance_score;
    if (finalRelevanceScore === undefined && personRecord) {
      finalRelevanceScore = await calculateRelevanceScore(body, personRecord);
    } else if (finalRelevanceScore === undefined) {
      finalRelevanceScore = 50; // Default
    }

    // Create the signal
    const { data: signal, error: signalError } = await supabase
      .from('signals')
      .insert({
        person_id: personRecord!.id,
        signal_type,
        content,
        url: url || null,
        relevance_score: finalRelevanceScore,
        detected_at: detected_at || new Date().toISOString(),
      })
      .select()
      .single();

    if (signalError) {
      console.error('Error creating signal:', signalError);
      return NextResponse.json(
        { error: 'Failed to create signal', details: signalError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      signal_id: signal.id,
      person_id: personRecord!.id,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in signals API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
