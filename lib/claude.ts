import Anthropic from '@anthropic-ai/sdk';
import { Person, Signal, MessageChannel } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface GenerateMessageParams {
  person: Person;
  signals: Signal[];
  pastMessages?: string[];
}

interface GeneratedMessage {
  message: string;
  reasoning: string;
  channel: MessageChannel;
  confidence: number;
}

export async function generateMessage(params: GenerateMessageParams): Promise<GeneratedMessage> {
  const { person, signals, pastMessages = [] } = params;

  const prompt = `You are helping me stay thoughtfully connected with ${person.name}${person.role ? `, ${person.role}` : ''}${person.company ? ` at ${person.company}` : ''}.

CONTEXT ABOUT THEM:
${person.notes || 'No additional notes yet.'}
${person.interests.length > 0 ? `Interests: ${person.interests.join(', ')}` : ''}
Our relationship: ${person.relationship_temperature}
${person.last_contact_date ? `Last contacted: ${new Date(person.last_contact_date).toLocaleDateString()}` : 'Never contacted before'}
Priority: ${person.priority}/10

RECENT SIGNALS:
${signals.length > 0 ? signals.map(s => `- ${s.signal_type}: ${s.title}
  ${s.description || ''}
  ${s.url ? `Source: ${s.url}` : ''}`).join('\n\n') : 'No recent signals detected.'}

MY COMMUNICATION STYLE:
- Warm but not overly casual
- Reference one specific thing they've done/said
- Keep it under 3 sentences
- Natural opener, no "just checking in" or "hope this finds you well"
- Show genuine interest, not transactional
- Sound like a real human who actually pays attention

${pastMessages.length > 0 ? `Examples of messages I've sent before:\n${pastMessages.slice(0, 3).join('\n\n')}` : ''}

TASK:
Draft a short message (2-3 sentences) that:
1. References the most relevant signal naturally (or just checks in thoughtfully if no signals)
2. Shows I'm paying attention and care
3. Opens the door for a brief reply or meeting
4. Sounds authentic and personal

Return ONLY a JSON object (no markdown, no code blocks) in this exact format:
{
  "message": "the draft message text",
  "reasoning": "why this message/timing makes sense",
  "channel": "email",
  "confidence": 85
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20250219',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse the JSON response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from Claude response');
  }

  const result = JSON.parse(jsonMatch[0]) as GeneratedMessage;
  return result;
}

export async function calculateRelevanceScore(signal: Signal, person: Person): Promise<number> {
  const prompt = `Given this signal about ${person.name}:
Signal: ${signal.signal_type} - ${signal.title}
${signal.description || ''}

And this context about our relationship:
${person.notes || 'No notes'}
Interests: ${person.interests.join(', ')}
Priority: ${person.priority}/10

Rate how relevant this signal is as a reason to reach out (0-100).
Consider:
- Does it relate to their interests?
- Is it significant enough to warrant a message?
- Is it recent and timely?

Return ONLY a number between 0-100.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20250219',
    max_tokens: 10,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  const score = parseInt(content.text.trim());
  return isNaN(score) ? 50 : Math.max(0, Math.min(100, score));
}
