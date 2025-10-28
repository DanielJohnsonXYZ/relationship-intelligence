import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { updateResponsiveness } from '@/lib/scheduling';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getServiceSupabase();
  const body = await request.json();

  // If marking as sent, update the person's last_contact_date
  if (body.status === 'sent') {
    const { data: message } = await supabase
      .from('messages')
      .select('person_id, signal_ids')
      .eq('id', id)
      .single();

    if (message) {
      // Update person
      await supabase
        .from('people')
        .update({
          last_contact_date: new Date().toISOString(),
        })
        .eq('id', message.person_id);

      // Mark signals as used
      if (message.signal_ids && message.signal_ids.length > 0) {
        await supabase
          .from('signals')
          .update({ used_in_message: true })
          .in('id', message.signal_ids);
      }
    }
  }

  const { data, error } = await supabase
    .from('messages')
    .update({
      ...body,
      sent_at: body.status === 'sent' ? new Date().toISOString() : undefined,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getServiceSupabase();
  const { action } = await request.json();

  if (action === 'mark_replied') {
    // Get message and person
    const { data: message } = await supabase
      .from('messages')
      .select('person_id')
      .eq('id', id)
      .single();

    if (message) {
      const { data: person } = await supabase
        .from('people')
        .select('responsiveness_score')
        .eq('id', message.person_id)
        .single();

      if (person) {
        const newScore = updateResponsiveness(person.responsiveness_score, true);

        await supabase
          .from('people')
          .update({ responsiveness_score: newScore })
          .eq('id', message.person_id);
      }
    }

    const { data, error } = await supabase
      .from('messages')
      .update({
        status: 'replied',
        replied_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
