import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { calculateNextContactDate } from '@/lib/scheduling';

export async function GET() {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('people')
    .select('*')
    .order('priority', { ascending: false })
    .order('next_contact_date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = getServiceSupabase();
  const body = await request.json();

  // Calculate initial next contact date
  const nextContactDate = calculateNextContactDate({
    ...body,
    last_contact_date: null,
    responsiveness_score: 50,
    relationship_temperature: body.relationship_temperature || 'warm',
  });

  const { data, error } = await supabase
    .from('people')
    .insert({
      ...body,
      next_contact_date: nextContactDate.toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
