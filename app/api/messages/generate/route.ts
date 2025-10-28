import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { generateMessage } from '@/lib/claude';
import { Person, Signal } from '@/lib/types';

export async function POST(request: NextRequest) {
  const supabase = getServiceSupabase();
  const { person_id } = await request.json();

  try {
    // Get person with signals
    const { data: person, error: personError } = await supabase
      .from('people')
      .select('*, signals(*)')
      .eq('id', person_id)
      .single();

    if (personError || !person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    // Get recent messages for context
    const { data: pastMessages } = await supabase
      .from('messages')
      .select('final_sent, draft')
      .eq('person_id', person_id)
      .eq('status', 'sent')
      .order('sent_at', { ascending: false })
      .limit(3);

    // Filter unused, relevant signals
    const relevantSignals = (person.signals || [])
      .filter((s: Signal) => !s.used_in_message && s.relevance_score >= 60)
      .sort((a: Signal, b: Signal) => b.relevance_score - a.relevance_score)
      .slice(0, 3);

    // Generate message
    const result = await generateMessage({
      person: person as Person,
      signals: relevantSignals as Signal[],
      pastMessages: pastMessages?.map((m) => m.final_sent || m.draft) || [],
    });

    // Save draft
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        person_id: person.id,
        signal_ids: relevantSignals.map((s: Signal) => s.id),
        draft: result.message,
        channel: result.channel,
        status: 'draft',
        ai_reasoning: result.reasoning,
      })
      .select()
      .single();

    if (messageError) {
      return NextResponse.json({ error: messageError.message }, { status: 500 });
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
}
