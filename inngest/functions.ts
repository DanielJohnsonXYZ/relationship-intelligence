import { inngest } from './client';
import { getServiceSupabase } from '@/lib/supabase';
import { generateMessage } from '@/lib/claude';
import { shouldContactNow, calculateNextContactDate } from '@/lib/scheduling';
import { Person, Signal } from '@/lib/types';

// Daily job to generate messages for people due for contact
export const generateDailyOutreach = inngest.createFunction(
  { id: 'generate-daily-outreach', name: 'Generate Daily Outreach Messages' },
  { cron: '0 9 * * *' }, // 9 AM daily
  async ({ step }) => {
    const supabase = getServiceSupabase();

    // Step 1: Find people due for contact
    const peopleToContact = await step.run('find-due-contacts', async () => {
      const { data, error } = await supabase
        .from('people')
        .select('*, signals(*)')
        .lte('next_contact_date', new Date().toISOString())
        .order('priority', { ascending: false })
        .limit(10); // Process 10 per day

      if (error) throw error;
      return data as (Person & { signals: Signal[] })[];
    });

    if (!peopleToContact || peopleToContact.length === 0) {
      return { message: 'No people due for contact today' };
    }

    // Step 2: Generate messages for each person
    const results = [];
    for (const person of peopleToContact) {
      const result = await step.run(`generate-message-${person.id}`, async () => {
        try {
          // Get past messages for context
          const { data: pastMessages } = await supabase
            .from('messages')
            .select('final_sent, draft')
            .eq('person_id', person.id)
            .eq('status', 'sent')
            .order('sent_at', { ascending: false })
            .limit(3);

          // Filter relevant signals
          const relevantSignals = person.signals
            .filter((s) => !s.used_in_message && s.relevance_score >= 60)
            .sort((a, b) => b.relevance_score - a.relevance_score)
            .slice(0, 3);

          // Generate message
          const generated = await generateMessage({
            person,
            signals: relevantSignals,
            pastMessages: pastMessages?.map((m) => m.final_sent || m.draft) || [],
          });

          // Save draft
          const { data: message, error: messageError } = await supabase
            .from('messages')
            .insert({
              person_id: person.id,
              signal_ids: relevantSignals.map((s) => s.id),
              draft: generated.message,
              channel: generated.channel,
              status: 'draft',
              ai_reasoning: generated.reasoning,
            })
            .select()
            .single();

          if (messageError) throw messageError;

          // Update next contact date
          const nextDate = calculateNextContactDate(person, person.signals);
          await supabase
            .from('people')
            .update({ next_contact_date: nextDate.toISOString() })
            .eq('id', person.id);

          return { success: true, person: person.name, messageId: message.id };
        } catch (error) {
          console.error(`Failed to generate message for ${person.name}:`, error);
          return { success: false, person: person.name, error: String(error) };
        }
      });

      results.push(result);
    }

    return {
      processed: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  }
);

// Function to detect signals from external sources (placeholder for now)
export const detectSignals = inngest.createFunction(
  { id: 'detect-signals', name: 'Detect Signals from External Sources' },
  { cron: '0 */6 * * *' }, // Every 6 hours
  async ({ step }) => {
    const supabase = getServiceSupabase();

    // Get all people with monitoring links
    const people = await step.run('get-people-to-monitor', async () => {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .or('linkedin_url.neq.null,twitter_handle.neq.null,company_domain.neq.null');

      if (error) throw error;
      return data as Person[];
    });

    if (!people || people.length === 0) {
      return { message: 'No people with monitoring links' };
    }

    // TODO: Implement actual signal detection
    // For now, this is a placeholder that you can extend with:
    // - LinkedIn scraping (Proxycurl)
    // - Twitter API
    // - News API (Perplexity/Google)
    // - RSS feeds

    return {
      message: 'Signal detection is a placeholder - extend with actual APIs',
      peopleMonitored: people.length,
    };
  }
);
