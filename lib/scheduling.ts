import { Person, Signal } from './types';

interface SchedulingFactors {
  baseInterval: number; // days
  priorityWeight: number;
  signalWeight: number;
  recencyWeight: number;
  temperatureWeight: number;
  responsivenessWeight: number;
}

const DEFAULT_FACTORS: SchedulingFactors = {
  baseInterval: 90, // 3 months default
  priorityWeight: 0.5,
  signalWeight: 0.3,
  recencyWeight: 0.6,
  temperatureWeight: 0.7,
  responsivenessWeight: 1.2,
};

function daysSince(date: string | null | undefined): number {
  if (!date) return 999; // Large number if never contacted
  const then = new Date(date);
  const now = new Date();
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function calculateNextContactDate(
  person: Person,
  signals: Signal[] = [],
  factors: Partial<SchedulingFactors> = {}
): Date {
  const f = { ...DEFAULT_FACTORS, ...factors };
  let urgencyMultiplier = 1.0;

  // SOONER: High-priority person
  if (person.priority >= 8) {
    urgencyMultiplier *= f.priorityWeight;
  } else if (person.priority >= 6) {
    urgencyMultiplier *= 0.75;
  }

  // SOONER: Recent high-relevance signal
  const recentHighValueSignal = signals.find(
    (s) =>
      !s.used_in_message &&
      s.relevance_score >= 70 &&
      daysSince(s.detected_at) < 7
  );
  if (recentHighValueSignal) {
    urgencyMultiplier *= f.signalWeight;
  }

  // SOONER: Haven't heard from them in a while
  const daysSinceContact = daysSince(person.last_contact_date);
  if (daysSinceContact > 180) {
    urgencyMultiplier *= f.recencyWeight;
  }

  // SOONER: Cold relationship needs warming
  if (person.relationship_temperature === 'cold') {
    urgencyMultiplier *= f.temperatureWeight;
  }

  // LATER: Just contacted them recently
  if (daysSinceContact < 30) {
    urgencyMultiplier *= 2.0;
  } else if (daysSinceContact < 60) {
    urgencyMultiplier *= 1.5;
  }

  // LATER: They're responsive (relationship is healthy)
  if (person.responsiveness_score >= 70) {
    urgencyMultiplier *= f.responsivenessWeight;
  }

  // Calculate final date (minimum 7 days to avoid spam)
  const daysUntilNext = Math.max(7, Math.floor(f.baseInterval * urgencyMultiplier));
  return addDays(new Date(), daysUntilNext);
}

export function shouldContactNow(person: Person): boolean {
  const nextDate = new Date(person.next_contact_date);
  const now = new Date();
  return nextDate <= now;
}

export function updateResponsiveness(
  currentScore: number,
  replied: boolean
): number {
  // Exponential moving average
  const alpha = 0.2; // How much weight to give new data
  const newDataPoint = replied ? 100 : 0;
  const newScore = currentScore * (1 - alpha) + newDataPoint * alpha;
  return Math.max(0, Math.min(100, Math.round(newScore)));
}

export function suggestRelationshipTemperature(
  person: Person,
  recentMessages: number,
  responseRate: number
): 'cold' | 'warm' | 'hot' {
  const daysSinceContact = daysSince(person.last_contact_date);

  if (recentMessages >= 3 && responseRate >= 0.7) {
    return 'hot';
  }

  if (daysSinceContact > 180 || responseRate < 0.3) {
    return 'cold';
  }

  return 'warm';
}
